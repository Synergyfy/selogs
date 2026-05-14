import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ShieldCheck, ArrowRight, Eye, EyeOff, ArrowLeft, Crown, Smartphone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AuthLayout.css';

import { useAuthActions } from '../hooks/useAuthActions';
import { Role } from '../services/auth.service';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, role } = useAuth();
  const { login, isLoggingIn, loginError } = useAuthActions();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Role-based redirection once authenticated
  if (isAuthenticated && role) {
    return <Navigate to={role === Role.super_admin ? '/super-admin' : '/dashboard'} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    login(formData);
  };

  const handleDemoLogin = (target: '/dashboard' | '/super-admin') => {
    setFormData({
      email: target === '/super-admin' ? 'superadmin@vguard.com' : 'admin@vguard.com',
      password: 'password123'
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
            The Command Center <br />for <span className="text-gradient">Elite Security</span>
          </motion.h2>
          <p>Manage multiple branches, track staff activity, and analyze vehicle flow with millisecond precision.</p>
        </div>

        <div className="visual-stats">
          <div className="v-stat">
            <h4>1M+</h4>
            <span>Vehicles Logged</span>
          </div>
          <div className="v-stat">
            <h4>99.9%</h4>
            <span>Uptime Guaranteed</span>
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
              <h2>Welcome Back</h2>
              <p>Enter your credentials to access your dashboard.</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="input-group-premium">
                <label>Email Address</label>
                <div className="input-field-wrapper">
                  <Mail className="input-icon" />
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="name@organization.com" 
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="input-group-premium">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <label>Password</label>
                  <button type="button" className="link-btn" style={{ fontSize: '12px' }}>Forgot Password?</button>
                </div>
                <div className="input-field-wrapper">
                  <Lock className="input-icon" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password" 
                    placeholder="••••••••" 
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

              {loginError && (
                <div style={{ color: 'var(--error)', fontSize: '14px', marginBottom: '16px', textAlign: 'center' }}>
                  Invalid email or password. Please try again.
                </div>
              )}

              <button type="submit" className="btn-auth-submit" disabled={isLoggingIn}>
                {isLoggingIn ? 'Logging in...' : 'Log In to Dashboard'}
                {!isLoggingIn && <ArrowRight size={18} />}
              </button>
            </form>

            <div className="auth-footer">
              <p>New to VGuard? <button onClick={() => navigate('/create-account')} className="link-btn">Create an account</button></p>
              
              <div className="demo-logins" style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border-light)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 700, display: 'block', marginBottom: '16px', textAlign: 'center' }}>⚡ Demo Quick Access</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                   <button 
                    onClick={() => handleDemoLogin('/dashboard')} 
                    style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.2)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
                   >
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <ShieldCheck size={20} style={{ color: '#6366f1' }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text)', marginBottom: '2px' }}>Admin Dashboard</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Manage branches, staff, entries & billing</div>
                    </div>
                   </button>

                   <button 
                    onClick={() => handleDemoLogin('/super-admin')} 
                    style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', borderRadius: '12px', background: 'rgba(251, 191, 36, 0.08)', border: '1px solid rgba(251, 191, 36, 0.2)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
                   >
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(251, 191, 36, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Crown size={20} style={{ color: '#f59e0b' }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text)', marginBottom: '2px' }}>Super Admin (Master)</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Platform-wide revenue, customers & settings</div>
                    </div>
                   </button>

                   <button 
                    onClick={() => navigate('/app')} 
                    style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', borderRadius: '12px', background: 'rgba(96, 165, 250, 0.08)', border: '1px solid rgba(96, 165, 250, 0.2)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
                   >
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(96, 165, 250, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Smartphone size={20} style={{ color: '#60a5fa' }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text)', marginBottom: '2px' }}>Mobile App (Guard)</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Vehicle check-in, check-out & sync</div>
                    </div>
                   </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
