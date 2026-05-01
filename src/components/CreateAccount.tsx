import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import './AuthLayout.css';

const CreateAccount: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/verify-account');
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
            Security is a <br /> <span className="text-gradient">Data Game.</span>
          </motion.h2>
          <p>Join the elite organizations worldwide who have traded paper logs for automated vehicle intelligence.</p>
          
          <div className="feature-list-minimal" style={{ marginTop: '40px' }}>
            <div className="f-item-min"><CheckCircle2 className="icon-xs" style={{ color: 'var(--accent)' }} /> <span>14-Day Free Trial</span></div>
            <div className="f-item-min"><CheckCircle2 className="icon-xs" style={{ color: 'var(--accent)' }} /> <span>Unlimited Devices</span></div>
            <div className="f-item-min"><CheckCircle2 className="icon-xs" style={{ color: 'var(--accent)' }} /> <span>Cancel Anytime</span></div>
          </div>
        </div>

        <div className="visual-stats">
          <div className="v-stat">
            <h4>500+</h4>
            <span>Global Partners</span>
          </div>
          <div className="v-stat">
            <h4>24/7</h4>
            <span>Priority Support</span>
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
            <button className="back-btn-minimal" onClick={() => navigate('/')}>
              <ArrowLeft size={18} /> Back to home
            </button>

            <div className="auth-header">
              <h2>Create Account</h2>
              <p>Sign up to start your 14-day free trial.</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="input-group-premium">
                <label>Full Name</label>
                <div className="input-field-wrapper">
                  <User className="input-icon" />
                  <input 
                    type="text" 
                    name="fullName" 
                    placeholder="John Doe" 
                    required 
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="input-group-premium">
                <label>Email Address</label>
                <div className="input-field-wrapper">
                  <Mail className="input-icon" />
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="name@company.com" 
                    required 
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="input-group-premium">
                <label>Password</label>
                <div className="input-field-wrapper">
                  <Lock className="input-icon" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password" 
                    placeholder="Min. 8 characters" 
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button 
                    type="button" 
                    className="eye-btn" 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-auth-submit">
                Create Account
                <ArrowRight size={18} />
              </button>
            </form>

            <div className="auth-footer">
              <p>Already have an account? <button onClick={() => navigate('/login')} className="link-btn">Log in</button></p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
