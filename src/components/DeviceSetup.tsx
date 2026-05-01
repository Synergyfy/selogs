import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Copy, Check, ArrowRight, ArrowLeft, ShieldCheck, ExternalLink, QrCode } from 'lucide-react';
import './AuthLayout.css';

const DeviceSetup: React.FC = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const orgCode = 'VGRD-8821-X';

  const handleCopy = () => {
    navigator.clipboard.writeText(orgCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            Deploy your <br /> <span className="text-gradient">Gate Terminals.</span>
          </motion.h2>
          <p>Link any mobile device or tablet to your organization using your unique secure code.</p>
          
          <div className="qr-preview-box-premium" style={{ marginTop: '40px' }}>
            <QrCode size={120} style={{ opacity: 0.8 }} />
            <span>Scan to Install PWA</span>
          </div>
        </div>

        <div className="visual-stats">
          <div className="v-stat">
            <h4>PWA</h4>
            <span>Cross-Platform Ready</span>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="auth-form-side">
        <div className="auth-container-premium">
          <motion.div 
            className="auth-card-premium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button className="back-btn-minimal" onClick={() => navigate(-1)}>
              <ArrowLeft size={18} /> Previous Step
            </button>

            <div className="auth-header">
              <h2>Device Connectivity</h2>
              <p>Connect your devices to start capturing vehicles.</p>
            </div>

            <div className="org-code-card-premium">
              <label>Unique Organization Code</label>
              <div className="code-display-premium">
                <strong>{orgCode}</strong>
                <button onClick={handleCopy} className={`copy-btn-premium ${copied ? 'success' : ''}`}>
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            <div className="setup-instruction-stack">
              <div className="instr-item">
                <div className="instr-num">1</div>
                <div className="instr-text">
                  <strong>Open VGuard on Mobile</strong>
                  <span>Visit this URL on your tablet or smartphone device.</span>
                </div>
              </div>
              <div className="instr-item">
                <div className="instr-num">2</div>
                <div className="instr-text">
                  <strong>Add to Home Screen</strong>
                  <span>Install the PWA for offline-first capabilities.</span>
                </div>
              </div>
              <div className="instr-item">
                <div className="instr-num">3</div>
                <div className="instr-text">
                  <strong>Enter Code</strong>
                  <span>Use the code above to link the device to your team.</span>
                </div>
              </div>
            </div>

            <div className="setup-actions-premium">
              <button onClick={() => navigate('/dashboard')} className="btn-auth-submit">
                Launch Admin Dashboard
                <ArrowRight size={18} />
              </button>
              <button onClick={() => window.open('/app', '_blank')} className="btn-auth-link">
                <ExternalLink size={14} />
                Preview Mobile App
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DeviceSetup;
