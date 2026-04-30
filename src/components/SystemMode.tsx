import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bed, Home, Shield, ArrowRight, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import './SystemMode.css';

type ModeType = 'Hotel' | 'Estate' | 'Security';

const SystemMode: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<ModeType>('Hotel');

  const modes = [
    {
      id: 'Hotel',
      title: 'Hotel Mode',
      description: 'Optimized for guest check-ins, valet parking, and short-term visitor logging.',
      icon: <Bed className="mode-icon" />
    },
    {
      id: 'Estate',
      title: 'Estate Mode',
      description: 'Built for residential gates, resident vehicle lists, and domestic staff access.',
      icon: <Home className="mode-icon" />
    },
    {
      id: 'Security',
      title: 'Security Mode',
      description: 'High-volume logging for warehouses, corporate hubs, and security check-points.',
      icon: <Shield className="mode-icon" />
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, save selected mode here
    navigate('/add-staff');
  };

  return (
    <div className="auth-page">
      <div className="bg-glow top-left-glow" />
      <div className="bg-glow bottom-right-glow" />

      <div className="auth-container">
        <div className="auth-brand" onClick={() => navigate('/')}>
          <div className="auth-logo">
            <ShieldCheck className="icon-white" />
          </div>
          <span className="auth-title">VGuard</span>
        </div>

        <motion.div 
          className="auth-card mode-card-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button 
            type="button" 
            className="back-btn" 
            onClick={() => navigate(-1)}
            title="Go Back"
          >
            <ArrowLeft className="icon-sm" />
          </button>

          <div className="auth-header">
            <h2>Choose System Mode</h2>
            <p>Select the mode that best fits your operational workflow.</p>
          </div>

          <div className="modes-grid">
            {modes.map((mode) => (
              <div 
                key={mode.id}
                className={`mode-selection-card ${selectedMode === mode.id ? 'active' : ''}`}
                onClick={() => setSelectedMode(mode.id as ModeType)}
              >
                <div className="mode-selection-header">
                  <div className={`mode-icon-wrapper ${mode.id.toLowerCase()}`}>
                    {mode.icon}
                  </div>
                  {selectedMode === mode.id && (
                    <CheckCircle2 className="selected-indicator" />
                  )}
                </div>
                <h3>{mode.title}</h3>
                <p>{mode.description}</p>
              </div>
            ))}
          </div>

          <button onClick={handleSubmit} className="btn-submit mt-24">
            Continue
            <ArrowRight className="icon-sm" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default SystemMode;
