import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  MapPin, 
  Users, 
  Smartphone,
  Plus,
  Save,
  X,
  PlusCircle,
  MinusCircle,
  Clock
} from 'lucide-react';
import './Dashboard.css';

const SuperAdminPlans: React.FC = () => {
  const [plans, setPlans] = useState([
    {
      id: 1,
      name: "Starter",
      price: "₦5,000",
      trial: "14 Days",
      limits: { branches: 1, staff: 5, devices: 2 },
      features: ["OCR Capture", "Basic Reporting", "Offline Mode"],
      status: "Active"
    },
    {
      id: 2,
      name: "Business",
      price: "₦15,000",
      trial: "14 Days",
      limits: { branches: 5, staff: 20, devices: 10 },
      features: ["Unlimited Branches", "Advanced Analytics", "CSV Export", "Custom Branding"],
      status: "Active"
    },
    {
      id: 3,
      name: "Enterprise",
      price: "Custom",
      trial: "30 Days",
      limits: { branches: "Unlimited", staff: "Unlimited", devices: "Unlimited" },
      features: ["Full API Access", "Dedicated Manager", "SLA Support", "Custom Features"],
      status: "Active"
    }
  ]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>(null);

  const startEditing = (plan: any) => {
    setEditingId(plan.id);
    setEditData({ ...plan });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditData(null);
  };

  const saveEditing = () => {
    setPlans(plans.map(p => p.id === editingId ? editData : p));
    setEditingId(null);
    setEditData(null);
  };

  const updateLimit = (key: string, value: any) => {
    setEditData({
      ...editData,
      limits: { ...editData.limits, [key]: value }
    });
  };

  const addFeature = () => {
    setEditData({
      ...editData,
      features: [...editData.features, "New Feature"]
    });
  };

  const removeFeature = (index: number) => {
    const newFeatures = [...editData.features];
    newFeatures.splice(index, 1);
    setEditData({ ...editData, features: newFeatures });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...editData.features];
    newFeatures[index] = value;
    setEditData({ ...editData, features: newFeatures });
  };

  return (
    <div className="dashboard-overview sa-theme">
      <div className="section-header">
        <div>
          <h1 className="hero-title" style={{ fontSize: '32px', marginBottom: '8px' }}>Plan Management</h1>
          <p className="text-muted" style={{ fontSize: '15px' }}>Configure subscription tiers, resource limits, and global feature access.</p>
        </div>
        <button className="btn-premium-sm" style={{ background: 'var(--sa-primary)', padding: '12px 24px', borderRadius: '14px' }}>
          <Plus size={18} /> Create New Tier
        </button>
      </div>

      <div className="sa-customer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {plans.map((plan, index) => (
          <motion.div 
            key={plan.id}
            className={`sa-plan-card ${editingId === plan.id ? 'editing' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {editingId === plan.id ? (
              /* EDIT MODE */
              <div className="edit-plan-container">
                <div className="sa-edit-field">
                  <label className="sa-edit-label">Basic Info</label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <input 
                      className="sa-input-premium" 
                      value={editData.name} 
                      onChange={(e) => setEditData({...editData, name: e.target.value})}
                      placeholder="Plan Name"
                    />
                    <select 
                      className="sa-input-premium"
                      style={{ width: '120px' }}
                      value={editData.status}
                      onChange={(e) => setEditData({...editData, status: e.target.value})}
                    >
                      <option>Active</option>
                      <option>Hidden</option>
                    </select>
                  </div>
                </div>

                <div className="sa-edit-field">
                  <label className="sa-edit-label">Pricing & Trial</label>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <input 
                      className="sa-input-premium" 
                      value={editData.price} 
                      onChange={(e) => setEditData({...editData, price: e.target.value})}
                      placeholder="Price"
                    />
                    <input 
                      className="sa-input-premium" 
                      value={editData.trial} 
                      onChange={(e) => setEditData({...editData, trial: e.target.value})}
                      placeholder="Trial"
                    />
                  </div>
                </div>

                <div className="sa-edit-field">
                  <label className="sa-edit-label">Resource Limits</label>
                  <div className="sa-limits-grid" style={{ padding: '12px', margin: '8px 0' }}>
                    <div className="sa-limit-item">
                      <MapPin size={14} className="text-indigo" />
                      <input className="sa-limit-input" value={editData.limits.branches} onChange={(e) => updateLimit('branches', e.target.value)} />
                      <span className="sa-limit-label">Branches</span>
                    </div>
                    <div className="sa-limit-item">
                      <Users size={14} className="text-blue" />
                      <input className="sa-limit-input" value={editData.limits.staff} onChange={(e) => updateLimit('staff', e.target.value)} />
                      <span className="sa-limit-label">Staff</span>
                    </div>
                    <div className="sa-limit-item">
                      <Smartphone size={14} className="text-amber" />
                      <input className="sa-limit-input" value={editData.limits.devices} onChange={(e) => updateLimit('devices', e.target.value)} />
                      <span className="sa-limit-label">Devices</span>
                    </div>
                  </div>
                </div>

                <div className="sa-edit-field">
                  <label className="sa-edit-label">Features</label>
                  <div style={{ maxHeight: '180px', overflowY: 'auto', marginBottom: '12px', paddingRight: '8px' }}>
                    {editData.features.map((f: string, i: number) => (
                      <div key={i} className="sa-feature-edit-row">
                        <input className="sa-feature-edit-input" value={f} onChange={(e) => updateFeature(i, e.target.value)} />
                        <button className="sa-remove-feature" onClick={() => removeFeature(i)}><MinusCircle size={16} /></button>
                      </div>
                    ))}
                  </div>
                  <button className="sa-add-feature-btn" onClick={addFeature}>
                    <PlusCircle size={14} /> Add Feature
                  </button>
                </div>

                <div className="sa-card-actions" style={{ paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                  <button className="btn-premium-sm" onClick={saveEditing} style={{ flex: 1, background: 'var(--sa-primary)' }}>
                    <Save size={16} /> Save Changes
                  </button>
                  <button className="btn-glass-sm" onClick={cancelEditing}>
                    <X size={18} />
                  </button>
                </div>
              </div>
            ) : (
              /* VIEW MODE */
              <>
                <div className="sa-plan-header">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="stat-icon-wrapper indigo" style={{ width: '48px', height: '48px', borderRadius: '14px' }}>
                      <Package size={24} />
                    </div>
                    <span className={`status-badge active`} style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>{plan.status}</span>
                  </div>
                  <div style={{ marginTop: '20px' }}>
                    <span className="sa-plan-name">{plan.name}</span>
                    <div className="sa-plan-price">
                      {plan.price}<span>/ month</span>
                    </div>
                    <div className="flex-center gap-8 text-muted" style={{ fontSize: '13px' }}>
                      <Clock size={14} /> Free Trial: {plan.trial}
                    </div>
                  </div>
                </div>

                <div className="sa-limits-grid">
                  <div className="sa-limit-item">
                    <MapPin size={16} className="text-indigo" style={{ opacity: 0.8 }} />
                    <span className="sa-limit-value">{plan.limits.branches}</span>
                    <span className="sa-limit-label">Branches</span>
                  </div>
                  <div className="sa-limit-item">
                    <Users size={16} className="text-blue" style={{ opacity: 0.8 }} />
                    <span className="sa-limit-value">{plan.limits.staff}</span>
                    <span className="sa-limit-label">Staff</span>
                  </div>
                  <div className="sa-limit-item">
                    <Smartphone size={16} className="text-amber" style={{ opacity: 0.8 }} />
                    <span className="sa-limit-value">{plan.limits.devices}</span>
                    <span className="sa-limit-label">Devices</span>
                  </div>
                </div>

                <ul className="sa-features-list">
                  {plan.features.map(f => (
                    <li key={f} className="sa-feature-item">
                      <CheckCircle size={16} className="sa-feature-icon" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="sa-card-actions">
                  <button 
                    className="btn-glass-sm" 
                    style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '14px', fontWeight: '600' }} 
                    onClick={() => startEditing(plan)}
                  >
                    <Edit3 size={16} /> Edit Config
                  </button>
                  <button className="action-btn text-red" style={{ background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', width: '44px' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </>
            )}
          </motion.div>
        ))}

        <motion.div 
          className="sa-plan-card"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed rgba(139, 92, 246, 0.2)', background: 'transparent', minHeight: '500px' }}
          whileHover={{ background: 'rgba(139, 92, 246, 0.03)', borderColor: 'var(--sa-primary)' }}
        >
          <div className="flex-center flex-column gap-16 text-muted">
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sa-primary)' }}>
              <Plus size={32} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ display: 'block', color: 'var(--text-primary)', fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>Add New Plan</span>
              <span style={{ fontSize: '13px', opacity: 0.6 }}>Create a custom tier for specific needs</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SuperAdminPlans;

