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
    return this.prisma.paymentMethod.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Set default payment method
   */
  async setDefaultPaymentMethod(organizationId: string, paymentMethodId: string) {
    await this.prisma.$transaction(async (tx) => {
      // Unset existing defaults
      await tx.paymentMethod.updateMany({
        where: { organizationId },
        data: { isDefault: false },
      });

      // Set new default
      await tx.paymentMethod.update({
        where: { id: paymentMethodId, organizationId },
        data: { isDefault: true },
      });
    });

    return { success: true };
  }

  /**
   * Get add-ons purchased by the organization
   */
  async getOrgAddons(organizationId: string) {
    const orgAddons = await this.prisma.organizationAddon.findMany({
      where: { organizationId },
      include: { addon: true },
    });
    
    return orgAddons.map(oa => oa.addon);
  }
}
