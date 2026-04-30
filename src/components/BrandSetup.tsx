import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, Palette, Type, ArrowRight, ArrowLeft, ShieldCheck, X } from 'lucide-react';
import './BrandSetup.css';

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
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogo(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, save brand settings here
    navigate('/system-mode');
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
          className="auth-card"
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
            <h2>Brand Identity Setup</h2>
            <p>Customize the system to reflect your organization's brand.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Logo Upload */}
            <div className="form-group">
              <label>Organization Logo</label>
              <div 
                className={`logo-upload-area ${logo ? 'has-logo' : ''}`}
                onClick={() => !logo && fileInputRef.current?.click()}
              >
                {logo ? (
                  <div className="logo-preview-container">
                    <img src={logo} alt="Logo Preview" className="logo-preview" />
                    <button type="button" className="remove-logo-btn" onClick={(e) => { e.stopPropagation(); handleRemoveLogo(); }}>
                      <X className="icon-xs" />
                    </button>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <Upload className="upload-icon" />
                    <span>Click to upload logo</span>
                    <p>PNG, JPG up to 2MB</p>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  hidden
                />
              </div>
            </div>

            {/* Colors */}
            <div className="colors-row">
              <div className="form-group flex-1">
                <label htmlFor="primaryColor">Primary Color</label>
                <div className="input-wrapper">
                  <Palette className="input-icon" />
                  <input 
                    type="color" 
                    id="primaryColor" 
                    name="primaryColor" 
                    className="color-input"
                    value={formData.primaryColor}
                    onChange={handleChange}
                  />
                  <span className="color-hex">{formData.primaryColor}</span>
                </div>
              </div>
              <div className="form-group flex-1">
                <label htmlFor="secondaryColor">Secondary Color</label>
                <div className="input-wrapper">
                  <Palette className="input-icon" />
                  <input 
                    type="color" 
                    id="secondaryColor" 
                    name="secondaryColor" 
                    className="color-input"
                    value={formData.secondaryColor}
                    onChange={handleChange}
                  />
                  <span className="color-hex">{formData.secondaryColor}</span>
                </div>
              </div>
            </div>

            {/* Custom Name */}
            <div className="form-group">
              <label htmlFor="customName">Custom System Name (Optional)</label>
              <div className="input-wrapper">
                <Type className="input-icon" />
                <input 
                  type="text" 
                  id="customName" 
                  name="customName" 
                  placeholder="e.g. Grand Plaza Security" 
                  value={formData.customName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button type="submit" className="btn-submit">
              Continue
              <ArrowRight className="icon-sm" />
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default BrandSetup;
