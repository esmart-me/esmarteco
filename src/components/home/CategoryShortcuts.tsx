import React from 'react';
import { Link } from 'react-router-dom';
import {
  Smartphone,
  Tablet,
  Laptop,
  Watch,
  Headphones,
  Speaker,
  BatteryCharging,
  Zap,
  Cable,
  SmartphoneNfc,
  Mouse,
  Gamepad2,
  Cpu,
  Tv,
  Radio,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Category } from '../../types/index.js';

const ICON_MAP: Record<string, React.ReactNode> = {
  Smartphone: <Smartphone className="w-5 h-5 text-brand-600" />,
  Tablet: <Tablet className="w-5 h-5 text-brand-600" />,
  Laptop: <Laptop className="w-5 h-5 text-brand-600" />,
  Watch: <Watch className="w-5 h-5 text-brand-600" />,
  Headphones: <Headphones className="w-5 h-5 text-brand-600" />,
  Earbuds: <Headphones className="w-5 h-5 text-brand-600" />,
  Speaker: <Speaker className="w-5 h-5 text-brand-600" />,
  BatteryCharging: <BatteryCharging className="w-5 h-5 text-brand-600" />,
  Zap: <Zap className="w-5 h-5 text-brand-600" />,
  Cable: <Cable className="w-5 h-5 text-brand-600" />,
  SmartphoneNfc: <SmartphoneNfc className="w-5 h-5 text-brand-600" />,
  Mouse: <Mouse className="w-5 h-5 text-brand-600" />,
  Gamepad2: <Gamepad2 className="w-5 h-5 text-brand-600" />,
  Cpu: <Cpu className="w-5 h-5 text-brand-600" />,
  Tv: <Tv className="w-5 h-5 text-brand-600" />,
  Radio: <Radio className="w-5 h-5 text-brand-600" />
};

export const CategoryShortcuts: React.FC<{ categories: Category[] }> = ({ categories }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-[11px] font-bold text-brand-700 tracking-wider uppercase">BROWSE COLLECTIONS</span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Shop by Electronics Category
          </h2>
        </div>

        <Link
          to="/shop"
          className="text-xs font-bold text-brand-700 hover:text-brand-900 flex items-center gap-1 group"
        >
          <span>View All 16 Categories</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3 sm:gap-4">
        {categories.slice(0, 16).map(cat => (
          <Link
            key={cat.id}
            to={`/shop?category=${cat.slug}`}
            className="group bg-white rounded-2xl border border-slate-100 p-3 flex flex-col items-center text-center hover:border-brand-200 hover:shadow-card-hover transition-all duration-200"
          >
            <div className="w-14 h-14 rounded-2xl bg-slate-50 group-hover:bg-brand-50 flex items-center justify-center mb-2.5 transition-colors overflow-hidden p-2">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
              />
            </div>

            <h3 className="text-xs font-bold text-slate-800 group-hover:text-brand-700 transition-colors line-clamp-1">
              {cat.name}
            </h3>

            <span className="text-[10px] text-slate-400 mt-0.5 font-medium">
              {cat.productCount !== undefined ? `${cat.productCount} items` : 'Explore'}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};
