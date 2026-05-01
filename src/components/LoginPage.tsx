import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ShieldCheck, ArrowRight, Eye, EyeOff, ArrowLeft, CheckCircle2, Crown, Smartphone } from 'lucide-react';
import './AuthLayout.css';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 1500);
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

              <button type="submit" className="btn-auth-submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Log In to Dashboard'}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <div className="auth-footer">
              <p>New to VGuard? <button onClick={() => navigate('/create-account')} className="link-btn">Create an account</button></p>
              
              <div className="demo-logins" style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border-light)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 700, display: 'block', marginBottom: '16px', textAlign: 'center' }}>⚡ Demo Quick Access</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                   <button 
                    onClick={() => navigate('/dashboard')} 
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
                    onClick={() => navigate('/super-admin')} 
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
