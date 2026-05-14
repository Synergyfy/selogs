import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  BarChart3,
  Loader2,
  Users,
  MapPin,
  PlusCircle,
  MinusCircle,
  CheckCircle2
} from 'lucide-react';
import { useAddons } from '../hooks/super-admin/useAddons';
import './Dashboard.css';

// Helper to map icon names to components
const IconMap: Record<string, React.ReactNode> = {
  Building2: <Building2 size={24} />,
  Puzzle: <Puzzle size={24} />,
  BarChart3: <BarChart3 size={24} />,
  Smartphone: <Smartphone size={24} />,
  Zap: <Zap size={24} />,
  Package: <Package size={24} />,
};

const SuperAdminFeatures: React.FC = () => {
  const { addons, isLoading, updateAddon, deleteAddon, createAddon, isUpdating } = useAddons(true);
  
  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    monthlyPrice: 0,
    icon: 'Package',
    color: 'indigo',
    branchLimitInc: 0,
    staffLimitInc: 0,
    deviceLimitInc: 0,
    customFeatures: [] as string[]
  });

  const toggleStatus = (id: string, currentStatus: boolean) => {
    updateAddon({ id, data: { isActive: !currentStatus } });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this add-on?')) {
      deleteAddon(id);
    }
  };

  const handleCreate = () => {
    if (!formData.name) return;
    createAddon(formData, {
      onSuccess: () => {
        setIsDrawerOpen(false);
        setFormData({
          name: '',
          description: '',
          monthlyPrice: 0,
          icon: 'Package',
          color: 'indigo',
          branchLimitInc: 0,
          staffLimitInc: 0,
          deviceLimitInc: 0,
          customFeatures: []
        });
      }
    });
  };

  const addCustomFeature = () => {
    setFormData({
      ...formData,
      customFeatures: [...formData.customFeatures, ""]
    });
  };

  const updateCustomFeature = (index: number, value: string) => {
    const newFeatures = [...formData.customFeatures];
    newFeatures[index] = value;
    setFormData({ ...formData, customFeatures: newFeatures });
  };

  const removeCustomFeature = (index: number) => {
    const newFeatures = [...formData.customFeatures];
    newFeatures.splice(index, 1);
    setFormData({ ...formData, customFeatures: newFeatures });
  };

  const totalRevenue = addons.reduce((acc, curr) => acc + curr.revenue, 0);
  const topSelling = [...addons].sort((a, b) => b.unitsSold - a.unitsSold)[0];

  if (isLoading) {
    return (
      <div className="flex-center sa-theme" style={{ height: '400px' }}>
        <Loader2 className="animate-spin" size={48} color="var(--sa-primary)" />
      </div>
    );
  }

  return (
    <div className="dashboard-overview sa-theme">
      <div className="section-header">
        <div>
          <h1 className="hero-title" style={{ fontSize: '28px', marginBottom: '8px' }}>Feature Management</h1>
          <p className="text-muted">Manage paid add-ons and individual platform modules.</p>
        </div>
        <div className="flex-center gap-12">
          <button 
            className="btn-premium-sm" 
            style={{ background: 'var(--sa-primary)' }}
            onClick={() => setIsDrawerOpen(true)}
          >
            <Plus size={16} /> Create New Add-on
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card sa-stat-card">
          <div className="stat-icon-wrapper blue"><Package size={24} /></div>
          <div className="stat-content">
            <span className="stat-title">Total Add-on Revenue</span>
            <h2 className="stat-value">₦{totalRevenue.toLocaleString()}</h2>
          </div>
        </div>
        <div className="stat-card sa-stat-card">
          <div className="stat-icon-wrapper emerald"><TrendingUp size={24} /></div>
          <div className="stat-content">
            <span className="stat-title">Top Selling Add-on</span>
            <h2 className="stat-value">{topSelling?.name || 'N/A'}</h2>
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
                <th>Inclusions</th>
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
                        {IconMap[addon.icon] || IconMap.Package}
                      </div>
                      <span className="font-bold">{addon.name}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex-column gap-4">
                      {addon.branchLimitInc > 0 && <span style={{ fontSize: '11px', color: 'var(--sa-primary)' }}>+{addon.branchLimitInc} Branches</span>}
                      {addon.staffLimitInc > 0 && <span style={{ fontSize: '11px', color: '#3b82f6' }}>+{addon.staffLimitInc} Staff</span>}
                      {addon.deviceLimitInc > 0 && <span style={{ fontSize: '11px', color: '#f59e0b' }}>+{addon.deviceLimitInc} Devices</span>}
                      {addon.customFeatures.slice(0, 2).map((f, i) => (
                        <span key={i} style={{ fontSize: '11px', opacity: 0.7 }}>• {f}</span>
                      ))}
                      {addon.customFeatures.length > 2 && <span style={{ fontSize: '11px', opacity: 0.5 }}>+{addon.customFeatures.length - 2} more...</span>}
                    </div>
                  </td>
                  <td className="font-bold">₦{addon.monthlyPrice.toLocaleString()}/mo</td>
                  <td>{addon.unitsSold} units</td>
                  <td className="font-bold">₦{addon.revenue.toLocaleString()}</td>
                  <td>
                    <span className={`status-badge ${addon.isActive ? 'synced' : 'pending'}`}>
                      {addon.isActive ? 'Active' : 'Draft'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="copy-code-btn" title="Edit"><Edit2 size={14} /></button>
                      <button 
                        className={`copy-code-btn ${addon.isActive ? 'text-red' : 'text-emerald'}`} 
                        title={addon.isActive ? 'Disable' : 'Enable'}
                        onClick={() => toggleStatus(addon.id, addon.isActive)}
                      >
                        {addon.isActive ? <X size={14} /> : <Check size={14} />}
                      </button>
                      <button 
                        className="copy-code-btn" 
                        style={{ color: 'var(--danger)' }} 
                        title="Delete"
                        onClick={() => handleDelete(addon.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {addons.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '48px' }}>
                    <p className="text-muted">No add-ons found. Click "Create New Add-on" to get started.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="sa-alert-box" style={{ marginTop: '24px', padding: '16px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', display: 'flex', gap: '12px', alignItems: 'center', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
        <Puzzle className="text-gradient" size={20} />
        <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}><strong>Architecture Note:</strong> Add-ons can be restricted to specific plans from the <strong>SaaS Plans</strong> tab.</span>
      </div>

      {/* CREATE ADDON DRAWER */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div 
              className="drawer-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000
              }}
            />
            <motion.div 
              className="sa-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                position: 'fixed', top: 0, right: 0, width: '450px', height: '100vh',
                background: 'var(--bg-card)', boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
                zIndex: 1001, display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--border)'
              }}
            >
              <div className="drawer-header" style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div className="stat-icon-wrapper indigo" style={{ width: '40px', height: '40px' }}>
                    <Puzzle size={20} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '18px', fontWeight: 700 }}>New SaaS Add-on</h2>
                    <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Configure a sellable platform module</p>
                  </div>
                </div>
                <button className="btn-glass-sm" onClick={() => setIsDrawerOpen(false)}><X size={20} /></button>
              </div>

              <div className="drawer-content" style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
                <div className="sa-edit-field" style={{ marginBottom: '24px' }}>
                  <label className="sa-edit-label">Add-on Name</label>
                  <input 
                    className="sa-input-premium" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Extra Branch Pack"
                  />
                </div>

                <div className="sa-edit-field" style={{ marginBottom: '24px' }}>
                  <label className="sa-edit-label">Description</label>
                  <textarea 
                    className="sa-input-premium" 
                    style={{ minHeight: '80px', paddingTop: '12px', resize: 'none' }}
                    value={formData.description} 
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe what this add-on unlocks..."
                  />
                </div>

                <div className="sa-edit-field" style={{ marginBottom: '24px' }}>
                  <label className="sa-edit-label">Monthly Price (₦)</label>
                  <input 
                    type="number"
                    className="sa-input-premium" 
                    value={formData.monthlyPrice} 
                    onChange={(e) => setFormData({...formData, monthlyPrice: parseInt(e.target.value) || 0})}
                  />
                </div>

                <div className="sa-edit-field" style={{ marginBottom: '24px' }}>
                  <label className="sa-edit-label">Visual Style</label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <select 
                      className="sa-input-premium" 
                      value={formData.icon} 
                      onChange={(e) => setFormData({...formData, icon: e.target.value})}
                    >
                      <option value="Package">Standard Box</option>
                      <option value="Building2">Building</option>
                      <option value="Puzzle">Puzzle Piece</option>
                      <option value="Zap">Zap / Fast</option>
                      <option value="Smartphone">Device</option>
                      <option value="BarChart3">Analytics</option>
                    </select>
                    <select 
                      className="sa-input-premium" 
                      value={formData.color} 
                      onChange={(e) => setFormData({...formData, color: e.target.value})}
                    >
                      <option value="indigo">Indigo</option>
                      <option value="blue">Blue</option>
                      <option value="emerald">Emerald</option>
                      <option value="rose">Rose</option>
                      <option value="amber">Amber</option>
                    </select>
                  </div>
                </div>

                <div className="sa-edit-field" style={{ marginBottom: '24px' }}>
                  <label className="sa-edit-label">Resource Boosts</label>
                  <div className="sa-limits-grid" style={{ padding: '16px', borderRadius: '14px', background: 'var(--bg-input)' }}>
                    <div className="sa-limit-item">
                      <MapPin size={14} className="text-indigo" />
                      <input 
                        className="sa-limit-input" 
                        type="number" 
                        value={formData.branchLimitInc} 
                        onChange={(e) => setFormData({...formData, branchLimitInc: parseInt(e.target.value) || 0})} 
                      />
                      <span className="sa-limit-label">Branches</span>
                    </div>
                    <div className="sa-limit-item">
                      <Users size={14} className="text-blue" />
                      <input 
                        className="sa-limit-input" 
                        type="number" 
                        value={formData.staffLimitInc} 
                        onChange={(e) => setFormData({...formData, staffLimitInc: parseInt(e.target.value) || 0})} 
                      />
                      <span className="sa-limit-label">Staff Slots</span>
                    </div>
                    <div className="sa-limit-item">
                      <Smartphone size={14} className="text-amber" />
                      <input 
                        className="sa-limit-input" 
                        type="number" 
                        value={formData.deviceLimitInc} 
                        onChange={(e) => setFormData({...formData, deviceLimitInc: parseInt(e.target.value) || 0})} 
                      />
                      <span className="sa-limit-label">Devices</span>
                    </div>
                  </div>
                </div>

                <div className="sa-edit-field">
                  <label className="sa-edit-label">Custom Features</label>
                  <div className="flex-column gap-8">
                    {formData.customFeatures.map((f, i) => (
                      <div key={i} className="flex-center gap-8">
                        <input 
                          className="sa-input-premium" 
                          style={{ flex: 1 }}
                          value={f} 
                          onChange={(e) => updateCustomFeature(i, e.target.value)} 
                          placeholder="e.g. 24/7 Priority Support"
                        />
                        <button className="btn-text text-red" onClick={() => removeCustomFeature(i)}>
                          <MinusCircle size={18} />
                        </button>
                      </div>
                    ))}
                    <button className="sa-add-feature-btn" style={{ marginTop: '8px' }} onClick={addCustomFeature}>
                      <PlusCircle size={14} /> Add Custom Perk
                    </button>
                  </div>
                </div>
              </div>

              <div className="drawer-footer" style={{ padding: '24px', borderTop: '1px solid var(--border)', display: 'flex', gap: '12px' }}>
                <button 
                  className="btn-premium" 
                  style={{ flex: 2, background: 'var(--sa-primary)' }}
                  onClick={handleCreate}
                  disabled={!formData.name}
                >
                  Create Add-on Module
                </button>
                <button className="btn-glass" style={{ flex: 1 }} onClick={() => setIsDrawerOpen(false)}>Cancel</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SuperAdminFeatures;
