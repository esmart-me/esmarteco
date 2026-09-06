import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  Package,
  Sparkles,
  ExternalLink,
  Flame,
  Zap
} from 'lucide-react';
import { supabaseAdmin, isSupabaseConfigured } from '../lib/supabaseAdmin.js';
import { ImageUploader } from '../components/ImageUploader.js';
import { formatAED } from '../lib/utils.js';

export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('Apple');
  const [category, setCategory] = useState('smartphones');
  const [originalPrice, setOriginalPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('15');
  const [warranty, setWarranty] = useState('1 Year Official UAE Warranty');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isWeeklyOffer, setIsWeeklyOffer] = useState(false);
  const [isFlashSale, setIsFlashSale] = useState(false);

  const fetchProducts = async () => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabaseAdmin
          .from('products')
          .select(`
            *,
            images:product_images(image_url, is_primary, display_order)
          `)
          .order('created_at', { ascending: false });

        if (data) {
          setProducts(data.map((p: any) => ({
            ...p,
            image: p.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop&q=85'
          })));
          return;
        }
      } catch (err) {
        console.warn(err);
      }
    }

    // Default Seed / Mock products
    setProducts([
      {
        id: 'prod-001',
        name: 'Apple iPhone 16 Pro Max 256GB - Desert Titanium',
        sku: 'IPH-16PM-256-DT',
        brand: 'Apple',
        category: 'smartphones',
        original_price: 5099,
        sale_price: 4799,
        stock_quantity: 18,
        is_featured: true,
        is_weekly_offer: true,
        is_flash_sale: false,
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=85'
      },
      {
        id: 'prod-002',
        name: 'Samsung Galaxy S25 Ultra 512GB - Titanium Silver',
        sku: 'SAM-S25U-512-TS',
        brand: 'Samsung',
        category: 'smartphones',
        original_price: 5299,
        sale_price: 4949,
        stock_quantity: 12,
        is_featured: true,
        is_weekly_offer: false,
        is_flash_sale: true,
        image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=85'
      },
      {
        id: 'prod-003',
        name: 'Apple MacBook Pro 16" M3 Max 36GB / 1TB',
        sku: 'MBP-16-M3M-1TB',
        brand: 'Apple',
        category: 'laptops',
        original_price: 13999,
        sale_price: 12899,
        stock_quantity: 5,
        is_featured: true,
        is_weekly_offer: false,
        is_flash_sale: false,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=85'
      },
      {
        id: 'prod-004',
        name: 'Sony WH-1000XM5 Wireless Noise-Canceling Headphones',
        sku: 'SNY-WH1000XM5-BLK',
        brand: 'Sony',
        category: 'headphones',
        original_price: 1499,
        sale_price: 1149,
        stock_quantity: 2,
        is_featured: true,
        is_weekly_offer: true,
        is_flash_sale: false,
        image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=85'
      }
    ]);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const triggerToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const openAdd = () => {
    setEditingProduct(null);
    setName('');
    setBrand('Apple');
    setCategory('smartphones');
    setOriginalPrice('');
    setSalePrice('');
    setStockQuantity('15');
    setWarranty('1 Year Official UAE Warranty');
    setDescription('');
    setImages(['https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop&q=85']);
    setIsFeatured(false);
    setIsWeeklyOffer(false);
    setIsFlashSale(false);
    setShowModal(true);
  };

  const openEdit = (prod: any) => {
    setEditingProduct(prod);
    setName(prod.name);
    setBrand(prod.brand || 'Apple');
    setCategory(prod.category || 'smartphones');
    setOriginalPrice(String(prod.original_price));
    setSalePrice(String(prod.sale_price));
    setStockQuantity(String(prod.stock_quantity));
    setWarranty(prod.warranty || '1 Year Official UAE Warranty');
    setDescription(prod.description || '');
    setImages(prod.image ? [prod.image] : []);
    setIsFeatured(Boolean(prod.is_featured));
    setIsWeeklyOffer(Boolean(prod.is_weekly_offer));
    setIsFlashSale(Boolean(prod.is_flash_sale));
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const payload = {
      name,
      slug,
      sku: editingProduct?.sku || `ESM-${Date.now().toString().slice(-6)}`,
      original_price: Number(originalPrice) || Number(salePrice),
      sale_price: Number(salePrice),
      stock_quantity: Number(stockQuantity),
      warranty,
      description,
      is_featured: isFeatured,
      is_weekly_offer: isWeeklyOffer,
      is_flash_sale: isFlashSale,
      status: 'active'
    };

    if (isSupabaseConfigured) {
      if (editingProduct?.id && editingProduct.id.length === 36) {
        await supabaseAdmin.from('products').update(payload).eq('id', editingProduct.id);
        if (images.length > 0) {
          await supabaseAdmin.from('product_images').upsert({
            product_id: editingProduct.id,
            image_url: images[0],
            is_primary: true
          });
        }
      } else {
        const { data: newProd } = await supabaseAdmin.from('products').insert([payload]).select().single();
        if (newProd && images.length > 0) {
          await supabaseAdmin.from('product_images').insert([{
            product_id: newProd.id,
            image_url: images[0],
            is_primary: true
          }]);
        }
      }
    } else {
      // Offline fallback mutation
      if (editingProduct) {
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? {
          ...p,
          ...payload,
          image: images[0] || p.image
        } : p));
      } else {
        setProducts(prev => [{
          id: `prod-${Date.now()}`,
          ...payload,
          image: images[0] || 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop&q=85',
          brand
        }, ...prev]);
      }
    }

    triggerToast(`Product "${name}" saved successfully!`);
    setShowModal(false);
    if (isSupabaseConfigured) fetchProducts();
  };

  const handleDelete = async (id: string, prodName: string) => {
    if (!confirm(`Delete "${prodName}" from catalog?`)) return;
    if (isSupabaseConfigured && id.length === 36) {
      await supabaseAdmin.from('products').delete().eq('id', id);
    }
    setProducts(prev => prev.filter(p => p.id !== id));
    triggerToast(`Product "${prodName}" deleted.`);
  };

  const handleQuickStockUpdate = async (prod: any, newStock: number) => {
    if (isSupabaseConfigured && prod.id.length === 36) {
      await supabaseAdmin.from('products').update({ stock_quantity: newStock }).eq('id', prod.id);
    }
    setProducts(prev => prev.map(p => p.id === prod.id ? { ...p, stock_quantity: newStock } : p));
    triggerToast(`Stock for ${prod.name} updated to ${newStock}`);
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Products Catalog</h2>
          <p className="text-xs text-slate-500">Manage real-time prices, UAE stock, and Supabase Storage images</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 w-64"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <button
            onClick={openAdd}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                <th className="py-3.5 px-5">Product</th>
                <th className="py-3.5 px-4">Brand</th>
                <th className="py-3.5 px-4">Price (AED)</th>
                <th className="py-3.5 px-4">Stock Level</th>
                <th className="py-3.5 px-4">Badges</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-100 bg-white"
                      />
                      <div>
                        <div className="font-bold text-slate-900 line-clamp-1">{prod.name}</div>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">{prod.sku}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-700">{prod.brand || 'Electronics'}</td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{formatAED(prod.sale_price)}</div>
                    {prod.original_price > prod.sale_price && (
                      <div className="text-[10px] text-slate-400 line-through">
                        {formatAED(prod.original_price)}
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        prod.stock_quantity <= 3
                          ? 'bg-rose-50 text-rose-700'
                          : prod.stock_quantity <= 8
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {prod.stock_quantity} in stock
                      </span>

                      {/* Quick Adjust Buttons */}
                      <button
                        onClick={() => handleQuickStockUpdate(prod, Math.max(0, prod.stock_quantity - 1))}
                        className="w-5 h-5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded flex items-center justify-center font-bold text-xs"
                        title="Reduce Stock"
                      >
                        -
                      </button>
                      <button
                        onClick={() => handleQuickStockUpdate(prod, prod.stock_quantity + 1)}
                        className="w-5 h-5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded flex items-center justify-center font-bold text-xs"
                        title="Add Stock"
                      >
                        +
                      </button>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {prod.is_featured && (
                        <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded">
                          Featured
                        </span>
                      )}
                      {prod.is_weekly_offer && (
                        <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded flex items-center gap-0.5">
                          <Flame className="w-2.5 h-2.5" /> Weekly
                        </span>
                      )}
                      {prod.is_flash_sale && (
                        <span className="px-1.5 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-bold rounded flex items-center gap-0.5">
                          <Zap className="w-2.5 h-2.5" /> Flash
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(prod)}
                        className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                        title="Edit Product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(prod.id, prod.name)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h3 className="font-black text-base text-slate-900">
                {editingProduct ? 'Edit Product Details' : 'Add New UAE Electronics Product'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Product Title / Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Apple iPhone 16 Pro Max 256GB"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Brand</label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category Slug</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="smartphones">Smartphones</option>
                    <option value="laptops">Laptops</option>
                    <option value="tablets">Tablets</option>
                    <option value="headphones">Audio & Headphones</option>
                    <option value="gaming">Gaming</option>
                    <option value="power-banks">Power & Charging</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Original Price (AED)</label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    placeholder="e.g. 5099"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sale Price (AED)</label>
                  <input
                    type="number"
                    required
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    placeholder="e.g. 4799"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">UAE Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Product Images (Supabase Storage)</label>
                <ImageUploader
                  bucket="product-images"
                  currentImages={images}
                  onImagesChange={setImages}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Warranty Description</label>
                <input
                  type="text"
                  value={warranty}
                  onChange={(e) => setWarranty(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* Promotional Checkboxes */}
              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span>Featured Product</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isWeeklyOffer}
                    onChange={(e) => setIsWeeklyOffer(e.target.checked)}
                    className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span>Weekly Deals Section</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFlashSale}
                    onChange={(e) => setIsFlashSale(e.target.checked)}
                    className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span>Flash Sale with Timer</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                >
                  {editingProduct ? 'Update Product' : 'Create & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
