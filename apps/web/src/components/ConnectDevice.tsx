import React, { useState } from 'react';
import { Shield, Link2, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './ConnectDevice.css';
import api from '../services/api';

interface ConnectDeviceProps {
  onConnect: (orgCode: string, orgName: string, orgId: string) => void;
}

const ConnectDevice: React.FC<ConnectDeviceProps> = ({ onConnect }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [orgName, setOrgName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setError('');
    setLoading(true);

    const upperCode = code.trim().toUpperCase();

    try {
      // API call to validate org
      const response = await api.get(`/devices/validate-org/${upperCode}`);
      const { id, name } = response.data;
      
      setOrgName(name);
      setSuccess(true);
      
      // Haptic feedback
      if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
      
      setTimeout(() => {
        onConnect(upperCode, name, id);
      }, 2000);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid organization code. Please check with your administrator.';
      setError(msg);
      setLoading(false);
      if (navigator.vibrate) navigator.vibrate(100);
    }
  };

  return (
    <div className="connect-screen">
      <div className="connect-bg-orb orb-1" />
      <div className="connect-bg-orb orb-2" />

      <motion.div 
        className="connect-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="connect-brand">
          <motion.div 
            className="connect-logo"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <Shield size={32} />
          </motion.div>
          <div className="connect-brand-name">VGuard</div>
          <div className="connect-brand-sub">
            Vehicle Entry Logging System
          </div>
        </div>

        <motion.div 
          className="connect-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="connect-card-title">Connect Device</h2>
          <p className="connect-card-desc">
            Enter the organization code provided by your administrator to link this device.
          </p>

          <AnimatePresence>
            {error && (
              <motion.div 
                className="connect-error"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit}>
            <div className="connect-input-group">
              <Link2 size={18} className="connect-input-icon" />
              <input
                type="text"
                className="connect-input"
                placeholder="e.g. VGRD-8821-X"
                value={code}
                onChange={(e) => { setCode(e.target.value); setError(''); }}
                disabled={loading}
                autoFocus
              />
            </div>

            <button 
              type="submit" 
              className="connect-submit"
              disabled={!code.trim() || loading}
            >
              {loading ? (
                <div className="connect-loading" />
              ) : (
                <>
                  Connect Device
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </motion.div>

        <div className="connect-footer">
          <p className="connect-footer-text">
            Don't have a code? Ask your organization admin<br />
            or try <a href="#" onClick={(e) => { e.preventDefault(); setCode('DEMO'); }}>DEMO</a> to explore.
          </p>
        </div>
      </motion.div>

      {/* Success Overlay */}
      <AnimatePresence>
        {success && (
          <motion.div 
            className="connect-success-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="connect-success-icon"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            >
              <CheckCircle2 size={48} />
            </motion.div>
            <motion.div 
              className="connect-success-text"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Connected!
            </motion.div>
            <motion.div 
              className="connect-success-sub"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {orgName}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConnectDevice;
