import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Palette, 
  Shield, 
  Check, 
  Image as ImageIcon,
  MapPin, 
  Hotel, 
  Home, 
  ShieldCheck,
  Save,
  Globe
} from 'lucide-react';
import './SettingsPage.css';

type Tab = 'general' | 'branding' | 'mode';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form States
  const [orgName, setOrgName] = useState('VGuard Security Solutions');
  const [location, setLocation] = useState('Lagos, Nigeria');
  const [systemName, setSystemName] = useState('VGuard System');
  const [primaryColor, setPrimaryColor] = useState('#6366f1');
  const [selectedMode, setSelectedMode] = useState<'hotel' | 'estate' | 'security'>('security');

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: <Building2 size={18} /> },
    { id: 'branding', label: 'Branding', icon: <Palette size={18} /> },
    { id: 'mode', label: 'System Mode', icon: <Shield size={18} /> },
  ];

  return (
    <div className="settings-page">
      <div className="settings-container">
        {/* Sidebar Tabs */}
        <aside className="settings-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id as Tab)}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div 
                  className="active-indicator"
                  layoutId="activeTab"
                />
              )}
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <main className="settings-content-card">
          <AnimatePresence mode="wait">
            {activeTab === 'general' && (
              <motion.div 
                key="general"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="settings-section"
              >
                <div className="section-header">
                  <h2>General Information</h2>
                  <p>Update your organization's public profile and contact details.</p>
                </div>

                <div className="settings-form">
                  <div className="form-group">
                    <label>Organization Name</label>
                    <div className="input-wrapper">
                      <Building2 className="input-icon" />
                      <input 
                        type="text" 
                        value={orgName} 
                        onChange={(e) => setOrgName(e.target.value)} 
                        placeholder="e.g. VGuard Security"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Location / Branch</label>
                    <div className="input-wrapper">
                      <MapPin className="input-icon" />
                      <input 
                        type="text" 
                        value={location} 
                        onChange={(e) => setLocation(e.target.value)} 
                        placeholder="e.g. Lagos Office"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Timezone</label>
                    <div className="input-wrapper">
                      <Globe className="input-icon" />
                      <select className="settings-select">
                        <option>(GMT+01:00) West Central Africa</option>
                        <option>(GMT+00:00) Greenwich Mean Time</option>
                        <option>(GMT+08:00) Singapore Standard Time</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'branding' && (
              <motion.div 
                key="branding"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="settings-section"
              >
                <div className="section-header">
                  <h2>Branding & Identity</h2>
                  <p>Customize the look and feel of your dashboard and mobile app.</p>
                </div>

                <div className="settings-form">
                  <div className="form-group">
                    <label>System Display Name</label>
                    <div className="input-wrapper">
                      <ShieldCheck className="input-icon" />
                      <input 
                        type="text" 
                        value={systemName} 
                        onChange={(e) => setSystemName(e.target.value)} 
                        placeholder="e.g. VGuard"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group flex-1">
                      <label>Organization Logo</label>
                      <div className="logo-upload-box">
                        <div className="logo-preview-box">
                          <ImageIcon size={24} className="text-muted" />
                        </div>
                        <div className="upload-info">
                          <button className="btn-text-small">Replace Image</button>
                          <span>PNG, JPG up to 2MB</span>
                        </div>
                      </div>
                    </div>

                    <div className="form-group flex-1">
                      <label>Primary Brand Color</label>
                      <div className="color-picker-wrapper">
                        <input 
                          type="color" 
                          value={primaryColor} 
                          onChange={(e) => setPrimaryColor(e.target.value)} 
                        />
                        <span className="color-hex-text">{primaryColor.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'mode' && (
              <motion.div 
                key="mode"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="settings-section"
              >
                <div className="section-header">
                  <h2>System Mode</h2>
                  <p>Select the environment that best describes your organization.</p>
                </div>

                <div className="mode-grid-settings">
                  {[
                    { id: 'hotel', icon: <Hotel size={24} />, title: 'Hotel / Resort', desc: 'Optimized for guest check-ins and valet services.' },
                    { id: 'estate', icon: <Home size={24} />, title: 'Gated Estate', desc: 'Focus on visitor management and resident safety.' },
                    { id: 'security', icon: <ShieldCheck size={24} />, title: 'High Security', desc: 'Standard security logging with strict identification.' },
                  ].map((mode) => (
                    <div 
                      key={mode.id}
                      className={`mode-card-mini ${selectedMode === mode.id ? 'selected' : ''}`}
                      onClick={() => setSelectedMode(mode.id as any)}
                    >
                      <div className="mode-icon-circle">
                        {mode.icon}
                      </div>
                      <div className="mode-info-mini">
                        <h4>{mode.title}</h4>
                        <p>{mode.desc}</p>
                      </div>
                      {selectedMode === mode.id && <Check className="check-icon-mini" size={20} />}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sticky Footer */}
          <div className="settings-footer">
            <AnimatePresence>
              {showSuccess && (
                <motion.div 
                  className="success-toast"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Check size={16} />
                  <span>Changes saved successfully!</span>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="footer-btns">
              <button className="btn-text">Cancel</button>
              <button 
                className={`btn-primary ${saving ? 'loading' : ''}`} 
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <div className="spinner-mini" />
                ) : (
                  <>
                    <Save size={18} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
