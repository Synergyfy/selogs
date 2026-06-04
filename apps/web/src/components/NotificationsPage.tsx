import React, { useState } from 'react';
import {
  AlertTriangle,
  CreditCard,
  Info,
  CheckCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  CheckCheck,
  Clock,
} from 'lucide-react';
import { useNotificationsList, useMarkAsRead, useMarkAllAsRead } from '../hooks/dashboard/useNotifications';
import './Dashboard.css';
import './NotificationCenter.css';

type FilterTab = 'all' | 'unread' | 'read';

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'alert': return <AlertTriangle size={18} className="text-red" />;
    case 'payment': return <CreditCard size={18} className="text-emerald" />;
    default: return <Info size={18} className="text-blue" />;
  }
};

const NotificationsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<FilterTab>('all');
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();
  const pageSize = 20;

  const { data, isLoading } = useNotificationsList(page, pageSize);

  const notifications = data?.data || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const handleMarkAsRead = (id: string) => {
    markAsRead.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = Date.now();
    const diff = now - d.getTime();
    if (diff < 60_000) return 'Just now';
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
    if (diff < 604_800_000) return `${Math.floor(diff / 86_400_000)}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="dashboard-overview">
      <div className="card-header">
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Notifications</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '14px' }}>
            View and manage your organization notifications.
          </p>
        </div>
        <div className="flex-center gap-12">
          {total > 0 && (
            <button
              className="btn-glass-sm"
              onClick={handleMarkAllAsRead}
              disabled={markAllAsRead.isPending}
            >
              {markAllAsRead.isPending ? (
                <Loader2 size={14} className="spin" />
              ) : (
                <CheckCheck size={14} />
              )}
              Mark All Read
            </button>
          )}
        </div>
      </div>

      <div className="content-card" style={{ marginTop: '16px' }}>
        <div className="card-header">
          <div className="flex-center gap-8">
            {(['all', 'unread', 'read'] as FilterTab[]).map((tab) => (
              <button
                key={tab}
                className={`btn-glass-sm ${filter === tab ? 'active' : ''}`}
                onClick={() => { setFilter(tab); setPage(1); }}
              >
                {tab === 'all' ? 'All' : tab === 'unread' ? 'Unread' : 'Read'}
                {tab === 'unread' && total > 0 && (
                  <span style={{ marginLeft: '6px', fontSize: '11px', opacity: 0.7 }}>
                    ({notifications.filter(n => !n.read).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <Loader2 size={32} className="spin" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="notification-list" style={{ maxHeight: 'none', padding: '8px' }}>
            {filtered.map((n) => (
              <div
                key={n.id}
                className={`notification-item ${!n.read ? 'unread' : ''} ${n.priority === 'high' ? 'high-priority' : ''}`}
                onClick={() => { if (!n.read) handleMarkAsRead(n.id); }}
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
                    <span>{formatTime(n.createdAt)}</span>
                    {n.read && (
                      <span style={{ marginLeft: '8px', color: 'var(--accent)' }}>
                        <CheckCheck size={12} style={{ display: 'inline' }} /> Read
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state" style={{ padding: '80px 20px' }}>
            <CheckCircle size={48} className="text-dim" />
            <p>No notifications found</p>
            <span>
              {filter !== 'all'
                ? `You have no ${filter} notifications.`
                : "You're all caught up!"}
            </span>
          </div>
        )}

        {totalPages > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '16px',
            padding: '16px',
            borderTop: '1px solid var(--border)',
          }}>
            <button
              className="btn-glass-sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <span style={{ fontSize: '13px', color: 'var(--text-dim)' }}>
              Page {page} of {totalPages}
            </span>
            <button
              className="btn-glass-sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
