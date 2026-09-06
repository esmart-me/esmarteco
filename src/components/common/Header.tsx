import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Heart,
  User as UserIcon,
  Phone,
  Menu,
  X,
  Layers,
  ShieldCheck,
  Truck,
  HelpCircle,
  LogOut,
  Settings,
  ChevronDown
} from 'lucide-react';
import { useCart } from '../../context/CartContext.js';
import { useWishlist } from '../../context/WishlistContext.js';
import { useCompare } from '../../context/CompareContext.js';
import { useAuth } from '../../context/AuthContext.js';
import { SearchBar } from '../search/SearchBar.js';
import { formatAED } from '../../lib/utils.js';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { itemCount, total, setIsDrawerOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { compareCount } = useCompare();
  const { user, isAdmin, logout, setDemoAdmin } = useAuth();

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm transition-all">
      {/* Top Announcement Bar - UAE focused */}
      <div className="bg-slate-900 text-white text-[11px] py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Truck className="w-3.5 h-3.5 text-brand-400" />
              <span>Free Delivery across UAE on orders above AED 250</span>
            </span>
            <span className="hidden md:inline-block text-slate-500">•</span>
            <span className="hidden md:flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Genuine UAE Stock & Official Warranty</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <Link to="/track-order" className="hover:text-white transition-colors flex items-center gap-1">
              <span>Track Order</span>
            </Link>
            <span className="text-slate-600">|</span>
            <a
              href="https://wa.me/971508924118"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>+971 2 642 8990</span>
            </a>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="hidden sm:inline font-semibold text-white">AED (UAE Dirham)</span>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex items-center justify-between gap-4 md:gap-8">
          {/* Logo & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -ml-2 text-slate-700 hover:text-brand-700 md:hidden focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-800 via-brand-700 to-brand-500 flex items-center justify-center text-white font-black text-xl shadow-sm tracking-tighter">
                E
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight text-slate-900 leading-none">
                  E SMART<span className="text-brand-700">.</span>
                </span>
                <span className="text-[9px] font-semibold tracking-widest text-slate-400 uppercase leading-tight">
                  Abu Dhabi • UAE
                </span>
              </div>
            </Link>
          </div>

          {/* Search Bar - Center and highly visible */}
          <div className="hidden md:flex flex-1 max-w-2xl">
            <SearchBar />
          </div>

          {/* Actions: Compare, Wishlist, Account, Cart */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Compare Button */}
            <Link
              to="/compare"
              className="relative p-2 text-slate-600 hover:text-brand-700 hover:bg-slate-50 rounded-full transition-colors hidden sm:flex items-center justify-center"
              title="Compare Products"
            >
              <Layers className="w-5 h-5" />
              {compareCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-700 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {compareCount}
                </span>
              )}
            </Link>

            {/* Wishlist Button */}
            <Link
              to="/account?tab=wishlist"
              className="relative p-2 text-slate-600 hover:text-brand-700 hover:bg-slate-50 rounded-full transition-colors hidden sm:flex items-center justify-center"
              title="My Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Account / User Menu Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 text-slate-700 hover:text-brand-700 hover:bg-slate-50 rounded-full sm:rounded-xl transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-semibold text-xs">
                  {user ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-[10px] text-slate-400 font-medium">Hello,</span>
                  <span className="text-xs font-bold text-slate-800 leading-tight">
                    {user ? user.name.split(' ')[0] : 'Sign In'}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:inline" />
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                  className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-dropdown border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                        {isAdmin && (
                          <span className="mt-1 inline-block text-[10px] font-semibold bg-brand-50 text-brand-700 px-2 py-0.5 rounded">
                            Store Administrator
                          </span>
                        )}
                      </div>

                      <Link
                        to="/account"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-brand-700"
                      >
                        My Account & Profile
                      </Link>

                      <Link
                        to="/account?tab=orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-brand-700"
                      >
                        My Orders & Invoices
                      </Link>

                      <Link
                        to="/account?tab=wishlist"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-brand-700"
                      >
                        Wishlist ({wishlistCount})
                      </Link>

                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-3">
                      <p className="text-xs text-slate-600 mb-3">Sign in to track orders, save wishlist and get UAE member perks.</p>
                      <Link
                        to="/account"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block w-full py-2 bg-brand-700 hover:bg-brand-800 text-white text-center text-xs font-bold rounded-xl shadow-sm transition-colors"
                      >
                        Sign In / Register
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Shopping Cart Button */}
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="relative flex items-center gap-2.5 px-3 py-2 bg-brand-50 hover:bg-brand-100 text-brand-900 rounded-xl transition-all border border-brand-200"
              aria-label="Shopping Cart"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-brand-700" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-700 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[10px] font-semibold text-slate-500 leading-none">Cart</span>
                <span className="text-xs font-bold text-brand-800 leading-tight">
                  {formatAED(total)}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Row */}
        <div className="mt-3 md:hidden">
          <SearchBar onCloseMobile={() => setIsMobileMenuOpen(false)} />
        </div>
      </div>

      {/* Navigation Sub-header (Desktop) */}
      <nav className="hidden md:block bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ul className="flex items-center gap-7 text-xs font-semibold text-slate-700 overflow-x-auto py-2.5">
            <li>
              <Link to="/shop" className="hover:text-brand-700 transition-colors flex items-center gap-1.5 py-1">
                <Menu className="w-3.5 h-3.5 text-brand-700" />
                <span>All Categories</span>
              </Link>
            </li>
            <li>
              <Link to="/shop?category=smartphones" className="hover:text-brand-700 transition-colors py-1">
                Smartphones
              </Link>
            </li>
            <li>
              <Link to="/shop?category=laptops" className="hover:text-brand-700 transition-colors py-1">
                Laptops
              </Link>
            </li>
            <li>
              <Link to="/shop?category=tablets" className="hover:text-brand-700 transition-colors py-1">
                Tablets
              </Link>
            </li>
            <li>
              <Link to="/shop?category=headphones" className="hover:text-brand-700 transition-colors py-1">
                Audio & Headphones
              </Link>
            </li>
            <li>
              <Link to="/shop?category=gaming" className="hover:text-brand-700 transition-colors py-1">
                Gaming
              </Link>
            </li>
            <li>
              <Link to="/shop?category=power-banks" className="hover:text-brand-700 transition-colors py-1">
                Power & Charging
              </Link>
            </li>
            <li className="ml-auto flex items-center gap-4">
              <Link
                to="/shop?weeklyOffer=true"
                className="text-brand-700 hover:text-brand-900 font-bold flex items-center gap-1 bg-brand-50 px-2.5 py-1 rounded-full"
              >
                <span>Weekly Deals</span>
              </Link>
              <Link
                to="/shop?flashSale=true"
                className="text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full"
              >
                <span>Flash Sales</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl z-10 flex flex-col overflow-y-auto">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-700 flex items-center justify-center text-white font-bold text-sm">
                  E
                </div>
                <span className="font-black text-slate-900">E SMART ELECTRONICS</span>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 text-slate-500 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Shop By Category</p>
                <div className="divide-y divide-slate-100 text-sm font-medium text-slate-800">
                  <Link
                    to="/shop"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2.5 hover:text-brand-700"
                  >
                    All Electronics Catalog
                  </Link>
                  <Link
                    to="/shop?category=smartphones"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2.5 hover:text-brand-700"
                  >
                    Smartphones & iPhones
                  </Link>
                  <Link
                    to="/shop?category=laptops"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2.5 hover:text-brand-700"
                  >
                    Laptops & MacBooks
                  </Link>
                  <Link
                    to="/shop?category=tablets"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2.5 hover:text-brand-700"
                  >
                    Tablets & iPads
                  </Link>
                  <Link
                    to="/shop?category=headphones"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2.5 hover:text-brand-700"
                  >
                    Headphones & Audio
                  </Link>
                  <Link
                    to="/shop?category=gaming"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2.5 hover:text-brand-700"
                  >
                    Gaming Consoles & Gear
                  </Link>
                  <Link
                    to="/shop?category=power-banks"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2.5 hover:text-brand-700"
                  >
                    Power Banks & Chargers
                  </Link>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <Link
                  to="/shop?weeklyOffer=true"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block p-2.5 rounded-xl bg-brand-50 text-brand-700 font-bold text-sm"
                >
                  Weekly Offers & Deals
                </Link>
                <Link
                  to="/shop?flashSale=true"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block p-2.5 rounded-xl bg-amber-50 text-amber-700 font-bold text-sm"
                >
                  Flash Sales (Limited Quota)
                </Link>
                <Link
                  to="/compare"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block p-2.5 rounded-xl bg-slate-50 text-slate-700 font-medium text-sm flex items-center justify-between"
                >
                  <span>Compare Products</span>
                  <span className="bg-brand-700 text-white text-[10px] px-2 py-0.5 rounded-full">
                    {compareCount}
                  </span>
                </Link>
                <Link
                  to="/track-order"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block p-2.5 rounded-xl bg-slate-50 text-slate-700 font-medium text-sm"
                >
                  Track UAE Delivery
                </Link>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2">
                <Link
                  to="/account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full block py-2.5 text-center bg-brand-700 text-white rounded-xl font-bold text-sm"
                >
                  {user ? 'My Account' : 'Sign In / Register'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
