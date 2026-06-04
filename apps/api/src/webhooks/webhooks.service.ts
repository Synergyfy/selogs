import { Injectable, Logger } from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaystackService } from '../paystack/paystack.service';
import { NotificationsService } from '../notifications/notifications.service';
import type { Request } from 'express';
import { SubscriptionStatus, BillingCycle } from '@prisma/client';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly paystack: PaystackService,
    private readonly notifications: NotificationsService,
  ) {}

  async handlePaystackWebhook(req: RawBodyRequest<Request>) {
    const signature = req.headers['x-paystack-signature'] as string;
    
    if (!signature || !req.rawBody) {
      this.logger.error('Missing signature or raw body in webhook request');
      return { status: 'ignored' };
    }

    const isValid = this.paystack.verifyWebhookSignature(signature, req.rawBody);
    if (!isValid) {
      this.logger.error('Invalid Paystack webhook signature');
      return { status: 'ignored' };
    }

    const event = req.body;
    this.logger.log(`Received Paystack Webhook Event: ${event.event}`);

    try {
      switch (event.event) {
        case 'charge.success':
          await this.handleChargeSuccess(event.data);
          break;
        case 'invoice.payment_success':
          await this.handleInvoicePaymentSuccess(event.data);
          break;
        case 'invoice.payment_failed':
          await this.handleInvoicePaymentFailed(event.data);
          break;
        case 'subscription.disable':
          await this.handleSubscriptionDisable(event.data);
          break;
        default:
          this.logger.log(`Unhandled webhook event: ${event.event}`);
      }
    } catch (error: any) {
      this.logger.error(`Error processing webhook ${event.event}: ${error.message}`);
      // Return 200 anyway so Paystack doesn't retry infinitely if it's a bug in our code,
      // or we can throw so they retry. We'll just log and swallow for idempotency right now.
    }

    return { status: 'success' };
  }

  private async handleChargeSuccess(data: any) {
    if (data.metadata?.type !== 'checkout' && data.metadata?.type !== 'addon_purchase') {
      return; // Ignore non-system charges
    }

    const { organizationId, planId, billingCycle, addonIds } = data.metadata;
    const amount = data.amount / 100; // convert from kobo to NGN

    // Idempotency check: see if invoice already exists
    const existingInvoice = await this.prisma.invoice.findUnique({
      where: { paystackReference: data.reference },
    });

    if (existingInvoice) {
      this.logger.log(`Charge already processed for reference ${data.reference}`);
      return;
    }

    await this.prisma.$transaction(async (tx) => {
      // 1. Create Invoice record
      await tx.invoice.create({
        data: {
          organizationId,
          amount,
          status: 'paid',
          paystackReference: data.reference,
          paidAt: new Date(data.paid_at),
          paymentMethod: `${data.authorization.brand} **** ${data.authorization.last4}`,
          billingCycle: billingCycle,
        },
      });

      // 2. Save Payment Method
      if (data.authorization.reusable) {
        await tx.paymentMethod.upsert({
          where: { authorizationCode: data.authorization.authorization_code },
          update: {
            isDefault: true,
            cardType: data.authorization.card_type,
            last4: data.authorization.last4,
            expMonth: data.authorization.exp_month,
            expYear: data.authorization.exp_year,
            bank: data.authorization.bank,
            countryCode: data.authorization.country_code,
          },
          create: {
            organizationId,
            authorizationCode: data.authorization.authorization_code,
            isDefault: true,
            cardType: data.authorization.card_type,
            last4: data.authorization.last4,
            expMonth: data.authorization.exp_month,
            expYear: data.authorization.exp_year,
            bank: data.authorization.bank,
            countryCode: data.authorization.country_code,
          },
        });
        
        // Reset others to false
        await tx.paymentMethod.updateMany({
          where: { organizationId, authorizationCode: { not: data.authorization.authorization_code } },
          data: { isDefault: false },
        });
      }

      if (data.metadata.type === 'checkout') {
        // 3. Update or Create Subscription
        const nextBillingDate = this.calculateNextBillingDate(new Date(), billingCycle);

        await tx.subscription.upsert({
          where: { organizationId },
          update: {
            planId,
            status: SubscriptionStatus.active,
            nextBillingDate,
            billingCycle,
            paystackCustomerCode: data.customer.customer_code,
            authorizationCode: data.authorization.authorization_code,
            updatedAt: new Date(),
          },
          create: {
            organizationId,
            planId,
            status: SubscriptionStatus.active,
            nextBillingDate,
            billingCycle,
            paystackCustomerCode: data.customer.customer_code,
            authorizationCode: data.authorization.authorization_code,
          },
        });

        // 4. Sync planId on Organization model
        await tx.organization.update({
          where: { id: organizationId },
          data: { planId },
        });

        // 5. Sync Add-ons
        if (addonIds && addonIds.length > 0) {
          // Clear old addons (simplistic replace strategy for checkout)
          await tx.organizationAddon.deleteMany({ where: { organizationId } });
          
          await tx.organizationAddon.createMany({
            data: addonIds.map((id: string) => ({
              organizationId,
              addonId: id,
            })),
            skipDuplicates: true,
          });
        }
      } else if (data.metadata.type === 'addon_purchase') {
        // Just add the addon
        const addonId = data.metadata.addonId;
        if (addonId) {
           await tx.organizationAddon.upsert({
             where: {
               organizationId_addonId: { organizationId, addonId }
             },
             update: {},
             create: { organizationId, addonId }
           });
        }
      }
    });

    // 6. Send payment success notification
    await this.notifications.create({
      organizationId,
      type: 'payment',
      title: 'Payment Successful',
      message: `Your payment of ₦${amount.toLocaleString()} was processed successfully. Thank you for your subscription!`,
      priority: 'medium',
    });

    this.logger.log(`Successfully processed charge.success for org ${organizationId}`);
  }

  private async handleInvoicePaymentSuccess(data: any) {
    // Paystack recurring billing success
    const subscriptionCode = data.subscription.subscription_code;
    
    const sub = await this.prisma.subscription.findUnique({
      where: { paystackSubscriptionCode: subscriptionCode }
    });

    if (!sub) return;

    // Idempotency
    const existingInvoice = await this.prisma.invoice.findUnique({
      where: { paystackReference: data.reference },
    });

    if (existingInvoice) return;

    await this.prisma.$transaction(async (tx) => {
      await tx.invoice.create({
        data: {
          organizationId: sub.organizationId,
          amount: data.amount / 100,
          status: 'paid',
          paystackReference: data.reference,
          paidAt: new Date(data.paid_at),
          paymentMethod: `${data.authorization.brand} **** ${data.authorization.last4}`,
          billingCycle: sub.billingCycle,
        },
      });

      const nextBillingDate = this.calculateNextBillingDate(new Date(), sub.billingCycle as any);
      await tx.subscription.update({
        where: { id: sub.id },
        data: {
          status: SubscriptionStatus.active,
          nextBillingDate,
        }
      });
    });
  }

  private async handleInvoicePaymentFailed(data: any) {
    const subscriptionCode = data.subscription?.subscription_code;
    if (!subscriptionCode) return;

    const sub = await this.prisma.subscription.findUnique({
      where: { paystackSubscriptionCode: subscriptionCode }
    });

    if (!sub) return;

    await this.prisma.subscription.update({
      where: { id: sub.id },
      data: {
        status: SubscriptionStatus.past_due,
      }
    });

    await this.notifications.create({
      organizationId: sub.organizationId,
      type: 'alert',
      title: 'Payment Failed',
      message: 'Your recent payment could not be processed. Your subscription is now past due — update your payment method to avoid service interruption.',
      priority: 'high',
    });
  }

  private async handleSubscriptionDisable(data: any) {
    const subscriptionCode = data.subscription_code;
    
    const sub = await this.prisma.subscription.findUnique({
      where: { paystackSubscriptionCode: subscriptionCode }
    });

    if (!sub) return;

    await this.prisma.subscription.update({
      where: { id: sub.id },
      data: {
        status: SubscriptionStatus.canceled,
      }
    });
  }

  private calculateNextBillingDate(startDate: Date, cycle: string): Date {
    const date = new Date(startDate);
    if (cycle === 'MONTHLY') date.setMonth(date.getMonth() + 1);
    else if (cycle === 'QUARTERLY') date.setMonth(date.getMonth() + 3);
    else if (cycle === 'YEARLY') date.setFullYear(date.getFullYear() + 1);
    return date;
  }
}
