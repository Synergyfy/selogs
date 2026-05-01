import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Download, 
  Calendar, 
  User, 
  ChevronLeft,
  ChevronRight,
  Trash2,
  ExternalLink,
  Edit2
} from 'lucide-react';
import DropdownMenu from './DropdownMenu';
import ConfirmModal from './ConfirmModal';
import './EntriesPage.css';

interface Entry {
  id: string;
  plate: string;
  phone: string;
  timestamp: string;
  staff: string;
  device: string;
  status: 'IN' | 'OUT';
  checkOutTime?: string;
  duration?: string;
}

const EntriesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [staffFilter, setStaffFilter] = useState('All Staff');
  const [dateFilter, setDateFilter] = useState('Today');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);

  // Mock data
  const [entries, setEntries] = useState<Entry[]>([
    { id: '1', plate: 'ABC-123-XY', phone: '08012345678', timestamp: '2026-04-30 11:20 AM', staff: 'Samuel Okon', device: 'Tab-01', status: 'OUT', checkOutTime: '2026-04-30 01:45 PM', duration: '2h 25m' },
    { id: '2', plate: 'LAG-456-ZZ', phone: '08123456789', timestamp: '2026-04-30 10:45 AM', staff: 'Samuel Okon', device: 'Tab-01', status: 'IN' },
    { id: '3', plate: 'KND-789-AA', phone: '07034567890', timestamp: '2026-04-30 09:15 AM', staff: 'John Doe', device: 'Tab-02', status: 'OUT', checkOutTime: '2026-04-30 12:30 PM', duration: '3h 15m' },
    { id: '4', plate: 'PHC-321-BB', phone: '09045678901', timestamp: '2026-04-29 04:30 PM', staff: 'Mary Jane', device: 'Phone-A', status: 'OUT', checkOutTime: '2026-04-29 06:10 PM', duration: '1h 40m' },
    { id: '5', plate: 'ABJ-654-CC', phone: '08056789012', timestamp: '2026-04-29 02:10 PM', staff: 'John Doe', device: 'Tab-02', status: 'IN' },
    { id: '6', plate: 'ENU-987-DD', phone: '08167890123', timestamp: '2026-04-29 11:05 AM', staff: 'Samuel Okon', device: 'Tab-01', status: 'OUT', checkOutTime: '2026-04-29 03:20 PM', duration: '4h 15m' },
    { id: '7', plate: 'BEN-159-EE', phone: '07078901234', timestamp: '2026-04-28 05:50 PM', staff: 'Mary Jane', device: 'Phone-A', status: 'OUT', checkOutTime: '2026-04-28 07:05 PM', duration: '1h 15m' },
    { id: '8', plate: 'KDY-753-FF', phone: '09089012345', timestamp: '2026-04-28 03:20 PM', staff: 'John Doe', device: 'Tab-02', status: 'OUT', checkOutTime: '2026-04-28 05:00 PM', duration: '1h 40m' },
  ]);

  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const matchesSearch = entry.plate.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStaff = staffFilter === 'All Staff' || entry.staff === staffFilter;
      
      // Simple date filter logic for mock
      let matchesDate = true;
      if (dateFilter === 'Today') matchesDate = entry.timestamp.includes('2026-04-30');
      else if (dateFilter === 'Yesterday') matchesDate = entry.timestamp.includes('2026-04-29');

      return matchesSearch && matchesStaff && matchesDate;
    });
  }, [searchQuery, staffFilter, dateFilter, entries]);

  const handleDeleteClick = (id: string) => {
    setEntryToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (entryToDelete) {
      setEntries(entries.filter(e => e.id !== entryToDelete));
      setEntryToDelete(null);
    }
  };

  const handleExport = () => {
    if (filteredEntries.length === 0) return;

    // Create CSV content
    const headers = ['Plate Number', 'Phone Number', 'Check-In', 'Check-Out', 'Duration', 'Staff Member', 'Device', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredEntries.map(entry => [
        `"${entry.plate}"`,
        `"${entry.phone || ''}"`,
        `"${entry.timestamp}"`,
        `"${entry.checkOutTime || '—'}"`,
        `"${entry.duration || 'Active'}"`,
        `"${entry.staff}"`,
        `"${entry.device}"`,
        `"${entry.status}"`
      ].join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `vguard_entries_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="entries-page">
      <motion.div 
        className="entries-controls"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="search-box">
          <Search className="search-icon" size={18} />
          <input 
            type="text" 
            placeholder="Search by plate number..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filters-group">
          <div className="filter-item">
            <Calendar className="filter-icon" size={16} />
            <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
              <option value="Today">Today</option>
              <option value="Yesterday">Yesterday</option>
              <option value="All Time">All Time</option>
            </select>
          </div>

          <div className="filter-item">
            <User className="filter-icon" size={16} />
            <select value={staffFilter} onChange={(e) => setStaffFilter(e.target.value)}>
              <option value="All Staff">All Staff</option>
              <option value="Samuel Okon">Samuel Okon</option>
              <option value="John Doe">John Doe</option>
              <option value="Mary Jane">Mary Jane</option>
            </select>
          </div>

          <button className="btn-export" onClick={handleExport} disabled={filteredEntries.length === 0}>
            <Download size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </motion.div>

      <motion.div 
        className="table-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="table-wrapper">
          <table className="entries-table">
            <thead>
              <tr>
                <th>Plate Number</th>
                <th>Phone Number</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Duration</th>
                <th>Staff</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.length > 0 ? (
                filteredEntries.map((entry) => (
                  <tr key={entry.id}>
                    <td className="plate-cell">{entry.plate}</td>
                    <td>{entry.phone || '—'}</td>
                    <td>{entry.timestamp}</td>
                    <td>{entry.checkOutTime || '—'}</td>
                    <td>
                      {entry.duration ? (
                        <span style={{ fontWeight: 600 }}>{entry.duration}</span>
                      ) : (
                        <span style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '12px' }}>Active</span>
                      )}
                    </td>
                    <td>
                      <div className="staff-cell">
                        <div className="staff-avatar-mini">{entry.staff.charAt(0)}</div>
                        {entry.staff}
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${entry.status === 'IN' ? 'active' : 'synced'}`}>
                        {entry.status === 'IN' ? '● IN' : '○ OUT'}
                      </span>
                    </td>
                    <td>
                      <DropdownMenu 
                        options={[
                          { label: 'View Details', icon: <ExternalLink size={14} />, onClick: () => {} },
                          { label: 'Edit Entry', icon: <Edit2 size={14} />, onClick: () => {} },
                          { label: 'Delete Record', icon: <Trash2 size={14} />, onClick: () => handleDeleteClick(entry.id), danger: true },
                        ]}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="no-data">
                    No entries found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-pagination">
          <p className="pagination-info">Showing 1 to {filteredEntries.length} of {filteredEntries.length} entries</p>
          <div className="pagination-btns">
            <button className="page-btn disabled"><ChevronLeft size={18} /></button>
            <button className="page-btn active">1</button>
            <button className="page-btn disabled"><ChevronRight size={18} /></button>
          </div>
        </div>
      </motion.div>

      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Vehicle Record?"
        message="This action will permanently remove this entry from your logs. This may affect your security reports and compliance."
        confirmText="Delete Record"
      />
    </div>
  );
};

export default EntriesPage;
