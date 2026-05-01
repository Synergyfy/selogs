import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../services/db';
import type { StaffMember, Organization } from '../services/db';

type UserRole = 'admin' | 'supervisor' | 'guard';

interface AuthUser extends Partial<StaffMember> {
  isAuthenticated: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  organization: Organization | null;
  login: (staffId: string) => Promise<boolean>;
  loginAsDemo: (role?: UserRole) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  userRole: UserRole | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await db.settings.get('current_session');
        const orgInfo = localStorage.getItem('orgInfo');

        if (session) {
          const staffMember = await db.staff.get(session.staffId);
          if (staffMember) {
            setUser({ ...staffMember, isAuthenticated: true });
          } else {
            // Fallback for demo/development if staff table is empty
            setUser({ 
              id: session.staffId, 
              name: session.staffName, 
              role: 'admin', 
              isAuthenticated: true 
            } as AuthUser);
          }
        }

        if (orgInfo) {
          const parsedOrg = JSON.parse(orgInfo);
          const org = await db.organizations.get({ code: parsedOrg.code });
          setOrganization(org || { ...parsedOrg, id: 'local-org', industry: 'General', plan: 'business' });
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (staffId: string) => {
    setIsLoading(true);
    const staffMember = await db.staff.get(staffId);
    
    if (staffMember) {
      setUser({ ...staffMember, isAuthenticated: true });
      await db.settings.put({
        id: 'current_session',
        staffId: staffMember.id,
        staffName: staffMember.name,
        deviceId: localStorage.getItem('deviceId') || 'unknown'
      });
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const loginAsDemo = async (role: UserRole = 'admin') => {
    setIsLoading(true);
    const demoUser = {
      id: 'demo-id',
      name: 'Demo Admin',
      role: role,
      isAuthenticated: true
    };
    setUser(demoUser);
    
    // Ensure we have a mock organization for demo mode
    if (!organization) {
      const mockOrg = {
        id: 'local-org',
        code: 'DEMO',
        name: 'Demo Organization',
        industry: 'General',
        plan: 'business' as const,
        joinedDate: Date.now(),
        syncStatus: false,
        updatedAt: Date.now()
      };
      setOrganization(mockOrg);
      localStorage.setItem('orgInfo', JSON.stringify(mockOrg));
    }

    await db.settings.put({
      id: 'current_session',
      staffId: 'demo-id',
      staffName: 'Demo Admin',
      deviceId: localStorage.getItem('deviceId') || 'unknown'
    });
    setIsLoading(false);
  };

  const logout = async () => {
    await db.settings.delete('current_session');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      organization, 
      login, 
      loginAsDemo,
      logout, 
      isLoading,
      userRole: user?.role || null
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
