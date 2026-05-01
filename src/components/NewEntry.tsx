import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, X, Check, Loader2, Edit3, Phone, RotateCcw, StickyNote, AlertCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { performOCR } from '../services/ocr';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../services/db';

interface NewEntryProps {
  onSave: (data: { plateNumber: string; phoneNumber?: string; notes?: string; image?: Blob }) => void;
  onCancel: () => void;
}

const NewEntry: React.FC<NewEntryProps> = ({ onSave, onCancel }) => {
  const [phase, setPhase] = useState<'capture' | 'review'>('capture');
  const [image, setImage] = useState<string | null>(null);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [plateNumber, setPlateNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrConfidence, setOcrConfidence] = useState<'high' | 'low' | null>(null);
  const [ocrSource, setOcrSource] = useState<'Cloud' | 'Local' | null>(null);
  const [showNotes, setShowNotes] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  // Lookup existing record for the plate
  const lastEntry = useLiveQuery(
    async () => {
      if (plateNumber.length < 3) return null;
      return await db.entries
        .where('plateNumber')
        .equals(plateNumber.trim().toUpperCase())
        .reverse()
        .sortBy('timestamp');
    },
    [plateNumber]
  )?.[0];

  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      // Haptic feedback
      if (navigator.vibrate) navigator.vibrate(50);
      
      setImage(imageSrc);
      setPhase('review');
      setIsProcessing(true);
      setOcrConfidence(null);
      
      try {
        const res = await fetch(imageSrc);
        const blob = await res.blob();
        setImageBlob(blob);
        
        const result = await performOCR(blob);
        
        setPlateNumber(result.text);
        setOcrSource(result.isCloud ? 'Cloud' : 'Local');
        
        // Show confidence based on actual score
        if (result.confidence > 85) setOcrConfidence('high');
        else if (result.confidence > 0) setOcrConfidence('low');
        
        // Store cloud status in metadata if needed for UI
      } catch (err) {
        console.error('OCR failed', err);
        setOcrConfidence('low');
      } finally {
        setIsProcessing(false);
      }
    }
  }, [webcamRef]);

  const handleSave = () => {
    if (plateNumber.trim()) {
      if (navigator.vibrate) navigator.vibrate([30, 20, 30]);
      onSave({ 
        plateNumber: plateNumber.trim(), 
        phoneNumber: phoneNumber.trim() || undefined,
        notes: notes.trim() || undefined,
        image: imageBlob || undefined
      });
    }
  };

  const handleRetake = () => {
    setPhase('capture');
    setPlateNumber('');
    setPhoneNumber('');
    setNotes('');
    setOcrConfidence(null);
    setShowNotes(false);
  };

  return (
    <div className="camera-screen">
      <AnimatePresence mode="wait">
        {phase === 'capture' ? (
          <motion.div 
            key="capture"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: 'flex', flexDirection: 'column', flex: 1 }}
          >
            <div className="camera-viewport">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: 'environment' }}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              
              <div className="camera-overlay">
                <div className="scanner-frame">
                  <div className="scanner-line" />
                  <div className="corner tl" />
                  <div className="corner tr" />
                  <div className="corner bl" />
                  <div className="corner br" />
                </div>
                <div className="camera-guide-badge">
                  <Camera size={12} />
                  <span className="camera-guide-text">Align Number Plate Inside Frame</span>
                </div>
              </div>

              <div className="camera-close">
                <button onClick={onCancel} className="btn-icon">
                  <X size={22} />
                </button>
              </div>
            </div>

            <div className="camera-controls">
              <button onClick={onCancel} className="camera-side-btn">
                <X size={20} />
              </button>
              <button onClick={capture} className="camera-shutter">
                <div className="camera-shutter-inner">
                  <Camera size={28} />
                </div>
              </button>
              <div className="camera-side-btn" style={{ visibility: 'hidden' }}>
                <X size={20} />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="review"
            className="review-screen"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Captured Image */}
            <div className="review-image-card">
              <div className="review-image">
                {image && <img src={image} alt="Captured plate" />}
                {isProcessing && (
                  <div className="review-processing">
                    <Loader2 size={28} className="animate-spin" />
                    <span className="review-processing-text">Analyzing Plate...</span>
                  </div>
                )}
              </div>
            </div>

            {/* OCR Confidence */}
            {ocrConfidence && !isProcessing && (
              <motion.div 
                className={`ocr-confidence ${ocrConfidence}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                  {ocrConfidence === 'high' ? (
                    <>
                      <Check size={14} />
                      <span>Plate detected with high confidence</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={14} />
                      <span>Low confidence — please verify manually</span>
                    </>
                  )}
                </div>
                {ocrSource && (
                  <span className={`ocr-source-badge ${ocrSource.toLowerCase()}`}>
                    {ocrSource}
                  </span>
                )}
              </motion.div>
            )}

            {/* Entry Form */}
            <div className="review-form card">
              <div className="form-group">
                <label className="form-label">
                  <Edit3 size={14} className="text-accent" /> Plate Number *
                </label>
                <input 
                  className="form-input form-input-lg"
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                  placeholder="ABC-1234"
                  disabled={isProcessing}
                  autoFocus={!isProcessing}
                />

                {/* Plate Verification Badge */}
                {lastEntry && !isProcessing && (
                  <motion.div 
                    className={`plate-status-badge ${lastEntry.status === 'IN' ? 'warning' : 'info'}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <div className="status-badge-content">
                      {lastEntry.status === 'IN' ? (
                        <>
                          <AlertCircle size={14} className="text-warning" />
                          <div>
                            <strong>Already Checked In</strong>
                            <p>Logged {new Date(lastEntry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} by {lastEntry.staffName || 'Staff'}</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <Clock size={14} className="text-blue" />
                          <div>
                            <strong>Last Seen</strong>
                            <p>Exited at {new Date(lastEntry.checkOutTimestamp || lastEntry.timestamp).toLocaleDateString()} {new Date(lastEntry.checkOutTimestamp || lastEntry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Phone size={14} className="text-accent" /> Driver Contact (Optional)
                </label>
                <input 
                  className="form-input"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g. 0801 234 5678"
                  disabled={isProcessing}
                />
              </div>

              {/* Notes toggle */}
              {!showNotes ? (
                <button 
                  className="add-notes-btn" 
                  onClick={() => setShowNotes(true)}
                  type="button"
                >
                  <StickyNote size={14} />
                  Add Notes
                </button>
              ) : (
                <motion.div 
                  className="form-group"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <label className="form-label">
                    <StickyNote size={14} className="text-accent" /> Notes (Optional)
                  </label>
                  <textarea
                    className="form-input form-textarea"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. White Toyota Camry, visiting Unit 5..."
                    rows={2}
                    disabled={isProcessing}
                  />
                </motion.div>
              )}
            </div>

            {/* Actions */}
            <div className="review-actions">
              <button 
                onClick={handleRetake}
                className="btn btn-secondary"
                disabled={isProcessing}
              >
                <RotateCcw size={16} />
                Retake
              </button>
              <button 
                onClick={handleSave}
                className="btn btn-primary"
                disabled={isProcessing || !plateNumber.trim()}
              >
                <Check size={18} />
                Confirm Entry
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NewEntry;
