import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BillingService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get paginated invoice history for an organization
   */
  async getInvoices(organizationId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.invoice.findMany({
        where: { organizationId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.invoice.count({
        where: { organizationId },
      }),
    ]);

    return {
      items,
      total,
      page,
      limit,
    };
  }

  /**
   * Get all invoices across the platform for Super Admin
   */
  async getGlobalInvoices(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.invoice.findMany({
        include: { organization: { select: { name: true } } },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.invoice.count(),
    ]);

    return {
      items,
      total,
      page,
      limit,
    };
  }

  /**
   * Get total platform revenue
   */
  async getGlobalRevenue() {
    const aggregate = await this.prisma.invoice.aggregate({
      where: { status: 'paid' },
      _sum: { amount: true },
    });

    return {
      totalRevenue: aggregate._sum.amount || 0,
      currency: 'NGN',
    };
  }

  /**
   * Get saved payment methods for an organization
   */
  async getPaymentMethods(organizationId: string) {
    // In a real app, this would query a PaymentMethods table.
    // Here we extract unique payment method masks from invoice history.
    const invoices = await this.prisma.invoice.findMany({
      where: {
        organizationId,
        paymentMethod: { not: null },
      },
      select: { paymentMethod: true },
      distinct: ['paymentMethod'],
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    return invoices.map((inv) => {
      const parts = inv.paymentMethod!.split(' '); // e.g. "Visa **** 4242"
      return {
        brand: parts[0] || 'Card',
        last4: parts[parts.length - 1] || '****',
        expMonth: 12, // Mocked
        expYear: 2025, // Mocked
        isDefault: true,
      };
    });
  }

  /**
   * Add a new payment method
   */
  async addPaymentMethod(organizationId: string, reference: string) {
    // Mocking the verification and saving of a payment method token
    // In production, you'd call Paystack to verify and then save the authorization token
    return {
      message: 'Payment method added successfully',
      status: 'success',
    };
  }
}
