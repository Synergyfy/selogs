import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { CheckoutDto } from './dto/checkout.dto';
import { GetCurrentUser } from '../auth/decorators';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('subscriptions')
@ApiBearerAuth('access-token')
@Controller('subscriptions')
@UseGuards(RolesGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('me')
  @Roles(Role.admin)
  @ApiOperation({ summary: 'Get current organization subscription' })
  @ApiResponse({ status: 200, description: 'Subscription details.' })
  @ApiResponse({ status: 404, description: 'No subscription found.' })
  async getMySubscription(@GetCurrentUser('organizationId') organizationId: string) {
    return this.subscriptionsService.getOrgSubscription(organizationId);
  }

  @Post('checkout')
  @Roles(Role.admin)
  @ApiOperation({ summary: 'Initialize checkout for a plan' })
  @ApiResponse({ status: 201, description: 'Checkout initialized, returns payment URL.' })
  async checkout(
    @GetCurrentUser('organizationId') organizationId: string,
    @GetCurrentUser('email') email: string,
    @Body() dto: CheckoutDto,
  ) {
    return this.subscriptionsService.initializeCheckout(organizationId, email, dto);
  }

  @Post('start-trial/:planId')
  @Roles(Role.admin)
  @ApiOperation({ summary: 'Start a free trial for a plan' })
  @ApiParam({ name: 'planId', description: 'Plan ID' })
  @ApiResponse({ status: 201, description: 'Trial started successfully.' })
  @ApiResponse({ status: 400, description: 'Trial not available or already used.' })
  async startTrial(
    @GetCurrentUser('organizationId') organizationId: string,
    @Param('planId') planId: string,
  ) {
    return this.subscriptionsService.startTrial(organizationId, planId);
  }

  @Post('cancel')
  @Roles(Role.admin)
  @ApiOperation({ summary: 'Cancel current subscription' })
  @ApiResponse({ status: 201, description: 'Subscription cancelled.' })
  @ApiResponse({ status: 404, description: 'No active subscription to cancel.' })
  async cancelSubscription(
    @GetCurrentUser('organizationId') organizationId: string,
  ) {
    return this.subscriptionsService.cancelSubscription(organizationId);
  }
}
