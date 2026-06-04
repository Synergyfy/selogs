import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, Plus, Minus, Loader2 } from 'lucide-react';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';
import type { ThemeMode } from '../types';
import { usePlans } from '../hooks/usePlans';
import { useInitializeCheckout, useStartTrial } from '../hooks/dashboard/useSubscription';
import { usePaystackPayment } from '../hooks/usePaystackPayment';
import { useAuth } from '../hooks/useAuth';
import './PricingPage.css';

interface PricingPageProps {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="pricing-faq-item">
      <button className="faq-question" onClick={() => setIsOpen(!isOpen)}>
        <span>{question}</span>
        {isOpen ? <Minus className="icon-xs" /> : <Plus className="icon-xs" />}
      </button>
      {isOpen && <div className="faq-answer"><p>{answer}</p></div>}
    </div>
  );
};

const PricingPage: React.FC<PricingPageProps> = ({ themeMode, setThemeMode }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: plans, isLoading } = usePlans();
  const initializeCheckout = useInitializeCheckout();
  const startTrial = useStartTrial();
  const launchPaystack = usePaystackPayment();

  const handleSelectPlan = async (plan: any) => {
    if (!user) {
      navigate('/create-account');
      return;
    }

    if (plan.isFree) {
      // Logic for selecting free plan if any
      return;
    }

    setIsProcessing(plan.id);
    try {
      const { accessCode } = await initializeCheckout.mutateAsync({
        planId: plan.id,
        billingCycle,
      });

      launchPaystack({
        accessCode,
        onSuccess: () => {
          navigate('/dashboard');
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

  const handleStartTrial = async (plan: any) => {
    if (!user) {
      navigate('/create-account');
      return;
    }

    setIsProcessing(`trial-${plan.id}`);
    try {
      await startTrial.mutateAsync(plan.id);
      navigate('/dashboard');
    } catch (err) {
      console.error('Trial start failed', err);
      setIsProcessing(null);
    }
  };

  const getPrice = (plan: any) => {
    if (plan.isFree) return 'Free';
    if (billingCycle === 'yearly') return plan.yearlyPrice;
    if (billingCycle === 'quarterly') return plan.quarterlyPrice;
    return plan.monthlyPrice;
  };

  const getBilledText = (plan: any) => {
    if (plan.isFree) return null;
    const price = getPrice(plan);
    if (billingCycle === 'yearly') {
      return `Billed ₦${(price * 12).toLocaleString()} yearly`;
    }
    if (billingCycle === 'quarterly') {
      return `Billed ₦${(price * 3).toLocaleString()} quarterly`;
    }
    return null;
  };

  return (
    <div className="pricing-page">
      <div className="bg-glow top-glow" />
      <div className="bg-glow bottom-glow" />

      <PublicHeader themeMode={themeMode} setThemeMode={setThemeMode} />

      <section className="pricing-hero">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hero-content centered"
          >
            <h1 className="hero-title">Transparent, <span className="text-gradient">Scalable Pricing</span></h1>
            <p className="hero-subtitle">Choose the perfect plan for your organization's security needs. Most plans include a free trial.</p>
            
            {/* Billing Toggle (3-way) */}
            <div className="billing-cycle-selector">
              <button 
                className={`cycle-btn ${billingCycle === 'monthly' ? 'active' : ''}`}
                onClick={() => setBillingCycle('monthly')}
              >
                Monthly
              </button>
              <button 
                className={`cycle-btn ${billingCycle === 'quarterly' ? 'active' : ''}`}
                onClick={() => setBillingCycle('quarterly')}
              >
                Quarterly
              </button>
              <button 
                className={`cycle-btn ${billingCycle === 'yearly' ? 'active' : ''}`}
                onClick={() => setBillingCycle('yearly')}
              >
                Yearly
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="pricing-plans">
        <div className="container">
          {isLoading ? (
            <div className="flex-center" style={{ padding: '64px' }}>
              <Loader2 className="spin" size={48} />
            </div>
          ) : (
            <div className="pricing-grid">
              {plans?.map((plan: any) => (
                <div key={plan.id} className={`pricing-card ${plan.name.toLowerCase() === 'business' ? 'featured' : ''}`}>
                  {plan.name.toLowerCase() === 'business' && <div className="popular-tag">MOST POPULAR</div>}
                  <div className="card-header">
                    <h3>{plan.name}</h3>
                    <p>{plan.description || `Perfect for your ${plan.name.toLowerCase()} needs.`}</p>
                    <div className="price">
                      {typeof getPrice(plan) === 'number' ? `₦${getPrice(plan).toLocaleString()}` : getPrice(plan)}
                      {typeof getPrice(plan) === 'number' && <span>/mo</span>}
                    </div>
                    {getBilledText(plan) && <p className="billed-yearly">{getBilledText(plan)}</p>}
                  </div>
                  <ul className="plan-features">
                    <li><Check className="icon-xs" /> {plan.branchLimit} Location{plan.branchLimit !== 1 ? 's' : ''}</li>
                    <li><Check className="icon-xs" /> Up to {plan.staffLimit} Staff Members</li>
                    <li><Check className="icon-xs" /> Up to {plan.deviceLimit} Devices</li>
                    {plan.hasOcr && <li><Check className="icon-xs" /> OCR Plate Recognition</li>}
                    {plan.hasAnalytics && <li><Check className="icon-xs" /> Advanced Analytics</li>}
                    {plan.hasExport && <li><Check className="icon-xs" /> Data Export (CSV/PDF)</li>}
                  </ul>
                  
                  <div className="flex-col gap-12" style={{ marginTop: 'auto' }}>
                    {plan.trialEnabled && (
                      <button 
                        className="btn-outline" 
                        onClick={() => handleStartTrial(plan)}
                        disabled={!!isProcessing}
                      >
                        {isProcessing === `trial-${plan.id}` ? <Loader2 size={18} className="spin" /> : `Start ${plan.trialDays}-Day Free Trial`}
                      </button>
                    )}
                    <button 
                      className={plan.name.toLowerCase() === 'business' ? 'btn-premium' : 'btn-outline'} 
                      onClick={() => handleSelectPlan(plan)}
                      disabled={!!isProcessing}
                    >
                      {isProcessing === plan.id ? <Loader2 size={18} className="spin" /> : plan.isFree ? 'Get Started' : 'Subscribe Now'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Add-on Pricing */}
      <section className="addons-section">
        <div className="container">
          <div className="section-header centered">
            <h2>Add-on <span className="text-gradient">Extras</span></h2>
            <p>Need more? Customize your plan with these add-ons.</p>
          </div>
          <div className="addons-grid">
            <div className="addon-item">
              <div className="addon-info">
                <h4>Extra Branch</h4>
                <p>Add an additional location to your plan.</p>
              </div>
              <div className="addon-price">₦2,000<span>/mo</span></div>
            </div>
            <div className="addon-item">
              <div className="addon-info">
                <h4>Extra Staff Slot</h4>
                <p>Increase your staff limit by 5 members.</p>
              </div>
              <div className="addon-price">₦1,000<span>/mo</span></div>
            </div>
            <div className="addon-item">
              <div className="addon-info">
                <h4>Extra Device</h4>
                <p>Connect an additional capturing device.</p>
              </div>
              <div className="addon-price">₦500<span>/mo</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing FAQ */}
      <section className="pricing-faq">
        <div className="container">
          <div className="section-header centered">
            <h2>Pricing FAQ</h2>
          </div>
          <div className="faq-list-small">
            <FAQItem 
              question="Can I change plans later?" 
              answer="Yes, you can upgrade or downgrade your plan at any time from your dashboard. If you upgrade, the new rate will be prorated." 
            />
            <FAQItem 
              question="What happens after my trial?" 
              answer="After 14 days, you'll be asked to choose a subscription plan to continue using VGuard. Your data will be preserved." 
            />
            <FAQItem 
              question="Do you offer discounts for non-profits?" 
              answer="Yes, we offer special pricing for charitable organizations and NGOs. Please contact our sales team for more information." 
            />
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-card pricing-cta">
            <h2>Still have questions?</h2>
            <p>Our team is here to help you find the right plan for your business.</p>
            <button className="btn-premium" onClick={() => navigate('/contact')}>Contact Our Team</button>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default PricingPage;
