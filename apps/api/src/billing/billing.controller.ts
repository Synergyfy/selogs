import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { BillingService } from './billing.service';
import { GetCurrentUser } from '../auth/decorators';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('billing')
@UseGuards(RolesGuard)
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('invoices')
  @Roles(Role.admin)
  async getInvoices(
    @GetCurrentUser('organizationId') organizationId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.billingService.getInvoices(organizationId, Number(page) || 1, Number(limit) || 20);
  }

  @Get('global/revenue')
  @Roles(Role.super_admin)
  async getGlobalRevenue() {
    return this.billingService.getGlobalRevenue();
  }

  @Get('global/invoices')
  @Roles(Role.super_admin)
  async getGlobalInvoices(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.billingService.getGlobalInvoices(Number(page) || 1, Number(limit) || 20);
  }
}
