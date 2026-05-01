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
  Search,
  Sun,
  Moon,
  Monitor,
  User,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../services/db';
import NotificationCenter from './NotificationCenter';
import type { ThemeMode } from '../types';
import './DashboardLayout.css'; // Reusing base styles but with override
import './SuperAdminLayout.css';

interface SuperAdminLayoutProps {
  children: React.ReactNode;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

const SuperAdminLayout: React.FC<SuperAdminLayoutProps> = ({ children, themeMode, setThemeMode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
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
    <div className="dashboard-container sa-theme">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`sa-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sa-sidebar-header">
          <div className="sa-logo-container">
            <div className="sa-logo-icon">
              <ShieldCheck size={24} />
            </div>
            <div className="sa-logo-text">
              <span className="sa-logo-title">VGUARD</span>
              <span className="sa-logo-badge">MASTER</span>
            </div>
          </div>
        </div>

        <div className="sa-sidebar-content">
          <div className="sa-nav-group">
            <span className="sa-nav-subtitle">Management</span>
            <nav className="sa-nav-links">
              {navItems.slice(0, 4).map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `sa-nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setIsSidebarOpen(false)}
                  end={item.path === '/super-admin'}
                >
                  {({ isActive }) => (
                    <>
                      <span className="sa-link-icon">{item.icon}</span>
                      <span className="sa-link-label">{item.label}</span>
                      {isActive && <motion.div layoutId="sa-active" className="sa-active-indicator" />}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="sa-nav-group">
            <span className="sa-nav-subtitle">System</span>
            <nav className="sa-nav-links">
              {navItems.slice(4).map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `sa-nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  {({ isActive }) => (
                    <>
                      <span className="sa-link-icon">{item.icon}</span>
                      <span className="sa-link-label">{item.label}</span>
                      {isActive && <motion.div layoutId="sa-active" className="sa-active-indicator" />}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>

        <div className="sa-sidebar-footer">
          <button className="sa-logout-btn" onClick={handleLogout}>
            <div className="sa-logout-content">
              <LogOut size={18} />
              <span>Sign Out</span>
            </div>
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
            <div className="page-info hide-mobile">
              <span className="page-breadcrumb">Super Admin</span>
              <h2 className="page-title">{user?.role === 'admin' ? 'Master Panel' : 'Dashboard'}</h2>
            </div>
          </div>

          <div className="header-center hide-mobile">
            <div className="search-bar-wrapper">
              <Search size={18} className="search-icon" />
              <input type="text" placeholder="Search customers, invoices, or logs..." className="search-input" />
              <div className="search-shortcut">
                <span style={{ fontSize: '12px' }}>⌘</span>
                <span>K</span>
              </div>
            </div>
          </div>

          <div className="header-right">
            <div className="theme-switcher-compact sa-theme-switcher">
              <button 
                className={`theme-btn ${themeMode === 'light' ? 'active' : ''}`}
                onClick={() => setThemeMode('light')}
                title="Light Mode"
              >
                <Sun size={18} />
              </button>
              <button 
                className={`theme-btn ${themeMode === 'dark' ? 'active' : ''}`}
                onClick={() => setThemeMode('dark')}
                title="Dark Mode"
              >
                <Moon size={18} />
              </button>
              <button 
                className={`theme-btn ${themeMode === 'system' ? 'active' : ''}`}
                onClick={() => setThemeMode('system')}
                title="System Default"
              >
                <Monitor size={18} />
              </button>
            </div>

            <div className="notification-wrapper">
              <button className="header-action-btn" title="Global Notifications" onClick={() => setIsNotifOpen(!isNotifOpen)}>
                <Bell size={20} />
                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
              </button>
              <NotificationCenter isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
            </div>
            <div className="header-divider" />
            <div className="user-profile-wrapper">
              <button className="user-profile" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                <div className="user-avatar sa-avatar">SA</div>
                <div className="user-info hide-mobile">
                  <span className="user-name">{user?.name || 'Super Admin'}</span>
                  <span className="user-role">Platform Owner</span>
                </div>
                <ChevronDown size={16} className={`dropdown-arrow ${isProfileOpen ? 'open' : ''}`} />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div 
                    className="profile-dropdown"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  >
                    <div className="dropdown-header">
                      <span className="dropdown-label">Account Management</span>
                    </div>
                    <div className="dropdown-content">
                      <button className="dropdown-item" onClick={() => { navigate('/super-admin/settings'); setIsProfileOpen(false); }}>
                        <User size={18} />
                        <span>Profile Settings</span>
                      </button>
                      <button className="dropdown-item" onClick={() => { navigate('/super-admin/billing'); setIsProfileOpen(false); }}>
                        <CreditCard size={18} />
                        <span>Platform Billing</span>
                      </button>
                      <div className="dropdown-divider" />
                      <button className="dropdown-item logout" onClick={handleLogout}>
                        <LogOut size={18} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
