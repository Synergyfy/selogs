import React from 'react';
import { Shield, Wifi, WifiOff, Sun, Moon, Building2, Unplug, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
  staffId?: string;
  staffName?: string;
  isOnline: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  orgName?: string;
  onDisconnect?: () => void;
  toast?: { message: string; type: 'success' | 'error' | 'info' } | null;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, staffId, staffName, isOnline, theme, toggleTheme, orgName, onDisconnect, toast 
}) => {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-brand">
          <div className="app-header-icon">
            <Shield size={22} />
          </div>
          <div>
            <div className="app-header-title">VGuard</div>
            {staffId && (
              <div className="app-header-subtitle">
                {staffName || staffId}
              </div>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={toggleTheme} className="btn-icon btn-icon-sm" aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <div className={`status-dot ${isOnline ? 'online' : 'offline'}`}>
            {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
          </div>
        </div>
      </header>

      {/* Organization Banner */}
      {orgName && (
        <div className="org-banner">
          <div className="org-banner-info">
            <Building2 size={14} />
            <span>{orgName}</span>
          </div>
          {onDisconnect && !staffId && (
            <button className="org-banner-disconnect" onClick={onDisconnect} title="Disconnect device">
              <Unplug size={12} />
            </button>
          )}
        </div>
      )}
      
      <main className="app-main">
        {children}
      </main>
      
      <footer className="app-footer">
        VGuard &bull; Offline-First Vehicle Capture
      </footer>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            className={`toast toast-${toast.type}`}
            initial={{ opacity: 0, y: 40, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 40, x: '-50%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {toast.type === 'success' && <CheckCircle2 size={16} />}
            {toast.type === 'error' && <AlertCircle size={16} />}
            {toast.type === 'info' && <Info size={16} />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Layout;
