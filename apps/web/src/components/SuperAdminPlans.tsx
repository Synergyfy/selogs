import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Clock,
  Layers
} from 'lucide-react';
import './Dashboard.css';

import { useGlobalPlans } from '../hooks/super-admin/useGlobalPlans';
import { useUpdatePlan } from '../hooks/super-admin/useUpdatePlan';
import { useCreatePlan } from '../hooks/super-admin/useCreatePlan';
import { useDeletePlan } from '../hooks/super-admin/useDeletePlan';
import type { Plan, CreatePlanDto, UpdatePlanDto } from '../types/super-admin';

const SuperAdminPlans: React.FC = () => {
  const { data: plans, isLoading } = useGlobalPlans();
  const updatePlan = useUpdatePlan();
  const createPlan = useCreatePlan();
  const deletePlan = useDeletePlan();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<UpdatePlanDto | null>(null);
  
  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState<CreatePlanDto>({
    name: '',
    description: '',
    monthlyPrice: 0,
    branchLimit: 1,
    staffLimit: 5,
    deviceLimit: 2,
    hasOcr: false,
    hasAnalytics: false,
    hasExport: false,
    customFeatures: []
  });

  const startEditing = (plan: Plan) => {
    setEditingId(plan.id);
    setEditData({ ...plan });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditData(null);
  };

  const saveEditing = () => {
    if (editingId && editData) {
      updatePlan.mutate({ id: editingId, data: editData });
      setEditingId(null);
      setEditData(null);
    }
  };

  const handleCreatePlan = () => {
    createPlan.mutate(formData, {
      onSuccess: () => {
        setIsDrawerOpen(false);
        setFormData({
          name: '',
          description: '',
          monthlyPrice: 0,
          branchLimit: 1,
          staffLimit: 5,
          deviceLimit: 2,
          hasOcr: false,
          hasAnalytics: false,
          hasExport: false,
          customFeatures: []
        });
      }
    });
  };

  const updateLimit = (key: string, value: string) => {
    if (!editData) return;
    const numValue = parseInt(value) || 0;
    setEditData({
      ...editData,
      [key]: numValue
    });
  };

  const updateFormLimit = (key: keyof CreatePlanDto, value: string) => {
    const numValue = parseInt(value) || 0;
    setFormData({
      ...formData,
      [key]: numValue
    });
  };

  const addFeature = () => {
    if (!editData) return;
    setEditData({
      ...editData,
      customFeatures: [...(editData.customFeatures || []), "New Feature"]
    });
  };

  const addFormFeature = () => {
    setFormData({
      ...formData,
      customFeatures: [...(formData.customFeatures || []), "New Feature"]
    });
  };

  const removeFeature = (index: number) => {
    if (!editData || !editData.customFeatures) return;
    const newFeatures = [...editData.customFeatures];
    newFeatures.splice(index, 1);
    setEditData({ ...editData, customFeatures: newFeatures });
  };

  const removeFormFeature = (index: number) => {
    if (!formData.customFeatures) return;
    const newFeatures = [...formData.customFeatures];
    newFeatures.splice(index, 1);
    setFormData({ ...formData, customFeatures: newFeatures });
  };

  const updateFeature = (index: number, value: string) => {
    if (!editData || !editData.customFeatures) return;
    const newFeatures = [...editData.customFeatures];
    newFeatures[index] = value;
    setEditData({ ...editData, customFeatures: newFeatures });
  };

  const updateFormFeature = (index: number, value: string) => {
    if (!formData.customFeatures) return;
    const newFeatures = [...formData.customFeatures];
    newFeatures[index] = value;
    setFormData({ ...formData, customFeatures: newFeatures });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(price);
  };

  const getFeatures = (plan: Plan) => {
    const features = [];
    if (plan.hasOcr) features.push('OCR Capture');
    if (plan.hasAnalytics) features.push('Advanced Analytics');
    if (plan.hasExport) features.push('Data Export');
    return [...features, ...plan.customFeatures];
  };

  if (isLoading) {
    return (
      <div className="dashboard-overview sa-theme flex-center" style={{ height: '400px' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-overview sa-theme">
      <div className="section-header">
        <div>
          <h1 className="hero-title" style={{ fontSize: '32px', marginBottom: '8px' }}>Plan Management</h1>
          <p className="text-muted" style={{ fontSize: '15px' }}>Configure subscription tiers, resource limits, and global feature access.</p>
        </div>
        <button 
          className="btn-premium-sm" 
          style={{ background: 'var(--sa-primary)', padding: '12px 24px', borderRadius: '14px' }}
          onClick={() => setIsDrawerOpen(true)}
        >
          <Plus size={18} /> Create New Tier
        </button>
      </div>

      <div className="sa-customer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {plans?.map((plan, index) => (
          <motion.div 
            key={plan.id}
            className={`sa-plan-card ${editingId === plan.id ? 'editing' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {editingId === plan.id && editData ? (
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
                      value={editData.isActive ? 'Active' : 'Hidden'}
                      onChange={(e) => setEditData({...editData, isActive: e.target.value === 'Active'})}
                    >
                      <option value="Active">Active</option>
                      <option value="Hidden">Hidden</option>
                    </select>
                  </div>
                </div>

                <div className="sa-edit-field">
                  <label className="sa-edit-label">Monthly Pricing (₦)</label>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <input 
                      type="number"
                      className="sa-input-premium" 
                      value={editData.monthlyPrice} 
                      onChange={(e) => setEditData({...editData, monthlyPrice: parseInt(e.target.value) || 0})}
                      placeholder="Price"
                    />
                  </div>
                </div>

                <div className="sa-edit-field">
                  <label className="sa-edit-label">Resource Limits</label>
                  <div className="sa-limits-grid" style={{ padding: '12px', margin: '8px 0' }}>
                    <div className="sa-limit-item">
                      <MapPin size={14} className="text-indigo" />
                      <input className="sa-limit-input" value={editData.branchLimit} onChange={(e) => updateLimit('branchLimit', e.target.value)} />
                      <span className="sa-limit-label">Branches</span>
                    </div>
                    <div className="sa-limit-item">
                      <Users size={14} className="text-blue" />
                      <input className="sa-limit-input" value={editData.staffLimit} onChange={(e) => updateLimit('staffLimit', e.target.value)} />
                      <span className="sa-limit-label">Staff</span>
                    </div>
                    <div className="sa-limit-item">
                      <Smartphone size={14} className="text-amber" />
                      <input className="sa-limit-input" value={editData.deviceLimit} onChange={(e) => updateLimit('deviceLimit', e.target.value)} />
                      <span className="sa-limit-label">Devices</span>
                    </div>
                  </div>
                </div>

                <div className="sa-edit-field">
                  <label className="sa-edit-label">Features</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                    <label className="flex-center gap-4" style={{ cursor: 'pointer', fontSize: '12px', background: editData.hasOcr ? 'rgba(99, 102, 241, 0.1)' : 'transparent', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                      <input type="checkbox" checked={editData.hasOcr} onChange={(e) => setEditData({...editData, hasOcr: e.target.checked})} /> OCR
                    </label>
                    <label className="flex-center gap-4" style={{ cursor: 'pointer', fontSize: '12px', background: editData.hasAnalytics ? 'rgba(59, 130, 246, 0.1)' : 'transparent', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                      <input type="checkbox" checked={editData.hasAnalytics} onChange={(e) => setEditData({...editData, hasAnalytics: e.target.checked})} /> Analytics
                    </label>
                    <label className="flex-center gap-4" style={{ cursor: 'pointer', fontSize: '12px', background: editData.hasExport ? 'rgba(16, 185, 129, 0.1)' : 'transparent', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                      <input type="checkbox" checked={editData.hasExport} onChange={(e) => setEditData({...editData, hasExport: e.target.checked})} /> Export
                    </label>
                  </div>
                  <div className="flex-column gap-8" style={{ maxHeight: '160px', overflowY: 'auto', marginBottom: '12px', paddingRight: '8px' }}>
                    {editData.customFeatures?.map((f: string, i: number) => (
                      <div key={i} className="flex-center gap-8">
                        <input 
                          className="sa-input-premium" 
                          style={{ flex: 1, fontSize: '13px' }}
                          value={f} 
                          onChange={(e) => updateFeature(i, e.target.value)} 
                          placeholder="e.g. Priority Support"
                        />
                        <button className="btn-text text-red" onClick={() => removeFeature(i)}>
                          <MinusCircle size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button className="sa-add-feature-btn" onClick={addFeature}>
                    <PlusCircle size={14} /> Add Custom Perk
                  </button>
                </div>

                <div className="sa-card-actions" style={{ paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                  <button className="btn-premium-sm" onClick={saveEditing} style={{ flex: 1, background: 'var(--sa-primary)' }} disabled={updatePlan.isPending}>
                    <Save size={16} /> {updatePlan.isPending ? 'Saving...' : 'Save Changes'}
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
                    <span className={`status-badge ${plan.isActive ? 'active' : 'inactive'}`} style={{ background: plan.isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: plan.isActive ? '#10b981' : '#ef4444' }}>
                      {plan.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </div>
                  <div style={{ marginTop: '20px' }}>
                    <span className="sa-plan-name">{plan.name}</span>
                    <div className="sa-plan-price">
                      {formatPrice(plan.monthlyPrice)}<span>/ month</span>
                    </div>
                    <div className="flex-center gap-8 text-muted" style={{ fontSize: '13px' }}>
                      <Clock size={14} /> {plan.description || 'Standard Tier'}
                    </div>
                  </div>
                </div>

                <div className="sa-limits-grid">
                  <div className="sa-limit-item">
                    <MapPin size={16} className="text-indigo" style={{ opacity: 0.8 }} />
                    <span className="sa-limit-value">{plan.branchLimit}</span>
                    <span className="sa-limit-label">Branches</span>
                  </div>
                  <div className="sa-limit-item">
                    <Users size={16} className="text-blue" style={{ opacity: 0.8 }} />
                    <span className="sa-limit-value">{plan.staffLimit}</span>
                    <span className="sa-limit-label">Staff</span>
                  </div>
                  <div className="sa-limit-item">
                    <Smartphone size={16} className="text-amber" style={{ opacity: 0.8 }} />
                    <span className="sa-limit-value">{plan.deviceLimit}</span>
                    <span className="sa-limit-label">Devices</span>
                  </div>
                </div>

                <ul className="sa-features-list">
                  {getFeatures(plan).map(f => (
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
                  <button 
                    className="action-btn text-red" 
                    style={{ background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', width: '44px' }}
                    onClick={() => {
                      if(window.confirm('Are you sure you want to delete this plan?')) {
                        deletePlan.mutate(plan.id);
                      }
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </>
            )}
          </motion.div>
        ))}

        <motion.div 
          className="sa-plan-card"
          style={{ display: 'grid', placeItems: 'center', border: '2px dashed rgba(139, 92, 246, 0.2)', background: 'transparent', minHeight: '500px', cursor: 'pointer' }}
          whileHover={{ background: 'rgba(139, 92, 246, 0.03)', borderColor: 'var(--sa-primary)' }}
          onClick={() => setIsDrawerOpen(true)}
        >
          <div className="flex-center flex-column gap-16 text-muted">
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sa-primary)' }}>
              <Plus size={32} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ display: 'block', color: 'var(--text-primary)', fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>
                Add New Plan
              </span>
              <span style={{ fontSize: '13px', opacity: 0.6 }}>Create a custom tier for specific needs</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* PLAN CREATION DRAWER */}
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
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(4px)',
                zIndex: 1000
              }}
            />
            <motion.div 
              className="sa-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                width: '450px',
                height: '100vh',
                background: 'var(--bg-card)',
                boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
                zIndex: 1001,
                display: 'flex',
                flexDirection: 'column',
                borderLeft: '1px solid var(--border)'
              }}
            >
              <div className="drawer-header" style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div className="stat-icon-wrapper indigo" style={{ width: '40px', height: '40px' }}>
                    <Layers size={20} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '18px', fontWeight: 700 }}>New Subscription Plan</h2>
                    <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Define a new service tier</p>
                  </div>
                </div>
                <button className="btn-glass-sm" onClick={() => setIsDrawerOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              <div className="drawer-content" style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
                <div className="sa-edit-field" style={{ marginBottom: '24px' }}>
                  <label className="sa-edit-label">Plan Name</label>
                  <input 
                    className="sa-input-premium" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Pro Ultimate"
                  />
                </div>

                <div className="sa-edit-field" style={{ marginBottom: '24px' }}>
                  <label className="sa-edit-label">Description</label>
                  <textarea 
                    className="sa-input-premium" 
                    style={{ minHeight: '80px', paddingTop: '12px', resize: 'none' }}
                    value={formData.description} 
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Briefly describe what this plan offers..."
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
                  <label className="sa-edit-label">Resource Limits</label>
                  <div className="sa-limits-grid" style={{ padding: '16px', borderRadius: '14px', background: 'var(--bg-input)' }}>
                    <div className="sa-limit-item">
                      <MapPin size={14} className="text-indigo" />
                      <input className="sa-limit-input" value={formData.branchLimit} onChange={(e) => updateFormLimit('branchLimit', e.target.value)} />
                      <span className="sa-limit-label">Branches</span>
                    </div>
                    <div className="sa-limit-item">
                      <Users size={14} className="text-blue" />
                      <input className="sa-limit-input" value={formData.staffLimit} onChange={(e) => updateFormLimit('staffLimit', e.target.value)} />
                      <span className="sa-limit-label">Staff Slots</span>
                    </div>
                    <div className="sa-limit-item">
                      <Smartphone size={14} className="text-amber" />
                      <input className="sa-limit-input" value={formData.deviceLimit} onChange={(e) => updateFormLimit('deviceLimit', e.target.value)} />
                      <span className="sa-limit-label">Devices</span>
                    </div>
                  </div>
                </div>

                <div className="sa-edit-field" style={{ marginBottom: '24px' }}>
                  <label className="sa-edit-label">Core Features</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    <label className="sa-feature-checkbox">
                      <input type="checkbox" checked={formData.hasOcr} onChange={(e) => setFormData({...formData, hasOcr: e.target.checked})} />
                      <span>OCR OCR Capture</span>
                    </label>
                    <label className="sa-feature-checkbox">
                      <input type="checkbox" checked={formData.hasAnalytics} onChange={(e) => setFormData({...formData, hasAnalytics: e.target.checked})} />
                      <span>Advanced Analytics</span>
                    </label>
                    <label className="sa-feature-checkbox">
                      <input type="checkbox" checked={formData.hasExport} onChange={(e) => setFormData({...formData, hasExport: e.target.checked})} />
                      <span>CSV Export</span>
                    </label>
                  </div>
                </div>

                <div className="sa-edit-field">
                  <label className="sa-edit-label">Custom Feature List</label>
                  <div className="flex-column gap-8" style={{ maxHeight: '160px', overflowY: 'auto' }}>
                    {formData.customFeatures?.map((f: string, i: number) => (
                      <div key={i} className="flex-center gap-8">
                        <input 
                          className="sa-input-premium" 
                          style={{ flex: 1, fontSize: '13px' }}
                          value={f} 
                          onChange={(e) => updateFormFeature(i, e.target.value)} 
                          placeholder="e.g. 24/7 Priority Support"
                        />
                        <button className="btn-text text-red" onClick={() => removeFormFeature(i)}>
                          <MinusCircle size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button className="sa-add-feature-btn" style={{ marginTop: '12px' }} onClick={addFormFeature}>
                    <PlusCircle size={14} /> Add Additional Perk
                  </button>
                </div>
              </div>

              <div className="drawer-footer" style={{ padding: '24px', borderTop: '1px solid var(--border)', display: 'flex', gap: '12px' }}>
                <button 
                  className="btn-premium" 
                  style={{ flex: 2, background: 'var(--sa-primary)' }}
                  onClick={handleCreatePlan}
                  disabled={createPlan.isPending || !formData.name}
                >
                  {createPlan.isPending ? 'Processing...' : 'Create Subscription Plan'}
                </button>
                <button 
                  className="btn-glass" 
                  style={{ flex: 1 }}
                  onClick={() => setIsDrawerOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SuperAdminPlans;

