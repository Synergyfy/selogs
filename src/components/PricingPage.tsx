import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, Info, Plus, Minus } from 'lucide-react';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';
import type { ThemeMode } from '../types';
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
  const navigate = useNavigate();

  const calculatePrice = (monthlyPrice: number) => {
    if (billingCycle === 'yearly') {
      return Math.round((monthlyPrice * 12 * 0.8) / 12); // 20% discount
    }
    if (billingCycle === 'quarterly') {
      return Math.round((monthlyPrice * 3 * 0.9) / 3); // 10% discount
    }
    return monthlyPrice;
  };

  const getBilledText = (monthlyPrice: number) => {
    if (billingCycle === 'yearly') {
      return `Billed ₦${(calculatePrice(monthlyPrice) * 12).toLocaleString()} yearly`;
    }
    if (billingCycle === 'quarterly') {
      return `Billed ₦${(calculatePrice(monthlyPrice) * 3).toLocaleString()} quarterly`;
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
            <p className="hero-subtitle">Choose the perfect plan for your organization's security needs. All plans include a 14-day free trial.</p>
            
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
                Quarterly <span className="save-tag">-10%</span>
              </button>
              <button 
                className={`cycle-btn ${billingCycle === 'yearly' ? 'active' : ''}`}
                onClick={() => setBillingCycle('yearly')}
              >
                Yearly <span className="save-tag">-20%</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="pricing-plans">
        <div className="container">
          <div className="pricing-grid">
            {/* Starter Plan */}
            <div className="pricing-card">
              <div className="card-header">
                <h3>Starter</h3>
                <p>For small facilities or single gates.</p>
                <div className="price">
                  ₦{calculatePrice(5000).toLocaleString()}<span>/mo</span>
                </div>
                {getBilledText(5000) && <p className="billed-yearly">{getBilledText(5000)}</p>}
              </div>
              <ul className="plan-features">
                <li><Check className="icon-xs" /> 1 Location (Branch)</li>
                <li><Check className="icon-xs" /> Up to 5 Staff Members</li>
                <li><Check className="icon-xs" /> Basic Reporting</li>
                <li><Check className="icon-xs" /> OCR Plate Recognition</li>
                <li><Check className="icon-xs" /> Offline Mode</li>
              </ul>
              <button className="btn-outline" onClick={() => navigate('/create-account')}>Start 14-Day Free Trial</button>
            </div>

            {/* Business Plan */}
            <div className="pricing-card featured">
              <div className="popular-tag">MOST POPULAR</div>
              <div className="card-header">
                <h3>Business</h3>
                <p>For growing estates and hotel chains.</p>
                <div className="price">
                  ₦{calculatePrice(15000).toLocaleString()}<span>/mo</span>
                </div>
                {getBilledText(15000) && <p className="billed-yearly">{getBilledText(15000)}</p>}
              </div>
              <ul className="plan-features">
                <li><Check className="icon-xs" /> Up to 5 Locations</li>
                <li><Check className="icon-xs" /> Up to 20 Staff Members</li>
                <li><Check className="icon-xs" /> Advanced Analytics & Charts</li>
                <li><Check className="icon-xs" /> CSV & PDF Data Export</li>
                <li><Check className="icon-xs" /> Custom Branding (Logo/Colors)</li>
                <li><Check className="icon-xs" /> Priority Email Support</li>
              </ul>
              <button className="btn-premium" onClick={() => navigate('/create-account')}>Start 14-Day Free Trial</button>
            </div>

            {/* Enterprise Plan */}
            <div className="pricing-card">
              <div className="card-header">
                <h3>Enterprise</h3>
                <p>For large-scale security operations.</p>
                <div className="price">Custom</div>
                <p className="contact-subtext">Tailored to your needs</p>
              </div>
              <ul className="plan-features">
                <li><Check className="icon-xs" /> Unlimited Locations</li>
                <li><Check className="icon-xs" /> Unlimited Staff Members</li>
                <li><Check className="icon-xs" /> Full API Access</li>
                <li><Check className="icon-xs" /> Dedicated Account Manager</li>
                <li><Check className="icon-xs" /> Custom Feature Development</li>
                <li><Check className="icon-xs" /> 24/7 Phone Support</li>
              </ul>
              <button className="btn-outline" onClick={() => navigate('/contact')}>Contact Sales</button>
            </div>
          </div>
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
