import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Trash2, Users, Phone, Fingerprint, ArrowRight, ArrowLeft, ShieldCheck, User } from 'lucide-react';
import './AddStaff.css';

interface StaffMember {
  id: string;
  name: string;
  staffId: string;
  phone?: string;
}

const AddStaff: React.FC = () => {
  const navigate = useNavigate();
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    staffId: '',
    phone: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.staffId) return;

    const newMember: StaffMember = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      staffId: formData.staffId,
      phone: formData.phone
    };

    setStaffList([...staffList, newMember]);
    setFormData({ name: '', staffId: '', phone: '' });
  };

  const handleRemoveMember = (id: string) => {
    setStaffList(staffList.filter(member => member.id !== id));
  };

  const handleSubmit = () => {
    // In a real app, save staff list here
    navigate('/device-setup');
  };

  return (
    <div className="auth-page">
      <div className="bg-glow top-left-glow" />
      <div className="bg-glow bottom-right-glow" />

      <div className="auth-container">
        <div className="auth-brand" onClick={() => navigate('/')}>
          <div className="auth-logo">
            <ShieldCheck className="icon-white" />
          </div>
          <span className="auth-title">VGuard</span>
        </div>

        <motion.div 
          className="auth-card staff-card-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button 
            type="button" 
            className="back-btn" 
            onClick={() => navigate(-1)}
            title="Go Back"
          >
            <ArrowLeft className="icon-sm" />
          </button>

          <div className="auth-header">
            <h2>Add Staff Members</h2>
            <p>Register the security personnel who will be using the system.</p>
          </div>

          <form onSubmit={handleAddMember} className="auth-form mb-24">
            <div className="form-group">
              <label htmlFor="name">Staff Name</label>
              <div className="input-wrapper">
                <User className="input-icon" />
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  placeholder="e.g. Samuel Okon" 
                  required 
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label htmlFor="staffId">Staff ID / Code</label>
                <div className="input-wrapper">
                  <Fingerprint className="input-icon" />
                  <input 
                    type="text" 
                    id="staffId" 
                    name="staffId" 
                    placeholder="ID-001" 
                    required 
                    value={formData.staffId}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group flex-1">
                <label htmlFor="phone">Phone (Optional)</label>
                <div className="input-wrapper">
                  <Phone className="input-icon" />
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    placeholder="080..." 
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="btn-secondary w-full">
              <UserPlus className="icon-sm" />
              Add Member
            </button>
          </form>

          <div className="staff-list-section">
            <div className="section-header">
              <Users className="icon-sm" />
              <h3>Added Staff ({staffList.length})</h3>
            </div>

            <div className="staff-list">
              <AnimatePresence mode="popLayout">
                {staffList.length === 0 ? (
                  <motion.p 
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="empty-state"
                  >
                    No staff members added yet.
                  </motion.p>
                ) : (
                  staffList.map((member) => (
                    <motion.div 
                      key={member.id}
                      className="staff-member-item"
                      initial={{ opacity: 0, scale: 0.95, x: -20 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95, x: 20 }}
                      layout
                    >
                      <div className="member-info">
                        <span className="member-name">{member.name}</span>
                        <span className="member-id">ID: {member.staffId}</span>
                      </div>
                      <button 
                        onClick={() => handleRemoveMember(member.id)}
                        className="remove-btn"
                        title="Remove member"
                      >
                        <Trash2 className="icon-xs" />
                      </button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          <button 
            onClick={handleSubmit} 
            className="btn-submit mt-32"
            disabled={staffList.length === 0}
          >
            Continue
            <ArrowRight className="icon-sm" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default AddStaff;
