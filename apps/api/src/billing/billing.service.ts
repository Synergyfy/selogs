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
}
