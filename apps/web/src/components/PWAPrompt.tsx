import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, X } from 'lucide-react';
import './PWAPrompt.css';

const PWAPrompt: React.FC = () => {
  const sw = useRegisterSW({
    onRegistered(r: ServiceWorkerRegistration | undefined) {
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error: unknown) {
      console.log('SW registration error', error);
    },
  });

  // Safe fallback to prevent destructuring crash
  const {
    offlineReady: [offlineReady, setOfflineReady] = [false, () => {}],
    needUpdate: [needUpdate, setNeedUpdate] = [false, () => {}],
    updateServiceWorker = () => Promise.resolve(),
  } = sw || {};

  const close = () => {
    if (setOfflineReady) setOfflineReady(false);
    if (setNeedUpdate) setNeedUpdate(false);
  };

  return (
    <AnimatePresence>
      {(offlineReady || needUpdate) && (
        <motion.div 
          className="pwa-prompt-container"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
        >
          <div className="pwa-prompt-content">
            <div className="pwa-icon-badge">
              <RefreshCw size={20} className={needUpdate ? 'animate-spin' : ''} />
            </div>
            <div className="pwa-text">
              {offlineReady ? (
                <>
                  <h4>App Ready Offline</h4>
                  <p>System is now cached for offline security use.</p>
                </>
              ) : (
                <>
                  <h4>Update Available</h4>
                  <p>A new version of VGuard is ready for your organization.</p>
                </>
              )}
            </div>
            <div className="pwa-actions">
              {needUpdate && (
                <button className="btn-update" onClick={() => updateServiceWorker(true)}>
                  Update Now
                </button>
              )}
              <button className="btn-close-prompt" onClick={close}>
                <X size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PWAPrompt;
