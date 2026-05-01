import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building, Briefcase, MapPin, ArrowRight, ArrowLeft, ShieldCheck, ChevronDown, CheckCircle2 } from 'lucide-react';
import './AuthLayout.css';

const CreateOrganization: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    type: 'Hotel',
    location: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/plan-selection');
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
            <span className="step-pill active">Organization</span>
            <span className="step-pill">Branding</span>
            <span className="step-pill">Deployment</span>
          </div>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            style={{ marginTop: '32px' }}
          >
            One More Step <br />to your <span className="text-gradient">Dashboard.</span>
          </motion.h2>
          <p>We'll use these details to customize your capturing interface and report templates.</p>
        </div>

        <div className="visual-stats">
          <div className="v-stat">
            <h4>Step 1 of 3</h4>
            <span>Initial Setup</span>
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
            <div className="auth-header">
              <h2>Setup Organization</h2>
              <p>Tell us about your business to get started.</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="input-group-premium">
                <label>Organization Name</label>
                <div className="input-field-wrapper">
                  <Building className="input-icon" />
                  <input 
                    type="text" 
                    name="name" 
                    placeholder="e.g. Grand Plaza Hotel" 
                    required 
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="input-group-premium">
                <label>Industry Type</label>
                <div className="input-field-wrapper">
                  <Briefcase className="input-icon" />
                  <select 
                    name="type" 
                    className="custom-select-premium"
                    value={formData.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="Hotel">Hotel</option>
                    <option value="Estate">Residential Estate</option>
                    <option value="Office">Corporate Office</option>
                    <option value="Security">Security Company</option>
                    <option value="Other">Other Industry</option>
                  </select>
                  <ChevronDown className="select-arrow-premium" />
                </div>
              </div>

              <div className="input-group-premium">
                <label>Primary Location</label>
                <div className="input-field-wrapper">
                  <MapPin className="input-icon" />
                  <input 
                    type="text" 
                    name="location" 
                    placeholder="City, Country" 
                    required 
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button type="submit" className="btn-auth-submit">
                Continue to Branding
                <ArrowRight size={18} />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrganization;
