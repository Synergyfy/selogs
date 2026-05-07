import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { InitializeSubscriptionDto } from './dto/initialize-subscription.dto';
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

  @Post('initialize')
  @Roles(Role.admin)
  async initialize(
    @GetCurrentUser('organizationId') organizationId: string,
    @GetCurrentUser('email') email: string,
    @Body() dto: InitializeSubscriptionDto,
  ) {
    return this.subscriptionsService.initializeSubscription(organizationId, email, dto);
  }

  @Post('verify')
  @Roles(Role.admin)
  async verify(
    @GetCurrentUser('organizationId') organizationId: string,
    @Query('reference') reference: string,
  ) {
    return this.subscriptionsService.verifySubscription(organizationId, reference);
  }
}
