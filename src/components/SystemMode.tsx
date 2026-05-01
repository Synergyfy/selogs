import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bed, Home, Shield, ArrowRight, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import './AuthLayout.css';

type ModeType = 'Hotel' | 'Estate' | 'Security';

const SystemMode: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<ModeType>('Hotel');

  const modes = [
    {
      id: 'Hotel',
      title: 'Hotel Mode',
      description: 'Optimized for guest check-ins, valet parking, and short-term visitors.',
      icon: <Bed className="mode-icon-premium" />
    },
    {
      id: 'Estate',
      title: 'Estate Mode',
      description: 'Built for residential gates, resident lists, and domestic staff access.',
      icon: <Home className="mode-icon-premium" />
    },
    {
      id: 'Security',
      title: 'Security Mode',
      description: 'High-volume logging for warehouses and corporate check-points.',
      icon: <Shield className="mode-icon-premium" />
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/add-staff');
  };

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
            <span className="step-pill">Branding</span>
            <span className="step-pill active">Deployment</span>
          </div>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            style={{ marginTop: '32px' }}
          >
            Final Step: <br /> <span className="text-gradient">Operational Mode.</span>
          </motion.h2>
          <p>Choose the mode that best fits your environment. You can change this later in settings.</p>
        </div>

        <div className="visual-stats">
          <div className="v-stat">
            <h4>Step 3 of 3</h4>
            <span>Ready to Launch</span>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="auth-form-side">
        <div className="auth-container-premium max-w-xl">
          <motion.div 
            className="auth-card-premium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button className="back-btn-minimal" onClick={() => navigate(-1)}>
              <ArrowLeft size={18} /> Previous Step
            </button>

            <div className="auth-header">
              <h2>Select Deployment Mode</h2>
              <p>Tailor VGuard to your specific operational needs.</p>
            </div>

            <div className="modes-stack-premium">
              {modes.map((mode) => (
                <div 
                  key={mode.id}
                  className={`mode-item-premium ${selectedMode === mode.id ? 'active' : ''}`}
                  onClick={() => setSelectedMode(mode.id as ModeType)}
                >
                  <div className="mode-icon-box-premium">
                    {mode.icon}
                  </div>
                  <div className="mode-info-premium">
                    <h4>{mode.title}</h4>
                    <p>{mode.description}</p>
                  </div>
                  {selectedMode === mode.id && <CheckCircle2 className="mode-check-premium" />}
                </div>
              ))}
            </div>

            <button onClick={handleSubmit} className="btn-auth-submit" style={{ marginTop: '32px' }}>
              Complete Setup
              <ArrowRight size={18} />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SystemMode;
