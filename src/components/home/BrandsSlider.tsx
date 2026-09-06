import React from 'react';
import { Link } from 'react-router-dom';
import { Brand } from '../../types/index.js';

export const BrandsSlider: React.FC<{ brands: Brand[] }> = ({ brands }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="text-center max-w-xl mx-auto mb-8">
        <span className="text-[11px] font-bold text-brand-700 tracking-wider uppercase">OFFICIAL UAE PARTNERS</span>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
          Top Electronics Brands
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Direct authorized stock with full manufacturer warranties in the UAE.
        </p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
        {brands.map(brand => (
          <Link
            key={brand.id}
            to={`/shop?brand=${encodeURIComponent(brand.name)}`}
            className="group bg-white rounded-2xl border border-slate-100 hover:border-brand-300 p-4 flex flex-col items-center justify-center hover:shadow-card-hover transition-all duration-200 h-24"
          >
            <span className="text-sm font-extrabold text-slate-800 group-hover:text-brand-700 transition-colors tracking-tight">
              {brand.name}
            </span>
            <span className="text-[10px] text-slate-400 mt-1 group-hover:text-slate-600">
              {brand.productCount !== undefined ? `${brand.productCount} models` : 'Official UAE Stock'}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};
