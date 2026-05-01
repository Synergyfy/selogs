import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  Lock, 
  Eye, 
  EyeOff,
  CheckCircle2
} from 'lucide-react';
import './AuthLayout.css';

type Step = 'email' | 'otp' | 'reset' | 'success';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [passwords, setPasswords] = useState({ new: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // OTP Timer Logic
  useEffect(() => {
    let interval: any;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('otp');
    setTimer(30);
    setCanResend(false);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.join('').length === 6) setStep('reset');
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new === passwords.confirm && passwords.new.length >= 8) {
      setStep('success');
    }
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
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 style={{ fontSize: '40px', lineHeight: 1.1, fontWeight: 800, marginBottom: '24px' }}>
                {step === 'email' && <>Recover your <br /><span className="text-gradient">Access.</span></>}
                {step === 'otp' && <>Verify your <br /><span className="text-gradient">Identity.</span></>}
                {step === 'reset' && <>Set a new <br /><span className="text-gradient">Password.</span></>}
                {step === 'success' && <>Access <br /><span className="text-gradient">Restored.</span></>}
              </h2>
              <p style={{ fontSize: '16px', opacity: 0.8, maxWidth: '400px' }}>
                {step === 'email' && "Don't worry! Enter your email and we'll send you a verification code."}
                {step === 'otp' && `We've sent a 6-digit code to ${email || 'your email'}. Enter it here to proceed.`}
                {step === 'reset' && "Choose a strong password to ensure your account remains secure."}
                {step === 'success' && "Your password has been reset successfully. You can now log back into your dashboard."}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="visual-stats">
          <div className="v-stat">
            <h4>Security</h4>
            <span>{step === 'email' ? 'Requesting Reset' : 'Multi-Factor Active'}</span>
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
            {step !== 'success' && (
              <button className="back-btn-minimal" onClick={() => step === 'email' ? navigate('/login') : setStep('email')}>
                <ArrowLeft size={18} /> {step === 'email' ? 'Back to login' : 'Back to email'}
              </button>
            )}

            <AnimatePresence mode="wait">
              {/* Step 1: Email */}
              {step === 'email' && (
                <motion.div key="email" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="auth-header">
                    <h2>Forgot Password?</h2>
                    <p>Enter your email address and we'll send you a reset code.</p>
                  </div>
                  <form onSubmit={handleEmailSubmit} className="auth-form">
                    <div className="input-group-premium">
                      <label>Email Address</label>
                      <div className="input-field-wrapper">
                        <Mail className="input-icon" />
                        <input 
                          type="email" 
                          placeholder="name@organization.com" 
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <button type="submit" className="btn-auth-submit">
                      Send Reset Code
                      <ArrowRight size={18} />
                    </button>
                  </form>
                </motion.div>
              )}

              {/* Step 2: OTP */}
              {step === 'otp' && (
                <motion.div key="otp" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="auth-header">
                    <h2>Verify Code</h2>
                    <p>Please enter the 6-digit code sent to your email.</p>
                  </div>
                  <form onSubmit={handleOtpSubmit} className="auth-form">
                    <div className="otp-grid-premium">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => { otpRefs.current[index] = el; }}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className="otp-field-premium"
                          autoFocus={index === 0}
                        />
                      ))}
                    </div>
                    <button type="submit" className="btn-auth-submit" disabled={otp.join('').length < 6} style={{ marginTop: '24px' }}>
                      Verify & Continue
                      <ArrowRight size={18} />
                    </button>
                  </form>
                  <div className="auth-footer" style={{ marginTop: '24px', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-dim)', fontSize: '14px' }}>
                      Didn't get a code?{' '}
                      <button 
                        onClick={() => { if(canResend) {setTimer(30); setCanResend(false); setOtp(['','','','','','']);} }} 
                        className="link-btn"
                        disabled={!canResend}
                      >
                        {canResend ? 'Resend now' : `Resend in ${timer}s`}
                      </button>
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Reset Password */}
              {step === 'reset' && (
                <motion.div key="reset" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="auth-header">
                    <h2>Create New Password</h2>
                    <p>Enter your new password below.</p>
                  </div>
                  <form onSubmit={handleResetSubmit} className="auth-form">
                    <div className="input-group-premium">
                      <label>New Password</label>
                      <div className="input-field-wrapper">
                        <Lock className="input-icon" />
                        <input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="Min. 8 characters" 
                          required
                          value={passwords.new}
                          onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                        />
                        <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <div className="input-group-premium">
                      <label>Confirm Password</label>
                      <div className="input-field-wrapper">
                        <Lock className="input-icon" />
                        <input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="Repeat new password" 
                          required
                          value={passwords.confirm}
                          onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                        />
                      </div>
                    </div>
                    <button type="submit" className="btn-auth-submit" disabled={passwords.new !== passwords.confirm || passwords.new.length < 8}>
                      Reset Password
                      <ArrowRight size={18} />
                    </button>
                  </form>
                </motion.div>
              )}

              {/* Step 4: Success */}
              {step === 'success' && (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="success-state-premium centered">
                  <div className="success-icon-box" style={{ marginBottom: '24px' }}>
                    <CheckCircle2 size={64} className="text-gradient" />
                  </div>
                  <h2>Password Updated</h2>
                  <p>Your security credentials have been successfully updated. You can now use your new password to login.</p>
                  <button onClick={() => navigate('/login')} className="btn-auth-submit" style={{ marginTop: '32px', width: '100%' }}>
                    Back to Login
                    <ArrowRight size={18} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
