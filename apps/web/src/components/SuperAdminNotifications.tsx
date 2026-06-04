import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Send,
  History,
  Users,
  Building2,
  AlertCircle,
  Clock,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { useSendBroadcast, useBroadcastsList } from '../hooks/dashboard/useNotifications';
import './Dashboard.css';

const SuperAdminNotifications: React.FC = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetType, setTargetType] = useState<'all' | 'org'>('all');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [page] = useState(1);

  const sendBroadcast = useSendBroadcast();
  const { data: historyData, isLoading } = useBroadcastsList(page, 20);

  const broadcasts = historyData?.data || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    try {
      await sendBroadcast.mutateAsync({
        title: title.trim(),
        message: message.trim(),
        type: 'system',
        priority,
        target: targetType === 'all' ? 'all' : [],
      });
      setTitle('');
      setMessage('');
      setPriority('medium');
    } catch (err) {
      console.error('Broadcast failed', err);
    }
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = Date.now();
    const diff = now - d.getTime();
    if (diff < 60_000) return 'Just now';
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="dashboard-overview sa-theme">
      <div className="section-header">
        <div>
          <h1 className="hero-title" style={{ fontSize: '28px', marginBottom: '8px' }}>Global Notifications</h1>
          <p className="text-muted">Broadcast messages and manage system-wide alerts.</p>
        </div>
        <div className="flex-center gap-12">
          <button className="btn-glass-sm"><History size={16} /> Audit Logs</button>
        </div>
      </div>

      <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1.5fr' }}>
        {/* Broadcast Form */}
        <motion.div
          className="content-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="card-header">
            <h3>New Broadcast</h3>
            <span className="sa-badge">LIVE</span>
          </div>
          <form className="modal-form" style={{ padding: 0 }} onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Message Title</label>
              <input
                type="text"
                className="modal-select"
                style={{ background: 'var(--bg-input)' }}
                placeholder="e.g. Scheduled Maintenance"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Target Audience</label>
              <div className="flex-center gap-8" style={{ marginTop: '8px' }}>
                <button
                  type="button"
                  className={`btn-glass-sm ${targetType === 'all' ? 'active' : ''}`}
                  onClick={() => setTargetType('all')}
                  style={{ flex: 1 }}
                ><Users size={14} /> All Organizations</button>
                <button
                  type="button"
                  className={`btn-glass-sm ${targetType === 'org' ? 'active' : ''}`}
                  onClick={() => setTargetType('org')}
                  style={{ flex: 1 }}
                ><Building2 size={14} /> Specific Org</button>
              </div>
            </div>
            <div className="form-group">
              <label>Priority Level</label>
              <select
                className="modal-select"
                style={{ background: 'var(--bg-input)' }}
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
              >
                <option value="low">Low - Informational</option>
                <option value="medium">Medium - Important</option>
                <option value="high">High - Urgent Action</option>
              </select>
            </div>
            <div className="form-group">
              <label>Message Content</label>
              <textarea
                className="modal-select"
                style={{ background: 'var(--bg-input)', minHeight: '120px', padding: '12px', resize: 'none' }}
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn-premium"
              style={{ width: '100%', background: 'var(--sa-primary)', marginTop: '16px' }}
              disabled={sendBroadcast.isPending || !title.trim() || !message.trim()}
            >
              {sendBroadcast.isPending ? (
                <Loader2 size={18} className="spin" />
              ) : (
                <Send size={18} />
              )}
              {sendBroadcast.isPending ? 'Sending...' : 'Send Broadcast Now'}
            </button>
            {sendBroadcast.isSuccess && (
              <div style={{ marginTop: '12px', padding: '12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <CheckCircle2 size={18} className="text-emerald" />
                <span style={{ fontSize: '13px' }}>Broadcast sent to {sendBroadcast.data?.count || 0} organizations.</span>
              </div>
            )}
            {sendBroadcast.isError && (
              <div style={{ marginTop: '12px', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <AlertCircle size={18} className="text-red" />
                <span style={{ fontSize: '13px' }}>Failed to send broadcast. Please try again.</span>
              </div>
            )}
          </form>
        </motion.div>

        {/* Sent History */}
        <motion.div
          className="content-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="card-header">
            <h3>Sent History</h3>
          </div>
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
              <Loader2 size={24} className="spin" />
            </div>
          ) : broadcasts.length > 0 ? (
            <div className="notification-history-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {broadcasts.map((notif) => (
                <div key={notif.id} className="history-item" style={{ padding: '16px', background: 'var(--bg-input)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div className={`stat-icon-wrapper mini ${notif.priority === 'high' ? 'rose' : notif.priority === 'medium' ? 'blue' : 'indigo'}`} style={{ width: '40px', height: '40px' }}>
                      <Bell size={18} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '2px' }}>{notif.title}</h4>
                      <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                        {notif.message.substring(0, 60)}{notif.message.length > 60 ? '...' : ''} • <Clock size={12} style={{ display: 'inline', margin: '0 4px' }} /> {formatTime(notif.createdAt)}
                      </p>
                    </div>
                  </div>
                  <span className={`status-badge ${notif.read ? 'synced' : 'pending'}`}>
                    {notif.priority.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '60px 20px', textAlign: 'center' }}>
              <Bell size={40} className="text-dim" />
              <p style={{ fontWeight: 700, marginTop: '12px' }}>No broadcasts sent yet</p>
              <span style={{ fontSize: '13px', color: 'var(--text-dim)' }}>Your first broadcast will appear here.</span>
            </div>
          )}
          <div className="sa-alert-box" style={{ marginTop: '24px', padding: '16px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', display: 'flex', gap: '12px', alignItems: 'center', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
            <AlertCircle className="text-blue" size={20} />
            <span style={{ fontSize: '13px', color: '#60a5fa' }}><strong>Pro Tip:</strong> Urgent notifications also send a push alert to mobile devices.</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SuperAdminNotifications;
