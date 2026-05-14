import React, { useState, useMemo } from 'react';
import { History as HistoryIcon, ArrowLeft, Clock, User, Hash, CheckCircle2, Circle, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db, type VehicleEntry } from '../services/db';

interface HistoryProps {
  onBack: () => void;
}

import { useLiveQuery } from 'dexie-react-hooks';

const History: React.FC<HistoryProps> = ({ onBack }) => {
  const entries = useLiveQuery(() => 
    db.entries.orderBy('timestamp').reverse().toArray()
  ) || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'synced' | 'unsynced'>('all');
  const [showSearch, setShowSearch] = useState(false);

  // Apply search and filter via useMemo to avoid cascading renders
  const filteredEntries = useMemo(() => {
    let result = [...entries];

    // Apply search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(e => 
        e.plateNumber.toLowerCase().includes(q) ||
        e.phoneNumber?.toLowerCase().includes(q) ||
        e.staffId.toLowerCase().includes(q) ||
        e.staffName?.toLowerCase().includes(q)
      );
    }

    // Apply filter
    if (filterMode === 'synced') {
      result = result.filter(e => e.synced);
    } else if (filterMode === 'unsynced') {
      result = result.filter(e => !e.synced);
    }

    return result;
  }, [searchQuery, filterMode, entries]);

  // Group entries by date
  const groupedEntries = filteredEntries.reduce((groups, entry) => {
    const date = new Date(entry.timestamp).toLocaleDateString([], { 
      weekday: 'short', month: 'short', day: 'numeric' 
    });
    if (!groups[date]) groups[date] = [];
    groups[date].push(entry);
    return groups;
  }, {} as Record<string, VehicleEntry[]>);

  return (
    <motion.div 
      className="history-screen"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="history-header">
        <button onClick={onBack} className="btn-icon">
          <ArrowLeft size={22} />
        </button>
        <h2 className="history-title">Entry History</h2>
        <button 
          className={`btn-icon ${showSearch ? 'active' : ''}`} 
          onClick={() => setShowSearch(!showSearch)}
        >
          {showSearch ? <X size={18} /> : <Search size={18} />}
        </button>
      </div>

      {/* Search Bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            className="history-search"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="history-search-input-wrap">
              <Search size={16} className="history-search-icon" />
              <input
                className="history-search-input"
                placeholder="Search plate, phone, or staff..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              {searchQuery && (
                <button className="history-search-clear" onClick={() => setSearchQuery('')}>
                  <X size={14} />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Tabs */}
      <div className="history-filters">
        <button 
          className={`history-filter-tab ${filterMode === 'all' ? 'active' : ''}`}
          onClick={() => setFilterMode('all')}
        >
          All ({entries.length})
        </button>
        <button 
          className={`history-filter-tab ${filterMode === 'synced' ? 'active' : ''}`}
          onClick={() => setFilterMode('synced')}
        >
          <CheckCircle2 size={12} /> Synced
        </button>
        <button 
          className={`history-filter-tab ${filterMode === 'unsynced' ? 'active' : ''}`}
          onClick={() => setFilterMode('unsynced')}
        >
          <Circle size={12} /> Pending
        </button>
      </div>

      {/* Content */}
      {filteredEntries.length === 0 ? (
        <div className="history-empty">
          <div className="history-empty-icon">
            {searchQuery ? <Search size={48} /> : <HistoryIcon size={48} />}
          </div>
          <p className="history-empty-text">
            {searchQuery 
              ? `No results for "${searchQuery}"` 
              : 'No records found yet.'
            }
          </p>
          {searchQuery && (
            <button className="btn btn-ghost btn-sm" onClick={() => setSearchQuery('')}>
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="history-list">
          {Object.entries(groupedEntries).map(([date, dateEntries]) => (
            <div key={date} className="history-group">
              <div className="history-group-header">
                <span>{date}</span>
                <span className="history-group-count">{dateEntries.length} entries</span>
              </div>
              {dateEntries.map((entry, index) => (
                <motion.div 
                  key={entry.id} 
                  className="card history-entry"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <div className="history-entry-top">
                    <div>
                      <div className="history-entry-plate">{entry.plateNumber}</div>
                      <div className="history-entry-time">
                        <Clock size={12} />
                        {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </div>
                    </div>
                    {entry.synced ? (
                      <span className="badge badge-success">
                        <CheckCircle2 size={10} /> Synced
                      </span>
                    ) : (
                      <span className="badge badge-warning">
                        <Circle size={10} /> Pending
                      </span>
                    )}
                  </div>

                  <div className="history-entry-meta">
                    <div className="history-entry-meta-item">
                      <User size={13} />
                      <span>{entry.staffName || entry.staffId}</span>
                    </div>
                    {entry.phoneNumber && (
                      <div className="history-entry-meta-item">
                        <Hash size={13} />
                        <span>{entry.phoneNumber}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Results count */}
      {filteredEntries.length > 0 && (
        <div className="history-results-count">
          Showing {filteredEntries.length} of {entries.length} records
        </div>
      )}
    </motion.div>
  );
};

export default History;
