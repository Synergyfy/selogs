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
  AlertCircle
} from 'lucide-react';
import ConfirmModal from './ConfirmModal';
import './Dashboard.css';

interface Branch {
  id: string;
  name: string;
  address: string;
  staffCount: number;
  deviceCount: number;
  status: 'Active' | 'Inactive';
}

const BranchesPage: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([
    { id: '1', name: 'Main HQ', address: 'Victoria Island, Lagos', staffCount: 12, deviceCount: 4, status: 'Active' },
    { id: '2', name: 'Ikeja Branch', address: 'Allen Avenue, Ikeja', staffCount: 8, deviceCount: 2, status: 'Active' },
    { id: '3', name: 'Abuja Regional', address: 'Maitama, Abuja', staffCount: 5, deviceCount: 3, status: 'Inactive' },
  ]);

  // Mock Plan Data
  const planInfo = {
    name: 'Business',
    includedBranches: 2, // Only 2 included in mock Business plan to trigger cost for new ones
    extraBranchCost: 2000
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState<string | null>(null);
  
  // New Branch Form State
  const [newBranch, setNewBranch] = useState({ name: '', address: '' });

  const isOverLimit = branches.length >= planInfo.includedBranches;
  const additionalCost = isOverLimit ? planInfo.extraBranchCost : 0;

  const handleDelete = (id: string) => {
    setBranchToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleCreateBranch = () => {
    if (!newBranch.name || !newBranch.address) return;
    
    const branch: Branch = {
      id: Math.random().toString(36).substr(2, 9),
      name: newBranch.name,
      address: newBranch.address,
      staffCount: 0,
      deviceCount: 0,
      status: 'Active'
    };
    
    setBranches([...branches, branch]);
    setIsModalOpen(false);
    setNewBranch({ name: '', address: '' });
  };

  return (
    <div className="dashboard-overview">
      <div className="card-header" style={{ marginBottom: '0px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Organization Branches</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '14px' }}>Manage multiple locations and security checkpoints.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          Add New Branch
        </button>
      </div>

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
              <span className={`status-badge ${branch.status === 'Active' ? 'synced' : ''}`} style={{ height: 'fit-content' }}>
                {branch.status}
              </span>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '4px' }}>{branch.name}</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px' }}>
              <MapPin size={14} /> {branch.address}
            </p>

            <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Staff</span>
                <span style={{ fontWeight: 800 }}>{branch.staffCount}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Devices</span>
                <span style={{ fontWeight: 800 }}>{branch.deviceCount}</span>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                <button className="copy-code-btn"><Edit2 size={14} /></button>
                <button className="copy-code-btn" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(branch.id)}><Trash2 size={14} /></button>
              </div>
            </div>
          </motion.div>
        ))}

        <motion.div 
          className="add-device-placeholder" 
          onClick={() => setIsModalOpen(true)}
          style={{ height: '100%', minHeight: '220px' }}
        >
          <div className="plus-icon-circle"><Plus size={24} /></div>
          <span>Create Branch</span>
        </motion.div>
      </div>

      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          setBranches(branches.filter(b => b.id !== branchToDelete));
          setIsConfirmOpen(false);
        }}
        title="Delete Branch?"
        message="All staff and devices linked to this branch will need to be re-assigned. This action cannot be undone."
      />

      {/* Add Branch Modal with Pricing Logic */}
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
                   <h3 style={{ fontSize: '22px', fontWeight: 800 }}>New Location Setup</h3>
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
                    value={newBranch.name}
                    onChange={(e) => setNewBranch({...newBranch, name: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Address / Zone</label>
                  <input 
                    type="text" 
                    className="modal-select" 
                    style={{ background: 'var(--bg-input)' }} 
                    placeholder="e.g. 12th Floor, Gate A"
                    value={newBranch.address}
                    onChange={(e) => setNewBranch({...newBranch, address: e.target.value})}
                  />
                </div>

                {/* Pricing Summary Logic */}
                <div style={{ marginTop: '24px', padding: '16px', background: 'var(--bg-input)', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '13px' }}>
                      <span style={{ color: 'var(--text-dim)' }}>Plan Limit ({planInfo.name})</span>
                      <span className="font-bold">{planInfo.includedBranches} Included</span>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '13px' }}>
                      <span style={{ color: 'var(--text-dim)' }}>Current Usage</span>
                      <span className="font-bold">{branches.length} Active</span>
                   </div>
                   <div style={{ height: '1px', background: 'var(--border-light)', margin: '12px 0' }} />
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                         <DollarSign size={18} className="text-gradient" />
                         <span style={{ fontWeight: 700 }}>Additional Cost</span>
                      </div>
                      <span style={{ fontWeight: 800, fontSize: '18px', color: additionalCost > 0 ? 'var(--accent)' : 'inherit' }}>
                         ₦{additionalCost.toLocaleString()}
                         <span style={{ fontSize: '12px', color: 'var(--text-dim)', fontWeight: 400 }}>/mo</span>
                      </span>
                   </div>
                </div>

                {additionalCost > 0 && (
                   <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '12px', display: 'flex', gap: '10px', alignItems: 'center', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                      <AlertCircle size={18} style={{ color: 'var(--danger)' }} />
                      <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Adding this branch will update your monthly subscription to <strong>₦17,000</strong>.</p>
                   </div>
                )}

                <div className="modal-footer" style={{ border: 'none', padding: 0, marginTop: '32px' }}>
                  <button className="btn-text" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button 
                    className="btn-primary" 
                    onClick={handleCreateBranch}
                    disabled={!newBranch.name || !newBranch.address}
                  >
                    Confirm & Create Branch
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
