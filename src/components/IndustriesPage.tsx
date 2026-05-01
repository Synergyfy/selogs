import React from 'react';
import { motion } from 'framer-motion';
import { Hotel, Building2, ShieldCheck, Building, CheckCircle2 } from 'lucide-react';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';
import type { ThemeMode } from '../types';
import './IndustriesPage.css';

interface IndustriesPageProps {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

const IndustriesPage: React.FC<IndustriesPageProps> = ({ themeMode, setThemeMode }) => {
  return (
    <div className="industries-page">
      <div className="bg-glow top-glow" />
      <div className="bg-glow bottom-glow" />

      <PublicHeader themeMode={themeMode} setThemeMode={setThemeMode} />

      <section className="industries-hero">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hero-content centered"
          >
            <h1 className="hero-title">Tailored Solutions for <span className="text-gradient">Every Industry</span></h1>
            <p className="hero-subtitle">VGuard is built to adapt to the unique security challenges of different sectors, from luxury hotels to massive residential estates.</p>
          </motion.div>
        </div>
      </section>

      <section className="industry-details">
        <div className="container">
          
          {/* Hotel Security */}
          <div className="industry-section">
            <div className="industry-header">
              <div className="industry-icon-box"><Hotel className="icon-lg" /></div>
              <h2>Hotel Security</h2>
            </div>
            <div className="industry-grid">
              <div className="industry-text">
                <p>Provide a seamless arrival experience for your guests while maintaining strict security standards. VGuard allows your valets and security team to log guest vehicles instantly, reducing wait times at the gate.</p>
                <ul className="benefit-list">
                  <li><CheckCircle2 className="icon-xs" /> Instant guest vehicle logging</li>
                  <li><CheckCircle2 className="icon-xs" /> Track valet-parked vehicles</li>
                  <li><CheckCircle2 className="icon-xs" /> Visitor pre-registration integration</li>
                  <li><CheckCircle2 className="icon-xs" /> Multi-gate coordination</li>
                </ul>
              </div>
              <div className="industry-image hotel-image">
                <div className="overlay-text">Elevate Guest Experience</div>
              </div>
            </div>
          </div>

          {/* Estate Security */}
          <div className="industry-section">
            <div className="industry-header">
              <div className="industry-icon-box"><Building2 className="icon-lg" /></div>
              <h2>Residential Estates</h2>
            </div>
            <div className="industry-grid reverse">
              <div className="industry-text">
                <p>Manage high volumes of visitor traffic without compromising the safety of your residents. VGuard's offline capability ensures that security logging never stops, even during power outages or network failures common in large estates.</p>
                <ul className="benefit-list">
                  <li><CheckCircle2 className="icon-xs" /> Resident vehicle whitelist management</li>
                  <li><CheckCircle2 className="icon-xs" /> Daily visitor flow analytics</li>
                  <li><CheckCircle2 className="icon-xs" /> Automated reporting for estate managers</li>
                  <li><CheckCircle2 className="icon-xs" /> Contractor access tracking</li>
                </ul>
              </div>
              <div className="industry-image estate-image">
                <div className="overlay-text">Secure Community Living</div>
              </div>
            </div>
          </div>

          {/* Security Companies */}
          <div className="industry-section">
            <div className="industry-header">
              <div className="industry-icon-box"><ShieldCheck className="icon-lg" /></div>
              <h2>Security Companies</h2>
            </div>
            <div className="industry-grid">
              <div className="industry-text">
                <p>Empower your guards with professional digital tools. Move away from unreliable paper logs and provide your clients with transparent, real-time data about their facility's access points.</p>
                <ul className="benefit-list">
                  <li><CheckCircle2 className="icon-xs" /> Professionalize guard operations</li>
                  <li><CheckCircle2 className="icon-xs" /> Real-time client reporting</li>
                  <li><CheckCircle2 className="icon-xs" /> Guard location & shift verification</li>
                  <li><CheckCircle2 className="icon-xs" /> Multi-client dashboard management</li>
                </ul>
              </div>
              <div className="industry-image security-image">
                <div className="overlay-text">Professional Guarding</div>
              </div>
            </div>
          </div>

          {/* Corporate Offices */}
          <div className="industry-section">
            <div className="industry-header">
              <div className="industry-icon-box"><Building className="icon-lg" /></div>
              <h2>Corporate Offices</h2>
            </div>
            <div className="industry-grid reverse">
              <div className="industry-text">
                <p>Maintain a professional image at your corporate headquarters. Track employee arrivals and visitor logs with ease, ensuring a secure environment for your staff and intellectual property.</p>
                <ul className="benefit-list">
                  <li><CheckCircle2 className="icon-xs" /> Employee arrival/departure logs</li>
                  <li><CheckCircle2 className="icon-xs" /> Courier & delivery tracking</li>
                  <li><CheckCircle2 className="icon-xs" /> Executive parking management</li>
                  <li><CheckCircle2 className="icon-xs" /> Emergency muster list generation</li>
                </ul>
              </div>
              <div className="industry-image corporate-image">
                <div className="overlay-text">Corporate Access Control</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content centered">
            <h2>Don't see your industry?</h2>
            <p>Our platform is flexible enough to adapt to any environment that requires vehicle access logging. Contact us to discuss your specific needs.</p>
            <button className="btn-premium" style={{ marginTop: '32px' }} onClick={() => navigate('/contact')}>Talk to an Expert</button>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default IndustriesPage;
