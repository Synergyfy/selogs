import { Controller, Get, Post, Body, Query, UseGuards, Param, HttpCode, HttpStatus, Delete } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { BillingService } from './billing.service';
import { GetCurrentUser } from '../auth/decorators';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('billing')
@ApiBearerAuth('access-token')
@Controller('billing')
@UseGuards(RolesGuard)
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('invoices')
  @Roles(Role.admin)
  @ApiOperation({ summary: 'Get organization invoices' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Paginated invoice list.' })
  async getInvoices(
    @GetCurrentUser('organizationId') organizationId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.billingService.getInvoices(organizationId, Number(page) || 1, Number(limit) || 20);
  }

  @Get('global/revenue')
  @Roles(Role.super_admin)
  @ApiOperation({ summary: 'Get global revenue (Super Admin)' })
  @ApiResponse({ status: 200, description: 'Global revenue summary.' })
  async getGlobalRevenue() {
    return this.billingService.getGlobalRevenue();
  }

  @Get('global/invoices')
  @Roles(Role.super_admin)
  @ApiOperation({ summary: 'Get all invoices across organizations (Super Admin)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Paginated global invoice list.' })
  async getGlobalInvoices(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.billingService.getGlobalInvoices(Number(page) || 1, Number(limit) || 20);
  }

  @Get('payment-methods')
  @Roles(Role.admin)
  @ApiOperation({ summary: 'Get organization payment methods' })
  @ApiResponse({ status: 200, description: 'List of saved payment methods.' })
  async getPaymentMethods(@GetCurrentUser('organizationId') organizationId: string) {
    return this.billingService.getPaymentMethods(organizationId);
  }

  @Post('payment-methods/:id/default')
  @Roles(Role.admin)
  @ApiOperation({ summary: 'Set a payment method as default' })
  @ApiParam({ name: 'id', description: 'Payment method ID' })
  @ApiResponse({ status: 201, description: 'Default payment method updated.' })
  @ApiResponse({ status: 404, description: 'Payment method not found.' })
  async setDefaultPaymentMethod(
    @GetCurrentUser('organizationId') organizationId: string,
    @Param('id') paymentMethodId: string,
  ) {
    return this.billingService.setDefaultPaymentMethod(organizationId, paymentMethodId);
  }

  @Get('addons')
  @Roles(Role.admin)
  @ApiOperation({ summary: 'Get organization addon purchases' })
  @ApiResponse({ status: 200, description: 'List of purchased addons.' })
  async getOrgAddons(@GetCurrentUser('organizationId') organizationId: string) {
    return this.billingService.getOrgAddons(organizationId);
  }
}
