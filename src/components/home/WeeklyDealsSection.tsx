import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Flame, ArrowRight } from 'lucide-react';
import { WeeklyOffer, Product } from '../../types/index.js';
import { ProductCard } from '../product/ProductCard.js';

interface WeeklyDealsSectionProps {
  offers: (WeeklyOffer & { product?: Product })[];
  onQuickView?: (product: Product) => void;
}

export const CountdownTimer: React.FC<{ targetDate: string; label?: string }> = ({ targetDate, label }) => {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    const calculate = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference <= 0) {
        setTimeLeft(null);
        return;
      }
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!timeLeft) {
    return <span className="text-rose-600 font-bold text-xs">Offer Expired</span>;
  }

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="flex items-center gap-1.5 text-slate-900 font-mono text-xs">
      {label && <span className="font-sans font-semibold text-slate-500 mr-1">{label}</span>}
      {timeLeft.days > 0 && (
        <span className="px-2 py-1 bg-slate-100 rounded-md font-bold">
          {timeLeft.days}d
        </span>
      )}
      <span className="px-2 py-1 bg-brand-50 text-brand-700 rounded-md font-bold">
        {pad(timeLeft.hours)}
      </span>
      <span className="text-slate-400 font-bold">:</span>
      <span className="px-2 py-1 bg-brand-50 text-brand-700 rounded-md font-bold">
        {pad(timeLeft.minutes)}
      </span>
      <span className="text-slate-400 font-bold">:</span>
      <span className="px-2 py-1 bg-brand-50 text-brand-700 rounded-md font-bold">
        {pad(timeLeft.seconds)}
      </span>
    </div>
  );
};

export const WeeklyDealsSection: React.FC<WeeklyDealsSectionProps> = ({ offers, onQuickView }) => {
  if (!offers || offers.length === 0) return null;

  // Find the earliest active expiry date for the banner timer
  const activeOffers = offers.filter(o => o.product && new Date(o.expiresAt) > new Date());
  if (activeOffers.length === 0) return null;

  const earliestExpiry = activeOffers[0].expiresAt;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <Flame className="w-3 h-3 text-brand-600" />
              <span>Weekly Deals</span>
            </span>
            <span className="text-xs font-semibold text-slate-500">Limited Time UAE Offers</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            Featured Deals of the Week
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-1.5 rounded-2xl border border-slate-200/70">
            <Clock className="w-4 h-4 text-brand-600 animate-pulse" />
            <CountdownTimer targetDate={earliestExpiry} label="Ends In:" />
          </div>

          <Link
            to="/shop?weeklyOffer=true"
            className="text-xs font-bold text-brand-700 hover:text-brand-900 flex items-center gap-1 group"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {activeOffers.slice(0, 4).map(offer => (
          <ProductCard
            key={offer.id}
            product={offer.product!}
            onQuickView={onQuickView}
          />
        ))}
      </div>
    </section>
  );
};
