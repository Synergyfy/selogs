import { ApiProperty } from '@nestjs/swagger';

export class AnalyticsOverviewDto {
  @ApiProperty({ example: 124 })
  todayEntries!: number;

  @ApiProperty({ example: 45 })
  activeVehicles!: number;

  @ApiProperty({ example: 14 })
  peakHour!: number;

  @ApiProperty({ example: 15.5 })
  weeklyGrowth?: number;

  @ApiProperty({ example: 5 })
  activeStaff!: number;

  @ApiProperty({ example: 10 })
  activeDevices!: number;

  @ApiProperty({ example: 3 })
  activeBranches!: number;

  @ApiProperty({ example: 'active' })
  subscriptionStatus!: string;
}

export class AnalyticsTrendDto {
  @ApiProperty({ example: '2026-05-07' })
  date!: string;

  @ApiProperty({ example: 150 })
  count!: number;
}

export class BranchBreakdownDto {
  @ApiProperty({ example: 'Main Gate' })
  branchName!: string;

  @ApiProperty({ example: 85 })
  entryCount!: number;

  @ApiProperty({ example: 20 })
  activeCount!: number;
}
