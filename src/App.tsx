import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Layout from './components/Layout'
import ConnectDevice from './components/ConnectDevice'
import StaffCheckIn from './components/StaffCheckIn'
import Home from './components/Home'
import NewEntry from './components/NewEntry'
import CheckOut from './components/CheckOut'
import History from './components/History'
import LandingPage from './components/LandingPage'
import CreateAccount from './components/CreateAccount'
import VerifyAccount from './components/VerifyAccount'
import CreateOrganization from './components/CreateOrganization'
import BrandSetup from './components/BrandSetup'
import SystemMode from './components/SystemMode'
import AddStaff from './components/AddStaff'
import DeviceSetup from './components/DeviceSetup'
import DashboardLayout from './components/DashboardLayout'
import Dashboard from './components/Dashboard'
import EntriesPage from './components/EntriesPage'
import StaffManagement from './components/StaffManagement'
import DevicesPage from './components/DevicesPage'
import BranchesPage from './components/BranchesPage'
import SubscriptionPage from './components/SubscriptionPage'
import BillingPage from './components/BillingPage'
import SettingsPage from './components/SettingsPage'
import SuperAdminLayout from './components/SuperAdminLayout'
import SuperAdminDashboard from './components/SuperAdminDashboard'
import SuperAdminCustomers from './components/SuperAdminCustomers'
import SuperAdminPlans from './components/SuperAdminPlans'
import SuperAdminBilling from './components/SuperAdminBilling'
import SuperAdminNotifications from './components/SuperAdminNotifications'
import SuperAdminSettings from './components/SuperAdminSettings'
import SuperAdminFeatures from './components/SuperAdminFeatures'
import PWAPrompt from './components/PWAPrompt'
import FAQPage from './components/FAQPage'
import ContactPage from './components/ContactPage'
import ForgotPassword from './components/ForgotPassword'
import PlanSelection from './components/PlanSelection'
import LoginPage from './components/LoginPage'
import PricingPage from './components/PricingPage'
import FeaturesPage from './components/FeaturesPage'
import IndustriesPage from './components/IndustriesPage'
import { db, type VehicleEntry } from './services/db'
import type { ThemeMode } from './types'
import { useAuth } from './context/AuthContext'
import { notificationService } from './services/NotificationService'
import './App.css'

// Route protection wrapper
const ProtectedRoute = ({ children, roles }: { children: React.ReactNode, roles?: string[] }) => {
  const { user, isLoading, userRole, organization } = useAuth();

  useEffect(() => {
    // Run lifecycle checks on app startup if user is logged in
    if (user?.isAuthenticated && organization) {
      notificationService.checkLifecycleEvents({
        id: organization.id,
        joinedDate: organization.joinedDate || Date.now() - (11 * 24 * 60 * 60 * 1000), // Default mock: 11 days ago
        plan: organization.plan
      });
    }
  }, [user, organization]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user?.isAuthenticated) {
      navigate('/login');
    }
    if (!isLoading && roles && userRole && !roles.includes(userRole)) {
      navigate('/dashboard');
    }
  }, [user, isLoading, userRole, roles, navigate]);

  if (isLoading) return <div className="loading-screen">Authenticating...</div>;
  return user?.isAuthenticated ? <>{children}</> : null;
};

type Screen = 'connect' | 'checkin' | 'home' | 'new_entry' | 'history' | 'check_out'

