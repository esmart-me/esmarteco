import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '../types.js';

interface AdminAuthContextType {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, role?: any) => Promise<boolean>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('esmart_admin_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return {
      id: 'adm-001',
      name: 'E Smart Executive Admin',
      email: 'admin@esmartelectronics.ae',
      role: 'SUPER_ADMIN'
    };
  });

  const login = async (email: string, role = 'SUPER_ADMIN') => {
    const user: AdminUser = {
      id: `adm-${Date.now()}`,
      name: email.split('@')[0].toUpperCase(),
      email,
      role
    };
    localStorage.setItem('esmart_admin_user', JSON.stringify(user));
    setAdmin(user);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('esmart_admin_user');
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        login,
        logout
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
};
