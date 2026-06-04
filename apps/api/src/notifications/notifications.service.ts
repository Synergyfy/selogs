import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { NotificationResponseDto } from './dto/notification.dto';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a notification for an organization.
   */
  async create(params: {
    organizationId: string;
    type: string;
    title: string;
    message: string;
    priority?: string;
  }): Promise<NotificationResponseDto> {
    const notification = await this.prisma.notification.create({
      data: {
        organizationId: params.organizationId,
        type: params.type,
        title: params.title,
        message: params.message,
        priority: params.priority || 'medium',
      },
    });
    return notification;
  }

  /**
   * List notifications for an organization (most recent first).
   */
  async findAll(
    organizationId: string,
    options?: { limit?: number; offset?: number },
  ): Promise<{ data: NotificationResponseDto[]; total: number }> {
    const limit = options?.limit || 50;
    const offset = options?.offset || 0;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.notification.findMany({
        where: { organizationId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      this.prisma.notification.count({ where: { organizationId } }),
    ]);

    return { data, total };
  }

  /**
   * Mark a single notification as read.
   */
  async markAsRead(notificationId: string, organizationId: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { id: notificationId, organizationId },
      data: { read: true },
    });
  }

  /**
   * Mark all notifications as read for an organization.
   */
  async markAllAsRead(organizationId: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { organizationId, read: false },
      data: { read: true },
    });
  }

  /**
   * Get unread count for an organization.
   */
  async getUnreadCount(organizationId: string): Promise<number> {
    return this.prisma.notification.count({
      where: { organizationId, read: false },
    });
  }

  /**
   * Broadcast a notification to all organizations (or specific targets).
   * Super-admin only.
   */
  async broadcast(params: {
    title: string;
    message: string;
    type: string;
    priority: string;
    target: 'all' | string[];
  }): Promise<{ count: number }> {
    const where =
      params.target === 'all'
        ? {}
        : { id: { in: params.target } };

    const orgs = await this.prisma.organization.findMany({
      where,
      select: { id: true },
    });

    if (orgs.length === 0) return { count: 0 };

    await this.prisma.notification.createMany({
      data: orgs.map((org) => ({
        organizationId: org.id,
        type: params.type,
        title: params.title,
        message: params.message,
        priority: params.priority,
      })),
    });

    this.logger.log(`Broadcast "${params.title}" sent to ${orgs.length} organizations`);
    return { count: orgs.length };
  }

  /**
   * List all notifications across all organizations (super-admin history).
   */
  async findAllBroadcasts(
    options?: { limit?: number; offset?: number },
  ): Promise<{ data: NotificationResponseDto[]; total: number }> {
    const limit = options?.limit || 50;
    const offset = options?.offset || 0;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.notification.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      this.prisma.notification.count(),
    ]);

    return { data, total };
  }
}
