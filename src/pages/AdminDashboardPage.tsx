import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Image as ImageIcon,
  Flame,
  Zap,
  Tag,
  Users,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle,
  FileText,
  Upload,
  ArrowUpRight,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { apiRequest } from '../lib/api.js';
import {
  Product,
  Banner,
  WeeklyOffer,
  FlashSale,
  Coupon,
  Order,
  OrderStatus
} from '../types/index.js';
import { formatAED } from '../lib/utils.js';
import { TaxInvoiceModal } from '../components/common/TaxInvoiceModal.js';

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'analytics' | 'products' | 'orders' | 'banners' | 'offers' | 'inventory' | 'coupons' | 'customers'
  >('analytics');

  // Analytics data
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);

  // Products
  const [products, setProducts] = useState<Product[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  // Banners CMS
  const [banners, setBanners] = useState<Banner[]>([]);
  const [showBannerModal, setShowBannerModal] = useState(false);

  // Weekly Offers & Flash Sales
  const [weeklyOffers, setWeeklyOffers] = useState<any[]>([]);
  const [flashSales, setFlashSales] = useState<any[]>([]);

  // Coupons
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  // Customers
  const [customers, setCustomers] = useState<any[]>([]);

  // Notifications
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  const triggerSuccess = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(''), 3000);
  };

  // Fetch initial dashboard data
  const refreshData = async () => {
    try {
      const [
        anaRes,
        prodRes,
        ordRes,
        banRes,
        woRes,
        fsRes,
        coupRes,
        custRes
      ] = await Promise.all([
        apiRequest('/admin/analytics'),
        apiRequest('/admin/products'),
        apiRequest('/admin/orders'),
        apiRequest('/admin/banners'),
        apiRequest('/admin/weekly-offers'),
        apiRequest('/admin/flash-sales'),
        apiRequest('/admin/coupons'),
        apiRequest('/admin/customers')
      ]);

      if (anaRes.success) setAnalytics(anaRes.analytics);
      if (prodRes.success) setProducts(prodRes.products || []);
      if (ordRes.success) setOrders(ordRes.orders || []);
      if (banRes.success) setBanners(banRes.banners || []);
      if (woRes.success) setWeeklyOffers(woRes.offers || []);
      if (fsRes.success) setFlashSales(fsRes.sales || []);
      if (coupRes.success) setCoupons(coupRes.coupons || []);
      if (custRes.success) setCustomers(custRes.customers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // --- Product Form State ---
  const [prodTitle, setProdTitle] = useState('');
  const [prodBrand, setProdBrand] = useState('');
  const [prodModel, setProdModel] = useState('');
  const [prodCategory, setProdCategory] = useState('smartphones');
  const [prodOriginalPrice, setProdOriginalPrice] = useState('');
  const [prodSalePrice, setProdSalePrice] = useState('');
  const [prodCostPrice, setProdCostPrice] = useState('');
  const [prodStock, setProdStock] = useState('10');
  const [prodWarranty, setProdWarranty] = useState('1 Year Official UAE Warranty');
  const [prodDescription, setProdDescription] = useState('');
  const [prodImages, setProdImages] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isWeekly, setIsWeekly] = useState(false);
  const [isFlash, setIsFlash] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const openAddProductModal = () => {
    setEditingProduct(null);
    setProdTitle('');
    setProdBrand('');
    setProdModel('');
    setProdCategory('smartphones');
    setProdOriginalPrice('');
    setProdSalePrice('');
    setProdCostPrice('');
    setProdStock('10');
    setProdWarranty('1 Year Official UAE Warranty');
    setProdDescription('');
    setProdImages([]);
    setImageInput('');
    setIsFeatured(false);
    setIsWeekly(false);
    setIsFlash(false);
    setShowProductModal(true);
  };

  const openEditProductModal = (prod: Product) => {
    setEditingProduct(prod);
    setProdTitle(prod.title);
    setProdBrand(prod.brand);
    setProdModel(prod.model);
    setProdCategory(prod.categorySlug);
    setProdOriginalPrice(String(prod.originalPrice));
    setProdSalePrice(String(prod.salePrice));
    setProdCostPrice(String(prod.costPrice || ''));
    setProdStock(String(prod.stock));
    setProdWarranty(prod.warranty);
    setProdDescription(prod.description);
    setProdImages(prod.images || []);
    setIsFeatured(prod.isFeatured);
    setIsWeekly(prod.isWeeklyOffer);
    setIsFlash(prod.isFlashSale);
    setShowProductModal(true);
  };

  // Image Upload handler for Multer
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setIsUploadingImage(true);

    try {
      const token = localStorage.getItem('esmart_token');
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: formData
      });
      const data = await res.json();
      if (data.success && data.imageUrl) {
        setProdImages(prev => [...prev, data.imageUrl]);
        triggerSuccess('Image uploaded successfully!');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: prodTitle,
      brand: prodBrand,
      model: prodModel || prodTitle,
      categorySlug: prodCategory,
      originalPrice: Number(prodOriginalPrice) || Number(prodSalePrice),
      salePrice: Number(prodSalePrice),
      costPrice: Number(prodCostPrice) || Math.round(Number(prodSalePrice) * 0.8),
      stock: Number(prodStock),
      warranty: prodWarranty,
      description: prodDescription,
      images: prodImages.length > 0 ? prodImages : ['https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop&q=85'],
      isFeatured,
      isWeeklyOffer: isWeekly,
      isFlashSale: isFlash
    };

    if (editingProduct) {
      await apiRequest(`/admin/products/${editingProduct.id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
      triggerSuccess(`Product "${prodTitle}" updated!`);
    } else {
      await apiRequest('/admin/products', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      triggerSuccess(`Product "${prodTitle}" added to catalog!`);
    }

    setShowProductModal(false);
    refreshData();
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    await apiRequest(`/admin/products/${id}`, { method: 'DELETE' });
    triggerSuccess('Product removed.');
    refreshData();
  };

  // --- Order Status Update ---
  const handleOrderStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    const res = await apiRequest(`/admin/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status: newStatus })
    });
    if (res.success) {
      triggerSuccess(`Order updated to "${newStatus}"`);
      refreshData();
    }
  };

  // Filter products by search
  const filteredProducts = products.filter(
    p =>
      p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-slate-900 text-white text-[10px] font-black uppercase tracking-wider">
                E Smart Electronics LLC
              </span>
              <span className="text-xs text-slate-500 font-semibold">Store Management Console</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              Admin & Content Operations Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={refreshData}
              className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold shadow-sm transition-colors"
            >
              Refresh Data
            </button>
            <button
              type="button"
              onClick={openAddProductModal}
              className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>
        </div>

        {/* Action success alert */}
        {actionSuccessMsg && (
          <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle className="w-4 h-4" />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {/* Admin Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors flex-shrink-0 ${
              activeTab === 'analytics' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Analytics & KPIs</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors flex-shrink-0 ${
              activeTab === 'products' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products Catalog ({products.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors flex-shrink-0 ${
              activeTab === 'orders' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Customer Orders ({orders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('banners')}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors flex-shrink-0 ${
              activeTab === 'banners' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Homepage CMS Banners</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('offers')}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors flex-shrink-0 ${
              activeTab === 'offers' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Weekly Deals & Flash Sales</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors flex-shrink-0 ${
              activeTab === 'inventory' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Stock & Inventory Radar</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('coupons')}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors flex-shrink-0 ${
              activeTab === 'coupons' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Promo Coupons</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('customers')}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors flex-shrink-0 ${
              activeTab === 'customers' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Customers</span>
          </button>
        </div>

        {/* TAB 1: ANALYTICS & INSIGHTS */}
        {activeTab === 'analytics' && analytics && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Top 4 KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Sales (AED)</span>
                <div className="text-2xl font-black text-slate-900 mt-2">{formatAED(analytics.totalSales)}</div>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>5% UAE VAT included</span>
                </p>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders</span>
                <div className="text-2xl font-black text-slate-900 mt-2">{analytics.totalOrders}</div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {analytics.deliveredOrders} delivered • {analytics.pendingOrders} in progress
                </p>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Order Value</span>
                <div className="text-2xl font-black text-brand-700 mt-2">{formatAED(analytics.averageOrderValue)}</div>
                <p className="text-[11px] text-slate-500 mt-1">High conversion across Emirates</p>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Stock Health</span>
                <div className="text-2xl font-black text-slate-900 mt-2">{analytics.totalProducts} items</div>
                <p className="text-[11px] text-rose-600 font-semibold mt-1">
                  {analytics.lowStockCount} items below safety threshold
                </p>
              </div>
            </div>

            {/* Recent Orders in Admin */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4">
                Recent Customer Orders
              </h3>
              <div className="divide-y divide-slate-100">
                {orders.slice(0, 5).map(ord => (
                  <div key={ord.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">{ord.orderNumber}</span>
                        <span className="font-bold text-slate-600">• {ord.customer.fullName}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {ord.shippingAddress.emirate} • {ord.items.length} items • {ord.paymentMethod.toUpperCase()}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-black text-slate-900">{formatAED(ord.total)}</span>
                      <span className="px-2.5 py-0.5 bg-brand-50 text-brand-800 rounded text-[10px] font-bold">
                        {ord.orderStatus}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedInvoiceOrder(ord)}
                        className="p-1 text-brand-700 hover:underline font-semibold text-xs"
                      >
                        Invoice
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCT MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-4 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="relative flex-1 max-w-sm">
                <input
                  type="text"
                  value={productSearch}
                  onChange={e => setProductSearch(e.target.value)}
                  placeholder="Filter by title, brand, SKU..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-600"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <span className="text-xs font-bold text-slate-500">
                {filteredProducts.length} products listed
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="py-2.5">Product</th>
                    <th className="py-2.5">Brand & SKU</th>
                    <th className="py-2.5">Price (AED)</th>
                    <th className="py-2.5">Stock</th>
                    <th className="py-2.5">Badges</th>
                    <th className="py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map(prod => (
                    <tr key={prod.id} className="hover:bg-slate-50/50">
                      <td className="py-3 pr-2">
                        <div className="flex items-center gap-3">
                          <img src={prod.images[0]} alt="" className="w-10 h-10 object-contain mix-blend-multiply flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 truncate max-w-xs">{prod.title}</p>
                            <p className="text-[10px] text-slate-400 capitalize">{prod.categorySlug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="font-bold text-slate-800">{prod.brand}</span>
                        <p className="text-[10px] font-mono text-slate-400">{prod.sku}</p>
                      </td>
                      <td className="py-3 font-bold text-slate-900">
                        {formatAED(prod.salePrice)}
                        {prod.originalPrice > prod.salePrice && (
                          <span className="block text-[10px] text-slate-400 line-through">
                            {formatAED(prod.originalPrice)}
                          </span>
                        )}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          prod.stock <= prod.stockAlertThreshold
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {prod.stock} in stock
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex flex-wrap gap-1">
                          {prod.isFeatured && <span className="px-1.5 py-0.5 bg-brand-50 text-brand-700 rounded text-[9px] font-bold">Featured</span>}
                          {prod.isWeeklyOffer && <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded text-[9px] font-bold">Weekly</span>}
                          {prod.isFlashSale && <span className="px-1.5 py-0.5 bg-rose-50 text-rose-700 rounded text-[9px] font-bold">Flash</span>}
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditProductModal(prod)}
                            className="p-1.5 text-slate-600 hover:text-brand-700 rounded-lg hover:bg-slate-100"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ORDER MANAGEMENT & 10 STATUSES */}
        {activeTab === 'orders' && (
          <div className="space-y-4 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm animate-in fade-in duration-200">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-2">
              Orders Operations & UAE Dispatch
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="py-2.5">Order Ref</th>
                    <th className="py-2.5">Customer</th>
                    <th className="py-2.5">Emirate</th>
                    <th className="py-2.5">Total Amount</th>
                    <th className="py-2.5">Payment</th>
                    <th className="py-2.5">Change Status</th>
                    <th className="py-2.5 text-right">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map(ord => (
                    <tr key={ord.id} className="hover:bg-slate-50/50">
                      <td className="py-3 font-mono font-bold text-brand-700">
                        {ord.orderNumber}
                        <span className="block text-[10px] text-slate-400 font-sans">{ord.createdAt.split('T')[0]}</span>
                      </td>
                      <td className="py-3">
                        <p className="font-bold text-slate-900">{ord.customer.fullName}</p>
                        <p className="text-[10px] text-slate-400">{ord.customer.phone}</p>
                      </td>
                      <td className="py-3 font-medium text-slate-700">
                        {ord.shippingAddress.emirate}
                      </td>
                      <td className="py-3 font-black text-slate-900">
                        {formatAED(ord.total)}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          ord.paymentStatus === 'confirmed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {ord.paymentStatus} ({ord.paymentMethod})
                        </span>
                      </td>
                      <td className="py-3">
                        <select
                          value={ord.orderStatus}
                          onChange={e => handleOrderStatusUpdate(ord.id, e.target.value as OrderStatus)}
                          className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-semibold text-slate-800 outline-none focus:border-brand-600 cursor-pointer"
                        >
                          <option value="Order Received">Order Received</option>
                          <option value="Payment Pending">Payment Pending</option>
                          <option value="Payment Confirmed">Payment Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Packed">Packed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                          <option value="Refunded">Refunded</option>
                        </select>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedInvoiceOrder(ord)}
                          className="px-2.5 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold rounded-lg text-xs"
                        >
                          Tax Invoice
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: CMS BANNERS */}
        {activeTab === 'banners' && (
          <div className="space-y-4 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Homepage Banner CMS</h3>
                <p className="text-xs text-slate-500">Edit hero sliders and promo banners without touching code.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {banners.map(b => (
                <div key={b.id} className="border border-slate-200 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden bg-slate-50">
                  <div className="h-32 rounded-xl overflow-hidden mb-3">
                    <img src={b.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="px-2 py-0.5 bg-brand-100 text-brand-800 text-[10px] font-bold rounded uppercase">
                      {b.type} • Slide #{b.order}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 mt-1">{b.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{b.subtitle}</p>
                    <p className="text-xs font-bold text-brand-700 mt-1">{b.offerText}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center text-xs">
                    <span className="text-slate-400">Target: {b.ctaLink}</span>
                    <span className="text-emerald-600 font-bold">Active</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: WEEKLY DEALS & FLASH SALES */}
        {activeTab === 'offers' && (
          <div className="space-y-6 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm animate-in fade-in duration-200">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-2">
                Active Weekly Offers (With Countdown Timers)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {weeklyOffers.map((wo: any) => (
                  <div key={wo.id} className="border border-slate-200 rounded-2xl p-3 bg-slate-50/50">
                    <p className="font-bold text-xs text-slate-900 truncate">{wo.product?.title || 'Weekly Deal'}</p>
                    <p className="text-xs font-black text-brand-700 mt-1">{formatAED(wo.offerPrice)}</p>
                    <p className="text-[10px] text-slate-500 mt-1">Expires: {wo.expiresAt.split('T')[0]}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-2">
                Active Flash Sales ("Only X Left" Stock Quotas)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {flashSales.map((fs: any) => (
                  <div key={fs.id} className="border border-amber-200 bg-amber-50/40 rounded-2xl p-3">
                    <p className="font-bold text-xs text-slate-900 truncate">{fs.product?.title || 'Flash Deal'}</p>
                    <p className="text-xs font-black text-slate-900 mt-1">{formatAED(fs.flashPrice)}</p>
                    <p className="text-[11px] font-bold text-rose-600 mt-1">Only {fs.remainingStock} units left</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: INVENTORY RADAR */}
        {activeTab === 'inventory' && analytics && (
          <div className="space-y-4 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm animate-in fade-in duration-200">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-2">
              Low-Stock Warnings & Inventory Control
            </h3>
            <div className="divide-y divide-slate-100">
              {analytics.lowStockProducts?.map((prod: Product) => (
                <div key={prod.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <img src={prod.images[0]} alt="" className="w-10 h-10 object-contain mix-blend-multiply" />
                    <div>
                      <p className="font-bold text-slate-900">{prod.title}</p>
                      <p className="text-[10px] text-slate-400">SKU: {prod.sku} • Alert threshold: {prod.stockAlertThreshold}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 bg-rose-50 text-rose-700 font-bold rounded-lg text-xs">
                      {prod.stock === 0 ? 'OUT OF STOCK' : `Only ${prod.stock} Left`}
                    </span>
                    <button
                      type="button"
                      onClick={async () => {
                        const newStock = prompt(`Update stock quantity for ${prod.title}:`, String(prod.stock + 10));
                        if (newStock) {
                          await apiRequest(`/admin/inventory/${prod.id}`, {
                            method: 'PUT',
                            body: JSON.stringify({ stock: Number(newStock) })
                          });
                          triggerSuccess(`Stock updated for ${prod.title}`);
                          refreshData();
                        }
                      }}
                      className="px-3 py-1.5 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800"
                    >
                      Quick Restock
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: COUPONS */}
        {activeTab === 'coupons' && (
          <div className="space-y-4 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm animate-in fade-in duration-200">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-2">
              Promotional Coupons
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {coupons.map(c => (
                <div key={c.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-brand-700 text-sm">{c.code}</span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">Active</span>
                  </div>
                  <p className="font-bold text-slate-800">
                    {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `AED ${c.discountValue} OFF`}
                  </p>
                  <p className="text-[11px] text-slate-500">Min Order: AED {c.minOrderValue}</p>
                  <p className="text-[11px] text-slate-400">Used {c.timesUsed} of {c.usageLimit} times</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: CUSTOMERS */}
        {activeTab === 'customers' && (
          <div className="space-y-4 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm animate-in fade-in duration-200">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-2">
              Registered UAE Customers ({customers.length})
            </h3>
            <div className="divide-y divide-slate-100 text-xs">
              {customers.map((cust: any) => (
                <div key={cust.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">{cust.name}</p>
                    <p className="text-[11px] text-slate-400">{cust.email} • {cust.phone || 'No phone'}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900">{cust.ordersCount} Orders</span>
                    <p className="text-[11px] font-black text-brand-700">{formatAED(cust.totalSpent)} total spent</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Product Add/Edit Modal */}
        {showProductModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-lg font-black text-slate-900 mb-4">
                {editingProduct ? 'Edit Product Details' : 'Add New Electronics Product'}
              </h2>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Product Title *</label>
                  <input
                    type="text"
                    value={prodTitle}
                    onChange={e => setProdTitle(e.target.value)}
                    required
                    placeholder="e.g. Apple iPhone 16 Pro Max 256GB"
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-brand-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Brand *</label>
                    <input
                      type="text"
                      value={prodBrand}
                      onChange={e => setProdBrand(e.target.value)}
                      required
                      placeholder="e.g. Apple, Samsung, Sony"
                      className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-brand-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Category *</label>
                    <select
                      value={prodCategory}
                      onChange={e => setProdCategory(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-brand-600"
                    >
                      <option value="smartphones">Smartphones</option>
                      <option value="laptops">Laptops</option>
                      <option value="tablets">Tablets</option>
                      <option value="smartwatches">Smartwatches</option>
                      <option value="headphones">Headphones</option>
                      <option value="tws-earbuds">TWS Earbuds</option>
                      <option value="speakers">Speakers</option>
                      <option value="power-banks">Power Banks</option>
                      <option value="chargers">Chargers</option>
                      <option value="cables">Cables</option>
                      <option value="mobile-accessories">Mobile Accessories</option>
                      <option value="computer-accessories">Computer Accessories</option>
                      <option value="gaming">Gaming</option>
                      <option value="smart-devices">Smart Devices</option>
                      <option value="multimedia">Multimedia</option>
                      <option value="other-electronics">Other Electronics</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Sale Price (AED) *</label>
                    <input
                      type="number"
                      value={prodSalePrice}
                      onChange={e => setProdSalePrice(e.target.value)}
                      required
                      placeholder="4799"
                      className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-brand-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Original Price (AED)</label>
                    <input
                      type="number"
                      value={prodOriginalPrice}
                      onChange={e => setProdOriginalPrice(e.target.value)}
                      placeholder="5099"
                      className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-brand-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Stock Units *</label>
                    <input
                      type="number"
                      value={prodStock}
                      onChange={e => setProdStock(e.target.value)}
                      required
                      placeholder="10"
                      className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-brand-600"
                    />
                  </div>
                </div>

                {/* Upload Image / Image URL */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Product Images (Upload or Image URL)</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={imageInput}
                      onChange={e => setImageInput(e.target.value)}
                      placeholder="Paste image URL..."
                      className="flex-1 p-2.5 border border-slate-200 rounded-xl outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (imageInput.trim()) {
                          setProdImages(prev => [...prev, imageInput.trim()]);
                          setImageInput('');
                        }
                      }}
                      className="px-4 py-2 bg-slate-100 text-slate-800 rounded-xl font-bold hover:bg-slate-200"
                    >
                      Add URL
                    </button>
                  </div>

                  {/* Multer Upload */}
                  <div className="flex items-center gap-3 p-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl">
                    <Upload className="w-5 h-5 text-slate-500" />
                    <label className="cursor-pointer text-brand-700 font-bold hover:underline">
                      <span>{isUploadingImage ? 'Uploading image...' : 'Click to Upload Image File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={isUploadingImage}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {prodImages.length > 0 && (
                    <div className="flex gap-2 mt-2 overflow-x-auto">
                      {prodImages.map((img, i) => (
                        <div key={i} className="relative w-16 h-16 rounded-xl border p-1 bg-white flex-shrink-0">
                          <img src={img} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                          <button
                            type="button"
                            onClick={() => setProdImages(prev => prev.filter((_, idx) => idx !== i))}
                            className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white rounded-full text-[10px] flex items-center justify-center"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Description</label>
                  <textarea
                    value={prodDescription}
                    onChange={e => setProdDescription(e.target.value)}
                    rows={3}
                    placeholder="Comprehensive description of technical specifications..."
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-brand-600"
                  />
                </div>

                <div className="flex items-center gap-6 pt-2 border-t border-slate-100">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={e => setIsFeatured(e.target.checked)}
                      className="rounded text-brand-700"
                    />
                    <span className="font-bold text-slate-800">Featured on Home</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isWeekly}
                      onChange={e => setIsWeekly(e.target.checked)}
                      className="rounded text-brand-700"
                    />
                    <span className="font-bold text-slate-800">Weekly Deal</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFlash}
                      onChange={e => setIsFlash(e.target.checked)}
                      className="rounded text-brand-700"
                    />
                    <span className="font-bold text-slate-800">Flash Sale</span>
                  </label>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowProductModal(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl font-bold shadow-sm"
                  >
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tax invoice modal */}
        <TaxInvoiceModal order={selectedInvoiceOrder} onClose={() => setSelectedInvoiceOrder(null)} />
      </div>
    </div>
  );
};
