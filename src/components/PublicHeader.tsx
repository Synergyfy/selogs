import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Sun, Moon, Monitor, Menu, X } from 'lucide-react';
import type { ThemeMode } from '../types';
import './PublicHeader.css';

interface PublicHeaderProps {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

const PublicHeader: React.FC<PublicHeaderProps> = ({ themeMode, setThemeMode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id: string) => {
    if (location.pathname !== '/') {
      navigate('/#' + id);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navTo = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <nav className="public-nav">
      <div className="nav-container">
        <div className="nav-brand" onClick={() => navTo('/')}>
          <div className="nav-logo">
            <ShieldCheck className="icon-white" />
          </div>
          <span className="nav-title">VGuard</span>
        </div>

        <div className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
          <button onClick={() => { navTo('/'); setIsMobileMenuOpen(false); }} className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</button>
          <button onClick={() => { navTo('/features'); setIsMobileMenuOpen(false); }} className={`nav-link ${location.pathname === '/features' ? 'active' : ''}`}>Features</button>
          <button onClick={() => { navTo('/industries'); setIsMobileMenuOpen(false); }} className={`nav-link ${location.pathname === '/industries' ? 'active' : ''}`}>Industries</button>
          <button onClick={() => { navTo('/pricing'); setIsMobileMenuOpen(false); }} className={`nav-link ${location.pathname === '/pricing' ? 'active' : ''}`}>Pricing</button>
          <button onClick={() => { navTo('/faq'); setIsMobileMenuOpen(false); }} className={`nav-link ${location.pathname === '/faq' ? 'active' : ''}`}>FAQ</button>
          <button onClick={() => { navTo('/contact'); setIsMobileMenuOpen(false); }} className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>Contact</button>
          
          <div className="mobile-actions">
            <button onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }} className="btn-text">Log in</button>
            <button onClick={() => { navigate('/create-account'); setIsMobileMenuOpen(false); }} className="btn-premium-sm">Get Started</button>
          </div>
        </div>

        <div className="nav-actions">
          <div className="theme-switcher hide-mobile">
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
            className="btn-text hide-mobile"
          >
            Log in
          </button>
          <button 
            onClick={() => navigate('/create-account')}
            className="btn-premium-sm hide-mobile"
          >
            Get Started
          </button>
          
          <button className="menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default PublicHeader;
