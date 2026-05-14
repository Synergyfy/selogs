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
import { useEntriesList, useDeleteEntry } from '../hooks/dashboard/useEntries';
import { useStaffList } from '../hooks/dashboard/useStaff';
import type { EntriesParams } from '../services/EntriesService';
import DropdownMenu from './DropdownMenu';
import ConfirmModal from './ConfirmModal';
import './EntriesPage.css';

const EntriesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [staffFilter, setStaffFilter] = useState('All Staff');
  const [dateFilter, setDateFilter] = useState('All Time');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // API Hooks
  const { data: staffMembers = [] } = useStaffList();
  
  const entriesParams = useMemo(() => {
    const params: EntriesParams = {
      page: currentPage,
      limit: itemsPerPage,
      plateNumber: searchQuery || undefined,
    };

    if (staffFilter !== 'All Staff') {
      const selectedStaff = staffMembers.find(s => s.fullName === staffFilter || s.email === staffFilter);
      if (selectedStaff) params.staffId = selectedStaff.id;
    }

    if (dateFilter === 'Today') {
      params.startDate = new Date().toISOString().split('T')[0];
    } else if (dateFilter === 'Yesterday') {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      params.startDate = yesterday.toISOString().split('T')[0];
      params.endDate = yesterday.toISOString().split('T')[0];
    }

    return params;
  }, [currentPage, searchQuery, staffFilter, dateFilter, staffMembers]);

  const { data: entriesData } = useEntriesList(entriesParams);
  const deleteMutation = useDeleteEntry();

  const entries = entriesData?.data || [];
  const totalEntries = entriesData?.total || 0;
  const totalPages = entriesData?.lastPage || 0;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDeleteClick = (id: string) => {
    setEntryToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (entryToDelete) {
      await deleteMutation.mutateAsync(entryToDelete);
      setEntryToDelete(null);
    }
  };

  const handleExport = () => {
    if (entries.length === 0) return;

    const headers = ['Plate Number', 'Phone Number', 'Check-In', 'Check-Out', 'Staff Member', 'Status'];
    const csvContent = [
      headers.join(','),
      ...entries.map(entry => [
        `"${entry.plateNumber}"`,
        `"${entry.phoneNumber || ''}"`,
        `"${new Date(entry.checkInTime).toLocaleString()}"`,
        `"${entry.checkOutTime ? new Date(entry.checkOutTime).toLocaleString() : '—'}"`,
        `"${entry.checkInStaffName || ''}"`,
        `"${entry.status}"`
      ].join(','))
    ].join('\n');

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
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to page 1 on search
            }}
          />
        </div>

        <div className="filters-group">
          <div className="filter-item">
            <Calendar className="filter-icon" size={16} />
            <select value={dateFilter} onChange={(e) => {
              setDateFilter(e.target.value);
              setCurrentPage(1);
            }}>
              <option value="Today">Today</option>
              <option value="Yesterday">Yesterday</option>
              <option value="All Time">All Time</option>
            </select>
          </div>

          <div className="filter-item">
            <User className="filter-icon" size={16} />
            <select value={staffFilter} onChange={(e) => {
              setStaffFilter(e.target.value);
              setCurrentPage(1);
            }}>
              <option value="All Staff">All Staff</option>
              {staffMembers.map(s => (
                <option key={s.id} value={s.fullName || s.email}>
                  {s.fullName || s.email}
                </option>
              ))}
            </select>
          </div>

          <button className="btn-export" onClick={handleExport} disabled={entries.length === 0}>
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
              {entries.length > 0 ? (
                entries.map((entry) => (
                  <tr key={entry.id}>
                    <td className="plate-cell">{entry.plateNumber}</td>
                    <td>{entry.phoneNumber || '—'}</td>
                    <td>{new Date(entry.checkInTime).toLocaleString()}</td>
                    <td>{entry.checkOutTime ? new Date(entry.checkOutTime).toLocaleString() : '—'}</td>
                    <td>
                      {entry.status === 'OUT' ? (
                        <span style={{ fontWeight: 600 }}>Completed</span>
                      ) : (
                        <span style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '12px' }}>Active</span>
                      )}
                    </td>
                    <td>
                      <div className="staff-cell">
                        <div className="staff-avatar-mini">{(entry.checkInStaffName || 'S').charAt(0)}</div>
                        {entry.checkInStaffName}
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
          <p className="pagination-info">
            Showing {entries.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, totalEntries)} of {totalEntries} entries
          </p>
          <div className="pagination-btns">
            <button 
              className={`page-btn ${currentPage === 1 ? 'disabled' : ''}`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={18} />
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button 
                key={i + 1}
                className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button 
              className={`page-btn ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight size={18} />
            </button>
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

