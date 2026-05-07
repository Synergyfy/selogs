import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Database, 
  Smartphone, 
  Mail, 
  Lock,
  Save,
  RefreshCcw,
  AlertTriangle,
  Zap
} from 'lucide-react';
import './Dashboard.css';

const SuperAdminSettings: React.FC = () => {
  const [maintMode, setMaintMode] = useState(false);
  const [regEnabled, setRegEnabled] = useState(true);

  return (
    <div className="dashboard-overview sa-theme">
      <div className="section-header">
        <div>
          <h1 className="hero-title" style={{ fontSize: '28px', marginBottom: '8px' }}>Platform Settings</h1>
          <p className="text-muted">Configure global system behavior and security policies.</p>
        </div>
        <div className="flex-center gap-12">
          <button className="btn-premium-sm" style={{ background: 'var(--sa-primary)' }}><Save size={16} /> Save Changes</button>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* System Controls */}
        <motion.div 
          className="content-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="stat-icon-wrapper mini blue"><Shield size={18} /></div>
              <h3>System Controls</h3>
            </div>
          </div>
          <div className="settings-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '16px 0' }}>
            <div className="setting-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontWeight: 700, marginBottom: '4px' }}>Maintenance Mode</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Restrict platform access during updates.</p>
              </div>
              <button 
                className={`theme-btn ${maintMode ? 'active' : ''}`}
                onClick={() => setMaintMode(!maintMode)}
                style={{ width: '60px', padding: '4px' }}
              >
                {maintMode ? 'ON' : 'OFF'}
              </button>
            </div>
            <div className="setting-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontWeight: 700, marginBottom: '4px' }}>Public Registration</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Allow new organizations to sign up.</p>
              </div>
              <button 
                className={`theme-btn ${regEnabled ? 'active' : ''}`}
                onClick={() => setRegEnabled(!regEnabled)}
                style={{ width: '60px', padding: '4px' }}
              >
                {regEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
            <div className="setting-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontWeight: 700, marginBottom: '4px' }}>Auto-Suspension</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Automatically suspend accounts with failed payments.</p>
              </div>
              <button className="theme-btn active" style={{ width: '60px', padding: '4px' }}>ON</button>
            </div>
          </div>
        </motion.div>

        {/* API & Services */}
        <motion.div 
          className="content-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="stat-icon-wrapper mini indigo"><Zap size={18} /></div>
              <h3>External Services</h3>
            </div>
          </div>
          <div className="settings-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Smartphone size={14} /> OCR Capture Engine (API Key)</label>
              <div className="input-field-wrapper" style={{ marginTop: '8px', background: 'var(--bg-input)', borderRadius: '8px', padding: '4px 12px', display: 'flex', alignItems: 'center' }}>
                <Lock size={14} style={{ color: 'var(--text-dim)', marginRight: '8px' }} />
                <input type="password" value="••••••••••••••••••••" readOnly style={{ border: 'none', background: 'transparent', color: 'var(--text-primary)', flex: 1, padding: '8px 0' }} />
                <button className="btn-text" style={{ fontSize: '11px' }}>Rotate Key</button>
              </div>
            </div>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} /> SMTP Provider Status</label>
              <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-input)', borderRadius: '8px' }}>
                <span style={{ fontSize: '13px' }}>Amazon SES (US-East-1)</span>
                <span className="status-badge synced">Connected</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Security & Access */}
        <motion.div 
          className="content-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="stat-icon-wrapper mini rose"><Lock size={18} /></div>
              <h3>Admin Security</h3>
            </div>
          </div>
          <div className="settings-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
             <button className="btn-glass-sm" style={{ justifyContent: 'space-between', width: '100%', padding: '12px' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                 <Shield size={18} />
                 <span style={{ fontWeight: 600 }}>Enable Two-Factor Auth</span>
               </div>
               <span className="text-muted">Recommended</span>
             </button>
             <button className="btn-glass-sm" style={{ justifyContent: 'space-between', width: '100%', padding: '12px' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                 <RefreshCcw size={18} />
                 <span style={{ fontWeight: 600 }}>Purge Activity Logs</span>
               </div>
               <span className="text-muted">Older than 90 days</span>
             </button>
          </div>
        </motion.div>

        {/* Database Health */}
        <motion.div 
          className="content-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="stat-icon-wrapper mini emerald"><Database size={18} /></div>
              <h3>System Health</h3>
            </div>
          </div>
          <div className="health-stats" style={{ padding: '8px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span className="text-muted">Server Load</span>
              <span className="font-bold">12%</span>
            </div>
            <div className="chart-placeholder" style={{ height: '4px', background: 'var(--border-light)', borderRadius: '2px', overflow: 'hidden', marginBottom: '20px' }}>
              <div style={{ width: '12%', height: '100%', background: 'var(--sa-primary)' }} />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span className="text-muted">Database Storage</span>
              <span className="font-bold">4.2 GB / 20 GB</span>
            </div>
            <div className="chart-placeholder" style={{ height: '4px', background: 'var(--border-light)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: '21%', height: '100%', background: 'var(--sa-primary)' }} />
            </div>
          </div>
          <div className="sa-alert-box" style={{ marginTop: '24px', padding: '12px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px', display: 'flex', gap: '10px', alignItems: 'center', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
            <AlertTriangle className="text-amber" size={18} />
            <span style={{ fontSize: '12px', color: '#fbbf24' }}>System backup scheduled for 02:00 AM.</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SuperAdminSettings;
