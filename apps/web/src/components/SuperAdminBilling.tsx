import React from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  Download, 
  Filter,
  Search,
  CreditCard,
  Building2,
  Calendar
} from 'lucide-react';
import './Dashboard.css';

const SuperAdminBilling: React.FC = () => {
  const revenueStats = [
    { title: "Total Revenue (MRR)", value: "₦4.2M", change: "+12.5%", icon: <DollarSign size={24} />, color: "emerald" },
    { title: "Pending Payouts", value: "₦850k", change: "42 pending", icon: <CreditCard size={24} />, color: "indigo" },
    { title: "Active Subs", value: "98", change: "72% growth", icon: <TrendingUp size={24} />, color: "blue" },
    { title: "Average ARPU", value: "₦42,800", change: "+5% vs LY", icon: <Building2 size={24} />, color: "amber" },
  ];

  const transactions = [
    { id: 'TX-9901', org: 'Sheraton Lagos', plan: 'Enterprise', amount: '₦150,000', status: 'Success', date: 'May 01, 2026' },
    { id: 'TX-9892', org: 'Ocean View Estate', plan: 'Business', amount: '₦15,000', status: 'Success', date: 'Apr 30, 2026' },
    { id: 'TX-9885', org: 'Eko Hotels & Suites', plan: 'Enterprise', amount: '₦150,000', status: 'Pending', date: 'Apr 28, 2026' },
    { id: 'TX-9871', org: 'Victoria Court', plan: 'Starter', amount: '₦5,000', status: 'Failed', date: 'Apr 25, 2026' },
    { id: 'TX-9860', org: 'Unity Security Ltd', plan: 'Business', amount: '₦15,000', status: 'Success', date: 'Apr 22, 2026' },
  ];

  return (
    <div className="dashboard-overview sa-theme">
      <div className="section-header">
        <div>
          <h1 className="hero-title" style={{ fontSize: '28px', marginBottom: '8px' }}>Global Revenue</h1>
          <p className="text-muted">Monitor platform earnings and transaction health.</p>
        </div>
        <div className="flex-center gap-12">
          <button className="btn-glass-sm"><Download size={16} /> Export CSV</button>
          <button className="btn-premium-sm" style={{ background: 'var(--sa-primary)' }}><Calendar size={16} /> Billing Cycle</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {revenueStats.map((stat, index) => (
          <motion.div 
            key={stat.title}
            className="stat-card sa-stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className={`stat-icon-wrapper ${stat.color}`}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <span className="stat-title">{stat.title}</span>
              <div className="stat-value-row">
                <h2 className="stat-value">{stat.value}</h2>
                <span className={`stat-change ${stat.color}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="content-card" style={{ marginTop: '32px' }}>
        <div className="card-header">
          <div className="header-left">
            <h3>Recent Transactions</h3>
            <div className="search-bar-wrapper mini hide-mobile" style={{ marginLeft: '24px', background: 'var(--bg-input)' }}>
              <Search size={14} className="search-icon" />
              <input type="text" placeholder="Find transaction..." className="search-input" style={{ fontSize: '12px' }} />
            </div>
          </div>
          <button className="btn-text"><Filter size={16} /> Filter Status</button>
        </div>
        <div className="table-container">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Organization</th>
                <th>Plan Type</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td className="font-mono" style={{ fontSize: '13px' }}>{tx.id}</td>
                  <td className="font-bold">{tx.org}</td>
                  <td>{tx.plan}</td>
                  <td className="font-bold">{tx.amount}</td>
                  <td className="text-muted">{tx.date}</td>
                  <td>
                    <span className={`status-badge ${tx.status.toLowerCase()}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td>
                    <button className="copy-code-btn" title="Download Invoice"><Download size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card-footer centered" style={{ borderTop: '1px solid var(--border-light)', padding: '16px' }}>
          <button className="btn-text">Load More Transactions <ArrowUpRight size={16} /></button>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminBilling;
