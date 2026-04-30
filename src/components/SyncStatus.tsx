import React from 'react';
import { Wifi, WifiOff, CloudSync } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SyncStatusProps {
  isOnline: boolean;
  unsyncedCount: number;
}

const SyncStatus: React.FC<SyncStatusProps> = ({ isOnline, unsyncedCount }) => {
  return (
    <div className="sync-status-floating">
      <AnimatePresence mode="wait">
        {!isOnline ? (
          <motion.div 
            key="offline"
            className="sync-pill offline"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <WifiOff size={14} />
            <span>Offline Mode</span>
          </motion.div>
        ) : unsyncedCount > 0 ? (
          <motion.div 
            key="syncing"
            className="sync-pill syncing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <CloudSync size={14} className="animate-pulse" />
            <span>{unsyncedCount} unsynced</span>
          </motion.div>
        ) : (
          <motion.div 
            key="online"
            className="sync-pill online"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Wifi size={14} />
            <span>Connected</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SyncStatus;
