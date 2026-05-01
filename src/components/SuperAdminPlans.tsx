import React from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  MapPin, 
  Users, 
  Smartphone,
  Plus
} from 'lucide-react';
import './Dashboard.css';

const SuperAdminPlans: React.FC = () => {
  const plans = [
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
  ];

  return (
    <div className="dashboard-overview sa-theme">
      <div className="section-header">
        <div>
          <h1 className="hero-title" style={{ fontSize: '28px', marginBottom: '8px' }}>Global Plan Configuration</h1>
          <p className="text-muted">Define pricing tiers, resource limits, and feature access.</p>
        </div>
        <button className="btn-premium-sm" style={{ background: 'var(--sa-primary)' }}>+ Create New Plan</button>
      </div>

      <div className="sa-customer-grid">
        {plans.map((plan, index) => (
          <motion.div 
            key={plan.id}
            className="content-card sa-plan-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="stat-icon-wrapper indigo" style={{ width: '40px', height: '40px' }}>
                  <Package size={20} />
                </div>
                <h3>{plan.name}</h3>
              </div>
              <span className={`status-badge active`}>{plan.status}</span>
            </div>

            <div style={{ padding: '20px 0' }}>
              <div style={{ fontSize: '32px', fontWeight: '800', marginBottom: '4px' }}>{plan.price}<span style={{ fontSize: '14px', opacity: 0.6 }}>/mo</span></div>
              <p className="text-muted" style={{ fontSize: '13px' }}>Trial Period: {plan.trial}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', margin: '20px 0', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
              <div className="flex-center flex-column gap-4">
                <MapPin size={16} className="text-indigo" />
                <span style={{ fontSize: '12px', fontWeight: '700' }}>{plan.limits.branches}</span>
                <span style={{ fontSize: '10px', opacity: 0.5 }}>Branches</span>
              </div>
              <div className="flex-center flex-column gap-4">
                <Users size={16} className="text-blue" />
                <span style={{ fontSize: '12px', fontWeight: '700' }}>{plan.limits.staff}</span>
                <span style={{ fontSize: '10px', opacity: 0.5 }}>Staff</span>
              </div>
              <div className="flex-center flex-column gap-4">
                <Smartphone size={16} className="text-amber" />
                <span style={{ fontSize: '12px', fontWeight: '700' }}>{plan.limits.devices}</span>
                <span style={{ fontSize: '10px', opacity: 0.5 }}>Devices</span>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '14px', marginBottom: '12px' }}>Included Features</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {plan.features.map(f => (
                  <li key={f} style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.8 }}>
                    <CheckCircle size={14} className="text-emerald" /> {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card-footer" style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', display: 'flex', gap: '12px' }}>
              <button className="btn-glass-sm" style={{ flex: 1 }}><Edit3 size={16} /> Edit Config</button>
              <button className="action-btn text-red"><Trash2 size={16} /></button>
            </div>
          </motion.div>
        ))}

        <motion.div 
          className="content-card"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border)', background: 'transparent' }}
          whileHover={{ background: 'rgba(255,255,255,0.02)' }}
        >
          <div className="flex-center flex-column gap-12 text-muted">
            <Plus size={32} />
            <span>Add Custom Plan Tier</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SuperAdminPlans;
