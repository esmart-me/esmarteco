import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Product } from '../../types/index.js';
import { ProductCard } from '../product/ProductCard.js';

export const NewArrivalsSection: React.FC<{
  products: Product[];
  onQuickView?: (product: Product) => void;
}> = ({ products, onQuickView }) => {
  const newArrivals = products.filter(p => p.isNew).slice(0, 4);
  if (newArrivals.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-brand-700 tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Just Landed</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            New Arrivals & 2026 Flagships
          </h2>
        </div>

        <Link
          to="/shop?isNew=true"
          className="text-xs font-bold text-brand-700 hover:text-brand-900 flex items-center gap-1 group"
        >
          <span>See New Products</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {newArrivals.map(product => (
          <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
        ))}
      </div>
    </section>
  );
};
