import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext.js';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAdminAuth();
  const [email, setEmail] = useState('admin@esmartelectronics.ae');
  const [password, setPassword] = useState('Admin@2026');
  const [role, setRole] = useState<'SUPER_ADMIN' | 'PRODUCT_MANAGER' | 'ORDER_MANAGER'>('SUPER_ADMIN');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await login(email, role);
    setIsLoading(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 shadow-xl text-white font-black text-3xl mb-4">
          E
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">
          E Smart Electronics LLC
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Executive Administration & UAE Merchant Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900 py-8 px-6 shadow-2xl rounded-3xl sm:px-10 border border-slate-800">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Admin Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Security Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Role Permission Level
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="SUPER_ADMIN">SUPER_ADMIN (Full Control)</option>
                <option value="PRODUCT_MANAGER">PRODUCT_MANAGER (Catalog & Offers)</option>
                <option value="ORDER_MANAGER">ORDER_MANAGER (Fulfillment & Tracking)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 rounded-xl shadow-md text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 focus:outline-none transition-all disabled:opacity-50"
            >
              <span>{isLoading ? 'Authenticating...' : 'Sign In To Control Center'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <span className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Protected by Row Level Security (RLS)</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
