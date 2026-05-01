import React, { useState, useEffect } from 'react';
import { Search, ArrowLeft, Clock, Car, LogOut, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db, type VehicleEntry } from '../services/db';

interface CheckOutProps {
  staffId?: string;
  staffName?: string;
  onCheckOutComplete: () => void;
  onCancel: () => void;
}

const CheckOut: React.FC<CheckOutProps> = ({ staffId, staffName, onCheckOutComplete, onCancel }) => {
  const [activeVehicles, setActiveVehicles] = useState<VehicleEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleEntry | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const loadActiveVehicles = async () => {
      // Find all vehicles that are marked as 'IN'
      // Note: We're filtering in memory for simplicity with Dexie if the index isn't fully ready yet, 
      // but in production we'd use .where('status').equals('IN')
      const allEntries = await db.entries.toArray();
      const active = allEntries.filter(e => !e.status || e.status === 'IN').sort((a, b) => b.timestamp - a.timestamp);
      setActiveVehicles(active);
    };
    loadActiveVehicles();
  }, []);

  const filteredVehicles = activeVehicles.filter(v => 
    v.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (v.phoneNumber && v.phoneNumber.includes(searchTerm))
  );

  const calculateDuration = (checkInTime: number) => {
    const diff = Date.now() - checkInTime;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const handleCheckOut = async () => {
    if (!selectedVehicle) return;
    
    setIsProcessing(true);
    
    try {
      const now = Date.now();
      await db.entries.update(selectedVehicle.id, {
        status: 'OUT',
        checkOutTimestamp: now,
        checkOutStaffId: staffId,
        checkOutStaffName: staffName,
        synced: false // Needs to be re-synced to update the server
      });
      
      setIsProcessing(false);
      setShowSuccess(true);
      
      setTimeout(() => {
        onCheckOutComplete();
      }, 1500);
      
    } catch (error) {
      console.error('Check-out failed', error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="new-entry-screen">
      <div className="ne-header">
        <button className="ne-back-btn" onClick={onCancel}>
          <ArrowLeft size={24} />
        </button>
        <h2>Check-Out Vehicle</h2>
        <div style={{ width: 24 }} />
      </div>

      <div className="ne-content" style={{ padding: '20px' }}>
        <AnimatePresence mode="wait">
          {!selectedVehicle ? (
            <motion.div 
              key="search"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="ne-input-group">
                <label>Find Vehicle</label>
                <div className="ne-input-wrapper">
                  <Search className="ne-input-icon" size={20} />
                  <input 
                    type="text" 
                    placeholder="Search Plate Number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ textTransform: 'uppercase' }}
                  />
                </div>
              </div>

              <div style={{ marginTop: '24px' }}>
                <h3 style={{ fontSize: '14px', color: 'var(--text-dim)', marginBottom: '12px' }}>
                  Vehicles Currently Inside ({activeVehicles.length})
                </h3>
                
                {filteredVehicles.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', opacity: 0.5 }}>
                    <Car size={32} style={{ margin: '0 auto 12px' }} />
                    <p>No active vehicles found.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {filteredVehicles.map(vehicle => (
                      <div 
                        key={vehicle.id} 
                        className="home-recent-entry" 
                        style={{ cursor: 'pointer', border: '1px solid var(--border-light)' }}
                        onClick={() => setSelectedVehicle(vehicle)}
                      >
                        <div className="home-recent-entry-left">
                          <div className="home-recent-plate">{vehicle.plateNumber}</div>
                          <div className="home-recent-time">
                            <Clock size={11} /> Check-In: {new Date(vehicle.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)' }}>
                            {calculateDuration(vehicle.timestamp)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div style={{ background: 'var(--surface)', borderRadius: '16px', padding: '24px', border: '1px solid var(--border-light)', marginBottom: '24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <Car size={32} />
                  </div>
                  <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '1px', marginBottom: '4px' }}>
                    {selectedVehicle.plateNumber}
                  </h2>
                  <p style={{ color: 'var(--text-dim)', fontSize: '14px' }}>Ready for Check-Out</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Check-In Time</span>
                    <span style={{ fontWeight: 600 }}>{new Date(selectedVehicle.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Time Spent</span>
                    <span style={{ fontWeight: 600, color: 'var(--accent)' }}>{calculateDuration(selectedVehicle.timestamp)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Check-In Staff</span>
                    <span style={{ fontWeight: 600 }}>{selectedVehicle.staffName || selectedVehicle.staffId}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  className="ne-save-btn" 
                  style={{ background: 'var(--bg-input)', color: 'var(--text)', flex: 1 }}
                  onClick={() => setSelectedVehicle(null)}
                >
                  Back
                </button>
                <button 
                  className="ne-save-btn" 
                  onClick={handleCheckOut}
                  disabled={isProcessing || showSuccess}
                  style={{ flex: 2, background: showSuccess ? '#10b981' : undefined }}
                >
                  {isProcessing ? (
                    <div className="spinner-mini" style={{ margin: '0 auto' }} />
                  ) : showSuccess ? (
                    <>
                      <CheckCircle2 size={20} />
                      Success
                    </>
                  ) : (
                    <>
                      <LogOut size={20} />
                      Confirm Check-Out
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CheckOut;
