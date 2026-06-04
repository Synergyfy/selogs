import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  X,
  Edit2,
  Trash2,
  LogIn,
  LogOut,
  ArrowLeftRight,
  Building2,
  Loader2,
} from 'lucide-react';
import ConfirmModal from './ConfirmModal';
import { useGatesList, useCreateGate, useUpdateGate, useDeleteGate } from '../hooks/dashboard/useGates';
import { useBranchesList } from '../hooks/dashboard/useBranches';
import type { GateType, Gate } from '../services/GatesService';
import './Dashboard.css';

const gateTypeConfig: Record<GateType, { label: string; icon: React.ReactNode; color: string }> = {
  ENTRY: { label: 'Entry', icon: <LogIn size={16} />, color: 'var(--success)' },
  EXIT: { label: 'Exit', icon: <LogOut size={16} />, color: 'var(--danger)' },
  BOTH: { label: 'Entry/Exit', icon: <ArrowLeftRight size={16} />, color: 'var(--accent)' },
};

const GatesPage: React.FC = () => {
  const { data: gates = [], isLoading } = useGatesList();
  const { data: branches = [] } = useBranchesList();
  const createMutation = useCreateGate();
  const updateMutation = useUpdateGate();
  const deleteMutation = useDeleteGate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [gateToDelete, setGateToDelete] = useState<string | null>(null);
  const [editingGate, setEditingGate] = useState<{
    id: string;
    name: string;
    type: GateType;
    branchId: string;
  } | null>(null);
  const [formData, setFormData] = useState({ name: '', type: 'BOTH' as GateType, branchId: '' });

  const resetForm = () => {
    setFormData({ name: '', type: 'BOTH', branchId: '' });
    setEditingGate(null);
  };

  const handleOpenModal = (gate?: Gate) => {
    if (gate) {
      setEditingGate({ id: gate.id, name: gate.name, type: gate.type, branchId: gate.branchId });
      setFormData({ name: gate.name, type: gate.type, branchId: gate.branchId });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.branchId) return;

    try {
      if (editingGate) {
        await updateMutation.mutateAsync({
          id: editingGate.id,
          data: { name: formData.name, type: formData.type, branchId: formData.branchId },
        });
      } else {
        await createMutation.mutateAsync({ name: formData.name, type: formData.type, branchId: formData.branchId });
      }
      setIsModalOpen(false);
      resetForm();
    } catch {
      alert('Failed to save gate. Please try again.');
    }
  };

  const handleDelete = (id: string) => {
    setGateToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (gateToDelete) {
      await deleteMutation.mutateAsync(gateToDelete);
      setGateToDelete(null);
    }
  };

  return (
    <div className="dashboard-overview">
      <div className="card-header" style={{ marginBottom: '0px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Gate Management</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '14px' }}>Manage entry and exit points across your branches.</p>
        </div>
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} />
          Add New Gate
        </button>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
          <Loader2 size={32} className="spin" />
        </div>
      ) : (
        <div className="stats-grid" style={{ marginTop: '24px' }}>
          {gates.map((gate, index) => {
            const cfg = gateTypeConfig[gate.type];
            return (
              <motion.div
                key={gate.id}
                className="content-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{ padding: '24px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div className="stat-icon-wrapper blue">
                    <ArrowLeftRight size={24} />
                  </div>
                  <span
                    className="status-badge synced"
                    style={{ height: 'fit-content', color: cfg.color, borderColor: cfg.color }}
                  >
                    {cfg.icon}
                    <span style={{ marginLeft: '4px' }}>{cfg.label}</span>
                  </span>
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '4px' }}>{gate.name}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px' }}>
                  <Building2 size={14} /> {gate.branchName}
                </p>

                <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                    <button className="copy-code-btn" onClick={() => handleOpenModal(gate)}><Edit2 size={14} /></button>
                    <button className="copy-code-btn" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(gate.id)}><Trash2 size={14} /></button>
                  </div>
                </div>
              </motion.div>
            );
          })}

          <motion.div
            className="add-device-placeholder"
            onClick={() => handleOpenModal()}
            style={{ height: '100%', minHeight: '220px' }}
          >
            <div className="plus-icon-circle"><Plus size={24} /></div>
            <span>Create Gate</span>
          </motion.div>
        </div>
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Gate?"
        message="Vehicles checked in through this gate will retain their records, but the gate will be permanently removed."
      />

      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-overlay" onClick={() => { setIsModalOpen(false); resetForm(); }}>
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
                  <h3 style={{ fontSize: '22px', fontWeight: 800 }}>{editingGate ? 'Edit Gate' : 'New Gate Setup'}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-dim)', marginTop: '4px' }}>Configure a new entry or exit point.</p>
                </div>
                <button className="close-modal-btn" onClick={() => { setIsModalOpen(false); resetForm(); }}><X size={20} /></button>
              </div>

              <div className="modal-form" style={{ padding: 0 }}>
                <div className="form-group">
                  <label>Gate Name</label>
                  <input
                    type="text"
                    className="modal-select"
                    style={{ background: 'var(--bg-input)' }}
                    placeholder="e.g. Main Entrance"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Gate Type</label>
                  <select
                    className="modal-select"
                    style={{ background: 'var(--bg-input)' }}
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as GateType })}
                  >
                    <option value="BOTH">Entry & Exit</option>
                    <option value="ENTRY">Entry Only</option>
                    <option value="EXIT">Exit Only</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Assigned Branch</label>
                  <select
                    className="modal-select"
                    style={{ background: 'var(--bg-input)' }}
                    value={formData.branchId}
                    onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                  >
                    <option value="">Select a branch...</option>
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div className="modal-footer" style={{ border: 'none', padding: 0, marginTop: '32px' }}>
                  <button className="btn-text" onClick={() => { setIsModalOpen(false); resetForm(); }}>Cancel</button>
                  <button
                    className="btn-primary"
                    onClick={handleSave}
                    disabled={
                      (createMutation.isPending || updateMutation.isPending) ||
                      !formData.name ||
                      !formData.branchId
                    }
                  >
                    {(createMutation.isPending || updateMutation.isPending) ? <Loader2 size={16} className="spin" /> : null}
                    {editingGate ? 'Update Gate' : 'Create Gate'}
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

export default GatesPage;
