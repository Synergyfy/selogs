import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  WifiOff, Users, MapPin, Zap, Check, LogOut, LogIn, ArrowLeftRight, Search, BarChart3
} from 'lucide-react';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';
import type { ThemeMode } from '../types';
import './FeaturesPage.css';

interface FeaturesPageProps {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

const FeaturesPage: React.FC<FeaturesPageProps> = ({ themeMode, setThemeMode }) => {
  const navigate = useNavigate();
  return (
    <div className="features-page">
      <div className="bg-glow top-glow" />
      <div className="bg-glow bottom-glow" />

      <PublicHeader themeMode={themeMode} setThemeMode={setThemeMode} />

      <section className="features-hero">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hero-content centered"
          >
            <h1 className="hero-title">Powerful Features for <span className="text-gradient">Modern Security</span></h1>
            <p className="hero-subtitle">Discover how VGuard transforms vehicle access management with cutting-edge technology and user-centric design.</p>
          </motion.div>
        </div>
      </section>

      <section className="feature-detail-section">
        <div className="container">
          {/* Feature 1: OCR */}
          <div className="feature-detail-row">
            <div className="feature-text">
              <div className="feature-badge"><Zap className="icon-xs" /> Instant Capture</div>
              <h2>AI-Powered OCR Plate Recognition</h2>
              <p>Our Optical Character Recognition engine is optimized for speed and accuracy. Security guards can simply point their device camera at a vehicle plate, and the system instantly extracts the text.</p>
              <ul className="feature-list">
                <li><Check className="icon-xs" /> High accuracy in low light</li>
                <li><Check className="icon-xs" /> Fast extraction (under 1s)</li>
                <li><Check className="icon-xs" /> Support for multiple plate formats</li>
                <li><Check className="icon-xs" /> Manual correction if needed</li>
              </ul>
            </div>
            <div className="feature-visual">
              <div className="visual-card ocr-preview">
                <div className="scan-line" />
                <div className="plate-box">ABC 123 XY</div>
              </div>
            </div>
          </div>

          {/* Feature 2: Offline */}
          <div className="feature-detail-row reverse">
            <div className="feature-text">
              <div className="feature-badge"><WifiOff className="icon-xs" /> Always Reliable</div>
              <h2>True Offline-First Architecture</h2>
              <p>Never worry about poor internet at the gate. VGuard stores all captured data locally on the device using a high-performance database, ensuring zero downtime.</p>
              <ul className="feature-list">
                <li><Check className="icon-xs" /> Full functionality without internet</li>
                <li><Check className="icon-xs" /> Automatic background sync</li>
                <li><Check className="icon-xs" /> Conflict resolution</li>
                <li><Check className="icon-xs" /> Local search capability</li>
              </ul>
            </div>
            <div className="feature-visual">
              <div className="visual-card offline-preview">
                <div className="status-badge offline">Offline Mode Active</div>
                <div className="sync-indicator">Queued: 12 entries</div>
              </div>
            </div>
          </div>

          {/* Feature 3: Staff Accountability */}
          <div className="feature-detail-row">
            <div className="feature-text">
              <div className="feature-badge"><Users className="icon-xs" /> Accountability</div>
              <h2>Total Staff Accountability</h2>
              <p>Track exactly who is responsible for every entry. Every record is tied to a specific staff member and device, providing a clear audit trail for security managers.</p>
              <ul className="feature-list">
                <li><Check className="icon-xs" /> Shift check-in/out tracking</li>
                <li><Check className="icon-xs" /> Entry timestamps by staff</li>
                <li><Check className="icon-xs" /> Device-specific activity logs</li>
                <li><Check className="icon-xs" /> Performance reporting</li>
              </ul>
            </div>
            <div className="feature-visual">
              <div className="visual-card staff-preview">
                <div className="staff-item">
                  <div className="staff-avatar">JD</div>
                  <div className="staff-info">
                    <strong>John Doe</strong>
                    <span>Main Gate • Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 4: Branch Management */}
          <div className="feature-detail-row reverse">
            <div className="feature-text">
              <div className="feature-badge"><MapPin className="icon-xs" /> Scalability</div>
              <h2>Centralized Branch Management</h2>
              <p>Scaling to multiple locations is easy. Manage your headquarters, regional offices, and hotel branches from a single unified dashboard.</p>
              <ul className="feature-list">
                <li><Check className="icon-xs" /> Unique branch codes</li>
                <li><Check className="icon-xs" /> Isolated branch data</li>
                <li><Check className="icon-xs" /> Global reporting across all sites</li>
                <li><Check className="icon-xs" /> Branch-specific staff assignment</li>
              </ul>
            </div>
            <div className="feature-visual">
              <div className="visual-card branch-preview">
                <div className="map-node node-1">Victoria Island</div>
                <div className="map-node node-2">Lekki Phase 1</div>
                <div className="map-node node-3">Ikeja Branch</div>
              </div>
            </div>
          </div>

          {/* Feature 5: Vehicle Check-Out */}
          <div className="feature-detail-row">
            <div className="feature-text">
              <div className="feature-badge"><LogOut className="icon-xs" /> Fast Exit</div>
              <h2>Lightning-Fast Vehicle Check-Out</h2>
              <p>Checking vehicles out is as fast as searching for a plate. Security staff can quickly locate active entries and process exits in seconds, maintaining smooth traffic flow.</p>
              <ul className="feature-list">
                <li><Check className="icon-xs" /> Search by plate or phone number</li>
                <li><Check className="icon-xs" /> Scan plate to auto-locate entry</li>
                <li><Check className="icon-xs" /> Duration tracking at a glance</li>
                <li><Check className="icon-xs" /> Complete audit trail for every exit</li>
              </ul>
            </div>
            <div className="feature-visual">
              <div className="visual-card checkout-preview">
                <div style={{ padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'monospace', marginBottom: '8px' }}>ABC 123 XY</div>
                  <div style={{ fontSize: '13px', opacity: 0.6 }}>Duration: 2h 15m</div>
                  <div className="status-badge synced" style={{ marginTop: '12px', display: 'inline-flex' }}>Check-Out Ready</div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 6: Multi-Gate Support */}
          <div className="feature-detail-row reverse">
            <div className="feature-text">
              <div className="feature-badge"><ArrowLeftRight className="icon-xs" /> Flexible</div>
              <h2>Entry & Exit Gate Management</h2>
              <p>Configure separate gates for entry and exit — or use combined gates for both directions. Every gate is independently managed and tracked for maximum flexibility.</p>
              <ul className="feature-list">
                <li><Check className="icon-xs" /> Dedicated entry and exit gates</li>
                <li><Check className="icon-xs" /> Combined entry/exit gate support</li>
                <li><Check className="icon-xs" /> Gate-specific vehicle reporting</li>
                <li><Check className="icon-xs" /> Per-gate device assignment</li>
              </ul>
            </div>
            <div className="feature-visual">
              <div className="visual-card gate-preview">
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', padding: '16px' }}>
                  <div className="status-badge synced" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <LogIn size={14} /> Entry
                  </div>
                  <div className="status-badge" style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--bg-hover)' }}>
                    <LogOut size={14} /> Exit
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 7: Reporting & Analytics */}
          <div className="feature-detail-row">
            <div className="feature-text">
              <div className="feature-badge"><BarChart3 className="icon-xs" /> Insights</div>
              <h2>Advanced Reporting & Search</h2>
              <p>Powerful search and filtering tools make it easy to find any vehicle entry across your organization. Generate reports to analyze traffic patterns and staff performance.</p>
              <ul className="feature-list">
                <li><Check className="icon-xs" /> Full-text vehicle search</li>
                <li><Check className="icon-xs" /> Date range and staff filters</li>
                <li><Check className="icon-xs" /> Staff activity reports</li>
                <li><Check className="icon-xs" /> CSV & PDF export support</li>
              </ul>
            </div>
            <div className="feature-visual">
              <div className="visual-card report-preview">
                <div style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    <div style={{ width: '40%', height: '8px', borderRadius: '4px', background: 'var(--accent)', opacity: 0.3 }} />
                    <div style={{ width: '25%', height: '8px', borderRadius: '4px', background: 'var(--accent)', opacity: 0.15 }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                    <Search size={14} />
                    <span style={{ opacity: 0.6 }}>Search 12,450 entries...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2>Ready to modernize your security?</h2>
            <p>Join hundreds of organizations using VGuard to secure their premises.</p>
            <div className="cta-actions">
              <button className="btn-premium" onClick={() => navigate('/create-account')}>Start Free Trial</button>
              <button className="btn-glass" onClick={() => navigate('/contact')}>Book a Demo</button>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default FeaturesPage;
