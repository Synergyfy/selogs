import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreVertical, MoreHorizontal } from 'lucide-react';
import './DropdownMenu.css';

interface DropdownOption {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}

interface DropdownMenuProps {
  options: DropdownOption[];
  horizontal?: boolean;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ options, horizontal = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <button 
        className={`dropdown-trigger ${isOpen ? 'active' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        {horizontal ? <MoreHorizontal size={18} /> : <MoreVertical size={18} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="dropdown-menu"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            {options.map((option, index) => (
              <button 
                key={index}
                className={`dropdown-item ${option.danger ? 'danger' : ''}`}
                onClick={() => {
                  option.onClick();
                  setIsOpen(false);
                }}
              >
                {option.icon && <span className="option-icon">{option.icon}</span>}
                <span className="option-label">{option.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DropdownMenu;
