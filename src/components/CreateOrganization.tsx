import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building, Briefcase, MapPin, ArrowRight, ArrowLeft, ShieldCheck, ChevronDown } from 'lucide-react';
import './CreateOrganization.css';

const CreateOrganization: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    type: 'Hotel',
    location: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, save organization data here
    navigate('/brand-setup');
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
            <h2>Set up your organization</h2>
            <p>Tell us about your business to customize your experience.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Organization Name</label>
              <div className="input-wrapper">
                <Building className="input-icon" />
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  placeholder="e.g. Grand Plaza Hotel" 
                  required 
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="type">Organization Type</label>
              <div className="input-wrapper">
                <Briefcase className="input-icon" />
                <select 
                  id="type" 
                  name="type" 
                  className="custom-select"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="Hotel">Hotel</option>
                  <option value="Estate">Residential Estate</option>
                  <option value="Office">Corporate Office</option>
                  <option value="Security">Security Company</option>
                  <option value="Other">Other</option>
                </select>
                <ChevronDown className="select-arrow" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <div className="input-wrapper">
                <MapPin className="input-icon" />
                <input 
                  type="text" 
                  id="location" 
                  name="location" 
                  placeholder="City, Country" 
                  required 
                  value={formData.location}
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

export default CreateOrganization;
