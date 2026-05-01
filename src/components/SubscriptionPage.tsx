import React, { useState } from 'react';
import { 
  Check, 
  Zap, 
  Rocket, 
  Crown, 
  ShieldCheck,
  Plus,
  Building2,
  Users,
  Smartphone,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import './Dashboard.css';

const SubscriptionPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      id: 'Starter',
      name: 'Starter',
      price: billingCycle === 'monthly' ? 'Free' : 'Free',
      desc: 'Basic security for small locations.',
      icon: <Zap size={24} />,
      features: ['Up to 2 Locations', '100 Entries/mo', 'Email Support'],
      current: false
    },
    {
      id: 'Business',
      name: 'Business',
      price: billingCycle === 'monthly' ? '₦15,000' : '₦144,000',
      desc: 'Advanced features for growing teams.',
      icon: <Rocket size={24} />,
      features: ['Up to 10 Locations', 'Unlimited Entries', 'Priority Support', 'Custom Branding'],
      current: true,
      popular: true
    },
    {
      id: 'Enterprise',
      name: 'Enterprise',
      price: 'Custom',
      desc: 'Maximum power for large operations.',
      icon: <Crown size={24} />,
      features: ['Unlimited Locations', 'API Access', '24/7 Dedicated Support', 'Multi-branch Audit'],
      current: false
    }
  ];

  const addons = [
    { name: 'Extra Branch', price: '₦2,000/mo', icon: <Building2 size={18} />, description: 'Add 1 location' },
    { name: 'Staff Pack', price: '₦1,000/mo', icon: <Users size={18} />, description: 'Add 5 staff slots' },
    { name: 'Device Link', price: '₦500/mo', icon: <Smartphone size={18} />, description: 'Add 1 device' },
  ];

  return (
    <div className="dashboard-overview">
      <div className="card-header">
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Subscription Management</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '14px' }}>Scale your operations by upgrading your plan or adding individual resources.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Main Plan Selection */}
        <div className="content-card" style={{ gridColumn: '1 / -1' }}>
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Sparkles className="text-gradient" size={20} />
              <h3>Platform Plans</h3>
            </div>
            <div className="theme-switcher-compact" style={{ padding: '2px' }}>
              <button 
                className={`theme-btn ${billingCycle === 'monthly' ? 'active' : ''}`}
                onClick={() => setBillingCycle('monthly')}
                style={{ width: '80px', fontSize: '12px', fontWeight: 700 }}
              >Monthly</button>
              <button 
                className={`theme-btn ${billingCycle === 'yearly' ? 'active' : ''}`}
                onClick={() => setBillingCycle('yearly')}
                style={{ width: '80px', fontSize: '12px', fontWeight: 700 }}
              >Yearly <span style={{ color: 'var(--accent)', fontSize: '10px' }}>-20%</span></button>
            </div>
          </div>

          <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', marginTop: '16px' }}>
            {plans.map((plan) => (
              <div key={plan.id} className={`plan-onboarding-card ${plan.current ? 'active' : ''}`} style={{ width: '100%', padding: '24px' }}>
                {plan.popular && <div className="popular-ribbon">POPULAR</div>}
                <div className="plan-o-icon">{plan.icon}</div>
                <h3 style={{ margin: '8px 0', fontSize: '20px' }}>{plan.name}</h3>
                <div className="plan-o-price" style={{ fontSize: '24px', color: 'var(--text-primary)', marginBottom: '4px' }}>{plan.price}</div>
                <p style={{ fontSize: '13px', color: 'var(--text-dim)', marginBottom: '20px' }}>{plan.desc}</p>
                <ul className="plan-o-features" style={{ textAlign: 'left', marginBottom: '24px' }}>
                  {plan.features.map((f, i) => (
                    <li key={i} style={{ justifyContent: 'flex-start', fontSize: '13px' }}><Check size={14} className="text-emerald" style={{ marginRight: '8px' }} /> {f}</li>
                  ))}
                </ul>
                <button 
                  className={`btn-auth-submit ${plan.current ? 'disabled' : ''}`} 
                  style={{ width: '100%', padding: '12px' }}
                  disabled={plan.current}
                >
                  {plan.current ? 'Current Plan' : 'Select Plan'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Resource Add-ons */}
        <div className="content-card">
          <div className="card-header">
            <h3>Individual Add-ons</h3>
            <span className="sa-badge">CUSTOMIZE</span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-dim)', marginBottom: '20px' }}>Need more capacity without changing your plan? Buy individual slots.</p>
          
          <div className="addon-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {addons.map((addon) => (
              <div key={addon.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--bg-input)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div className="stat-icon-wrapper mini blue" style={{ width: '36px', height: '36px' }}>
                    {addon.icon}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 700 }}>{addon.name}</h4>
                    <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{addon.description}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <strong style={{ fontSize: '14px' }}>{addon.price}</strong>
                  <button className="copy-code-btn" style={{ background: 'var(--sa-primary)', color: 'white', border: 'none' }}><Plus size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Usage / Status */}
        <div className="content-card">
          <div className="card-header">
            <h3>Subscription Status</h3>
          </div>
          <div className="v-stat" style={{ background: 'var(--bg-input)', padding: '20px', borderRadius: '16px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <ShieldCheck className="text-gradient" size={24} />
              <strong style={{ fontSize: '18px' }}>Business Plan</strong>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-dim)' }}>Renewing on <strong>June 01, 2026</strong>.</p>
            <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
              <button className="btn-auth-outline" style={{ borderStyle: 'solid', fontSize: '13px', flex: 1 }}>Manage Billing</button>
              <button className="btn-auth-outline" style={{ borderStyle: 'solid', fontSize: '13px', flex: 1, color: 'var(--danger)' }}>Cancel</button>
            </div>
          </div>
          
          <div style={{ padding: '16px', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
             <h4 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
               <ArrowUpRight size={14} /> Usage Summary
             </h4>
             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-dim)', marginBottom: '4px' }}>
               <span>Branches</span>
               <span>2 / 10 used</span>
             </div>
             <div className="chart-placeholder" style={{ height: '4px', background: 'var(--border-light)', borderRadius: '2px', overflow: 'hidden' }}>
               <div style={{ width: '20%', height: '100%', background: 'var(--accent)' }} />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
