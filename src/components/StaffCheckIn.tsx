import React, { useState } from 'react';
import { UserCheck, ArrowRight, Shield, Clock, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface StaffCheckInProps {
  onCheckIn: (staffId: string, staffName?: string) => void;
  orgName?: string;
}

const StaffCheckIn: React.FC<StaffCheckInProps> = ({ onCheckIn }) => {
  const [staffId, setStaffId] = useState('');
  const [staffName, setStaffName] = useState('');

  // Mock active staff for the organization
  const activeStaff = [
    { id: 'SEC-001', name: 'Samuel Okon' },
    { id: 'SEC-002', name: 'John Doe' },
    { id: 'SEC-003', name: 'Mary Jane' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (staffId.trim()) {
      if (navigator.vibrate) navigator.vibrate(50);
      onCheckIn(staffId.trim(), staffName.trim() || undefined);
    }
  };

  const handleQuickSelect = (id: string, name: string) => {
    if (navigator.vibrate) navigator.vibrate(30);
    onCheckIn(id, name);
  };

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const currentDate = new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <motion.div 
      className="checkin-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="checkin-hero">
        <div className="checkin-icon-wrap">
          <Shield size={36} />
        </div>
        <h2 className="checkin-title">Start Your Shift</h2>
        <p className="checkin-desc">
          Identify yourself to begin logging vehicles.
        </p>
        <div className="checkin-time">
          <Clock size={14} />
          <span>{currentTime}</span>
          <span className="checkin-date-sep">&bull;</span>
          <span>{currentDate}</span>
        </div>
      </div>

      <div className="checkin-quick-select">
        <p className="section-label">
          <Users size={12} />
          Active Staff
        </p>
        <div className="staff-grid-mini">
          {activeStaff.map((staff, index) => (
            <motion.button 
              key={staff.id} 
              className="staff-chip"
              onClick={() => handleQuickSelect(staff.id, staff.name)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.3 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="staff-avatar-xs">{staff.name.charAt(0)}</div>
              <div className="staff-chip-info">
                <span className="chip-name">{staff.name}</span>
                <span className="chip-id">{staff.id}</span>
              </div>
              <ArrowRight size={16} className="staff-chip-arrow" />
            </motion.button>
          ))}
        </div>
      </div>

      <div className="checkin-divider">
        <span>or enter manually</span>
      </div>

      <form onSubmit={handleSubmit} className="checkin-form">
        <div className="form-group">
          <label htmlFor="staffId" className="form-label">Staff ID *</label>
          <input
            id="staffId"
            type="text"
            className="form-input"
            placeholder="e.g. SEC-001"
            value={staffId}
            onChange={(e) => setStaffId(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="staffName" className="form-label">Full Name (optional)</label>
          <input
            id="staffName"
            type="text"
            className="form-input"
            placeholder="Enter your name"
            value={staffName}
            onChange={(e) => setStaffName(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={!staffId.trim()}>
          Start Shift
          <ArrowRight size={20} />
        </button>
      </form>

      <div className="card-glass checkin-info">
        <div className="checkin-info-icon">
          <UserCheck size={18} />
        </div>
        <p className="checkin-info-text">
          Your ID links all vehicle captures in this session for accountability and audit tracking.
        </p>
      </div>
    </motion.div>
  );
};

export default StaffCheckIn;
