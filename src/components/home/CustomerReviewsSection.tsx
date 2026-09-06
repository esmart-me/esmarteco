import React from 'react';
import { Star, CheckCircle2, Quote } from 'lucide-react';
import { Review } from '../../types/index.js';

export const CustomerReviewsSection: React.FC<{ reviews: Review[] }> = ({ reviews }) => {
  if (!reviews || reviews.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-[11px] font-bold text-emerald-600 tracking-wider uppercase">CUSTOMER EXPERIENCES</span>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
          Trusted by Tech Shoppers Across UAE
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Real reviews from verified purchasers in Abu Dhabi, Dubai, and Sharjah.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.slice(0, 3).map(rev => (
          <div
            key={rev.id}
            className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-card-hover transition-all flex flex-col justify-between relative"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                    />
                  ))}
                </div>
                <Quote className="w-6 h-6 text-slate-200" />
              </div>

              <h4 className="text-sm font-bold text-slate-900 mb-2">{rev.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "{rev.comment}"
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">{rev.userName}</p>
                <p className="text-[10px] text-slate-400">Abu Dhabi, UAE</p>
              </div>

              {rev.isVerifiedPurchase && (
                <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Verified Buyer</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
