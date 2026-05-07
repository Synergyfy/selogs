import {
  Controller,
  Get,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { AnalyticsService } from './analytics.service';
import {
  AnalyticsOverviewDto,
  AnalyticsTrendDto,
  BranchBreakdownDto,
} from './dto/analytics-response.dto';
import { Roles, GetCurrentUser } from '../auth/decorators';
import { RolesGuard } from '../auth/guards';

@ApiTags('analytics')
@ApiBearerAuth('access-token')
@UseGuards(RolesGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @ApiOperation({ summary: 'Get dashboard overview stats' })
  @Roles(Role.admin, Role.supervisor)
  @ApiResponse({ status: 200, type: AnalyticsOverviewDto })
  @Get('overview')
  async getOverview(@GetCurrentUser('organizationId') organizationId: string) {
    return this.analyticsService.getOverview(organizationId);
  }

  @ApiOperation({ summary: 'Get entry trends' })
  @Roles(Role.admin, Role.supervisor)
  @ApiQuery({ name: 'days', required: false, type: Number })
  @ApiResponse({ status: 200, type: [AnalyticsTrendDto] })
  @Get('trends')
  async getTrends(
    @GetCurrentUser('organizationId') organizationId: string,
    @Query('days', new ParseIntPipe({ optional: true })) days?: number,
  ) {
    return this.analyticsService.getTrends(organizationId, days || 7);
  }

  @ApiOperation({ summary: 'Get branch breakdown' })
  @Roles(Role.admin, Role.supervisor)
  @ApiResponse({ status: 200, type: [BranchBreakdownDto] })
  @Get('branches')
  async getBranches(@GetCurrentUser('organizationId') organizationId: string) {
    return this.analyticsService.getBranchBreakdown(organizationId);
  }
}
