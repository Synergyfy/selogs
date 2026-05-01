import React, { useEffect, useState } from 'react';
import { Plus, RefreshCcw, History, Clock, LogOut, CheckCircle2, FileText, Wifi, WifiOff, AlertTriangle, Car } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db, type VehicleEntry } from '../services/db';

interface HomeProps {
  unsyncedCount: number;
  isOnline: boolean;
  isSyncing?: boolean;
  staffName?: string;
  staffId?: string;
  onNewEntry: () => void;
  onCheckOut?: () => void;
  onSync: () => void;
  onViewHistory: () => void;
  onEndShift: () => void;
}

const Home: React.FC<HomeProps> = ({ 
  unsyncedCount, isOnline, isSyncing, staffName, staffId, 
  onNewEntry, onCheckOut, onSync, onViewHistory, onEndShift 
}) => {
  const [recentEntries, setRecentEntries] = useState<VehicleEntry[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [totalShiftEntries, setTotalShiftEntries] = useState(0);
  const [todayCount, setTodayCount] = useState(0);

  useEffect(() => {
    const loadRecent = async () => {
      const entries = await db.entries.orderBy('timestamp').reverse().limit(5).toArray();
      setRecentEntries(entries);
      
      const count = await db.entries.count();
      setTotalShiftEntries(count);

      // Count today's entries
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const todayEntries = await db.entries
        .where('timestamp')
        .above(startOfDay.getTime())
        .count();
      setTodayCount(todayEntries);
    };
    loadRecent();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <motion.div 
      className="home-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Greeting */}
      <div className="home-greeting">
        <div className="home-greeting-text">
          <h2 className="home-greeting-hello">{getGreeting()}</h2>
          <p className="home-greeting-name">{staffName || staffId}</p>
        </div>
        <div className={`home-connection-badge ${isOnline ? 'online' : 'offline'}`}>
          {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
          <span>{isOnline ? 'Online' : 'Offline'}</span>
        </div>
      </div>

      {/* Primary CTAs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '0 20px', marginBottom: '24px' }}>
        <motion.div whileTap={{ scale: 0.98 }}>
          <button onClick={onNewEntry} className="home-cta-btn" style={{ padding: '16px 12px' }}>
            <div className="home-cta-icon" style={{ marginBottom: '8px' }}>
              <Plus size={24} strokeWidth={2.5} />
            </div>
            <div className="home-cta-content" style={{ textAlign: 'center' }}>
              <span className="home-cta-text" style={{ fontSize: '14px' }}>Check-In</span>
              <span className="home-cta-sub" style={{ fontSize: '11px' }}>New Entry</span>
            </div>
          </button>
        </motion.div>
        
        <motion.div whileTap={{ scale: 0.98 }}>
          <button onClick={onCheckOut} className="home-cta-btn" style={{ padding: '16px 12px', background: 'var(--surface)', border: '1px solid var(--border-light)' }}>
            <div className="home-cta-icon" style={{ marginBottom: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
              <LogOut size={24} strokeWidth={2.5} />
            </div>
            <div className="home-cta-content" style={{ textAlign: 'center' }}>
              <span className="home-cta-text" style={{ fontSize: '14px', color: 'var(--text)' }}>Check-Out</span>
              <span className="home-cta-sub" style={{ fontSize: '11px' }}>Exit Vehicle</span>
            </div>
          </button>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="home-stats">
        <motion.button 
          onClick={onSync} 
          className={`home-stat-card ${isSyncing ? 'syncing' : ''}`}
          whileTap={{ scale: 0.95 }}
        >
          <div className={`home-stat-icon sync ${unsyncedCount === 0 ? 'all-synced' : ''}`}>
            <RefreshCcw size={20} className={isSyncing ? 'animate-spin' : ''} />
          </div>
          <span className="home-stat-value">{unsyncedCount}</span>
          <span className="home-stat-label">{isSyncing ? 'Syncing...' : 'To Sync'}</span>
        </motion.button>

        <motion.button 
          onClick={onViewHistory} 
          className="home-stat-card"
          whileTap={{ scale: 0.95 }}
        >
          <div className="home-stat-icon history">
            <History size={20} />
          </div>
          <span className="home-stat-value">{totalShiftEntries}</span>
          <span className="home-stat-label">Total Records</span>
        </motion.button>

        <div className="home-stat-card home-stat-today">
          <div className="home-stat-icon today">
            <Car size={20} />
          </div>
          <span className="home-stat-value">{todayCount}</span>
          <span className="home-stat-label">Today</span>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="home-recent-section">
        <h3 className="home-section-title">Recent Activity</h3>
        {recentEntries.length === 0 ? (
          <div className="home-empty">
            <Car size={32} style={{ opacity: 0.3, marginBottom: 12 }} />
            <p>No entries recorded yet.</p>
            <p style={{ fontSize: 12, marginTop: 4 }}>Tap "New Vehicle Entry" to start.</p>
          </div>
        ) : (
          <div className="home-recent-list">
            {recentEntries.map((entry, index) => (
              <motion.div 
                key={entry.id} 
                className="home-recent-entry"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="home-recent-entry-left">
                  <div className="home-recent-plate">{entry.plateNumber}</div>
                  <div className="home-recent-time">
                    <Clock size={11} />
                    {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {entry.phoneNumber && (
                      <span className="home-recent-phone"> &bull; {entry.phoneNumber}</span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <span className={`badge ${entry.status === 'OUT' ? 'badge-neutral' : 'badge-primary'}`} style={{ fontSize: '10px', padding: '2px 6px' }}>
                    {entry.status || 'IN'}
                  </span>
                  {entry.synced ? (
                    <span className="text-success" style={{ fontSize: '10px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <CheckCircle2 size={10} /> Synced
                    </span>
                  ) : (
                    <span className="text-warning" style={{ fontSize: '10px' }}>Pending</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* End Shift */}
      <button className="home-session-btn" onClick={() => setShowSummary(true)}>
        <LogOut size={14} />
        End Shift
      </button>

      {/* Shift Summary Modal */}
      <AnimatePresence>
        {showSummary && (
          <div className="modal-overlay" onClick={() => setShowSummary(false)}>
            <motion.div 
              className="modal-content"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="summary-header">
                <div className="summary-icon-circle">
                  <CheckCircle2 size={32} className="text-success" />
                </div>
                <h3>Shift Summary</h3>
                <p>Great work, {staffName || staffId}! Here's your session.</p>
              </div>

              <div className="summary-stats-grid">
                <div className="summary-stat-item">
                  <div className="summary-stat-icon">
                    <FileText size={18} />
                  </div>
                  <div className="summary-stat-data">
                    <span className="summary-stat-val">{totalShiftEntries}</span>
                    <span className="summary-stat-lab">Total Entries</span>
                  </div>
                </div>
                <div className="summary-stat-item">
                  <div className="summary-stat-icon sync-icon">
                    <RefreshCcw size={18} />
                  </div>
                  <div className="summary-stat-data">
                    <span className="summary-stat-val">{unsyncedCount}</span>
                    <span className="summary-stat-lab">Pending Sync</span>
                  </div>
                </div>
              </div>

              {unsyncedCount > 0 && (
                <div className="summary-warning">
                  <AlertTriangle size={16} />
                  <p>You have {unsyncedCount} records that haven't synced yet. Please connect to Wi-Fi before leaving.</p>
                </div>
              )}

              <div className="modal-footer-stacked">
                <button 
                  className="btn btn-primary btn-full" 
                  onClick={onEndShift}
                >
                  Confirm End Shift
                </button>
                <button className="btn-text btn-full" onClick={() => setShowSummary(false)}>
                  Go Back
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Home;
