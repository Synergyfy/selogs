import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  X, 
  CheckCircle, 
  AlertTriangle, 
  CreditCard, 
  Info,
  Clock
} from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../services/db';
import { notificationService } from '../services/NotificationService';
import './NotificationCenter.css';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  orgId?: string;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose, orgId }) => {
  const notifications = useLiveQuery(() => {
    const query = db.notifications.orderBy('timestamp').reverse();
    if (orgId) {
      return query.filter(n => n.orgId === orgId).toArray();
    }
    return query.toArray();
  }, [orgId]) || [];

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertTriangle className="text-red" size={18} />;
      case 'payment': return <CreditCard className="text-emerald" size={18} />;
      default: return <Info className="text-blue" size={18} />;
    }
  };

  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleViewHistory = () => {
    navigate(orgId ? '/dashboard/notifications' : '/super-admin/notifications');
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="notification-flyout"
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
      >
        <div className="flyout-header">
          <div className="flex-center gap-8">
            <Bell size={20} className="text-indigo" />
            <h3>Notifications</h3>
            {unreadCount > 0 && <span className="unread-badge-inline">{unreadCount}</span>}
          </div>
          <div className="flex-center gap-12">
            {unreadCount > 0 && (
              <button 
                className="btn-text-xs" 
                onClick={() => notificationService.markAllAsRead(orgId)}
              >
                Mark all read
              </button>
            )}
            <button className="close-btn" onClick={onClose}><X size={18} /></button>
          </div>
        </div>

        <div className="notification-list">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div 
                key={n.id} 
                className={`notification-item ${!n.read ? 'unread' : ''} ${n.priority}-priority`}
                onClick={() => notificationService.markAsRead(n.id)}
              >
                <div className="notif-icon">
                  {getTypeIcon(n.type)}
                </div>
                <div className="notif-content">
                  <div className="notif-title-row">
                    <h4>{n.title}</h4>
                    {!n.read && <span className="unread-dot" />}
                  </div>
                  <p>{n.message}</p>
                  <div className="notif-meta">
                    <Clock size={12} />
                    <span>{new Date(n.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <CheckCircle size={40} className="text-dim" />
              <p>You're all caught up!</p>
              <span>No new notifications at the moment.</span>
            </div>
          )}
        </div>

        <div className="flyout-footer">
          <button className="btn-full-text" onClick={handleViewHistory}>View Notification History</button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationCenter;
