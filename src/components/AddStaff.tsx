import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Trash2, Users, Phone, Fingerprint, ArrowRight, ArrowLeft, ShieldCheck, User } from 'lucide-react';
import './AuthLayout.css';

interface StaffMember {
  id: string;
  name: string;
  staffId: string;
}

const AddStaff: React.FC = () => {
  const navigate = useNavigate();
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [formData, setFormData] = useState({ name: '', staffId: '' });

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.staffId) return;
    const newMember: StaffMember = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      staffId: formData.staffId
    };
    setStaffList([...staffList, newMember]);
    setFormData({ name: '', staffId: '' });
  };

  const handleRemoveMember = (id: string) => {
    setStaffList(staffList.filter(m => m.id !== id));
  };

  return (
    <div className="auth-page">
      <div className="auth-glow auth-glow-1" />
      <div className="auth-glow auth-glow-2" />

      {/* Visual Side */}
      <div className="auth-visual-side">
        <div className="auth-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <ShieldCheck className="icon-md" style={{ color: 'var(--accent)' }} />
          <span style={{ fontSize: '24px', fontWeight: 800, color: 'white', marginLeft: '12px' }}>VGuard</span>
        </div>

        <div className="visual-content">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            Build your <br /> <span className="text-gradient">Security Team.</span>
          </motion.h2>
          <p>Add the personnel who will be responsible for vehicle check-ins and gate security.</p>
        </div>

        <div className="visual-stats">
          <div className="v-stat">
            <h4>{staffList.length}</h4>
            <span>Members Added</span>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="auth-form-side">
        <div className="auth-container-premium">
          <motion.div 
            className="auth-card-premium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button className="back-btn-minimal" onClick={() => navigate(-1)}>
              <ArrowLeft size={18} /> Previous Step
            </button>

            <div className="auth-header">
              <h2>Staff Management</h2>
              <p>Add security staff to your organization.</p>
            </div>

            <form onSubmit={handleAddMember} className="auth-form mb-32">
              <div className="input-group-premium">
                <label>Staff Full Name</label>
                <div className="input-field-wrapper">
                  <User className="input-icon" />
                  <input 
                    type="text" 
                    placeholder="e.g. Samuel Okon" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="input-group-premium">
                <label>Staff ID / Access Code</label>
                <div className="input-field-wrapper">
                  <Fingerprint className="input-icon" />
                  <input 
                    type="text" 
                    placeholder="ID-001" 
                    required 
                    value={formData.staffId}
                    onChange={(e) => setFormData({...formData, staffId: e.target.value})}
                  />
                </div>
              </div>

              <button type="submit" className="btn-auth-outline">
                <UserPlus size={18} />
                Add Staff Member
              </button>
            </form>

            <div className="staff-preview-section">
              <div className="preview-header">
                <Users size={16} />
                <span>Team Members ({staffList.length})</span>
              </div>
              <div className="staff-stack-premium">
                <AnimatePresence mode="popLayout">
                  {staffList.length === 0 ? (
                    <motion.p key="empty" className="empty-msg">No staff added yet.</motion.p>
                  ) : (
                    staffList.map((m) => (
                      <motion.div 
                        key={m.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="staff-chip-premium"
                      >
                        <div className="s-info">
                          <strong>{m.name}</strong>
                          <span>{m.staffId}</span>
                        </div>
                        <button onClick={() => handleRemoveMember(m.id)} className="remove-s-btn">
                          <Trash2 size={14} />
                        </button>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>

            <button 
              onClick={() => navigate('/device-setup')} 
              className="btn-auth-submit"
              disabled={staffList.length === 0}
              style={{ marginTop: '32px' }}
            >
              Continue to Device Setup
              <ArrowRight size={18} />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AddStaff;
