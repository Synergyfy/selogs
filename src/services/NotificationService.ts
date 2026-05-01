import { db, type AppNotification } from './db';
import { v4 as uuidv4 } from 'uuid';

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
   * Check for critical system events and trigger notifications
   */
  async checkLifecycleEvents(orgInfo: { id: string, joinedDate: number, plan: string }) {
    const now = Date.now();
    const trialDuration = 14 * 24 * 60 * 60 * 1000; // 14 days
    const trialExpiry = orgInfo.joinedDate + trialDuration;
    const daysRemaining = Math.ceil((trialExpiry - now) / (1000 * 60 * 60 * 24));

    // 1. Trial Ending Notification (3 days threshold)
    if (daysRemaining <= 3 && daysRemaining > 0) {
      const existing = await db.notifications
        .where('type').equals('alert')
        .and(n => n.title.includes('Trial Ending'))
        .count();

      if (existing === 0) {
        await this.addNotification({
          type: 'alert',
          title: 'Trial Ending Soon',
          message: `Your 14-day free trial will expire in ${daysRemaining} days. Upgrade now to avoid service interruption.`,
          priority: 'high',
          orgId: orgInfo.id
        });
      }
    }

    // 2. Trial Expired Notification
    if (daysRemaining <= 0) {
      const existing = await db.notifications
        .where('type').equals('alert')
        .and(n => n.title.includes('Trial Expired'))
        .count();

      if (existing === 0) {
        await this.addNotification({
          type: 'alert',
          title: 'Trial Expired',
          message: 'Your trial period has ended. Access to advanced features has been restricted.',
          priority: 'high',
          orgId: orgInfo.id
        });
      }
    }
  }

  /**
   * Simulate a Payment Success notification
   */
  async notifyPaymentSuccess(orgId: string, amount: string) {
    await this.addNotification({
      type: 'payment',
      title: 'Payment Successful',
      message: `Your payment of ${amount} was processed successfully. Thank you for your subscription!`,
      priority: 'medium',
      orgId
    });
  }
}

export const notificationService = new NotificationService();
