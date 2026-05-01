import React from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  Settings,
  TrendingUp,
  Puzzle,
  Zap,
  Smartphone,
  Building2,
  BarChart3
} from 'lucide-react';
import './Dashboard.css';

const SuperAdminFeatures: React.FC = () => {
  const addons = [
    { id: 1, name: 'Extra Branch', price: '₦2,000/mo', active: true, sold: 142, icon: <Building2 size={24} />, color: 'indigo' },
    { id: 2, name: 'Extra Staff Slot (5)', price: '₦1,000/mo', active: true, sold: 85, icon: <Puzzle size={24} />, color: 'blue' },
    { id: 3, name: 'Advanced Analytics', price: '₦5,000/mo', active: true, sold: 42, icon: <BarChart3 size={24} />, color: 'emerald' },
    { id: 4, name: 'Extra Capturing Device', price: '₦500/mo', active: true, sold: 210, icon: <Smartphone size={24} />, color: 'amber' },
    { id: 5, name: 'White-label Portal', price: '₦25,000/mo', active: false, sold: 12, icon: <Zap size={24} />, color: 'rose' },
  ];

  return (
    <div className="dashboard-overview sa-theme">
      <div className="section-header">
        <div>
          <h1 className="hero-title" style={{ fontSize: '28px', marginBottom: '8px' }}>Feature Management</h1>
          <p className="text-muted">Manage paid add-ons and individual platform modules.</p>
        </div>
        <div className="flex-center gap-12">
          <button className="btn-premium-sm" style={{ background: 'var(--sa-primary)' }}><Plus size={16} /> Create New Add-on</button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card sa-stat-card">
          <div className="stat-icon-wrapper blue"><Package size={24} /></div>
          <div className="stat-content">
            <span className="stat-title">Total Add-on Revenue</span>
            <h2 className="stat-value">₦1.2M</h2>
          </div>
        </div>
        <div className="stat-card sa-stat-card">
          <div className="stat-icon-wrapper emerald"><TrendingUp size={24} /></div>
          <div className="stat-content">
            <span className="stat-title">Top Selling Add-on</span>
            <h2 className="stat-value">Extra Devices</h2>
          </div>
        </div>
      </div>

      <div className="content-card" style={{ marginTop: '32px' }}>
        <div className="card-header">
          <h3>Active SaaS Add-ons</h3>
          <button className="btn-text">Manage Global Limits <Settings size={16} /></button>
        </div>
        <div className="table-container">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Feature Module</th>
                <th>Monthly Price</th>
                <th>Units Sold</th>
                <th>Revenue</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {addons.map((addon) => (
                <tr key={addon.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className={`stat-icon-wrapper mini ${addon.color}`} style={{ width: '32px', height: '32px' }}>
                        {addon.icon}
                      </div>
                      <span className="font-bold">{addon.name}</span>
                    </div>
                  </td>
                  <td className="font-bold">{addon.price}</td>
                  <td>{addon.sold} units</td>
                  <td className="font-bold">₦{(addon.sold * parseInt(addon.price.replace(/[^0-9]/g, ''))).toLocaleString()}</td>
                  <td>
                    <span className={`status-badge ${addon.active ? 'synced' : 'pending'}`}>
                      {addon.active ? 'Active' : 'Draft'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="copy-code-btn" title="Edit"><Edit2 size={14} /></button>
                      <button className={`copy-code-btn ${addon.active ? 'text-red' : 'text-emerald'}`} title={addon.active ? 'Disable' : 'Enable'}>
                        {addon.active ? <X size={14} /> : <Check size={14} />}
                      </button>
                      <button className="copy-code-btn" style={{ color: 'var(--danger)' }} title="Delete"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="sa-alert-box" style={{ marginTop: '24px', padding: '16px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', display: 'flex', gap: '12px', alignItems: 'center', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
        <Puzzle className="text-gradient" size={20} />
        <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}><strong>Architecture Note:</strong> Add-ons can be restricted to specific plans from the <strong>SaaS Plans</strong> tab.</span>
      </div>
    </div>
  );
};

export default SuperAdminFeatures;
