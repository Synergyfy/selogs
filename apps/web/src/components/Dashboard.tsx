import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  Car, 
  Calendar, 
  Smartphone, 
  TrendingUp,
  ArrowUpRight,
  Clock,
  Loader2
} from 'lucide-react';
import { useDashboardOverview, useDashboardTrends } from '../hooks/dashboard/useDashboardStats';
import { useEntriesList } from '../hooks/dashboard/useEntries';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // API Hooks
  const { data: overview } = useDashboardOverview();
  const { data: trendData = [], isLoading: isLoadingTrend } = useDashboardTrends(14);
  const { data: entriesData } = useEntriesList({ limit: 5 });

  // Calculate trends
  const trends = trendData.slice(-7); // Last 7 days for display
  const lastWeek = trendData.slice(-7).reduce((acc, t) => acc + t.count, 0);
  const prevWeek = trendData.slice(0, 7).reduce((acc, t) => acc + t.count, 0);
  
  const trendPercent = prevWeek === 0 
    ? (lastWeek > 0 ? 100 : 0) 
    : Math.round(((lastWeek - prevWeek) / prevWeek) * 100);

  const stats = [
    { title: "Today's Entries", value: overview?.todayEntries.toString() || '0', change: "Live", icon: <Car size={24} />, color: "indigo" },
    { title: "Active Vehicles", value: overview?.activeVehicles.toString() || '0', change: "Inside", icon: <Calendar size={24} />, color: "emerald" },
    { title: "Active Staff", value: overview?.activeStaff.toString() || '0', change: "On Shift", icon: <Users size={24} />, color: "blue" },
    { title: "System Nodes", value: overview?.activeDevices.toString() || '0', change: "Online", icon: <Smartphone size={24} />, color: "amber" },
  ];

  const liveEntries = entriesData?.data || [];

  return (
    <div className="dashboard-overview">
      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <motion.div 
            key={stat.title}
            className="stat-card"
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
        {/* Recent Entries Table */}
        <motion.div 
          className="content-card recent-entries"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="card-header">
            <h3>Recent Vehicle Entries</h3>
            <button className="btn-text" onClick={() => navigate('/dashboard/entries')}>
              View All <ArrowUpRight size={16} />
            </button>
          </div>
          <div className="table-container">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Plate Number</th>
                  <th>Time</th>
                  <th>Staff Member</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {liveEntries.map((entry) => (
                  <tr key={entry.id}>
                    <td className="font-bold">{entry.plateNumber}</td>
                    <td className="text-muted">
                      <div className="flex-center gap-4">
                        <Clock size={14} />
                        {new Date(entry.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td>{entry.checkInStaffName || 'System'}</td>
                    <td>
                      <span className={`status-badge ${entry.status === 'IN' ? 'pending' : 'synced'}`}>
                        {entry.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {liveEntries.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)' }}>
                      No recent activity recorded today.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Activity Chart Placeholder */}
        <motion.div 
          className="content-card activity-chart"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="card-header">
            <h3>Weekly Traffic</h3>
            <div className={`stat-change ${trendPercent >= 0 ? 'emerald' : 'danger'}`}>
              <TrendingUp size={16} className={trendPercent < 0 ? 'rotate-180' : ''} />
              {trendPercent >= 0 ? '+' : ''}{trendPercent}%
            </div>
          </div>
          <div className="chart-placeholder">
            {isLoadingTrend ? (
              <div className="flex-center" style={{ height: '100%' }}>
                <Loader2 className="animate-spin text-muted" size={32} />
              </div>
            ) : (
              <>
                <div className="chart-bars">
                  {trends.map((t, i) => (
                    <div 
                      key={i} 
                      className="chart-bar" 
                      style={{ height: `${Math.min(100, (t.count / (Math.max(...(trends.map(tr => tr.count) || [1]))) * 100))}%` }}
                    />
                  ))}
                </div>
                <div className="chart-labels">
                  {trends.map((t, i) => (
                    <span key={i}>{new Date(t.date).toLocaleDateString([], { weekday: 'narrow' })}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
