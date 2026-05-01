import React, { useState, useEffect } from 'react';
import { Search, ArrowLeft, Clock, Car, LogOut, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db, type VehicleEntry } from '../services/db';
import './CheckOut.css';

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
      const allEntries = await db.entries.toArray();
      const active = allEntries
        .filter(e => !e.status || e.status === 'IN')
        .sort((a, b) => b.timestamp - a.timestamp);
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
        synced: false 
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
    <div className="checkout-screen">
      <div className="checkout-header">
        <button className="checkout-back-btn" onClick={onCancel}>
          <ArrowLeft size={20} />
        </button>
        <h2>Check-Out Vehicle</h2>
        <div style={{ width: 40 }} />
      </div>

      <div className="checkout-content">
        <AnimatePresence mode="wait">
          {!selectedVehicle ? (
            <motion.div 
              key="search"
              className="search-container"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="checkout-search-group">
                <label>Identify Vehicle</label>
                <div className="checkout-input-wrapper">
                  <Search className="checkout-input-icon" size={20} />
                  <input 
                    type="text" 
                    placeholder="Enter Plate Number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ textTransform: 'uppercase' }}
                    autoFocus
                  />
                </div>
              </div>

              <div className="checkout-results">
                <div className="checkout-results-header">
                  <h3>Active Vehicles ({activeVehicles.length})</h3>
                </div>
                
                {filteredVehicles.length === 0 ? (
                  <div className="empty-state">
                    <Car size={48} />
                    <p>No active vehicles found{searchTerm ? ` for "${searchTerm.toUpperCase()}"` : ''}.</p>
                  </div>
                ) : (
                  <div className="checkout-list">
                    {filteredVehicles.map((vehicle, idx) => (
                      <motion.div 
                        key={vehicle.id} 
                        className="checkout-vehicle-card" 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => setSelectedVehicle(vehicle)}
                      >
                        <div className="vehicle-card-left">
                          <div className="vehicle-card-plate">{vehicle.plateNumber}</div>
                          <div className="vehicle-card-meta">
                            <Clock size={12} /> {new Date(vehicle.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        <div className="vehicle-card-right">
                          <span className="duration-tag">
                            {calculateDuration(vehicle.timestamp)}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="details"
              className="details-container"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="checkout-details-card">
                <div className="details-hero">
                  <div className="details-icon-box">
                    <Car size={36} />
                  </div>
                  <h1>{selectedVehicle.plateNumber}</h1>
                  <p>Check-out Summary</p>
                </div>

                <div className="details-info-list">
                  <div className="details-info-item">
                    <span className="info-label">Check-In Time</span>
                    <span className="info-value">{new Date(selectedVehicle.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="details-info-item">
                    <span className="info-label">Duration Stayed</span>
                    <span className="info-value highlight">{calculateDuration(selectedVehicle.timestamp)}</span>
                  </div>
                  <div className="details-info-item">
                    <span className="info-label">Staff Member</span>
                    <span className="info-value">{selectedVehicle.staffName || 'Security'}</span>
                  </div>
                </div>
              </div>

              <div className="checkout-actions">
                <button 
                  className="btn-secondary" 
                  onClick={() => setSelectedVehicle(null)}
                  disabled={isProcessing || showSuccess}
                >
                  Change Vehicle
                </button>
                <button 
                  className={`btn-checkout-confirm ${showSuccess ? 'success' : ''}`} 
                  onClick={handleCheckOut}
                  disabled={isProcessing || showSuccess}
                >
                  {isProcessing ? (
                    <div className="spinner-mini" />
                  ) : showSuccess ? (
                    <>
                      <CheckCircle2 size={24} />
                      Completed
                    </>
                  ) : (
                    <>
                      <LogOut size={22} />
                      Confirm Exit
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

