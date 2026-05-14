import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  ExternalLink
} from 'lucide-react';
import './Dashboard.css';

import { useOrganizations } from '../hooks/super-admin/useOrganizations';

const SuperAdminCustomers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: organizations, isLoading } = useOrganizations();

  const filteredCustomers = organizations?.filter(org => 
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.industry.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="dashboard-overview sa-theme">
      <div className="section-header">
        <div>
          <h1 className="hero-title" style={{ fontSize: '28px', marginBottom: '8px' }}>Customer Management</h1>
          <p className="text-muted">Manage all organizations, trials, and global accounts.</p>
        </div>
        <button className="btn-premium-sm" style={{ background: 'var(--sa-primary)' }}>+ Manual Signup</button>
      </div>

      <div className="content-card">
        <div className="card-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '20px' }}>
          <div className="search-bar-wrapper" style={{ flex: 1 }}>
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by name, code, or email..." 
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex-center gap-12">
            <button className="btn-glass-sm"><Filter size={16} /> Filter</button>
          </div>
        </div>

        <div className="table-container">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Organization</th>
                <th>Code</th>
                <th>Plan</th>
                <th>Joined</th>
                <th>Total Entries</th>
                <th>Total Revenue</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={8} className="text-center p-24">Loading organizations...</td></tr>
              ) : filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="user-avatar" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                        {customer.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="font-bold">{customer.name}</span>
                    </div>
                  </td>
                  <td><code style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>{customer.code}</code></td>
                  <td>{customer.planName || 'N/A'}</td>
                  <td className="text-muted">{new Date(customer.createdAt).toLocaleDateString()}</td>
                  <td>{customer.deviceCount} Devices / {customer.branchCount} Branches</td>
                  <td className="sa-revenue-text">N/A</td>
                  <td>
                    <span className={`status-badge active`}>
                      Active
                    </span>
                  </td>
                  <td>
                    <div className="flex-center gap-8">
                      <button className="action-btn" title="Impersonate Account"><ExternalLink size={16} /></button>
                      <button className="action-btn" title="Edit Customer"><MoreVertical size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminCustomers;
