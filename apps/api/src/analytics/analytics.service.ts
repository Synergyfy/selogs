import { Injectable } from '@nestjs/common';
import { EntryStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  AnalyticsOverviewDto,
  AnalyticsTrendDto,
  BranchBreakdownDto,
} from './dto/analytics-response.dto';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get dashboard overview statistics.
   */
  async getOverview(organizationId: string): Promise<AnalyticsOverviewDto> {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [todayEntries, activeVehicles, activeStaff, activeDevices, activeBranches, org] = await Promise.all([
      this.prisma.vehicleEntry.count({
        where: {
          organizationId,
          checkInTime: { gte: startOfToday },
        },
      }),
      this.prisma.vehicleEntry.count({
        where: {
          organizationId,
          status: EntryStatus.IN,
        },
      }),
      this.prisma.shift.count({
        where: {
          organizationId,
          endTime: null,
        },
      }),
      this.prisma.device.count({
        where: { organizationId },
      }),
      this.prisma.branch.count({
        where: { organizationId },
      }),
      this.prisma.organization.findUnique({
        where: { id: organizationId },
        include: { subscription: true },
      }),
    ]);

    // Calculate peak hour today using raw SQL
    const peakHourResult = await this.prisma.$queryRaw<any[]>`
      SELECT EXTRACT(HOUR FROM check_in_time) as hour, COUNT(*) as count
      FROM vehicle_entries
      WHERE organization_id = ${organizationId}
        AND check_in_time >= ${startOfToday}
      GROUP BY hour
      ORDER BY count DESC
      LIMIT 1
    `;

    const peakHour = peakHourResult.length > 0 ? Number(peakHourResult[0].hour) : 0;

    return {
      todayEntries,
      activeVehicles,
      peakHour,
      activeStaff,
      activeDevices,
      activeBranches,
      subscriptionStatus: org?.subscription?.status || 'inactive',
    };
  }

  /**
   * Get entry trends (daily counts).
   */
  async getTrends(organizationId: string, days = 7): Promise<AnalyticsTrendDto[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const trends = await this.prisma.$queryRaw<any[]>`
      SELECT DATE(check_in_time) as date, COUNT(*) as count
      FROM vehicle_entries
      WHERE organization_id = ${organizationId}
        AND check_in_time >= ${startDate}
      GROUP BY date
      ORDER BY date ASC
    `;

    return trends.map((t) => ({
      date: t.date.toISOString().split('T')[0],
      count: Number(t.count),
    }));
  }

  /**
   * Get breakdown by branch.
   */
  async getBranchBreakdown(organizationId: string): Promise<BranchBreakdownDto[]> {
    const branches = await this.prisma.branch.findMany({
      where: { organizationId },
      include: {
        _count: {
          select: {
            entries: true,
          },
        },
      },
    });

    // Get active counts per branch
    const activeCounts = await this.prisma.vehicleEntry.groupBy({
      by: ['branchId'],
      where: {
        organizationId,
        status: EntryStatus.IN,
      },
      _count: true,
    });

    const activeMap = new Map(activeCounts.map((c) => [c.branchId, c._count]));

    return branches.map((b) => ({
      branchName: b.name,
      entryCount: b._count.entries,
      activeCount: activeMap.get(b.id) || 0,
    }));
  }
}
