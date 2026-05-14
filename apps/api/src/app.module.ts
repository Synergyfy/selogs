import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AtGuard } from './auth/guards';
import { CapabilityModule, CapabilityGuard } from './common/capabilities';
import { BranchesModule } from './branches/branches.module';
import { EntriesModule } from './entries/entries.module';
import { StaffModule } from './staff/staff.module';
import { DevicesModule } from './devices/devices.module';
import { PlansModule } from './plans/plans.module';
import { PaystackModule } from './paystack/paystack.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { BillingModule } from './billing/billing.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { SettingsModule } from './settings/settings.module';
import { GatesModule } from './gates/gates.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { AddonsModule } from './addons/addons.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerModule } from './scheduler/scheduler.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.string().required(),
        REFRESH_TOKEN_SECRET: Joi.string().required(),
        REFRESH_TOKEN_EXPIRES_IN: Joi.string().required(),
        SUPER_ADMIN_SECRET: Joi.string().required(),
        PAYSTACK_SECRET_KEY: Joi.string().required(),
        PORT: Joi.number().default(5001),
      }),
    }),
    PrismaModule,
    AuthModule,
    BranchesModule,
    EntriesModule,
    StaffModule,
    DevicesModule,
    PlansModule,
    PaystackModule,
    SubscriptionsModule,
    BillingModule,
    AnalyticsModule,
    SettingsModule,
    GatesModule,
    OrganizationsModule,
    AddonsModule,
    CapabilityModule,
    WebhooksModule,
    ScheduleModule.forRoot(),
    SchedulerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    // Runs after AtGuard — no-op when no @Capability() decorator is present.
    {
      provide: APP_GUARD,
      useClass: CapabilityGuard,
    },
  ],
})
export class AppModule {}
