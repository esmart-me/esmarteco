import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Address } from '../types/index.js';
import { apiRequest } from '../lib/api.js';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  saveAddress: (address: Partial<Address>) => Promise<boolean>;
  setDemoAdmin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('esmart_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await apiRequest('/auth/me');
        if (res.success && res.user) {
          setUser(res.user);
        } else {
          localStorage.removeItem('esmart_token');
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.error('Error verifying auth:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMe();
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    if (res.success && (res as any).token) {
      const newToken = (res as any).token;
      const loggedUser = (res as any).user;
      localStorage.setItem('esmart_token', newToken);
      setToken(newToken);
      setUser(loggedUser);
      return { success: true, message: res.message };
    }
    return { success: false, message: res.message || 'Login failed' };
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    const res = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, phone })
    });

    if (res.success && (res as any).token) {
      const newToken = (res as any).token;
      const loggedUser = (res as any).user;
      localStorage.setItem('esmart_token', newToken);
      setToken(newToken);
      setUser(loggedUser);
      return { success: true, message: res.message };
    }
    return { success: false, message: res.message || 'Registration failed' };
  };

  const logout = () => {
    localStorage.removeItem('esmart_token');
    localStorage.removeItem('esmart_admin_key');
    setToken(null);
    setUser(null);
  };

  const setDemoAdmin = () => {
    localStorage.setItem('esmart_admin_key', 'esmart-admin-2026');
    const adminUser: User = {
      id: 'usr-admin',
      name: 'E Smart Admin',
      email: 'admin@esmartelectronics.ae',
      phone: '+971 2 642 8990',
      role: 'admin',
      createdAt: new Date().toISOString()
    };
    setUser(adminUser);
  };

  const saveAddress = async (address: Partial<Address>) => {
    if (!user) return false;
    const res = await apiRequest('/auth/address', {
      method: 'POST',
      body: JSON.stringify(address)
    });
    if (res.success && (res as any).addresses) {
      setUser({ ...user, addresses: (res as any).addresses });
      return true;
    }
    return false;
  };

  const isAdmin = user?.role === 'admin' || localStorage.getItem('esmart_admin_key') === 'esmart-admin-2026';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAdmin,
        isLoading,
        login,
        register,
        logout,
        saveAddress,
        setDemoAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
