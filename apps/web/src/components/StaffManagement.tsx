import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, 
  Edit2, 
  Trash2, 
  User, 
  Fingerprint, 
  Mail,
  X,
  Check,
  Search
} from 'lucide-react';
import { useStaffList, useCreateStaff, useUpdateStaff, useDeleteStaff } from '../hooks/dashboard/useStaff';
import type { StaffMember } from '../types/dashboard';
import DropdownMenu from './DropdownMenu';
import ConfirmModal from './ConfirmModal';
import './StaffManagement.css';

const StaffManagement: React.FC = () => {
  // API Hooks
  const { data: staffMembers = [] } = useStaffList();
  const createMutation = useCreateStaff();
  const updateMutation = useUpdateStaff();
  const deleteMutation = useDeleteStaff();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    fullName: '',
    email: '',
    staffId: '',
    role: 'guard' as 'supervisor' | 'guard',
  });

  const handleOpenModal = (staff?: StaffMember) => {
    if (staff) {
      setFormData({ 
        id: staff.id, 
        fullName: staff.fullName || '', 
        email: staff.email, 
        staffId: staff.staffId || '', 
        role: (staff.role as 'supervisor' | 'guard') || 'guard'
      });
      setIsEditing(true);
    } else {
      setFormData({ id: '', fullName: '', email: '', staffId: '', role: 'guard' });
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

  const handleSaveStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ 
          id: formData.id, 
          data: { fullName: formData.fullName, role: formData.role } 
        });
      } else {
        await createMutation.mutateAsync({
          fullName: formData.fullName,
          email: formData.email,
          staffId: formData.staffId,
          role: formData.role,
        });
      }
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save staff:', error);
      alert('Error saving staff member. Please check if email or Staff ID already exists.');
    }
  };

  const handleDeleteClick = (id: string) => {
    setStaffToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (staffToDelete) {
      await deleteMutation.mutateAsync(staffToDelete);
      setStaffToDelete(null);
    }
  };

  const toggleStatus = () => {
    // Backend doesn't have a specific status toggle, we could use update role or similar
    // For now we'll skip this or implement if status is added to DB
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
                      <div className="staff-avatar">{(staff.fullName || staff.email).charAt(0)}</div>
                      <span className="staff-name-bold">{staff.fullName || 'No Name'}</span>
                    </div>
                  </td>
                  <td className="font-mono">{staff.staffId}</td>
                  <td>{staff.email}</td>
                  <td>
                    <span className={`status-badge synced`}>
                      {staff.role}
                    </span>
                  </td>
                  <td className="text-muted">{new Date(staff.createdAt).toLocaleDateString()}</td>
                  <td>
                    <DropdownMenu 
                      options={[
                        { label: 'Edit Staff', icon: <Edit2 size={14} />, onClick: () => handleOpenModal(staff) },
                        { label: 'Deactivate', icon: <X size={14} />, onClick: () => toggleStatus() },
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
                  <label htmlFor="fullName">Full Name</label>
                  <div className="input-wrapper">
                    <User className="input-icon" />
                    <input 
                      type="text" 
                      id="fullName" 
                      name="fullName" 
                      required 
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. Samuel Okon"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <div className="input-wrapper">
                    <Mail className="input-icon" />
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      required 
                      disabled={isEditing}
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="samuel@example.com"
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
                        disabled={isEditing}
                        value={formData.staffId}
                        onChange={handleInputChange}
                        placeholder="ID-001"
                      />
                    </div>
                  </div>
                  <div className="form-group flex-1">
                    <label htmlFor="role">Role</label>
                    <select 
                      id="role" 
                      name="role" 
                      className="modal-select"
                      value={formData.role}
                      onChange={handleInputChange}
                    >
                      <option value="supervisor">Supervisor</option>
                      <option value="guard">Guard</option>
                    </select>
                  </div>
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
