import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { NotificationsService } from './notifications.service';
import { NotificationResponseDto, BroadcastNotificationDto } from './dto/notification.dto';
import { GetCurrentUser, Roles } from '../auth/decorators';
import { RolesGuard } from '../auth/guards';
import type { NotificationResponseDto as NotificationDto } from './dto/notification.dto';

@ApiTags('notifications')
@ApiBearerAuth('access-token')
@UseGuards(RolesGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @Roles(Role.admin, Role.supervisor, Role.guard, Role.super_admin)
  @ApiOperation({ summary: 'List organization notifications' })
  @ApiResponse({ status: 200, description: 'Paginated notifications list.' })
  async findAll(
    @GetCurrentUser('organizationId') organizationId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ): Promise<{ data: NotificationDto[]; total: number }> {
    return this.notificationsService.findAll(organizationId, {
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    });
  }

  @Get('unread-count')
  @Roles(Role.admin, Role.supervisor, Role.guard, Role.super_admin)
  @ApiOperation({ summary: 'Get unread notification count' })
  @ApiResponse({ status: 200, description: 'Unread notification count.' })
  async getUnreadCount(
    @GetCurrentUser('organizationId') organizationId: string,
  ): Promise<{ count: number }> {
    const count = await this.notificationsService.getUnreadCount(organizationId);
    return { count };
  }

  @Patch(':id/read')
  @Roles(Role.admin, Role.supervisor, Role.guard, Role.super_admin)
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiResponse({ status: 200, description: 'Notification marked as read.' })
  @ApiResponse({ status: 404, description: 'Notification not found.' })
  async markAsRead(
    @Param('id') id: string,
    @GetCurrentUser('organizationId') organizationId: string,
  ): Promise<void> {
    return this.notificationsService.markAsRead(id, organizationId);
  }

  @Patch('read-all')
  @Roles(Role.admin, Role.supervisor, Role.guard, Role.super_admin)
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({ status: 200, description: 'All notifications marked as read.' })
  async markAllAsRead(
    @GetCurrentUser('organizationId') organizationId: string,
  ): Promise<void> {
    return this.notificationsService.markAllAsRead(organizationId);
  }

  @Post('broadcast')
  @Roles(Role.super_admin)
  @ApiOperation({ summary: 'Broadcast notification to organizations' })
  @ApiResponse({ status: 201, description: 'Notification broadcasted.' })
  async broadcast(
    @Body() dto: BroadcastNotificationDto,
  ): Promise<{ count: number }> {
    return this.notificationsService.broadcast({
      title: dto.title,
      message: dto.message,
      type: dto.type || 'system',
      priority: dto.priority || 'medium',
      target: dto.target,
    });
  }

  @Get('all')
  @Roles(Role.super_admin)
  @ApiOperation({ summary: 'List all notifications across organizations (super admin)' })
  @ApiResponse({ status: 200, description: 'List of all broadcast notifications.' })
  async findAllBroadcasts(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ): Promise<{ data: NotificationDto[]; total: number }> {
    return this.notificationsService.findAllBroadcasts({
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    });
  }
}
