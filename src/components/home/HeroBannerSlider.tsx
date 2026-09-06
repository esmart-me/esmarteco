import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { Banner } from '../../types/index.js';

export const HeroBannerSlider: React.FC<{ banners: Banner[] }> = ({ banners }) => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const heroBanners = banners.filter(b => b.type === 'hero' && b.active);

  useEffect(() => {
    if (heroBanners.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % heroBanners.length);
    }, 5500);

    return () => clearInterval(interval);
  }, [heroBanners.length, isPaused]);

  if (heroBanners.length === 0) return null;

  const currentBanner = heroBanners[current];

  return (
    <div
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-2"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative w-full min-h-[360px] sm:min-h-[440px] md:min-h-[480px] bg-slate-900 rounded-3xl overflow-hidden shadow-card flex items-center">
        {/* Background Image with subtle gradient overlay to guarantee text contrast */}
        <div className="absolute inset-0 z-0">
          <img
            src={currentBanner.image}
            alt={currentBanner.title}
            className="w-full h-full object-cover object-center opacity-85 transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />
        </div>

        {/* Content Box */}
        <div className="relative z-10 max-w-xl px-6 sm:px-12 py-8 text-white space-y-4">
          {currentBanner.badge && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-600/90 backdrop-blur-md rounded-full text-[11px] font-extrabold uppercase tracking-wider text-white shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{currentBanner.badge}</span>
            </div>
          )}

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            {currentBanner.title}
          </h1>

          <p className="text-xs sm:text-base text-slate-200 font-normal leading-relaxed max-w-md">
            {currentBanner.subtitle}
          </p>

          {currentBanner.offerText && (
            <div className="inline-block px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-xl text-xs sm:text-sm font-bold text-amber-300 border border-white/10">
              {currentBanner.offerText}
            </div>
          )}

          <div className="pt-2">
            <Link
              to={currentBanner.ctaLink || '/shop'}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-lg hover:shadow-brand-500/20 transition-all transform hover:-translate-y-0.5"
            >
              <span>{currentBanner.ctaText || 'Shop Now'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Navigation Arrows */}
        {heroBanners.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => setCurrent((current - 1 + heroBanners.length) % heroBanners.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/30 backdrop-blur-md hover:bg-white text-slate-900 flex items-center justify-center transition-all z-20"
              aria-label="Previous Banner"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => setCurrent((current + 1) % heroBanners.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/30 backdrop-blur-md hover:bg-white text-slate-900 flex items-center justify-center transition-all z-20"
              aria-label="Next Banner"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
              {heroBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`h-2 rounded-full transition-all ${
                    current === idx ? 'w-8 bg-brand-500' : 'w-2 bg-white/50 hover:bg-white'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
