import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, CreditCard } from 'lucide-react';
import { Banner } from '../../types/index.js';

export const PromoBanner: React.FC<{ banners: Banner[] }> = ({ banners }) => {
  const promo = banners.find(b => b.type === 'promo_mid' && b.active) || {
    id: 'promo-default',
    title: 'Sony Audio Superfest in Abu Dhabi',
    subtitle: 'WH-1000XM5 Noise Cancelling Headphones at unbeatable UAE pricing',
    offerText: 'Save AED 300 Today • Fast Delivery Across All 7 Emirates',
    badge: 'LIMITED TIME',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=90',
    ctaText: 'Grab Deal Now',
    ctaLink: '/shop?category=headphones',
    type: 'promo_mid',
    order: 1,
    active: true
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="relative rounded-3xl overflow-hidden bg-slate-950 text-white min-h-[260px] sm:min-h-[300px] flex items-center shadow-card">
        <div className="absolute inset-0 z-0">
          <img
            src={promo.image}
            alt={promo.title}
            className="w-full h-full object-cover object-center opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-xl p-6 sm:p-10 space-y-3">
          {promo.badge && (
            <span className="inline-block px-3 py-1 bg-amber-500 text-slate-950 text-[10px] font-black tracking-widest uppercase rounded-full">
              {promo.badge}
            </span>
          )}

          <h3 className="text-2xl sm:text-3xl font-black tracking-tight">{promo.title}</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{promo.subtitle}</p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to={promo.ctaLink || '/shop'}
              className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
            >
              <span>{promo.ctaText || 'Shop Offer'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-950/50 px-3 py-2 rounded-xl border border-emerald-900/60">
              <CreditCard className="w-4 h-4" />
              <span>Pay in 4 interest-free with Tabby</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
