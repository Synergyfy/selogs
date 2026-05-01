import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, ArrowLeft, Check, Zap, Rocket, Crown } from 'lucide-react';
import './AuthLayout.css';

const PlanSelection: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('Business');

  const plans = [
    {
      id: 'Starter',
      name: 'Starter',
      price: 'Free',
      desc: 'Ideal for small estates or small hotels.',
      icon: <Zap size={24} />,
      features: ['Up to 2 Locations', 'Basic Analytics', 'Standard Support']
    },
    {
      id: 'Business',
      name: 'Business',
      price: '₦15,000/mo',
      desc: 'Best for growing security operations.',
      icon: <Rocket size={24} />,
      features: ['Up to 5 Locations', 'Advanced Reports', 'Priority Support'],
      popular: true
    },
    {
      id: 'Enterprise',
      name: 'Enterprise',
      price: 'Custom',
      desc: 'Full power for large corporations.',
      icon: <Crown size={24} />,
      features: ['Unlimited Locations', 'Custom Features', '24/7 Phone Support']
    }
  ];

  return (
    <div className="auth-page">
      <div className="auth-glow auth-glow-1" />
      <div className="auth-glow auth-glow-2" />

      {/* Visual Side */}
      <div className="auth-visual-side">
        <div className="auth-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <ShieldCheck className="icon-md" style={{ color: 'var(--accent)' }} />
          <span style={{ fontSize: '24px', fontWeight: 800, color: 'white', marginLeft: '12px' }}>VGuard</span>
        </div>

        <div className="visual-content">
          <div className="step-indicator-minimal">
            <span className="step-pill">Organization</span>
            <span className="step-pill active">Subscription</span>
            <span className="step-pill">Deployment</span>
          </div>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            style={{ marginTop: '32px' }}
          >
            Invest in <br /> <span className="text-gradient">Peace of Mind.</span>
          </motion.h2>
          <p>Choose the plan that best scales with your security requirements. You can upgrade anytime.</p>
        </div>

        <div className="visual-stats">
          <div className="v-stat">
            <h4>No Card</h4>
            <span>Required for Trial</span>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="auth-form-side">
        <div className="auth-container-premium max-w-2xl">
          <motion.div 
            className="auth-card-premium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button className="back-btn-minimal" onClick={() => navigate(-1)}>
              <ArrowLeft size={18} /> Previous Step
            </button>

            <div className="auth-header">
              <h2>Select your Plan</h2>
              <p>Start your 14-day free trial on any plan today.</p>
            </div>

            <div className="plan-onboarding-grid">
              {plans.map((plan) => (
                <div 
                  key={plan.id}
                  className={`plan-onboarding-card ${selectedPlan === plan.id ? 'active' : ''}`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.popular && <div className="popular-ribbon">POPULAR</div>}
                  <div className="plan-o-icon">{plan.icon}</div>
                  <h3>{plan.name}</h3>
                  <div className="plan-o-price">{plan.price}</div>
                  <ul className="plan-o-features">
                    {plan.features.map((f, i) => (
                      <li key={i}><Check size={12} /> {f}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <button onClick={() => navigate('/brand-setup')} className="btn-auth-submit" style={{ marginTop: '32px' }}>
              Confirm & Continue
              <ArrowRight size={18} />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PlanSelection;
