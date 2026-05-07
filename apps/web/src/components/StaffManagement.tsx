import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, 
  Edit2, 
  Trash2, 
  User, 
  Fingerprint, 
  Phone, 
  X,
  Check,
  Search
} from 'lucide-react';
import DropdownMenu from './DropdownMenu';
import ConfirmModal from './ConfirmModal';
import './StaffManagement.css';

interface Staff {
  id: string;
  name: string;
  staffId: string;
  phone: string;
  status: 'Active' | 'Inactive';
  lastActive: string;
}

const StaffManagement: React.FC = () => {
  const [staffMembers, setStaffMembers] = useState<Staff[]>([
    { id: '1', name: 'Samuel Okon', staffId: 'ID-001', phone: '08012345678', status: 'Active', lastActive: '2 mins ago' },
    { id: '2', name: 'John Doe', staffId: 'ID-002', phone: '08123456789', status: 'Active', lastActive: '45 mins ago' },
    { id: '3', name: 'Mary Jane', staffId: 'ID-003', phone: '07034567890', status: 'Inactive', lastActive: '1 day ago' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    staffId: '',
    phone: '',
    status: 'Active' as 'Active' | 'Inactive'
  });

  const handleOpenModal = (staff?: Staff) => {
    if (staff) {
      setFormData({ ...staff });
      setIsEditing(true);
    } else {
      setFormData({ id: '', name: '', staffId: '', phone: '', status: 'Active' });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      setStaffMembers(staffMembers.map(s => s.id === formData.id ? { ...formData, lastActive: s.lastActive } as Staff : s));
    } else {
      const newStaff: Staff = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        lastActive: 'Never'
      };
      setStaffMembers([...staffMembers, newStaff]);
    }
    handleCloseModal();
  };

  const handleDeleteClick = (id: string) => {
    setStaffToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (staffToDelete) {
      setStaffMembers(staffMembers.filter(s => s.id !== staffToDelete));
      setStaffToDelete(null);
    }
  };

  const toggleStatus = (id: string) => {
    setStaffMembers(staffMembers.map(s => 
      s.id === id ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' } : s
    ));
  };

  return (
    <div className="staff-management">
      <motion.div 
        className="staff-header-actions"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="search-box">
          <Search className="search-icon" size={18} />
          <input type="text" placeholder="Search staff by name or ID..." />
        </div>
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          <UserPlus size={18} />
          <span>Add New Staff</span>
        </button>
      </motion.div>

      <motion.div 
        className="table-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="table-wrapper">
          <table className="staff-table">
            <thead>
              <tr>
                <th>Staff Name</th>
                <th>Staff ID</th>
                <th>Phone Number</th>
                <th>Status</th>
                <th>Last Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {staffMembers.map((staff) => (
                <tr key={staff.id}>
                  <td>
                    <div className="staff-info-cell">
                      <div className="staff-avatar">{staff.name.charAt(0)}</div>
                      <span className="staff-name-bold">{staff.name}</span>
                    </div>
                  </td>
                  <td className="font-mono">{staff.staffId}</td>
                  <td>{staff.phone}</td>
                  <td>
                    <button 
                      className={`status-toggle-btn ${staff.status.toLowerCase()}`}
                      onClick={() => toggleStatus(staff.id)}
                    >
                      <div className="toggle-dot" />
                      {staff.status}
                    </button>
                  </td>
                  <td className="text-muted">{staff.lastActive}</td>
                  <td>
                    <DropdownMenu 
                      options={[
                        { label: 'Edit Staff', icon: <Edit2 size={14} />, onClick: () => handleOpenModal(staff) },
                        { label: 'Deactivate', icon: <X size={14} />, onClick: () => toggleStatus(staff.id) },
                        { label: 'Delete Staff', icon: <Trash2 size={14} />, onClick: () => handleDeleteClick(staff.id), danger: true },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Remove Staff Member?"
        message="This will immediately revoke their access to the mobile capture app and all security features."
        confirmText="Remove Member"
      />

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <motion.div 
              className="modal-content"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>{isEditing ? 'Edit Staff Member' : 'Add New Staff'}</h3>
                <button className="close-modal-btn" onClick={handleCloseModal}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveStaff} className="modal-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <div className="input-wrapper">
                    <User className="input-icon" />
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      required 
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Samuel Okon"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group flex-1">
                    <label htmlFor="staffId">Staff ID</label>
                    <div className="input-wrapper">
                      <Fingerprint className="input-icon" />
                      <input 
                        type="text" 
                        id="staffId" 
                        name="staffId" 
                        required 
                        value={formData.staffId}
                        onChange={handleInputChange}
                        placeholder="ID-001"
                      />
                    </div>
                  </div>
                  <div className="form-group flex-1">
                    <label htmlFor="phone">Phone Number</label>
                    <div className="input-wrapper">
                      <Phone className="input-icon" />
                      <input 
                        type="tel" 
                        id="phone" 
                        name="phone" 
                        required 
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="080..."
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select 
                    id="status" 
                    name="status" 
                    className="modal-select"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn-text" onClick={handleCloseModal}>Cancel</button>
                  <button type="submit" className="btn-primary">
                    <Check size={18} />
                    {isEditing ? 'Update Member' : 'Register Member'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StaffManagement;
