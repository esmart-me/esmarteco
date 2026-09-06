import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, ArrowRight } from 'lucide-react';
import { Product } from '../../types/index.js';
import { ProductCard } from '../product/ProductCard.js';

export const BestSellersSection: React.FC<{
  products: Product[];
  onQuickView?: (product: Product) => void;
}> = ({ products, onQuickView }) => {
  const bestsellers = products.filter(p => p.isBestseller).slice(0, 4);
  if (bestsellers.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-600 tracking-wider uppercase">
            <Trophy className="w-3.5 h-3.5" />
            <span>UAE Customer Favorites</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            Best Sellers in Abu Dhabi & UAE
          </h2>
        </div>

        <Link
          to="/shop?bestseller=true"
          className="text-xs font-bold text-brand-700 hover:text-brand-900 flex items-center gap-1 group"
        >
          <span>View All Best Sellers</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {bestsellers.map(product => (
          <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
        ))}
      </div>
    </section>
  );
};
