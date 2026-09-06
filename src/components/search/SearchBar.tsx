import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ShoppingCart, Check, ArrowRight } from 'lucide-react';
import { apiRequest } from '../../lib/api.js';
import { formatAED } from '../../lib/utils.js';
import { useCart } from '../../context/CartContext.js';

interface AutocompleteItem {
  id: string;
  slug: string;
  title: string;
  brand: string;
  model: string;
  sku: string;
  image: string;
  salePrice: number;
  originalPrice: number;
  stock: number;
  inStock: boolean;
}

export const SearchBar: React.FC<{ className?: string; onCloseMobile?: () => void }> = ({
  className,
  onCloseMobile
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AutocompleteItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await apiRequest(`/products/autocomplete?q=${encodeURIComponent(query)}`);
        if (res.success && res.results) {
          setSuggestions(res.results);
          setIsOpen(true);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    if (onCloseMobile) onCloseMobile();
    navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
  };

  const handleSelectProduct = (slug: string) => {
    setIsOpen(false);
    setQuery('');
    if (onCloseMobile) onCloseMobile();
    navigate(`/product/${slug}`);
  };

  const handleQuickAdd = async (e: React.MouseEvent, item: AutocompleteItem) => {
    e.stopPropagation();
    try {
      const res = await apiRequest(`/products/${item.id}`);
      if (res.success && res.product) {
        addToCart(res.product, 1);
        setAddedId(item.id);
        setTimeout(() => setAddedId(null), 1800);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className || ''}`}>
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => query.trim().length >= 2 && suggestions.length > 0 && setIsOpen(true)}
          placeholder="Search iPhone, Galaxy, laptops, SKU, models..."
          className="w-full h-11 pl-11 pr-24 text-sm bg-slate-50 border border-slate-200 rounded-full focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-100 transition-all outline-none text-slate-800 placeholder-slate-400"
        />
        <Search className="absolute left-4 w-4 h-4 text-slate-400 pointer-events-none" />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSuggestions([]);
              setIsOpen(false);
            }}
            className="absolute right-16 p-1 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          type="submit"
          className="absolute right-1 px-4 h-9 bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold rounded-full transition-colors flex items-center gap-1 shadow-sm"
        >
          <span>Search</span>
        </button>
      </form>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-dropdown border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="p-3 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Matching Products ({suggestions.length})</span>
            {isLoading && <span className="text-brand-600">Searching...</span>}
          </div>

          {suggestions.length === 0 && !isLoading ? (
            <div className="p-6 text-center text-sm text-slate-500">
              No matching products found for "{query}".
            </div>
          ) : (
            <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
              {suggestions.map(item => (
                <div
                  key={item.id}
                  onClick={() => handleSelectProduct(item.slug)}
                  className="p-3 hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-lg bg-white border border-slate-100 p-1 flex-shrink-0 flex items-center justify-center">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-brand-700 tracking-wider uppercase">
                          {item.brand}
                        </span>
                        <span className="text-[10px] text-slate-400">SKU: {item.sku}</span>
                      </div>
                      <h4 className="text-xs font-semibold text-slate-800 truncate group-hover:text-brand-600 transition-colors">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-bold text-slate-900">
                          {formatAED(item.salePrice)}
                        </span>
                        {item.originalPrice > item.salePrice && (
                          <span className="text-[11px] text-slate-400 line-through">
                            {formatAED(item.originalPrice)}
                          </span>
                        )}
                        {item.inStock ? (
                          <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                            In Stock
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                            Out of Stock
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {item.inStock && (
                    <button
                      type="button"
                      onClick={e => handleQuickAdd(e, item)}
                      disabled={addedId === item.id}
                      className={`flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                        addedId === item.id
                          ? 'bg-emerald-600 text-white'
                          : 'bg-brand-50 hover:bg-brand-600 text-brand-700 hover:text-white border border-brand-200 hover:border-transparent'
                      }`}
                    >
                      {addedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {query.trim().length >= 2 && (
            <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={handleSubmit}
                className="text-xs font-medium text-brand-700 hover:text-brand-900 flex items-center justify-center gap-1 mx-auto"
              >
                <span>View all search results for "{query}"</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
