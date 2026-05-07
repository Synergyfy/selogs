import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import './ConfirmModal.css';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm',
  type = 'danger'
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay" onClick={onClose}>
          <motion.div 
            className={`confirm-modal ${type}`}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="confirm-modal-header">
              <div className="warning-icon-bg">
                <AlertTriangle size={24} />
              </div>
              <button className="close-confirm-btn" onClick={onClose}>
                <X size={20} />
              </button>
            </div>

            <div className="confirm-modal-content">
              <h3>{title}</h3>
              <p>{message}</p>
              
              {type === 'danger' && (
                <div className="danger-alert-box">
                  <strong>Warning:</strong> This action is permanent and cannot be undone.
                </div>
              )}
            </div>

            <div className="confirm-modal-footer">
              <button className="btn-text" onClick={onClose}>Cancel</button>
              <button 
                className={`btn-confirm ${type}`} 
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
