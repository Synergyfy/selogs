import { Controller, Get, Post, Body, Query, UseGuards, Param, HttpCode, HttpStatus, Delete } from '@nestjs/common';
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

  @Get('payment-methods')
  @Roles(Role.admin)
  async getPaymentMethods(@GetCurrentUser('organizationId') organizationId: string) {
    return this.billingService.getPaymentMethods(organizationId);
  }

  @Post('payment-methods/:id/default')
  @Roles(Role.admin)
  async setDefaultPaymentMethod(
    @GetCurrentUser('organizationId') organizationId: string,
    @Param('id') paymentMethodId: string,
  ) {
    return this.billingService.setDefaultPaymentMethod(organizationId, paymentMethodId);
  }

  @Get('addons')
  @Roles(Role.admin)
  async getOrgAddons(@GetCurrentUser('organizationId') organizationId: string) {
    return this.billingService.getOrgAddons(organizationId);
  }
}
