import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, Palette, Type, ArrowRight, ArrowLeft, ShieldCheck, X, CheckCircle2 } from 'lucide-react';
import './AuthLayout.css';

const BrandSetup: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    primaryColor: '#6366f1',
    secondaryColor: '#9333ea',
    customName: ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/system-mode');
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
            <span className="step-pill active">Branding</span>
            <span className="step-pill">Deployment</span>
          </div>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            style={{ marginTop: '32px' }}
          >
            Personalize your <br /> <span className="text-gradient">Experience.</span>
          </motion.h2>
          <p>Your brand will be visible to every staff member and visitor using the system.</p>
        </div>

        <div className="visual-stats">
          <div className="v-stat">
            <h4>Step 2 of 3</h4>
            <span>Identity Design</span>
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
              <h2>Brand Identity</h2>
              <p>Customize colors and upload your organization logo.</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {/* Logo Upload */}
              <div className="input-group-premium">
                <label>Organization Logo</label>
                <div 
                  className={`logo-upload-box-premium ${logo ? 'has-logo' : ''}`}
                  onClick={() => !logo && fileInputRef.current?.click()}
                >
                  {logo ? (
                    <div className="logo-preview-box">
                      <img src={logo} alt="Preview" />
                      <button type="button" className="remove-logo-premium" onClick={(e) => { e.stopPropagation(); setLogo(null); }}>
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="upload-cta-premium">
                      <Upload className="icon-sm" />
                      <span>Upload PNG/JPG</span>
                    </div>
                  )}
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" hidden />
                </div>
              </div>

              {/* Color Selection */}
              <div className="color-grid-premium">
                <div className="input-group-premium">
                  <label>Primary</label>
                  <div className="color-picker-wrapper-premium">
                    <input 
                      type="color" 
                      name="primaryColor" 
                      value={formData.primaryColor}
                      onChange={(e) => setFormData({...formData, primaryColor: e.target.value})}
                    />
                    <span className="hex-val">{formData.primaryColor}</span>
                  </div>
                </div>
                <div className="input-group-premium">
                  <label>Secondary</label>
                  <div className="color-picker-wrapper-premium">
                    <input 
                      type="color" 
                      name="secondaryColor" 
                      value={formData.secondaryColor}
                      onChange={(e) => setFormData({...formData, secondaryColor: e.target.value})}
                    />
                    <span className="hex-val">{formData.secondaryColor}</span>
                  </div>
                </div>
              </div>

              <div className="input-group-premium">
                <label>System Display Name</label>
                <div className="input-field-wrapper">
                  <Type className="input-icon" />
                  <input 
                    type="text" 
                    name="customName" 
                    placeholder="e.g. Grand Plaza Security" 
                    value={formData.customName}
                    onChange={(e) => setFormData({...formData, customName: e.target.value})}
                  />
                </div>
              </div>

              <button type="submit" className="btn-auth-submit">
                Continue to Deployment
                <ArrowRight size={18} />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BrandSetup;
