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
  Search,
  Loader2
} from 'lucide-react';
import { useStaffList, useCreateStaff, useUpdateStaff, useDeleteStaff } from '../hooks/dashboard/useStaff';
import { useBranchesList } from '../hooks/dashboard/useBranches';
import type { StaffMember } from '../types/dashboard';
import DropdownMenu from './DropdownMenu';
import ConfirmModal from './ConfirmModal';
import './StaffManagement.css';

const StaffManagement: React.FC = () => {
  // API Hooks
  const { data: staffMembers = [] } = useStaffList();
  const { data: branches = [] } = useBranchesList();
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
    branchId: '',
    role: 'guard' as 'supervisor' | 'guard',
  });

  const handleOpenModal = (staff?: StaffMember) => {
    if (staff) {
      setFormData({ 
        id: staff.id, 
        fullName: staff.fullName || '', 
        email: staff.email, 
        branchId: staff.branchId || '',
        role: (staff.role as 'supervisor' | 'guard') || 'guard'
      });
      setIsEditing(true);
    } else {
      setFormData({ id: '', fullName: '', email: '', branchId: branches[0]?.id || '', role: 'guard' });
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
          data: { 
            fullName: formData.fullName, 
            role: formData.role,
            branchId: formData.branchId 
          } 
        });
      } else {
        await createMutation.mutateAsync({
          fullName: formData.fullName,
          email: formData.email,
          role: formData.role,
          branchId: formData.branchId,
          password: 'Password123!', // Temporary default password for new staff
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

      {/* Improved Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <motion.div 
              className="modal-content premium-modal"
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header-premium">
                <div className="modal-icon-badge">
                  {isEditing ? <Edit2 size={24} /> : <UserPlus size={24} />}
                </div>
                <div className="modal-header-text">
                  <h3>{isEditing ? 'Edit Staff Member' : 'Register New Staff'}</h3>
                  <p>{isEditing ? 'Update personnel details and access level.' : 'Add a new guard or supervisor to your organization.'}</p>
                </div>
                <button className="close-modal-btn-circle" onClick={handleCloseModal}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveStaff} className="modal-form-premium">
                <div className="form-section">
                  <h4 className="section-label">Personal Information</h4>
                  <div className="form-group">
                    <label htmlFor="fullName">Full Name</label>
                    <div className="input-wrapper-premium">
                      <User className="input-icon" size={18} />
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
                    <div className="input-wrapper-premium">
                      <Mail className="input-icon" size={18} />
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
                </div>

                <div className="form-section">
                  <h4 className="section-label">Assignment & Role</h4>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label htmlFor="role">Platform Role</label>
                      <select 
                        id="role" 
                        name="role" 
                        className="select-premium"
                        value={formData.role}
                        onChange={handleInputChange}
                      >
                        <option value="supervisor">Supervisor (Full Access)</option>
                        <option value="guard">Security Guard</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="branchId">Assigned Branch</label>
                      <select 
                        id="branchId" 
                        name="branchId" 
                        className="select-premium"
                        value={formData.branchId}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="" disabled>Select a location</option>
                        {branches.map(b => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="modal-footer-premium">
                  <button type="button" className="btn-text" onClick={handleCloseModal}>Cancel</button>
                  <button 
                    type="submit" 
                    className={`btn-primary-premium ${(createMutation.isPending || updateMutation.isPending) ? 'loading' : ''}`}
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {(createMutation.isPending || updateMutation.isPending) ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <>
                        <Check size={18} />
                        <span>{isEditing ? 'Update Profile' : 'Complete Registration'}</span>
                      </>
                    )}
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
