import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  ArrowUpRight, 
  Clock,
  Activity,
  AlertCircle
} from 'lucide-react';
import './Dashboard.css'; // Reusing base grid styles

const SuperAdminDashboard: React.FC = () => {
  const globalStats = [
    { title: "Total Organizations", value: "142", change: "+12 this month", icon: <Building2 size={24} />, color: "indigo" },
    { title: "Platform Revenue", value: "₦4.2M", change: "+18%", icon: <DollarSign size={24} />, color: "emerald" },
    { title: "Active Subscriptions", value: "98", change: "69% rate", icon: <ShieldCheck size={24} />, color: "blue" },
    { title: "Total Logs Captured", value: "852k", change: "+42k today", icon: <Activity size={24} />, color: "amber" },
  ];

  const recentSignups = [
    { id: 1, org: "Sheraton Lagos", plan: "Enterprise", time: "10 mins ago", status: "Active" },
    { id: 2, org: "Ocean View Estate", plan: "Business", time: "2 hours ago", status: "Trial" },
    { id: 3, org: "Eko Hotels & Suites", plan: "Enterprise", time: "5 hours ago", status: "Active" },
    { id: 4, org: "Victoria Court", plan: "Starter", time: "1 day ago", status: "Expired" },
    { id: 5, org: "Unity Security Ltd", plan: "Business", time: "2 days ago", status: "Active" },
  ];

  return (
    <div className="dashboard-overview sa-theme">
      <div className="section-header">
        <div>
          <h1 className="hero-title" style={{ fontSize: '28px', marginBottom: '8px' }}>Global Performance</h1>
          <p className="text-muted">Master oversight of the VGuard SaaS ecosystem.</p>
        </div>
        <div className="flex-center gap-12">
          <button className="btn-glass-sm"><Clock size={16} /> History</button>
          <button className="btn-premium-sm" style={{ background: 'var(--sa-primary)' }}><Activity size={16} /> Live Logs</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {globalStats.map((stat, index) => (
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

      <div className="dashboard-grid">
        {/* Customer Feed */}
        <motion.div 
          className="content-card recent-entries"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="card-header">
            <h3>Latest Organization Signups</h3>
            <button className="btn-text">View All Organizations <ArrowUpRight size={16} /></button>
          </div>
          <div className="table-container">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Organization</th>
                  <th>Plan</th>
                  <th>Time Joined</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentSignups.map((signup) => (
                  <tr key={signup.id}>
                    <td className="font-bold">{signup.org}</td>
                    <td>{signup.plan}</td>
                    <td className="text-muted">{signup.time}</td>
                    <td>
                      <span className={`status-badge ${signup.status.toLowerCase()}`}>
                        {signup.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* System Health / Revenue Chart Placeholder */}
        <motion.div 
          className="content-card activity-chart"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="card-header">
            <h3>Revenue Growth</h3>
            <div className={`stat-change emerald`}>
              <TrendingUp size={16} /> +24% vs LY
            </div>
          </div>
          <div className="chart-placeholder">
            <div className="chart-bars sa-bars">
              {[30, 50, 70, 60, 90, 85, 100].map((height, i) => (
                <div 
                  key={i} 
                  className="chart-bar" 
                  style={{ height: `${height}%`, background: 'var(--sa-primary)' }}
                />
              ))}
            </div>
            <div className="chart-labels">
              <span>Oct</span><span>Nov</span><span>Dec</span><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span>
            </div>
          </div>
          
          <div className="sa-alert-box" style={{ marginTop: '24px', padding: '16px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', display: 'flex', gap: '12px', alignItems: 'center', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <AlertCircle className="text-red" size={20} />
            <span style={{ fontSize: '13px', color: '#f87171' }}><strong>Critical:</strong> 4 trial accounts expiring in the next 24 hours.</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
