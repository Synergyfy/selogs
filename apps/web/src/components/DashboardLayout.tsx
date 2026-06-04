import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  List, 
  Users, 
  Smartphone, 
  Settings, 
  LogOut, 
  ShieldCheck, 
  Menu, 
  X,
  Sun,
  Moon,
  Monitor,
  Building2,
  CreditCard,
  Bell,
  Zap,
  Search,
  User,
  ChevronDown,
  ArrowLeftRight,
  Car
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../services/db';
import { useAuth } from '../hooks/useAuth';
import { notificationService } from '../services/NotificationService';
import NotificationCenter from './NotificationCenter';
import type { ThemeMode } from '../types';
import './DashboardLayout.css';

interface DashboardLayoutProps {
  children: React.ReactNode;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, themeMode, setThemeMode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const unreadCount = useLiveQuery(() => 
    db.notifications.where('read').equals(0).count()
  ) || 0;

  useEffect(() => {
    if (user?.organizationId) {
      notificationService.syncFromApi(user.organizationId);
    }
  }, [user?.organizationId]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const navItems = [
    { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Overview' },
    { path: '/dashboard/entries', icon: <List size={20} />, label: 'Vehicle Entries' },
    { path: '/dashboard/active-vehicles', icon: <Car size={20} />, label: 'Active Vehicles' },
    { path: '/dashboard/branches', icon: <Building2 size={20} />, label: 'Branches' },
    { path: '/dashboard/gates', icon: <ArrowLeftRight size={20} />, label: 'Gates' },
    { path: '/dashboard/staff', icon: <Users size={20} />, label: 'Staff' },
    { path: '/dashboard/devices', icon: <Smartphone size={20} />, label: 'Devices' },
    { path: '/dashboard/notifications', icon: <Bell size={20} />, label: 'Notifications' },
    { path: '/dashboard/subscription', icon: <Zap size={20} />, label: 'Subscription' },
    { path: '/dashboard/billing', icon: <CreditCard size={20} />, label: 'Billing' },
    { path: '/dashboard/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      {/* Mobile Backdrop */}
      {isSidebarOpen && <div className="sidebar-backdrop" onClick={toggleSidebar} />}

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="brand-logo">
              <ShieldCheck className="icon-white" size={24} />
            </div>
            <span className="brand-name">VGuard</span>
          </div>
          <button className="sidebar-close" onClick={toggleSidebar}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setIsSidebarOpen(false)}
              end={item.path === '/dashboard'}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-link logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-left">
            <button className="sidebar-toggle" onClick={toggleSidebar}>
              <Menu size={24} />
            </button>
            <h1 className="page-title hide-mobile">
              {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
            </h1>
          </div>

          <div className="header-center hide-mobile">
            <div className="search-bar-wrapper">
              <Search size={18} className="search-icon" />
              <input type="text" placeholder="Search branches, staff, or entries..." className="search-input" />
              <div className="search-shortcut">
                <span style={{ fontSize: '12px' }}>⌘</span>
                <span>K</span>
              </div>
            </div>
          </div>

          <div className="header-right">
            <div className="theme-switcher-compact">
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
              <button className="header-action-btn" onClick={() => setIsNotifOpen(!isNotifOpen)}>
                <Bell size={20} />
                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
              </button>
              <NotificationCenter isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
            </div>
            
            <div className="user-profile-wrapper">
              <button className="user-profile" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                <div className="user-avatar">{user?.fullName?.substring(0, 2).toUpperCase() || 'AD'}</div>
                <div className="user-info hide-mobile">
                  <span className="user-name">{user?.fullName || 'Admin User'}</span>
                  <span className="user-role">{user?.role === 'admin' ? 'Organization Admin' : 'Staff Member'}</span>
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
                      <span className="dropdown-label">Settings & Profile</span>
                    </div>
                    <div className="dropdown-content">
                      <button className="dropdown-item" onClick={() => { navigate('/dashboard/settings'); setIsProfileOpen(false); }}>
                        <User size={18} />
                        <span>My Profile</span>
                      </button>
                      <button className="dropdown-item" onClick={() => { navigate('/dashboard/subscription'); setIsProfileOpen(false); }}>
                        <CreditCard size={18} />
                        <span>Subscription</span>
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

        <section className="dashboard-content">
          {children}
        </section>
      </main>
    </div>
  );
};

export default DashboardLayout;
