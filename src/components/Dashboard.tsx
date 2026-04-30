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
  Clock
} from 'lucide-react';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // Mock data
  const stats = [
    { title: "Today's Entries", value: "48", change: "+12%", icon: <Car size={24} />, color: "indigo" },
    { title: "Weekly Total", value: "312", change: "+8%", icon: <Calendar size={24} />, color: "emerald" },
    { title: "Active Staff", value: "6", change: "Full", icon: <Users size={24} />, color: "blue" },
    { title: "Linked Devices", value: "4", change: "Online", icon: <Smartphone size={24} />, color: "amber" },
  ];

  const recentEntries = [
    { id: 1, plate: "ABC-123-XY", time: "2 mins ago", staff: "Samuel Okon", status: "Synced" },
    { id: 2, plate: "LAG-456-ZZ", time: "15 mins ago", staff: "Samuel Okon", status: "Synced" },
    { id: 3, plate: "KND-789-AA", time: "45 mins ago", staff: "John Doe", status: "Synced" },
    { id: 4, plate: "PHC-321-BB", time: "1 hour ago", staff: "Mary Jane", status: "Synced" },
    { id: 5, plate: "ABJ-654-CC", time: "2 hours ago", staff: "John Doe", status: "Synced" },
  ];

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
                {recentEntries.map((entry) => (
                  <tr key={entry.id}>
                    <td className="font-bold">{entry.plate}</td>
                    <td className="text-muted">
                      <div className="flex-center gap-4">
                        <Clock size={14} />
                        {entry.time}
                      </div>
                    </td>
                    <td>{entry.staff}</td>
                    <td>
                      <span className="status-badge synced">
                        {entry.status}
                      </span>
                    </td>
                  </tr>
                ))}
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
            <div className={`stat-change emerald`}>
              <TrendingUp size={16} /> +15%
            </div>
          </div>
          <div className="chart-placeholder">
            <div className="chart-bars">
              {[40, 70, 45, 90, 65, 80, 50].map((height, i) => (
                <div 
                  key={i} 
                  className="chart-bar" 
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
            <div className="chart-labels">
              <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
