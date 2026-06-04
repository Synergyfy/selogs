import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Car, Clock, LogIn, User, Search, AlertCircle } from 'lucide-react';
import { useEntriesList } from '../hooks/dashboard/useEntries';
import './Dashboard.css';

const DurationDisplay: React.FC<{ checkInTime: string }> = ({ checkInTime }) => {
  const [now, setNow] = useState(Date.now());

  React.useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const diff = now - new Date(checkInTime).getTime();
  const hours = Math.floor(diff / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);

  const color =
    hours >= 6 ? 'var(--danger)' :
    hours >= 2 ? 'var(--warning)' :
    'var(--success)';

  const label =
    hours > 0 ? `${hours}h ${minutes}m` :
    `${minutes}m`;

  return <span style={{ color, fontWeight: 700 }}>{label}</span>;
};

const ActiveVehiclesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: entriesData, isLoading } = useEntriesList({ status: 'IN', limit: 200 });

  const activeVehicles = useMemo(() => {
    const vehicles = entriesData?.data || [];
    if (!searchQuery.trim()) return vehicles;
    const q = searchQuery.toLowerCase();
    return vehicles.filter(
      (v) =>
        v.plateNumber.toLowerCase().includes(q) ||
        v.checkInStaffName?.toLowerCase().includes(q) ||
        v.checkInGateName?.toLowerCase().includes(q)
    );
  }, [entriesData, searchQuery]);

  return (
    <div className="dashboard-overview">
      <div className="card-header" style={{ marginBottom: '0px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Active Vehicles</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '14px' }}>
            {isLoading ? 'Loading...' : `${activeVehicles.length} vehicle${activeVehicles.length !== 1 ? 's' : ''} currently on premises`}
          </p>
        </div>
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search by plate, staff, or gate..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 40px',
              borderRadius: '12px',
              border: '1px solid var(--border-light)',
              background: 'var(--bg-input)',
              fontSize: '14px',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
          <div className="spinner" />
        </div>
      ) : activeVehicles.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-dim)' }}>
          <AlertCircle size={48} style={{ margin: '0 auto 16px', opacity: 0.4 }} />
          <h3 style={{ fontWeight: 700, marginBottom: '4px' }}>No Active Vehicles</h3>
          <p style={{ fontSize: '14px' }}>
            {searchQuery ? 'No vehicles match your search.' : 'All vehicles have been checked out.'}
          </p>
        </div>
      ) : (
        <div style={{ marginTop: '24px', overflowX: 'auto' }}>
          <table className="entries-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-light)', fontSize: '13px', color: 'var(--text-dim)' }}>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600 }}>Plate Number</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600 }}>Check-In Time</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600 }}>Duration</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600 }}>Gate Entered</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600 }}>Staff</th>
              </tr>
            </thead>
            <tbody>
              {activeVehicles.map((vehicle, idx) => (
                <motion.tr
                  key={vehicle.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  style={{ borderBottom: '1px solid var(--border-light)', transition: 'background 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '14px 16px', fontWeight: 700, fontFamily: 'monospace', fontSize: '15px' }}>
                    <Car size={14} style={{ marginRight: '8px', opacity: 0.5, verticalAlign: 'middle' }} />
                    {vehicle.plateNumber}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '14px' }}>
                    <Clock size={14} style={{ marginRight: '6px', opacity: 0.5, verticalAlign: 'middle' }} />
                    {new Date(vehicle.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '14px' }}>
                    <DurationDisplay checkInTime={vehicle.checkInTime} />
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '14px' }}>
                    <LogIn size={14} style={{ marginRight: '6px', opacity: 0.5, verticalAlign: 'middle' }} />
                    {vehicle.checkInGateName}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '14px' }}>
                    <User size={14} style={{ marginRight: '6px', opacity: 0.5, verticalAlign: 'middle' }} />
                    {vehicle.checkInStaffName}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ActiveVehiclesPage;
