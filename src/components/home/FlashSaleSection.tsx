import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Clock, ShoppingCart, Check, Flame } from 'lucide-react';
import { FlashSale, Product } from '../../types/index.js';
import { formatAED, formatDiscount } from '../../lib/utils.js';
import { useCart } from '../../context/CartContext.js';
import { CountdownTimer } from './WeeklyDealsSection.js';

interface FlashSaleSectionProps {
  flashSales: (FlashSale & { product?: Product })[];
}

export const FlashSaleSection: React.FC<FlashSaleSectionProps> = ({ flashSales }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [addedId, setAddedId] = useState<string | null>(null);

  const activeFlashSales = flashSales.filter(f => f.product && f.remainingStock > 0 && new Date(f.endsAt) > new Date());
  if (activeFlashSales.length === 0) return null;

  const handleQuickAdd = (product: Product) => {
    addToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const handleBuyNow = (product: Product) => {
    addToCart(product, 1);
    navigate('/checkout');
  };

  const targetDate = activeFlashSales[0]?.endsAt || new Date(Date.now() + 48 * 3600 * 1000).toISOString();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200/80 rounded-3xl p-6 sm:p-8">
        {/* Top Flash Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-sm">
              <Zap className="w-6 h-6 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-amber-700 tracking-wider uppercase">
                  LIMITED STOCK FLASH SALE
                </span>
                <span className="px-2 py-0.5 bg-amber-200 text-amber-900 rounded-full text-[10px] font-bold">
                  Hurry Up!
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Exclusive Deals • Ends Soon
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-amber-200">
            <Clock className="w-4 h-4 text-amber-600 animate-spin" />
            <CountdownTimer targetDate={targetDate} label="Flash Sale Ends In:" />
          </div>
        </div>

        {/* Flash Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {activeFlashSales.slice(0, 4).map(sale => {
            const prod = sale.product!;
            const soldPercent = Math.round(((sale.totalStock - sale.remainingStock) / sale.totalStock) * 100);
            const discount = formatDiscount(sale.originalPrice, sale.flashPrice);

            return (
              <div
                key={sale.id}
                className="bg-white rounded-2xl border border-amber-100 p-4 shadow-sm hover:shadow-card-hover transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Badge & Image */}
                  <div className="relative mb-3">
                    <span className="absolute top-0 left-0 px-2.5 py-1 bg-amber-500 text-slate-950 text-[10px] font-black rounded-lg z-10 shadow-sm">
                      {discount}% OFF
                    </span>

                    <Link
                      to={`/product/${prod.slug}`}
                      className="w-full h-44 bg-slate-50/50 rounded-xl p-2 flex items-center justify-center overflow-hidden block"
                    >
                      <img
                        src={prod.images[0]}
                        alt={prod.title}
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </Link>
                  </div>

                  <span className="text-[10px] font-bold text-brand-700 tracking-wider uppercase">{prod.brand}</span>
                  <Link to={`/product/${prod.slug}`} className="block mt-0.5">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-brand-700 transition-colors line-clamp-2">
                      {prod.title}
                    </h3>
                  </Link>

                  {/* Price */}
                  <div className="mt-2.5 flex items-baseline gap-2">
                    <span className="text-lg font-black text-slate-900">{formatAED(sale.flashPrice)}</span>
                    <span className="text-xs text-slate-400 line-through">{formatAED(sale.originalPrice)}</span>
                  </div>

                  {/* Limited Stock Indicator ("Only X left") */}
                  <div className="mt-3 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                      <span className="text-rose-600 flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 fill-rose-600" />
                        <span>Only {sale.remainingStock} left!</span>
                      </span>
                      <span className="text-slate-400">{soldPercent}% Claimed</span>
                    </div>

                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(15, soldPercent))}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-4 grid grid-cols-2 gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => handleQuickAdd(prod)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                      addedId === prod.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
                    }`}
                  >
                    {addedId === prod.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleBuyNow(prod)}
                    className="py-2 px-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1 transition-colors"
                  >
                    <Zap className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Buy Now</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
