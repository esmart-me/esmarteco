import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Filter,
  Grid,
  List,
  SlidersHorizontal,
  X,
  Star,
  Check,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { apiRequest } from '../lib/api.js';
import { Product, Category, Brand } from '../types/index.js';
import { ProductCard } from '../components/product/ProductCard.js';
import { QuickViewModal } from '../components/common/QuickViewModal.js';
import { formatAED } from '../lib/utils.js';

export const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Filter states derived from URL query parameters
  const selectedCategory = searchParams.get('category') || '';
  const selectedBrand = searchParams.get('brand') || '';
  const searchQuery = searchParams.get('q') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sortBy = searchParams.get('sort') || 'popularity';
  const onlyInStock = searchParams.get('inStock') === 'true';
  const isWeeklyOffer = searchParams.get('weeklyOffer') === 'true';
  const isFlashSale = searchParams.get('flashSale') === 'true';
  const isFeatured = searchParams.get('featured') === 'true';
  const isNew = searchParams.get('isNew') === 'true';
  const isBestseller = searchParams.get('bestseller') === 'true';

  // Load categories & brands metadata
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          apiRequest('/categories'),
          apiRequest('/brands')
        ]);
        if (catRes.success && catRes.categories) setCategories(catRes.categories);
        if (brandRes.success && brandRes.brands) setBrands(brandRes.brands);
      } catch (err) {
        console.error('Error loading catalog metadata:', err);
      }
    };
    loadMetadata();
  }, []);

  // Fetch products whenever searchParams change
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams(searchParams);
        const res = await apiRequest(`/products?${queryParams.toString()}`);
        if (res.success && res.products) {
          let list = res.products;
          if (onlyInStock) {
            list = list.filter((p: Product) => p.stock > 0);
          }
          setProducts(list);
          setTotalCount(res.total || list.length);
        }
      } catch (err) {
        console.error('Error fetching catalog products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams, onlyInStock]);

  const updateParam = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === null || value === '') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="min-h-screen bg-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb & Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <span>Home</span>
            <ChevronRight className="w-3 h-3" />
            <span>Catalog</span>
            {selectedCategory && (
              <>
                <ChevronRight className="w-3 h-3" />
                <span className="capitalize text-slate-700 font-semibold">{selectedCategory.replace('-', ' ')}</span>
              </>
            )}
            {searchQuery && (
              <>
                <ChevronRight className="w-3 h-3" />
                <span className="text-brand-700 font-semibold">Search: "{searchQuery}"</span>
              </>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {selectedCategory
                  ? categories.find(c => c.slug === selectedCategory)?.name || 'Electronics'
                  : searchQuery
                  ? `Search Results for "${searchQuery}"`
                  : 'All Electronics Catalog'}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Showing {products.length} products available for delivery in UAE
              </p>
            </div>

            {/* Sort & View Mode Toolbar */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
              </button>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-medium hidden sm:inline">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={e => updateParam('sort', e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-brand-600 cursor-pointer"
                >
                  <option value="popularity">Most Popular</option>
                  <option value="newest">Newest Arrivals</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              {/* Grid / List toggle */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm text-brand-700' : 'text-slate-500 hover:text-slate-900'
                  }`}
                  aria-label="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm text-brand-700' : 'text-slate-500 hover:text-slate-900'
                  }`}
                  aria-label="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Catalog Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Filter className="w-4 h-4 text-brand-700" />
                <span>Filters</span>
              </span>
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs text-brand-700 hover:underline font-semibold"
              >
                Reset All
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Categories</h3>
              <div className="max-h-56 overflow-y-auto space-y-1 pr-1 text-xs">
                <button
                  type="button"
                  onClick={() => updateParam('category', null)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                    !selectedCategory ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>All Categories</span>
                  <span>{categories.reduce((sum, c) => sum + (c.productCount || 0), 0)}</span>
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => updateParam('category', cat.slug)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                      selectedCategory.toLowerCase() === cat.slug.toLowerCase()
                        ? 'bg-brand-50 text-brand-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[11px] text-slate-400">{cat.productCount}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Brands</h3>
              <div className="max-h-48 overflow-y-auto space-y-1 pr-1 text-xs">
                {brands.map(brand => {
                  const isChecked = selectedBrand.toLowerCase() === brand.name.toLowerCase();
                  return (
                    <label
                      key={brand.id}
                      className="flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer text-slate-700"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => updateParam('brand', isChecked ? null : brand.name)}
                          className="rounded border-slate-300 text-brand-700 focus:ring-brand-500"
                        />
                        <span className={isChecked ? 'font-bold text-brand-700' : ''}>{brand.name}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">{brand.productCount}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Price Range (AED)</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <input
                  type="number"
                  placeholder="Min AED"
                  value={minPrice}
                  onChange={e => updateParam('minPrice', e.target.value)}
                  className="px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-brand-600"
                />
                <input
                  type="number"
                  placeholder="Max AED"
                  value={maxPrice}
                  onChange={e => updateParam('maxPrice', e.target.value)}
                  className="px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-brand-600"
                />
              </div>
            </div>

            {/* Special Collections Filter */}
            <div className="space-y-2 pt-4 border-t border-slate-100 text-xs">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Special Offers</h3>
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 py-1">
                <input
                  type="checkbox"
                  checked={isWeeklyOffer}
                  onChange={e => updateParam('weeklyOffer', e.target.checked ? 'true' : null)}
                  className="rounded border-slate-300 text-brand-700 focus:ring-brand-500"
                />
                <span>Weekly Deals Only</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 py-1">
                <input
                  type="checkbox"
                  checked={isFlashSale}
                  onChange={e => updateParam('flashSale', e.target.checked ? 'true' : null)}
                  className="rounded border-slate-300 text-brand-700 focus:ring-brand-500"
                />
                <span>Flash Sales Only</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 py-1">
                <input
                  type="checkbox"
                  checked={isNew}
                  onChange={e => updateParam('isNew', e.target.checked ? 'true' : null)}
                  className="rounded border-slate-300 text-brand-700 focus:ring-brand-500"
                />
                <span>New 2026 Arrivals</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 py-1">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={e => updateParam('inStock', e.target.checked ? 'true' : null)}
                  className="rounded border-slate-300 text-brand-700 focus:ring-brand-500"
                />
                <span>In Stock Only</span>
              </label>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-3">
            {isLoading ? (
              <div className="py-24 flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-700 rounded-full animate-spin" />
                <p className="text-xs text-slate-400 mt-2 font-semibold">Updating catalog...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 p-8">
                <h3 className="text-base font-bold text-slate-800">No products match your filters</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Try adjusting your price range, selected brand, or clear all filters to see more electronics.
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="mt-4 px-4 py-2 bg-brand-700 text-white text-xs font-bold rounded-xl hover:bg-brand-800 transition-colors shadow-sm"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6'
                    : 'space-y-4'
                }
              >
                {products.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    layout={viewMode}
                    onQuickView={setQuickViewProduct}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl z-10 flex flex-col justify-between overflow-y-auto p-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Filter Electronics</h3>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 py-4 space-y-5 text-xs">
              <div>
                <h4 className="font-bold text-slate-900 mb-2">Category</h4>
                <select
                  value={selectedCategory}
                  onChange={e => updateParam('category', e.target.value || null)}
                  className="w-full p-2 border border-slate-200 rounded-xl"
                >
                  <option value="">All Categories</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">Brand</h4>
                <select
                  value={selectedBrand}
                  onChange={e => updateParam('brand', e.target.value || null)}
                  className="w-full p-2 border border-slate-200 rounded-xl"
                >
                  <option value="">All Brands</option>
                  {brands.map(b => (
                    <option key={b.id} value={b.name}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">Price Range (AED)</h4>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={e => updateParam('minPrice', e.target.value)}
                    className="p-2 border border-slate-200 rounded-xl"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={e => updateParam('maxPrice', e.target.value)}
                    className="p-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={clearAllFilters}
                className="py-2.5 px-3 border border-slate-200 text-slate-700 rounded-xl font-bold text-xs"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="py-2.5 px-3 bg-brand-700 text-white rounded-xl font-bold text-xs"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
};
