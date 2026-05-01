import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Search, 
  Filter, 
  MoreVertical, 
  PauseCircle, 
  PlayCircle, 
  Calendar,
  ExternalLink,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import './Dashboard.css';

const SuperAdminCustomers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const customers = [
    { id: 1, name: "Sheraton Lagos", code: "SHER-LOS", plan: "Enterprise", status: "Active", joined: "2024-03-12", entries: "125,482", revenue: "₦450,000" },
    { id: 2, name: "Ocean View Estate", code: "OV-EST", plan: "Business", status: "Active", joined: "2024-04-01", entries: "42,102", revenue: "₦180,000" },
    { id: 3, name: "Eko Hotels", code: "EKO-HOT", plan: "Enterprise", status: "Active", joined: "2024-02-15", entries: "210,554", revenue: "₦550,000" },
    { id: 4, name: "Victoria Court", code: "VIC-CRT", plan: "Starter", status: "Expired", joined: "2024-01-20", entries: "1,240", revenue: "₦0" },
    { id: 5, name: "Unity Security", code: "UNITY-SEC", plan: "Business", status: "Active", joined: "2024-04-10", entries: "15,480", revenue: "₦15,000" },
    { id: 6, name: "Grand Cinemas", code: "G-CIN", plan: "Trial", status: "Active", joined: "2024-04-28", entries: "450", revenue: "₦0" },
  ];

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
              {customers.map((customer) => (
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
                  <td>{customer.plan}</td>
                  <td className="text-muted">{customer.joined}</td>
                  <td>{customer.entries}</td>
                  <td className="sa-revenue-text">{customer.revenue}</td>
                  <td>
                    <span className={`status-badge ${customer.status.toLowerCase()}`}>
                      {customer.status}
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
