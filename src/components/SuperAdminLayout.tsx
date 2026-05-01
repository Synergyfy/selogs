import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CreditCard, 
  Settings, 
  Bell, 
  Menu, 
  ShieldCheck,
  Building2,
  Package,
  Puzzle,
  LogOut,
  Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../services/db';
import NotificationCenter from './NotificationCenter';
import './DashboardLayout.css'; // Reusing base styles but with override
import './SuperAdminLayout.css';

interface SuperAdminLayoutProps {
  children: React.ReactNode;
}

const SuperAdminLayout: React.FC<SuperAdminLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const unreadCount = useLiveQuery(() => 
    db.notifications.where('read').equals(0).count()
  ) || 0;

  const navItems = [
    { path: '/super-admin', icon: <LayoutDashboard size={20} />, label: 'Master Overview' },
    { path: '/super-admin/customers', icon: <Building2 size={20} />, label: 'Customers' },
    { path: '/super-admin/plans', icon: <Package size={20} />, label: 'SaaS Plans' },
    { path: '/super-admin/features', icon: <Puzzle size={20} />, label: 'Feature Add-ons' },
    { path: '/super-admin/billing', icon: <CreditCard size={20} />, label: 'Global Revenue' },
    { path: '/super-admin/notifications', icon: <Bell size={20} />, label: 'Notifications' },
    { path: '/super-admin/settings', icon: <Settings size={20} />, label: 'Platform Settings' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-wrapper sa-theme">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="nav-logo sa-logo">
            <ShieldCheck className="icon-white" />
          </div>
          <div className="sidebar-brand">
            <span className="brand-name">VGuard <span className="sa-badge">MASTER</span></span>
            <span className="brand-tag">SaaS Control Center</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setIsSidebarOpen(false)}
              end={item.path === '/super-admin'}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item logout-btn" onClick={handleLogout}>
            <span className="nav-icon"><LogOut size={20} /></span>
            <span className="nav-label">System Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header sa-header">
          <div className="header-left">
            <button className="menu-toggle" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="search-bar-wrapper hide-mobile">
              <Search size={18} className="search-icon" />
              <input type="text" placeholder="Search customers, invoices, or logs..." className="search-input" />
            </div>
          </div>

          <div className="header-right">
            <div className="notification-wrapper">
              <button className="header-action-btn" title="Global Notifications" onClick={() => setIsNotifOpen(!isNotifOpen)}>
                <Bell size={20} />
                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
              </button>
              <NotificationCenter isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
            </div>
            <div className="header-divider" />
            <div className="user-profile">
              <div className="user-avatar sa-avatar">SA</div>
              <div className="user-info hide-mobile">
                <span className="user-name">{user?.name || 'Super Admin'}</span>
                <span className="user-role">Platform Owner</span>
              </div>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default SuperAdminLayout;
