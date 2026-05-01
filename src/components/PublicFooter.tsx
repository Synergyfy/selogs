import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Phone, Globe } from 'lucide-react';
import './PublicFooter.css';

const SocialIcon = ({ d }: { d: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    width="18" 
    height="18" 
    stroke="currentColor" 
    strokeWidth="2" 
    fill="none" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

const FacebookIcon = () => <SocialIcon d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />;
const TwitterIcon = () => <SocialIcon d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />;
const LinkedinIcon = () => <SocialIcon d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 2a2 2 0 0 1 2 2 2 2 0 0 1-2 2 2 2 0 0 1-2-2 2 2 0 0 1 2-2z" />;
const InstagramIcon = () => (
  <svg 
    viewBox="0 0 24 24" 
    width="18" 
    height="18" 
    stroke="currentColor" 
    strokeWidth="2" 
    fill="none" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const PublicFooter: React.FC = () => {
  const navigate = useNavigate();

  const navTo = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <footer className="public-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="nav-brand" onClick={() => navTo('/')}>
              <div className="nav-logo">
                <ShieldCheck className="icon-white" />
              </div>
              <span className="nav-title">VGuard</span>
            </div>
            <p className="footer-about">
              The modern, digital alternative to manual vehicle logbooks. Secure your premises with data-driven accountability.
            </p>
            <div className="social-links">
              <a href="#"><FacebookIcon /></a>
              <a href="#"><TwitterIcon /></a>
              <a href="#"><LinkedinIcon /></a>
              <a href="#"><InstagramIcon /></a>
            </div>
          </div>
          <div className="footer-links-col">
            <h4>Platform</h4>
            <button onClick={() => navTo('/features')}>Features</button>
            <button onClick={() => navTo('/industries')}>Industries</button>
            <button onClick={() => navTo('/pricing')}>Pricing</button>
            <button onClick={() => navigate('/login')}>Login</button>
          </div>
          <div className="footer-links-col">
            <h4>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
          <div className="footer-links-col">
            <h4>Contact</h4>
            <div className="contact-item"><Mail className="icon-xs" /> support@vguard.com</div>
            <div className="contact-item"><Phone className="icon-xs" /> +234 800 VGUARD</div>
            <div className="contact-item"><Globe className="icon-xs" /> www.vguard.com</div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} VGuard SaaS Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
