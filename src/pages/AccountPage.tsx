import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  User,
  Package,
  Heart,
  MapPin,
  LogOut,
  ShieldAlert,
  FileText,
  Clock,
  Trash2,
  ShoppingCart,
  Eye,
  Settings,
  Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useWishlist } from '../context/WishlistContext.js';
import { useCart } from '../context/CartContext.js';
import { apiRequest } from '../lib/api.js';
import { Order } from '../types/index.js';
import { formatAED } from '../lib/utils.js';
import { TaxInvoiceModal } from '../components/common/TaxInvoiceModal.js';

export const AccountPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'orders';
  const navigate = useNavigate();

  const { user, logout, setDemoAdmin, saveAddress } = useAuth();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  // New address state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addrTitle, setAddrTitle] = useState('Home');
  const [addrFullName, setAddrFullName] = useState(user?.name || '');
  const [addrPhone, setAddrPhone] = useState(user?.phone || '');
  const [addrApartment, setAddrApartment] = useState('');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrArea, setAddrArea] = useState('');
  const [addrCity, setAddrCity] = useState('Abu Dhabi');
  const [addrEmirate, setAddrEmirate] = useState('Abu Dhabi');

  // Auth form state if user not logged in
  const [isLoginView, setIsLoginView] = useState(true);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const { login, register } = useAuth();

  useEffect(() => {
    if (user && activeTab === 'orders') {
      const fetchOrders = async () => {
        setIsLoadingOrders(true);
        try {
          const res = await apiRequest('/orders/my-orders');
          if (res.success && res.orders) {
            setOrders(res.orders);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoadingOrders(false);
        }
      };
      fetchOrders();
    }
  }, [user, activeTab]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthLoading(true);

    try {
      if (isLoginView) {
        const res = await login(authEmail, authPassword);
        if (!res.success) setAuthError(res.message || 'Login failed');
      } else {
        const res = await register(authName, authEmail, authPassword, authPhone);
        if (!res.success) setAuthError(res.message || 'Registration failed');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Auth error');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveAddress({
      title: addrTitle,
      fullName: addrFullName,
      phone: addrPhone,
      apartmentVilla: addrApartment,
      street: addrStreet,
      area: addrArea,
      city: addrCity,
      emirate: addrEmirate,
      country: 'United Arab Emirates'
    });
    setShowAddressModal(false);
  };

  // If user is not logged in, render customer portal sign-in / registration
  if (!user) {
    return (
      <div className="min-h-[80vh] bg-white py-12 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-slate-50/80 rounded-3xl p-8 border border-slate-200/80 shadow-sm">
          <div className="text-center mb-6">
            <div className="w-10 h-10 rounded-2xl bg-brand-700 text-white font-black text-lg flex items-center justify-center mx-auto mb-2">
              E
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {isLoginView ? 'Sign in to E Smart Electronics' : 'Create Customer Account'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {isLoginView
                ? 'Access your UAE orders, invoices, and saved delivery addresses.'
                : 'Join UAE’s premier electronics store for exclusive deals.'}
            </p>
          </div>

          {authError && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
              {authError}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-3.5 text-xs">
            {!isLoginView && (
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={authName}
                  onChange={e => setAuthName(e.target.value)}
                  required
                  placeholder="e.g. Rashid Al Nuaimi"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-600"
                />
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={authEmail}
                onChange={e => setAuthEmail(e.target.value)}
                required
                placeholder="name@domain.ae"
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-600"
              />
            </div>

            {!isLoginView && (
              <div>
                <label className="block font-bold text-slate-700 mb-1">UAE Phone Number</label>
                <input
                  type="tel"
                  value={authPhone}
                  onChange={e => setAuthPhone(e.target.value)}
                  placeholder="+971 50 123 4567"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-600"
                />
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                value={authPassword}
                onChange={e => setAuthPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-600"
              />
            </div>

            <button
              type="submit"
              disabled={isAuthLoading}
              className="w-full py-3 bg-brand-700 hover:bg-brand-800 text-white font-bold rounded-xl shadow-sm transition-colors text-xs"
            >
              {isAuthLoading ? 'Please wait...' : isLoginView ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Toggle between Login and Register */}
          <div className="mt-4 pt-4 border-t border-slate-200 text-center text-xs text-slate-600">
            {isLoginView ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsLoginView(false);
                    setAuthError('');
                  }}
                  className="font-bold text-brand-700 hover:underline"
                >
                  Register here
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsLoginView(true);
                    setAuthError('');
                  }}
                  className="font-bold text-brand-700 hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>

          {/* Quick Demo Credentials helper */}
          <div className="mt-6 pt-4 border-t border-slate-200 text-center">
            <p className="text-[11px] text-slate-400 font-bold mb-2 uppercase tracking-wider">Quick One-Click Demo Access:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setAuthEmail('customer@gmail.com');
                  setAuthPassword('Customer@123');
                }}
                className="py-1.5 px-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold hover:bg-slate-100"
              >
                Fill Customer Demo
              </button>
              <button
                type="button"
                onClick={() => {
                  setDemoAdmin();
                  navigate('/admin');
                }}
                className="py-1.5 px-2 bg-slate-900 text-white rounded-lg text-[11px] font-semibold hover:bg-slate-800"
              >
                Access Admin Portal
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Welcome Header */}
        <div className="bg-slate-50/70 rounded-3xl p-6 sm:p-8 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-700 text-white flex items-center justify-center font-black text-xl shadow-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">{user.name}</h1>
                {user.role === 'admin' && (
                  <span className="px-2 py-0.5 bg-brand-100 text-brand-800 text-[10px] font-bold rounded-md uppercase">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{user.email} • {user.phone || '+971 UAE'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {user.role === 'admin' && (
              <Link
                to="/admin"
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-slate-800 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>Admin Operations</span>
              </Link>
            )}

            <button
              type="button"
              onClick={logout}
              className="px-4 py-2 bg-white border border-slate-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-6 overflow-x-auto text-xs font-bold">
          <button
            type="button"
            onClick={() => setSearchParams({ tab: 'orders' })}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-colors ${
              activeTab === 'orders' ? 'bg-brand-700 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Orders & Invoices</span>
          </button>

          <button
            type="button"
            onClick={() => setSearchParams({ tab: 'wishlist' })}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-colors ${
              activeTab === 'wishlist' ? 'bg-brand-700 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Wishlist ({wishlist.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSearchParams({ tab: 'addresses' })}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-colors ${
              activeTab === 'addresses' ? 'bg-brand-700 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved UAE Addresses</span>
          </button>
        </div>

        {/* Tab: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {isLoadingOrders ? (
              <div className="py-16 text-center">
                <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-700 rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-500 mt-2">Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 bg-slate-50/60 rounded-3xl p-8 border border-slate-100">
                <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-slate-900">No Orders Found</h3>
                <p className="text-xs text-slate-500 mt-1">You have not placed any orders with this account yet.</p>
                <Link
                  to="/shop"
                  className="mt-4 inline-block px-5 py-2.5 bg-brand-700 text-white rounded-xl text-xs font-bold"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-brand-700">{order.orderNumber}</span>
                          <span className="px-2.5 py-0.5 bg-brand-50 text-brand-800 text-[10px] font-extrabold rounded-md uppercase">
                            {order.orderStatus}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Placed on {order.createdAt.split('T')[0]} • Paid via {order.paymentMethod.toUpperCase()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/track-order?orderNumber=${order.orderNumber}`}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
                        >
                          Track UAE Courier
                        </Link>
                        <button
                          type="button"
                          onClick={() => setSelectedInvoiceOrder(order)}
                          className="px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Tax Invoice</span>
                        </button>
                      </div>
                    </div>

                    {/* Order items preview */}
                    <div className="divide-y divide-slate-100">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="py-2 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <img src={item.productImage} alt="" className="w-10 h-10 object-contain mix-blend-multiply" />
                            <div>
                              <p className="font-bold text-slate-900">{item.productTitle}</p>
                              <p className="text-[10px] text-slate-400">Qty: {item.quantity} • Unit: {formatAED(item.unitPrice)}</p>
                            </div>
                          </div>
                          <span className="font-bold text-slate-900">{formatAED(item.totalPrice)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-bold">
                      <span className="text-slate-500">Destination: {order.shippingAddress.emirate}</span>
                      <div className="text-right">
                        <span className="text-slate-500 mr-2">Total Amount (5% VAT Incl):</span>
                        <span className="text-brand-700 text-sm font-black">{formatAED(order.total)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Wishlist */}
        {activeTab === 'wishlist' && (
          <div>
            {wishlist.length === 0 ? (
              <div className="text-center py-16 bg-slate-50/60 rounded-3xl p-8 border border-slate-100">
                <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-slate-900">Your Wishlist is Empty</h3>
                <p className="text-xs text-slate-500 mt-1">Save electronics you love to buy them later.</p>
                <Link
                  to="/shop"
                  className="mt-4 inline-block px-5 py-2.5 bg-brand-700 text-white rounded-xl text-xs font-bold"
                >
                  Explore Electronics
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {wishlist.map(product => (
                  <div key={product.id} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="w-full h-44 bg-slate-50 rounded-xl p-2 flex items-center justify-center mb-3">
                        <img src={product.images[0]} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                      <span className="text-[10px] font-bold text-brand-700 uppercase">{product.brand}</span>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{product.title}</h4>
                      <p className="text-xs font-black text-slate-900 mt-2">{formatAED(product.salePrice)}</p>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => addToCart(product, 1)}
                        className="py-2 bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromWishlist(product.id)}
                        className="py-2 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Addresses */}
        {activeTab === 'addresses' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-black text-slate-900">Saved UAE Delivery Addresses</h3>
              <button
                type="button"
                onClick={() => setShowAddressModal(true)}
                className="px-4 py-2 bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Address</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(user.addresses || []).map(addr => (
                <div key={addr.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{addr.title}</span>
                    {addr.isDefault && (
                      <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">Default</span>
                    )}
                  </div>
                  <p className="font-bold text-slate-900">{addr.fullName}</p>
                  <p className="text-slate-600">{addr.phone}</p>
                  <p className="text-slate-600">{addr.apartmentVilla}, {addr.street}</p>
                  <p className="text-slate-900 font-semibold">{addr.emirate}, UAE</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tax invoice modal */}
        <TaxInvoiceModal order={selectedInvoiceOrder} onClose={() => setSelectedInvoiceOrder(null)} />
      </div>
    </div>
  );
};
