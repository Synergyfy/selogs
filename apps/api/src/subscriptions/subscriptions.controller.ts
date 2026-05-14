import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CheckoutDto } from './dto/checkout.dto';
import { GetCurrentUser } from '../auth/decorators';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('subscriptions')
@UseGuards(RolesGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('me')
  @Roles(Role.admin)
  async getMySubscription(@GetCurrentUser('organizationId') organizationId: string) {
    return this.subscriptionsService.getOrgSubscription(organizationId);
  }

  @Post('checkout')
  @Roles(Role.admin)
  async checkout(
    @GetCurrentUser('organizationId') organizationId: string,
    @GetCurrentUser('email') email: string,
    @Body() dto: CheckoutDto,
  ) {
    return this.subscriptionsService.initializeCheckout(organizationId, email, dto);
  }

  @Post('start-trial/:planId')
  @Roles(Role.admin)
  async startTrial(
    @GetCurrentUser('organizationId') organizationId: string,
    @Param('planId') planId: string,
  ) {
    return this.subscriptionsService.startTrial(organizationId, planId);
  }

  @Post('cancel')
  @Roles(Role.admin)
  async cancelSubscription(
    @GetCurrentUser('organizationId') organizationId: string,
  ) {
    return this.subscriptionsService.cancelSubscription(organizationId);
  }
}
