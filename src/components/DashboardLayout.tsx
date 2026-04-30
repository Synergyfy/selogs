import React, { useState } from 'react';
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
  Monitor
} from 'lucide-react';
import type { ThemeMode } from '../types';
import './DashboardLayout.css';

interface DashboardLayoutProps {
  children: React.ReactNode;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, themeMode, setThemeMode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const navItems = [
    { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Overview' },
    { path: '/dashboard/entries', icon: <List size={20} />, label: 'Vehicle Entries' },
    { path: '/dashboard/staff', icon: <Users size={20} />, label: 'Staff Management' },
    { path: '/dashboard/devices', icon: <Smartphone size={20} />, label: 'Linked Devices' },
    { path: '/dashboard/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  const handleLogout = () => {
    // In a real app, clear auth here
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
            <h1 className="page-title">
              {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
            </h1>
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
            
            <div className="user-profile">
              <div className="user-avatar">AD</div>
              <div className="user-info">
                <span className="user-name">Admin User</span>
                <span className="user-role">Administrator</span>
              </div>
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
