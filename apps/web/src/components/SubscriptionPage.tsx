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
  Sparkles,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { useMySubscription, useInitializeCheckout, useCancelSubscription } from '../hooks/dashboard/useSubscription';
import { usePlans } from '../hooks/usePlans';
import { useAddons } from '../hooks/super-admin/useAddons';
import { usePaymentMethods } from '../hooks/dashboard/useBilling';
import { usePaystackPayment } from '../hooks/usePaystackPayment';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const SubscriptionPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const { data: subscription, isLoading: isLoadingSub } = useMySubscription();
  const { data: plans, isLoading: isLoadingPlans } = usePlans();
  const { addons, isLoading: isLoadingAddons, purchaseAddon } = useAddons();
  const { data: paymentMethods = [] } = usePaymentMethods();
  
  const initializeCheckout = useInitializeCheckout();
  const cancelSubscription = useCancelSubscription();
  const launchPaystack = usePaystackPayment();

  const hasSavedCard = paymentMethods.length > 0;

  const handleSelectPlan = async (plan: any) => {
    setIsProcessing(plan.id);
    try {
      const { accessCode } = await initializeCheckout.mutateAsync({
        planId: plan.id,
        billingCycle,
      });

      launchPaystack({
        accessCode,
        onSuccess: () => {
          setIsProcessing(null);
        },
        onCancel: () => {
          setIsProcessing(null);
        },
      });
    } catch (err) {
      console.error('Checkout failed', err);
      setIsProcessing(null);
    }
  };

  const handlePurchaseAddon = async (addon: any) => {
    if (!hasSavedCard) {
      // If no card is saved, we should probably redirect to a checkout that adds a card
      // or tell them to subscribe to a plan first.
      alert('Please add a payment method in the Billing tab first.');
      return;
    }

    if (!window.confirm(`Purchase ${addon.name} for ₦${addon.monthlyPrice.toLocaleString()}/mo?`)) return;

    setIsProcessing(addon.id);
    purchaseAddon({ addonId: addon.id, quantity: 1 }, {
      onSuccess: () => {
        setIsProcessing(null);
        alert('Add-on purchased successfully!');
      },
      onError: (err) => {
        console.error('Add-on purchase failed', err);
        setIsProcessing(null);
        alert('Failed to purchase add-on. Please try again.');
      }
    });
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription? You will lose access at the end of the current period.')) return;
    
    setIsProcessing('cancel');
    try {
      await cancelSubscription.mutateAsync();
      setIsProcessing(null);
    } catch (err) {
      console.error('Cancellation failed', err);
      setIsProcessing(null);
    }
  };

  const getPlanPrice = (plan: any) => {
    if (plan.isFree) return 'Free';
    if (billingCycle === 'yearly') return `₦${plan.yearlyPrice.toLocaleString()}`;
    if (billingCycle === 'quarterly') return `₦${plan.quarterlyPrice.toLocaleString()}`;
    return `₦${plan.monthlyPrice.toLocaleString()}`;
  };

  const getPlanIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('starter')) return <Zap size={24} />;
    if (n.includes('business')) return <Rocket size={24} />;
    return <Crown size={24} />;
  };

  if (isLoadingSub || isLoadingPlans) {
    return (
      <div className="flex-center" style={{ height: '400px' }}>
        <Loader2 className="spin" size={48} />
      </div>
    );
  }

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
                className={`theme-btn ${billingCycle === 'quarterly' ? 'active' : ''}`}
                onClick={() => setBillingCycle('quarterly')}
                style={{ width: '80px', fontSize: '12px', fontWeight: 700 }}
              >Quarterly</button>
              <button 
                className={`theme-btn ${billingCycle === 'yearly' ? 'active' : ''}`}
                onClick={() => setBillingCycle('yearly')}
                style={{ width: '80px', fontSize: '12px', fontWeight: 700 }}
              >Yearly</button>
            </div>
          </div>

          <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', marginTop: '16px' }}>
            {plans?.map((plan) => {
              const isCurrent = subscription?.planId === plan.id;
              return (
                <div key={plan.id} className={`plan-onboarding-card ${isCurrent ? 'active' : ''}`} style={{ width: '100%', padding: '24px' }}>
                  {plan.name.toLowerCase() === 'business' && <div className="popular-ribbon">POPULAR</div>}
                  <div className="plan-o-icon">{getPlanIcon(plan.name)}</div>
                  <h3 style={{ margin: '8px 0', fontSize: '20px' }}>{plan.name}</h3>
                  <div className="plan-o-price" style={{ fontSize: '24px', color: 'var(--text-primary)', marginBottom: '4px' }}>{getPlanPrice(plan)}</div>
                  <p style={{ fontSize: '13px', color: 'var(--text-dim)', marginBottom: '20px' }}>{plan.description || 'Flexible security plan.'}</p>
                  <ul className="plan-o-features" style={{ textAlign: 'left', marginBottom: '24px' }}>
                    <li style={{ justifyContent: 'flex-start', fontSize: '13px' }}><Check size={14} className="text-emerald" style={{ marginRight: '8px' }} /> {plan.branchLimit} Branch{plan.branchLimit !== 1 ? 'es' : ''}</li>
                    <li style={{ justifyContent: 'flex-start', fontSize: '13px' }}><Check size={14} className="text-emerald" style={{ marginRight: '8px' }} /> {plan.staffLimit} Staff</li>
                    <li style={{ justifyContent: 'flex-start', fontSize: '13px' }}><Check size={14} className="text-emerald" style={{ marginRight: '8px' }} /> {plan.deviceLimit} Devices</li>
                  </ul>
                  <button 
                    className={`btn-auth-submit ${isCurrent ? 'disabled' : ''}`} 
                    style={{ width: '100%', padding: '12px' }}
                    disabled={isCurrent || !!isProcessing}
                    onClick={() => handleSelectPlan(plan)}
                  >
                    {isProcessing === plan.id ? <Loader2 size={18} className="spin" /> : isCurrent ? 'Current Plan' : 'Select Plan'}
                  </button>
                </div>
              );
            })}
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
            {isLoadingAddons ? (
              <Loader2 className="spin" />
            ) : addons.map((addon) => (
              <div key={addon.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--bg-input)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div className="stat-icon-wrapper mini blue" style={{ width: '36px', height: '36px' }}>
                    {addon.branchLimitInc > 0 ? <Building2 size={18} /> : addon.staffLimitInc > 0 ? <Users size={18} /> : <Smartphone size={18} />}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 700 }}>{addon.name}</h4>
                    <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{addon.description}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <strong style={{ fontSize: '14px' }}>₦{addon.monthlyPrice.toLocaleString()}/mo</strong>
                  <button 
                    className="copy-code-btn" 
                    style={{ background: 'var(--sa-primary)', color: 'white', border: 'none' }}
                    onClick={() => handlePurchaseAddon(addon)}
                    disabled={!!isProcessing}
                  >
                    {isProcessing === addon.id ? <Loader2 size={14} className="spin" /> : <Plus size={14} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
          {!hasSavedCard && (
            <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.1)', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <AlertTriangle size={16} style={{ color: 'var(--danger)' }} />
              <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Add a payment method to purchase add-ons.</p>
            </div>
          )}
        </div>

        {/* Current Usage / Status */}
        <div className="content-card">
          <div className="card-header">
            <h3>Subscription Status</h3>
          </div>
          
          <div className="v-stat" style={{ background: 'var(--bg-input)', padding: '20px', borderRadius: '16px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <ShieldCheck className="text-gradient" size={24} />
              <strong style={{ fontSize: '18px' }}>{subscription?.planName || 'No Active Plan'}</strong>
            </div>
            <span className={`status-badge ${subscription?.status === 'active' ? 'synced' : subscription?.status === 'trialing' ? 'pending' : 'danger'}`} style={{ marginBottom: '12px', display: 'inline-block' }}>
              {(subscription?.status || 'inactive').toUpperCase()}
            </span>
            {subscription?.nextBillingDate && (
              <p style={{ fontSize: '13px', color: 'var(--text-dim)' }}>
                {subscription.status === 'canceled' ? 'Expires on' : 'Next billing on'} <strong>{new Date(subscription.nextBillingDate).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: '2-digit' })}</strong>.
              </p>
            )}
            <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
              <button 
                className="btn-auth-outline" 
                style={{ borderStyle: 'solid', fontSize: '13px', flex: 1 }}
                onClick={() => navigate('/dashboard/billing')}
              >Manage Billing</button>
              {subscription?.status !== 'inactive' && subscription?.status !== 'canceled' && (
                <button 
                  className="btn-auth-outline" 
                  style={{ borderStyle: 'solid', fontSize: '13px', flex: 1, color: 'var(--danger)' }}
                  onClick={handleCancel}
                  disabled={isProcessing === 'cancel'}
                >
                  {isProcessing === 'cancel' ? <Loader2 size={16} className="spin" /> : 'Cancel'}
                </button>
              )}
            </div>
          </div>
          
          <div style={{ padding: '16px', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
             <h4 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
               <ArrowUpRight size={14} /> Platform Add-ons
             </h4>
             <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
               Your subscription includes merged capabilities from your plan and all purchased add-ons.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
