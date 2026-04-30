import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Zap, WifiOff, ChevronRight, Lock, Sun, Moon, Monitor } from 'lucide-react';
import type { ThemeMode } from '../types';
import './LandingPage.css';

interface LandingPageProps {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ themeMode, setThemeMode }) => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      
      {/* Background Gradients */}
      <div className="bg-glow top-glow" />
      <div className="bg-glow bottom-glow" />

      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-brand">
          <div className="nav-logo">
            <ShieldCheck className="icon-white" />
          </div>
          <span className="nav-title">VGuard</span>
        </div>
        <div className="nav-actions">
          <div className="theme-switcher">
            <button 
              onClick={() => setThemeMode('light')} 
              className={`theme-btn ${themeMode === 'light' ? 'active' : ''}`}
              title="Light Mode"
            >
              <Sun className="icon-xs" />
            </button>
            <button 
              onClick={() => setThemeMode('dark')} 
              className={`theme-btn ${themeMode === 'dark' ? 'active' : ''}`}
              title="Dark Mode"
            >
              <Moon className="icon-xs" />
            </button>
            <button 
              onClick={() => setThemeMode('system')} 
              className={`theme-btn ${themeMode === 'system' ? 'active' : ''}`}
              title="System Default"
            >
              <Monitor className="icon-xs" />
            </button>
          </div>
          <button 
            onClick={() => navigate('/login')}
            className="btn-text"
          >
            Log in
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="landing-hero">
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="hero-badge"
          >
            <span className="badge-dot" />
            Next-Gen Vehicle Capture
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hero-title"
          >
            Secure, Paperless <br className="break-desktop"/>
            <span className="text-gradient">
              Vehicle Logging
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hero-subtitle"
          >
            Modernize your security operations. Fast plate capture, seamless offline sync, and real-time dashboard analytics for hotels, estates, and offices.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="hero-actions"
          >
            <button 
              onClick={() => navigate('/create-account')}
              className="btn-premium"
            >
              Get Started
              <ChevronRight className="icon-sm" />
            </button>
            <button 
              onClick={() => navigate('/app')}
              className="btn-glass"
            >
              Open Mobile App
            </button>
          </motion.div>
        </div>

        {/* Benefits Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="benefits-grid"
        >
          <div className="benefit-card">
            <div className="benefit-icon bg-emerald">
              <Zap className="icon" />
            </div>
            <h3 className="benefit-title">Lightning Fast</h3>
            <p className="benefit-desc">Instantly capture plates using device cameras. Minimal typing required to keep traffic flowing.</p>
          </div>

          <div className="benefit-card relative-card">
            <div className="card-glow" />
            <div className="benefit-icon bg-indigo relative-z">
              <WifiOff className="icon" />
            </div>
            <h3 className="benefit-title relative-z">Works Offline</h3>
            <p className="benefit-desc relative-z">Internet down? No problem. The app continues to work perfectly and syncs automatically when reconnected.</p>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon bg-purple">
              <Lock className="icon" />
            </div>
            <h3 className="benefit-title">No More Paper</h3>
            <p className="benefit-desc">Secure, searchable, and permanent records. Replace easily damaged logbooks with a robust digital system.</p>
          </div>
        </motion.div>
      </main>

    </div>
  );
};

export default LandingPage;

