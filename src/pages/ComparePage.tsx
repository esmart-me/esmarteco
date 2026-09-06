import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, Trash2, ShoppingCart, Star, Check, ArrowRight } from 'lucide-react';
import { useCompare } from '../context/CompareContext.js';
import { useCart } from '../context/CartContext.js';
import { formatAED } from '../lib/utils.js';

export const ComparePage: React.FC = () => {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();

  if (compareList.length === 0) {
    return (
      <div className="min-h-[70vh] bg-white py-16 flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mb-3">
          <Layers className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Compare Electronics</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          You have no devices in comparison. Browse phones, laptops, and tablets and click the compare icon on product cards.
        </p>
        <Link
          to="/shop"
          className="mt-6 px-6 py-2.5 bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  // Common spec keys to compare
  const specKeys = [
    'Display',
    'Processor',
    'RAM',
    'Storage',
    'Rear Camera',
    'Front Camera',
    'Battery',
    'OS',
    'Weight'
  ];

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-bold text-brand-700 uppercase tracking-wider">SIDE-BY-SIDE</span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Compare Specifications ({compareList.length}/4)
            </h1>
          </div>

          <button
            type="button"
            onClick={clearCompare}
            className="px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
          >
            Clear All
          </button>
        </div>

        {/* Side-by-side comparison table */}
        <div className="overflow-x-auto pb-6">
          <div className="min-w-[700px] border border-slate-100 rounded-3xl overflow-hidden divide-y divide-slate-100 bg-white">
            {/* Top row: Images, Title, Price, Add to Cart */}
            <div className="grid grid-cols-5 p-4 bg-slate-50/70 items-start">
              <div className="text-xs font-black text-slate-400 uppercase tracking-wider pt-8">
                Products
              </div>
              {compareList.map(prod => (
                <div key={prod.id} className="p-3 text-center space-y-2 relative">
                  <button
                    type="button"
                    onClick={() => removeFromCompare(prod.id)}
                    className="absolute top-0 right-0 p-1 text-slate-400 hover:text-rose-600"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="w-28 h-28 mx-auto bg-white rounded-2xl p-2 border border-slate-200 flex items-center justify-center">
                    <img src={prod.images[0]} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                  </div>

                  <span className="text-[10px] font-bold text-brand-700 uppercase">{prod.brand}</span>
                  <Link to={`/product/${prod.slug}`} className="block">
                    <h3 className="text-xs font-bold text-slate-900 hover:text-brand-700 line-clamp-2">
                      {prod.title}
                    </h3>
                  </Link>
                  <p className="text-sm font-black text-slate-950">{formatAED(prod.salePrice)}</p>

                  <button
                    type="button"
                    onClick={() => addToCart(prod, 1)}
                    className="w-full py-2 bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 hover:bg-brand-800 transition-colors shadow-sm"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Brand row */}
            <div className="grid grid-cols-5 p-4 text-xs">
              <div className="font-bold text-slate-500">Brand</div>
              {compareList.map(prod => (
                <div key={prod.id} className="p-2 text-center font-bold text-slate-900">{prod.brand}</div>
              ))}
            </div>

            {/* Model row */}
            <div className="grid grid-cols-5 p-4 text-xs bg-slate-50/40">
              <div className="font-bold text-slate-500">Model Number</div>
              {compareList.map(prod => (
                <div key={prod.id} className="p-2 text-center text-slate-800">{prod.model}</div>
              ))}
            </div>

            {/* Rating row */}
            <div className="grid grid-cols-5 p-4 text-xs">
              <div className="font-bold text-slate-500">Customer Rating</div>
              {compareList.map(prod => (
                <div key={prod.id} className="p-2 text-center font-bold text-slate-800 flex items-center justify-center gap-1 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{prod.rating} ({prod.reviewCount})</span>
                </div>
              ))}
            </div>

            {/* Warranty row */}
            <div className="grid grid-cols-5 p-4 text-xs bg-slate-50/40">
              <div className="font-bold text-slate-500">UAE Warranty</div>
              {compareList.map(prod => (
                <div key={prod.id} className="p-2 text-center text-emerald-700 font-bold">{prod.warranty}</div>
              ))}
            </div>

            {/* Specs iteration */}
            {specKeys.map((key, idx) => (
              <div key={key} className={`grid grid-cols-5 p-4 text-xs ${idx % 2 === 0 ? '' : 'bg-slate-50/40'}`}>
                <div className="font-bold text-slate-500">{key}</div>
                {compareList.map(prod => (
                  <div key={prod.id} className="p-2 text-center text-slate-800">
                    {prod.specifications[key] || '—'}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
