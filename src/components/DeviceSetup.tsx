import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Smartphone, Download, Key, Copy, Check, ArrowRight, ArrowLeft, ShieldCheck, ExternalLink } from 'lucide-react';
import './DeviceSetup.css';

const DeviceSetup: React.FC = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const orgCode = 'VGRD-8821-X';

  const handleCopy = () => {
    navigator.clipboard.writeText(orgCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFinish = () => {
    navigate('/dashboard');
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
          className="auth-card setup-card-container"
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
            <h2>Device Setup</h2>
            <p>Link your security devices to the organization.</p>
          </div>

          <div className="code-section">
            <label>Your Organization Code</label>
            <div className="org-code-box">
              <span className="org-code">{orgCode}</span>
              <button 
                className={`copy-btn ${copied ? 'copied' : ''}`}
                onClick={handleCopy}
                title="Copy code"
              >
                {copied ? <Check className="icon-xs" /> : <Copy className="icon-xs" />}
              </button>
            </div>
            <p className="code-hint">Share this code with your security team to link their mobile apps.</p>
          </div>

          <div className="setup-steps">
            <div className="setup-step">
              <div className="step-number">1</div>
              <div className="step-icon-wrapper">
                <Smartphone className="step-icon" />
              </div>
              <div className="step-content">
                <h4>Install Mobile App</h4>
                <p>Open this site on your security device and tap 'Add to Home Screen'.</p>
              </div>
            </div>

            <div className="setup-step">
              <div className="step-number">2</div>
              <div className="step-icon-wrapper">
                <Download className="step-icon" />
              </div>
              <div className="step-content">
                <h4>Open VGuard App</h4>
                <p>Launch the app from the home screen on your tablet or smartphone.</p>
              </div>
            </div>

            <div className="setup-step">
              <div className="step-number">3</div>
              <div className="step-icon-wrapper">
                <Key className="step-icon" />
              </div>
              <div className="step-content">
                <h4>Link Organization</h4>
                <p>Enter your unique code <strong>{orgCode}</strong> to start logging vehicles.</p>
              </div>
            </div>
          </div>

          <div className="setup-actions">
            <button onClick={handleFinish} className="btn-submit w-full">
              Finish Setup & Go to Dashboard
              <ArrowRight className="icon-sm" />
            </button>
            <button className="btn-text mt-12 w-full" onClick={() => window.open('/app', '_blank')}>
              Open Mobile App Preview
              <ExternalLink className="icon-xs" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DeviceSetup;
