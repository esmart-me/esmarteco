import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Layers,
  Award,
  BarChart3,
  Users,
  Percent,
  Flame,
  Zap,
  Image as ImageIcon,
  History,
  Settings,
  LogOut,
  Bell,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext.js';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logout } = useAdminAuth();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const navItems = [
    { label: 'Overview', path: '/', icon: LayoutDashboard },
    { label: 'Products Catalog', path: '/products', icon: Package },
    { label: 'Categories', path: '/categories', icon: Layers },
    { label: 'Brands', path: '/brands', icon: Award },
    { label: 'Inventory Radar', path: '/inventory', icon: BarChart3 },
    { label: 'Orders & Invoices', path: '/orders', icon: ShoppingCart },
    { label: 'Customers', path: '/customers', icon: Users },
    { label: 'Weekly Deals', path: '/offers', icon: Flame },
    { label: 'Flash Sales', path: '/flash-sales', icon: Zap },
    { label: 'Coupons & Promos', path: '/coupons', icon: Percent },
    { label: 'Homepage CMS', path: '/banners', icon: ImageIcon },
    { label: 'Activity Logs', path: '/logs', icon: History },
    { label: 'Store Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-950 text-white flex flex-col fixed inset-y-0 z-30 shadow-xl">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white font-black text-xl shadow-md">
              E
            </div>
            <div>
              <div className="font-bold text-sm text-white tracking-wide">E SMART ADMIN</div>
              <div className="text-[10px] text-slate-400 font-medium">Abu Dhabi, UAE • FTA TRN</div>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info & Signout */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-brand-700 text-white flex items-center justify-center font-bold text-xs">
                {admin?.name?.charAt(0) || 'A'}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">{admin?.name || 'Administrator'}</p>
                <span className="inline-block text-[9px] font-semibold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800/50">
                  {admin?.role || 'SUPER_ADMIN'}
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 bg-white border-b border-slate-200/80 px-8 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-slate-800">
              {navItems.find((i) => i.path === location.pathname)?.label || 'Administration'}
            </h2>
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
              UAE Production Portal
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Direct Link to View Storefront */}
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 px-3 py-1.5 rounded-xl transition-all"
            >
              <span>View Customer Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <div className="h-4 w-px bg-slate-200" />

            {/* Quick Status */}
            <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Supabase Live</span>
            </div>
          </div>
        </header>

        {/* Sub-view Outlet */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
