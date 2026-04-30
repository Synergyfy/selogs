import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ConnectDevice from './components/ConnectDevice'
import StaffCheckIn from './components/StaffCheckIn'
import Home from './components/Home'
import NewEntry from './components/NewEntry'
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
import SettingsPage from './components/SettingsPage'
import PWAPrompt from './components/PWAPrompt'
import LoginPage from './components/LoginPage'
import { db, type VehicleEntry } from './services/db'
import type { ThemeMode } from './types'
import './App.css'

type Screen = 'connect' | 'checkin' | 'home' | 'new_entry' | 'history'

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
      image: data.image
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
      {screen === 'history' && (
        <History onBack={() => setScreen('home')} />
      )}
    </Layout>
  )
}

function App() {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('themeMode') as ThemeMode;
    return saved || 'dark';
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
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-account" element={<VerifyAccount />} />
        <Route path="/create-organization" element={<CreateOrganization />} />
        <Route path="/brand-setup" element={<BrandSetup />} />
        <Route path="/system-mode" element={<SystemMode />} />
        <Route path="/add-staff" element={<AddStaff />} />
        <Route path="/device-setup" element={<DeviceSetup />} />
        <Route path="/app/*" element={<MobileApp theme={effectiveTheme} toggleTheme={toggleTheme} />} />
        <Route path="/dashboard" element={<DashboardLayout themeMode={themeMode} setThemeMode={setThemeMode}><Dashboard /></DashboardLayout>} />
        <Route path="/dashboard/entries" element={<DashboardLayout themeMode={themeMode} setThemeMode={setThemeMode}><EntriesPage /></DashboardLayout>} />
        <Route path="/dashboard/staff" element={<DashboardLayout themeMode={themeMode} setThemeMode={setThemeMode}><StaffManagement /></DashboardLayout>} />
        <Route path="/dashboard/devices" element={<DashboardLayout themeMode={themeMode} setThemeMode={setThemeMode}><DevicesPage /></DashboardLayout>} />
        <Route path="/dashboard/settings" element={<DashboardLayout themeMode={themeMode} setThemeMode={setThemeMode}><SettingsPage /></DashboardLayout>} />
      </Routes>
      <PWAPrompt />
    </>
  )
}

export default App
