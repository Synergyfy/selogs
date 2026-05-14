import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  MapPin, 
  Building2, 
  X, 
  Edit2, 
  Trash2, 
  DollarSign,
  Loader2
} from 'lucide-react';
import ConfirmModal from './ConfirmModal';
import { useBranchesList, useCreateBranch, useDeleteBranch } from '../hooks/dashboard/useBranches';
import { useMySubscription } from '../hooks/dashboard/useSubscription';
import './Dashboard.css';

const BranchesPage: React.FC = () => {
  const { data: branches = [], isLoading } = useBranchesList();
  const { data: subscription } = useMySubscription();
  const createMutation = useCreateBranch();
  const deleteMutation = useDeleteBranch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState<string | null>(null);
  const [editingBranch, setEditingBranch] = useState<{ id: string; name: string; address: string } | null>(null);
  const [newBranch, setNewBranch] = useState({ name: '', address: '' });

  const handleDelete = (id: string) => {
    setBranchToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (branchToDelete) {
      await deleteMutation.mutateAsync(branchToDelete);
      setBranchToDelete(null);
    }
  };

  const handleOpenModal = (branch?: typeof branches[0]) => {
    if (branch) {
      setEditingBranch({ id: branch.id, name: branch.name, address: branch.address || '' });
    } else {
      setEditingBranch(null);
      setNewBranch({ name: '', address: '' });
    }
    setIsModalOpen(true);
  };

  const handleCreateBranch = async () => {
    const data = editingBranch ?? newBranch;
    if (!data.name) return;

    try {
      if (editingBranch) {
        // Edit not yet implemented — use updateBranch when needed
      } else {
        await createMutation.mutateAsync({ name: newBranch.name, address: newBranch.address });
      }
      setIsModalOpen(false);
      setNewBranch({ name: '', address: '' });
      setEditingBranch(null);
    } catch (err) {
      console.error('Failed to create branch:', err);
      alert('Failed to create branch. Please try again.');
    }
  };

  return (
    <div className="dashboard-overview">
      <div className="card-header" style={{ marginBottom: '0px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Organization Branches</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '14px' }}>Manage multiple locations and security checkpoints.</p>
        </div>
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} />
          Add New Branch
        </button>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
          <Loader2 size={32} className="spin" />
        </div>
      ) : (
        <div className="stats-grid" style={{ marginTop: '24px' }}>
          {branches.map((branch, index) => (
            <motion.div 
              key={branch.id}
              className="content-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{ padding: '24px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div className="stat-icon-wrapper indigo">
                  <Building2 size={24} />
                </div>
                <span className="status-badge synced" style={{ height: 'fit-content' }}>
                  Active
                </span>
              </div>

              <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '4px' }}>{branch.name}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <MapPin size={14} /> {branch.address || 'No address set'}
              </p>
              <p style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-dim)', marginBottom: '20px' }}>
                Code: <strong>{branch.code}</strong>
              </p>

              <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                  <button className="copy-code-btn" onClick={() => handleOpenModal(branch)}><Edit2 size={14} /></button>
                  <button className="copy-code-btn" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(branch.id)}><Trash2 size={14} /></button>
                </div>
              </div>
            </motion.div>
          ))}

          <motion.div 
            className="add-device-placeholder" 
            onClick={() => handleOpenModal()}
            style={{ height: '100%', minHeight: '220px' }}
          >
            <div className="plus-icon-circle"><Plus size={24} /></div>
            <span>Create Branch</span>
          </motion.div>
        </div>
      )}

      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Branch?"
        message="All staff and devices linked to this branch will need to be re-assigned. This action cannot be undone."
      />

      {/* Add / Edit Branch Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <motion.div 
              className="modal-content"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{ padding: '32px', maxWidth: '500px' }}
            >
              <div className="modal-header" style={{ padding: 0, marginBottom: '24px', border: 'none' }}>
                <div>
                   <h3 style={{ fontSize: '22px', fontWeight: 800 }}>{editingBranch ? 'Edit Branch' : 'New Location Setup'}</h3>
                   <p style={{ fontSize: '13px', color: 'var(--text-dim)', marginTop: '4px' }}>Register a new gate or facility checkpoint.</p>
                </div>
                <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
              </div>
              
              <div className="modal-form" style={{ padding: 0 }}>
                <div className="form-group">
                  <label>Branch Name</label>
                  <input 
                    type="text" 
                    className="modal-select" 
                    style={{ background: 'var(--bg-input)' }} 
                    placeholder="e.g. West Wing Terminal"
                    value={editingBranch ? editingBranch.name : newBranch.name}
                    onChange={(e) => editingBranch 
                      ? setEditingBranch({ ...editingBranch, name: e.target.value })
                      : setNewBranch({ ...newBranch, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Address / Zone</label>
                  <input 
                    type="text" 
                    className="modal-select" 
                    style={{ background: 'var(--bg-input)' }} 
                    placeholder="e.g. 12th Floor, Gate A"
                    value={editingBranch ? editingBranch.address : newBranch.address}
                    onChange={(e) => editingBranch 
                      ? setEditingBranch({ ...editingBranch, address: e.target.value })
                      : setNewBranch({ ...newBranch, address: e.target.value })}
                  />
                </div>

                {/* Subscription info summary */}
                <div style={{ marginTop: '24px', padding: '16px', background: 'var(--bg-input)', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '13px' }}>
                      <span style={{ color: 'var(--text-dim)' }}>Current Plan</span>
                      <span className="font-bold">{subscription?.planName || 'Unknown'}</span>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '13px' }}>
                      <span style={{ color: 'var(--text-dim)' }}>Active Branches</span>
                      <span className="font-bold">{branches.length}</span>
                   </div>
                   <div style={{ height: '1px', background: 'var(--border-light)', margin: '12px 0' }} />
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                         <DollarSign size={18} className="text-gradient" />
                         <span style={{ fontWeight: 700 }}>Status</span>
                      </div>
                      <span className={`status-badge ${subscription?.status === 'active' ? 'synced' : 'pending'}`}>
                        {subscription?.status?.toUpperCase() || 'UNKNOWN'}
                      </span>
                   </div>
                </div>

                <div className="modal-footer" style={{ border: 'none', padding: 0, marginTop: '32px' }}>
                  <button className="btn-text" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button 
                    className="btn-primary" 
                    onClick={handleCreateBranch}
                    disabled={createMutation.isPending || !(editingBranch ? editingBranch.name : newBranch.name)}
                  >
                    {createMutation.isPending ? <Loader2 size={16} className="spin" /> : null}
                    {editingBranch ? 'Update Branch' : 'Confirm & Create Branch'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BranchesPage;
