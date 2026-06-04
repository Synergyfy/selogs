import { db, type AppNotification } from './db';
import { v4 as uuidv4 } from 'uuid';
import { NotificationsApiService } from './NotificationsApiService';

class NotificationService {
  /**
   * Add a new notification to the database
   */
  async addNotification(params: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) {
    const notification: AppNotification = {
      id: uuidv4(),
      timestamp: Date.now(),
      read: false,
      ...params
    };
    
    await db.notifications.add(notification);
    return notification;
  }

  /**
   * Mark a specific notification as read
   */
  async markAsRead(id: string) {
    await db.notifications.update(id, { read: true });
  }

  /**
   * Mark all notifications as read for an organization
   */
  async markAllAsRead(orgId?: string) {
    const query = orgId 
      ? db.notifications.where('orgId').equals(orgId)
      : db.notifications.where('read').equals(0);
      
    await query.modify({ read: true });
  }

  /**
   * Sync notifications from the server API into Dexie.
   * Fetches the latest notifications and upserts them locally.
   */
  async syncFromApi(_orgId: string): Promise<void> {
    try {
      const { data } = await NotificationsApiService.getAll(50, 0);
      for (const n of data) {
        const existing = await db.notifications.get(n.id);
        if (existing) {
          await db.notifications.update(n.id, {
            read: n.read,
          });
        } else {
          await db.notifications.add({
            id: n.id,
            type: (n.type as AppNotification['type']) || 'system',
            title: n.title,
            message: n.message,
            timestamp: new Date(n.createdAt).getTime(),
            read: n.read,
            priority: (n.priority as AppNotification['priority']) || 'medium',
            orgId: n.organizationId,
          });
        }
      }
    } catch (err) {
      console.error('Failed to sync notifications from API:', err);
    }
  }
}

export const notificationService = new NotificationService();