// Helper for mobile app to receive theme
function MobileApp({ theme, toggleTheme }: { theme: 'light' | 'dark', toggleTheme: () => void }) {
  const [screen, setScreen] = useState<Screen>('connect')
  const [staff, setStaff] = useState<{ id: string; name?: string } | null>(null)
  const [orgInfo, setOrgInfo] = useState<{ code: string; name: string } | null>(null)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [unsyncedCount, setUnsyncedCount] = useState(0)
  const [isSyncing, setIsSyncing] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)
  const [deviceId] = useState(() => {
    let id = localStorage.getItem('deviceId')
    if (!id) {
      id = uuidv4()
      localStorage.setItem('deviceId', id)
    }
    return id
  })

  // Show toast helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Online/offline handling with auto-sync
  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      showToast('Back online! Syncing...', 'info');
      const unsynced = await db.entries.where('synced').equals(0).toArray();
      if (unsynced.length > 0) {
        setIsSyncing(true);
        setTimeout(async () => {
          for (const entry of unsynced) {
            await db.entries.update(entry.id, { synced: true });
          }
          const count = await db.entries.where('synced').equals(0).count();
          setUnsyncedCount(count);
          setIsSyncing(false);
          showToast(`${unsynced.length} records synced!`, 'success');
        }, 1500);
      }
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      showToast('You are offline. Records will be saved locally.', 'error');
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load persisted session on mount
  useEffect(() => {
    const loadSession = async () => {
      // Check for saved org
      const savedOrg = localStorage.getItem('orgInfo');
      if (savedOrg) {
        const parsed = JSON.parse(savedOrg);
        setOrgInfo(parsed);

        // Check for active staff session
        const settings = await db.settings.get('current_session');
        if (settings) {
          setStaff({ id: settings.staffId, name: settings.staffName });
          setScreen('home');
        } else {
          setScreen('checkin');
        }
      } else {
        setScreen('connect');
      }
    };
    
    const updateUnsynced = async () => {
      const count = await db.entries.where('synced').equals(0).count()
      setUnsyncedCount(count)
    }

    loadSession()
    updateUnsynced()
  }, [])

  // Connect device to organization
  const handleConnect = (orgCode: string, orgName: string) => {
    const info = { code: orgCode, name: orgName };
    setOrgInfo(info);
    localStorage.setItem('orgInfo', JSON.stringify(info));
    setScreen('checkin');
  };

  // Disconnect device from organization
  const handleDisconnect = async () => {
    await db.settings.delete('current_session');
    localStorage.removeItem('orgInfo');
    setOrgInfo(null);
    setStaff(null);
    setScreen('connect');
  };

  const handleCheckIn = async (staffId: string, staffName?: string) => {
    setStaff({ id: staffId, name: staffName })
    await db.settings.put({
      id: 'current_session',
      staffId,
      staffName,
      deviceId
    })
    setScreen('home')
    showToast(`Shift started. Welcome, ${staffName || staffId}!`, 'success');
  }

  const handleNewEntry = async (data: { plateNumber: string; phoneNumber?: string; notes?: string; image?: Blob }) => {
    if (!staff) return

    const newEntry: VehicleEntry = {
      id: uuidv4(),
      plateNumber: data.plateNumber,
      phoneNumber: data.phoneNumber,
      timestamp: Date.now(),
      deviceId,
      staffId: staff.id,
      staffName: staff.name,
      synced: false,
      image: data.image,
      status: 'IN'
    }

    await db.entries.add(newEntry)
    
    const count = await db.entries.where('synced').equals(0).count()
    setUnsyncedCount(count)
    setScreen('home')
    showToast(`Entry saved: ${data.plateNumber}`, 'success');
  }

  const handleSync = async () => {
    if (!isOnline) {
      showToast('You are currently offline. Sync will resume when internet is available.', 'error');
      return
    }

    const unsynced = await db.entries.where('synced').equals(0).toArray()
    
    if (unsynced.length === 0) {
      showToast('All records are already synced!', 'success');
      return
    }

    setIsSyncing(true);

    setTimeout(async () => {
      for (const entry of unsynced) {
        await db.entries.update(entry.id, { synced: true })
      }
      const count = await db.entries.where('synced').equals(0).count()
      setUnsyncedCount(count)
      setIsSyncing(false);
      showToast(`Successfully synced ${unsynced.length} records.`, 'success');
    }, 1500)
  }

  const handleEndShift = async () => {
    await db.settings.delete('current_session')
    setStaff(null)
    setScreen('checkin')
    showToast('Shift ended. See you next time!', 'info');
  }

  // Render the connect screen outside of Layout (it has its own full-screen design)
  if (screen === 'connect') {
    return <ConnectDevice onConnect={handleConnect} />;
  }

  return (
    <Layout 
      staffId={staff?.id} 
      staffName={staff?.name}
      isOnline={isOnline} 
      theme={theme} 
      toggleTheme={toggleTheme}
      orgName={orgInfo?.name}
      onDisconnect={handleDisconnect}
      toast={toast}
    >
      {screen === 'checkin' && (
        <StaffCheckIn 
          onCheckIn={handleCheckIn} 
          orgName={orgInfo?.name}
        />
      )}
      {screen === 'home' && (
        <Home 
          isOnline={isOnline} 
          unsyncedCount={unsyncedCount} 
          isSyncing={isSyncing}
          staffName={staff?.name}
          staffId={staff?.id}
          onNewEntry={() => setScreen('new_entry')} 
          onCheckOut={() => setScreen('check_out')}
          onSync={handleSync} 
          onViewHistory={() => setScreen('history')} 
          onEndShift={handleEndShift} 
        />
      )}
      {screen === 'new_entry' && (
        <NewEntry 
          onSave={handleNewEntry} 
          onCancel={() => setScreen('home')} 
        />
      )}
      {screen === 'check_out' && (
        <CheckOut 
          staffId={staff?.id}
          staffName={staff?.name}
          onCheckOutComplete={() => {
            setScreen('home');
            const count = async () => setUnsyncedCount(await db.entries.where('synced').equals(0).count());
            count();
          }} 
          onCancel={() => setScreen('home')} 
        />
      )}
      {screen === 'history' && (
        <History onBack={() => setScreen('home')} />
      )}
    </Layout>
  )
}

