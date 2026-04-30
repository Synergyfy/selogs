import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Smartphone, 
  Tablet, 
  Activity, 
  RefreshCcw, 
  Trash2, 
  Copy, 
  Check,
  ShieldCheck,
  Clock,
  Edit2,
  Lock,
  Plus,
  X
} from 'lucide-react';
import DropdownMenu from './DropdownMenu';
import ConfirmModal from './ConfirmModal';
import './DevicesPage.css';

interface Device {
  id: string;
  name: string;
  type: 'Phone' | 'Tablet' | 'Laptop';
  deviceId: string;
  status: 'Online' | 'Offline';
  lastSync: string;
  location: string;
}

const DevicesPage: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [refreshingId, setRefreshingId] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deviceToUnlink, setDeviceToUnlink] = useState<string | null>(null);
  const orgCode = 'VGRD-8821-X';

  const [devices, setDevices] = useState<Device[]>([
    { id: '1', name: 'Front Gate Tab', type: 'Tablet', deviceId: 'DEV-A982-11', status: 'Online', lastSync: '2 mins ago', location: 'Main Entrance' },
    { id: '2', name: 'Security Phone 1', type: 'Phone', deviceId: 'DEV-B212-45', status: 'Online', lastSync: '15 mins ago', location: 'Roving Patrol' },
    { id: '3', name: 'Back Exit Tab', type: 'Tablet', deviceId: 'DEV-C334-89', status: 'Offline', lastSync: '4 hours ago', location: 'Service Entrance' },
    { id: '4', name: 'Main Office PC', type: 'Laptop', deviceId: 'DEV-D001-02', status: 'Online', lastSync: 'Just now', location: 'Admin Desk' },
  ]);

  const handleCopy = () => {
    navigator.clipboard.writeText(orgCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefreshSync = (id: string) => {
    setRefreshingId(id);
    setTimeout(() => {
      setRefreshingId(null);
      setDevices(prev => prev.map(d => d.id === id ? { ...d, lastSync: 'Just now', status: 'Online' } : d));
    }, 1500);
  };

  const handleUnlinkClick = (id: string) => {
    setDeviceToUnlink(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deviceToUnlink) {
      setDevices(devices.filter(d => d.id !== deviceToUnlink));
      setDeviceToUnlink(null);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'Phone': return <Smartphone size={24} />;
      case 'Tablet': return <Tablet size={24} />;
      default: return <Activity size={24} />;
    }
  };

  return (
    <div className="devices-page">
      <div className="devices-header-grid">
        <motion.div 
          className="org-code-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="card-header-mini">
            <ShieldCheck size={18} className="accent-icon" />
            <span>Organization Code</span>
          </div>
          <div className="org-code-display-compact">
            <span className="code-text-large">{orgCode}</span>
            <button className={`copy-code-btn ${copied ? 'copied' : ''}`} onClick={handleCopy}>
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
          <p className="code-description">Use this code on new devices to link them to this organization.</p>
        </motion.div>

        <motion.div 
          className="devices-stats-mini"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="stat-mini">
            <span className="stat-label">Total Connected</span>
            <span className="stat-value-large">{devices.length}</span>
          </div>
          <div className="stat-mini">
            <span className="stat-label">Currently Online</span>
            <span className="stat-value-large emerald">{devices.filter(d => d.status === 'Online').length}</span>
          </div>
        </motion.div>
      </div>

      <div className="device-cards-grid">
        {devices.map((device, index) => (
          <motion.div 
            key={device.id}
            className={`device-card ${device.status.toLowerCase()}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="device-card-header">
              <div className={`device-icon-box ${device.type.toLowerCase()}`}>
                {getIcon(device.type)}
              </div>
              <div className="device-status-indicator">
                <span className={`status-dot ${device.status.toLowerCase()}`} />
                {device.status}
              </div>
              <DropdownMenu 
                options={[
                  { label: 'Edit Device', icon: <Edit2 size={14} />, onClick: () => {} },
                  { label: 'Lock Access', icon: <Lock size={14} />, onClick: () => {} },
                  { label: 'Unlink Device', icon: <Trash2 size={14} />, onClick: () => handleUnlinkClick(device.id), danger: true },
                ]}
                horizontal
              />
            </div>

            <div className="device-card-body">
              <h3 className="device-name">{device.name}</h3>
              <p className="device-id-mono">{device.deviceId}</p>
              
              <div className="device-meta-row">
                <div className="meta-item">
                  <Clock size={14} />
                  <span>Synced {device.lastSync}</span>
                </div>
                <div className="meta-item">
                  <Activity size={14} />
                  <span>{device.location}</span>
                </div>
              </div>
            </div>

            <div className="device-card-footer">
              <button 
                className={`btn-icon-outline ${refreshingId === device.id ? 'refreshing' : ''}`} 
                onClick={() => handleRefreshSync(device.id)}
                disabled={refreshingId === device.id}
              >
                <RefreshCcw size={16} className={refreshingId === device.id ? 'animate-spin' : ''} />
                <span className="btn-label-mobile">Sync Now</span>
              </button>
              <button 
                className="btn-icon-danger" 
                onClick={() => handleUnlinkClick(device.id)}
              >
                <Trash2 size={16} />
                <span className="btn-label-mobile">Unlink</span>
              </button>
            </div>
          </motion.div>
        ))}

        <motion.button 
          className="add-device-placeholder"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: devices.length * 0.1 }}
          onClick={() => setIsAddModalOpen(true)}
        >
          <div className="plus-icon-circle">
            <Plus size={24} />
          </div>
          <span>Link New Device</span>
          <p>Scan code or enter manually</p>
        </motion.button>
      </div>

      {/* Add Device Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
            <motion.div 
              className="modal-content device-link-modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div className="modal-icon-circle">
                  <Smartphone size={24} />
                </div>
                <h3>Link New Device</h3>
                <p>Follow these steps to connect a new security device.</p>
                <button className="modal-close-btn" onClick={() => setIsAddModalOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              <div className="link-steps">
                <div className="link-step">
                  <div className="step-num">1</div>
                  <p>Open <strong>vguard.app/app</strong> on the target device.</p>
                </div>
                <div className="link-step">
                  <div className="step-num">2</div>
                  <p>Select 'Connect Organization' on the welcome screen.</p>
                </div>
                <div className="link-step">
                  <div className="step-num">3</div>
                  <div className="link-code-box">
                    <p>Enter the code below:</p>
                    <div className="compact-code">
                      <span>{orgCode}</span>
                      <button onClick={handleCopy} className={copied ? 'success' : ''}>
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn btn-primary w-full" onClick={() => setIsAddModalOpen(false)}>
                  I've connected the device
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Unlink Security Device?"
        message="This will immediately revoke this device's access to the capture system. Security personnel using this device will be logged out instantly."
        confirmText="Unlink Device"
      />
    </div>
  );
};

export default DevicesPage;
