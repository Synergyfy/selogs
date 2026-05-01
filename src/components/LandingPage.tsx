import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, WifiOff, ChevronRight, 
  Hotel, Building2, Building, PartyPopper, Check,
  Smartphone, Database, LayoutDashboard, 
  ShieldCheck, MessageSquare
} from 'lucide-react';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';
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
      
      {/* Background Gradients & Effects */}
      <div className="bg-glow top-glow" />
      <div className="bg-glow middle-glow" />
      <div className="bg-glow bottom-glow" />
      <div className="grid-overlay" />

      {/* Shared Navigation */}
      <PublicHeader themeMode={themeMode} setThemeMode={setThemeMode} />

      {/* Hero Section */}
      <main id="home" className="landing-hero">
        <div className="container hero-container">
          <div className="hero-content">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="hero-badge"
            >
              <span className="badge-dot" />
              Trusted by 500+ Security Teams
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hero-title"
            >
              The Gold Standard in <br />
              <span className="text-gradient">Vehicle Intelligence</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="hero-subtitle"
            >
              Elite security operations require elite tools. VGuard combines AI-powered OCR with robust offline-first architecture to deliver ultimate vehicle tracking.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="hero-actions"
            >
              <button 
                onClick={() => navigate('/create-account')}
                className="btn-premium"
              >
                Start Free Trial
                <ChevronRight className="icon-sm" />
              </button>
              <button 
                className="btn-glass"
                onClick={() => navigate('/contact')}
              >
                Watch Demo
              </button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="hero-stats"
            >
              <div className="stat-item">
                <strong>99.9%</strong>
                <span>Accuracy</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <strong>0.5s</strong>
                <span>Capture Speed</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <strong>1M+</strong>
                <span>Logs Securely Synced</span>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hero-visual"
          >
            <div className="hero-image-wrapper">
              <img 
                src="/vguard_hero.png" 
                alt="VGuard Security Dashboard" 
                className="hero-main-img"
              />
              <div className="img-glow" />
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="floating-card ocr-card"
              >
                <div className="card-icon"><Zap className="icon-sm" /></div>
                <div className="card-info">
                  <span>New Entry Detected</span>
                  <strong>LSR-442-AX</strong>
                </div>
              </motion.div>
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="floating-card sync-card"
              >
                <div className="card-icon"><Database className="icon-sm" /></div>
                <div className="card-info">
                  <span>Cloud Sync Active</span>
                  <strong>100% Verified</strong>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Trusted Industries */}
      <section className="landing-section trusted-section">
        <div className="container">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="section-subtitle centered"
          >
            POWERING SECURITY FOR GLOBAL LEADERS
          </motion.p>
          <div className="trusted-grid">
            <div className="trusted-item"><Hotel className="icon-md" /> <span>Hotels</span></div>
            <div className="trusted-item"><Building2 className="icon-md" /> <span>Residential Estates</span></div>
            <div className="trusted-item"><Building className="icon-md" /> <span>Corporate Offices</span></div>
            <div className="trusted-item"><ShieldCheck className="icon-white" /> <span>Security Firms</span></div>
            <div className="trusted-item"><PartyPopper className="icon-md" /> <span>Event Centers</span></div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section id="features" className="landing-section features-preview">
        <div className="container">
          <div className="section-header centered">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="section-title"
            >
              Engineered for <span className="text-gradient">Reliability</span>
            </motion.h2>
            <p className="section-description">Our core platform is built to withstand the toughest security environments.</p>
          </div>

          <div className="features-grid-premium">
            <motion.div 
              whileHover={{ y: -10 }}
              className="feature-card-premium"
            >
              <div className="feature-card-icon"><Smartphone /></div>
              <h3>Intelligent Capture</h3>
              <p>AI-powered OCR that works from any angle, even in low-light conditions.</p>
              <ul className="feature-points">
                <li><Check className="icon-xs" /> High accuracy rates</li>
                <li><Check className="icon-xs" /> Fast camera focus</li>
              </ul>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              className="feature-card-premium featured"
            >
              <div className="feature-card-icon"><WifiOff /></div>
              <h3>Zero-Downtime Sync</h3>
              <p>Proprietary offline-first logic ensures your gates never stop moving.</p>
              <ul className="feature-points">
                <li><Check className="icon-xs" /> Automatic background sync</li>
                <li><Check className="icon-xs" /> Conflict resolution</li>
              </ul>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              className="feature-card-premium"
            >
              <div className="feature-card-icon"><LayoutDashboard /></div>
              <h3>Unified Dashboard</h3>
              <p>A single source of truth for all locations, branches, and staff activity.</p>
              <ul className="feature-points">
                <li><Check className="icon-xs" /> Real-time analytics</li>
                <li><Check className="icon-xs" /> CSV & PDF Exports</li>
              </ul>
            </motion.div>
          </div>
          
          <div className="centered" style={{ marginTop: '48px' }}>
            <button className="btn-outline" onClick={() => navigate('/features')}>View All Features</button>
          </div>
        </div>
      </section>

      {/* How It Works (Fixed Layout) */}
      <section className="landing-section how-works-section">
        <div className="container">
          <div className="section-header centered">
            <h2 className="section-title">Deployment is <span className="text-gradient">Instant</span></h2>
            <p className="section-description">Go from paper logs to a digital power-house in four simple steps.</p>
          </div>
          
          <div className="process-flow">
            {[
              { num: '01', title: 'Sign Up', desc: 'Create your account and verify your business identity.' },
              { num: '02', title: 'Configure', desc: 'Setup branches, staff accounts, and organization branding.' },
              { num: '03', title: 'Install PWA', desc: 'Add VGuard to any mobile device with a single tap.' },
              { num: '04', title: 'Go Live', desc: 'Start capturing secure, searchable vehicle entries.' }
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="process-step"
              >
                <div className="step-num-bg">{step.num}</div>
                <div className="step-content">
                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>
                </div>
                {i < 3 && <div className="step-connector" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="landing-section final-cta">
        <div className="container">
          <div className="cta-wrapper">
            <div className="cta-text">
              <h2>Join the Future of <br />Premises Security</h2>
              <p>Start your 14-day free trial today. No credit card required.</p>
              <div className="cta-buttons">
                <button className="btn-premium" onClick={() => navigate('/create-account')}>Get Started Now</button>
                <button className="btn-glass" onClick={() => navigate('/contact')}>Talk to Sales</button>
              </div>
            </div>
            <div className="cta-visual">
              <ShieldCheck className="cta-shield-icon" />
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />

      {/* Floating Chat Button */}
      <motion.button 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="floating-chat-btn"
        onClick={() => navigate('/contact')}
      >
        <MessageSquare className="icon-md" />
      </motion.button>

    </div>
  );
};

export default LandingPage;