function App() {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('themeMode') as ThemeMode;
    return saved || 'light';
  });

  // Calculate effective theme
  const getEffectiveTheme = () => {
    if (themeMode === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return themeMode;
  };

  const [effectiveTheme, setEffectiveTheme] = useState<'light'|'dark'>(getEffectiveTheme());

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (themeMode === 'system') {
        setEffectiveTheme(mediaQuery.matches ? 'dark' : 'light');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeMode]);

  useEffect(() => {
    setEffectiveTheme(getEffectiveTheme());
    localStorage.setItem('themeMode', themeMode);
  }, [themeMode]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', effectiveTheme);
    localStorage.setItem('theme', effectiveTheme);
  }, [effectiveTheme]);

  const toggleTheme = () => {
    setThemeMode(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage themeMode={themeMode} setThemeMode={setThemeMode} />} />
        <Route path="/features" element={<FeaturesPage themeMode={themeMode} setThemeMode={setThemeMode} />} />
        <Route path="/industries" element={<IndustriesPage themeMode={themeMode} setThemeMode={setThemeMode} />} />
        <Route path="/pricing" element={<PricingPage themeMode={themeMode} setThemeMode={setThemeMode} />} />
        <Route path="/faq" element={<FAQPage themeMode={themeMode} setThemeMode={setThemeMode} />} />
        <Route path="/contact" element={<ContactPage themeMode={themeMode} setThemeMode={setThemeMode} />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-account" element={<VerifyAccount />} />
        <Route path="/create-organization" element={<CreateOrganization />} />
        <Route path="/plan-selection" element={<PlanSelection />} />
        <Route path="/brand-setup" element={<BrandSetup />} />
        <Route path="/system-mode" element={<SystemMode />} />
        <Route path="/add-staff" element={<AddStaff />} />
        <Route path="/device-setup" element={<DeviceSetup />} />
        <Route path="/app/*" element={<MobileApp theme={effectiveTheme} toggleTheme={toggleTheme} />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout themeMode={themeMode} setThemeMode={setThemeMode}><Dashboard /></DashboardLayout></ProtectedRoute>} />
        <Route path="/dashboard/entries" element={<ProtectedRoute><DashboardLayout themeMode={themeMode} setThemeMode={setThemeMode}><EntriesPage /></DashboardLayout></ProtectedRoute>} />
        <Route path="/dashboard/branches" element={<ProtectedRoute roles={['admin', 'supervisor']}><DashboardLayout themeMode={themeMode} setThemeMode={setThemeMode}><BranchesPage /></DashboardLayout></ProtectedRoute>} />
        <Route path="/dashboard/staff" element={<ProtectedRoute roles={['admin', 'supervisor']}><DashboardLayout themeMode={themeMode} setThemeMode={setThemeMode}><StaffManagement /></DashboardLayout></ProtectedRoute>} />
        <Route path="/dashboard/devices" element={<ProtectedRoute roles={['admin']}><DashboardLayout themeMode={themeMode} setThemeMode={setThemeMode}><DevicesPage /></DashboardLayout></ProtectedRoute>} />
        <Route path="/dashboard/subscription" element={<ProtectedRoute roles={['admin']}><DashboardLayout themeMode={themeMode} setThemeMode={setThemeMode}><SubscriptionPage /></DashboardLayout></ProtectedRoute>} />
        <Route path="/dashboard/billing" element={<ProtectedRoute roles={['admin']}><DashboardLayout themeMode={themeMode} setThemeMode={setThemeMode}><BillingPage /></DashboardLayout></ProtectedRoute>} />
        <Route path="/dashboard/settings" element={<ProtectedRoute roles={['admin']}><DashboardLayout themeMode={themeMode} setThemeMode={setThemeMode}><SettingsPage /></DashboardLayout></ProtectedRoute>} />
        
        {/* Super Admin Routes */}
        <Route path="/super-admin" element={<ProtectedRoute roles={['admin']}><SuperAdminLayout><SuperAdminDashboard /></SuperAdminLayout></ProtectedRoute>} />
        <Route path="/super-admin/customers" element={<ProtectedRoute roles={['admin']}><SuperAdminLayout><SuperAdminCustomers /></SuperAdminLayout></ProtectedRoute>} />
        <Route path="/super-admin/plans" element={<ProtectedRoute roles={['admin']}><SuperAdminLayout><SuperAdminPlans /></SuperAdminLayout></ProtectedRoute>} />
        <Route path="/super-admin/features" element={<ProtectedRoute roles={['admin']}><SuperAdminLayout><SuperAdminFeatures /></SuperAdminLayout></ProtectedRoute>} />
        <Route path="/super-admin/billing" element={<ProtectedRoute roles={['admin']}><SuperAdminLayout><SuperAdminBilling /></SuperAdminLayout></ProtectedRoute>} />
        <Route path="/super-admin/notifications" element={<ProtectedRoute roles={['admin']}><SuperAdminLayout><SuperAdminNotifications /></SuperAdminLayout></ProtectedRoute>} />
        <Route path="/super-admin/settings" element={<ProtectedRoute roles={['admin']}><SuperAdminLayout><SuperAdminSettings /></SuperAdminLayout></ProtectedRoute>} />
      </Routes>
      <PWAPrompt />
    </>
  )
}

export default App
