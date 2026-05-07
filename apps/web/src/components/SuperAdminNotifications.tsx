import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Send, 
  History, 
  Users, 
  Building2, 
  AlertCircle,
  Plus,
  Trash2,
  Clock
} from 'lucide-react';
import './Dashboard.css';

const SuperAdminNotifications: React.FC = () => {
  const [targetType, setTargetType] = useState<'all' | 'org' | 'staff'>('all');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const recentNotifications = [
    { id: 1, title: 'System Maintenance', target: 'All Organizations', time: '2 hours ago', status: 'Delivered', priority: 'high' },
    { id: 2, title: 'New Feature: PDF Export', target: 'Enterprise Users', time: '1 day ago', status: 'Delivered', priority: 'medium' },
    { id: 3, title: 'Trial Expiry Warning', target: 'Trial Accounts', time: '3 days ago', status: 'Automated', priority: 'high' },
    { id: 4, title: 'Holiday Support Hours', target: 'All Staff', time: '1 week ago', status: 'Archived', priority: 'low' },
  ];

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
          <form className="modal-form" style={{ padding: 0 }}>
            <div className="form-group">
              <label>Message Title</label>
              <input type="text" className="modal-select" style={{ background: 'var(--bg-input)' }} placeholder="e.g. Scheduled Maintenance" />
            </div>
            <div className="form-group">
              <label>Target Audience</label>
              <div className="flex-center gap-8" style={{ marginTop: '8px' }}>
                <button 
                  type="button" 
                  className={`btn-glass-sm ${targetType === 'all' ? 'active' : ''}`}
                  onClick={() => setTargetType('all')}
                  style={{ flex: 1 }}
                ><Users size={14} /> All</button>
                <button 
                  type="button" 
                  className={`btn-glass-sm ${targetType === 'org' ? 'active' : ''}`}
                  onClick={() => setTargetType('org')}
                  style={{ flex: 1 }}
                ><Building2 size={14} /> Orgs</button>
              </div>
            </div>
            <div className="form-group">
              <label>Priority Level</label>
              <select 
                className="modal-select" 
                style={{ background: 'var(--bg-input)' }}
                value={priority}
                onChange={(e: any) => setPriority(e.target.value)}
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
              ></textarea>
            </div>
            <button type="button" className="btn-premium" style={{ width: '100%', background: 'var(--sa-primary)', marginTop: '16px' }}>
              <Send size={18} /> Send Broadcast Now
            </button>
          </form>
        </motion.div>

        {/* Recent History */}
        <motion.div 
          className="content-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="card-header">
            <h3>Sent History</h3>
            <button className="btn-text">Clear All</button>
          </div>
          <div className="notification-history-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {recentNotifications.map((notif) => (
              <div key={notif.id} className="history-item" style={{ padding: '16px', background: 'var(--bg-input)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div className={`stat-icon-wrapper mini ${notif.priority === 'high' ? 'rose' : notif.priority === 'medium' ? 'blue' : 'indigo'}`} style={{ width: '40px', height: '40px' }}>
                    <Bell size={18} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '2px' }}>{notif.title}</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                      <Users size={12} style={{ display: 'inline', marginRight: '4px' }} /> {notif.target} • <Clock size={12} style={{ display: 'inline', margin: '0 4px' }} /> {notif.time}
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className={`status-badge ${notif.status === 'Delivered' ? 'synced' : 'pending'}`} style={{ marginBottom: '8px', display: 'inline-block' }}>
                    {notif.status}
                  </span>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button className="copy-code-btn" title="Resend"><Plus size={14} /></button>
                    <button className="copy-code-btn" title="Delete"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
