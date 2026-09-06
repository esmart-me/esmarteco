import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Truck,
  RotateCcw
} from 'lucide-react';
import { useCart } from '../context/CartContext.js';
import { formatAED } from '../lib/utils.js';
import { TabbyWidget } from '../components/product/TabbyWidget.js';
import { TamaraWidget } from '../components/product/TamaraWidget.js';

export const CartPage: React.FC = () => {
  const {
    cart,
    itemCount,
    subtotal,
    discount,
    vatAmount,
    deliveryFee,
    total,
    isFreeDelivery,
    freeDeliveryThreshold,
    updateQuantity,
    removeFromCart,
    couponCode,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const navigate = useNavigate();

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!inputCoupon.trim()) return;
    setIsApplying(true);
    const res = await applyCoupon(inputCoupon);
    setIsApplying(false);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setInputCoupon('');
    }
  };

  const remainingForFree = Math.max(0, freeDeliveryThreshold - subtotal);

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500 mt-2 max-w-sm">
          You have no electronics in your shopping cart. Browse our smartphones, laptops, audio products and gadgets.
        </p>
        <Link
          to="/shop"
          className="mt-6 px-6 py-3 bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
        >
          Explore UAE Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-6">Shopping Cart ({itemCount} Items)</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart items table/list */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free Delivery Bar */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
              {isFreeDelivery ? (
                <span className="text-emerald-700 font-bold">
                  🎉 You have unlocked Free UAE Delivery!
                </span>
              ) : (
                <div>
                  <span className="text-slate-600">
                    Add <strong className="text-brand-700">{formatAED(remainingForFree)}</strong> more to get Free Delivery across all 7 Emirates!
                  </span>
                  <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-brand-600 h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, (subtotal / freeDeliveryThreshold) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Products Table */}
            <div className="border border-slate-100 rounded-3xl overflow-hidden divide-y divide-slate-100">
              {cart.map(item => (
                <div
                  key={`${item.product.id}-${item.selectedVariant?.id || 'base'}`}
                  className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-20 h-20 bg-slate-50 rounded-2xl p-2 border border-slate-100 flex-shrink-0 flex items-center justify-center">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-brand-700 uppercase tracking-wider">
                        {item.product.brand}
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                        {item.product.title}
                      </h3>
                      {item.selectedVariant && (
                        <p className="text-[11px] text-slate-500 mt-0.5">{item.selectedVariant.name}</p>
                      )}
                      <p className="text-xs font-black text-slate-900 mt-1">{formatAED(item.unitPrice)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-slate-200 rounded-xl bg-white">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedVariant?.id)}
                        className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 py-1.5 text-xs font-bold text-slate-900">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedVariant?.id)}
                        className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-[90px]">
                      <div className="text-sm font-black text-slate-900">
                        {formatAED(item.unitPrice * item.quantity)}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id, item.selectedVariant?.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Remove product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary & Calculations */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 space-y-4">
              <h2 className="text-base font-black text-slate-900">Order Summary</h2>

              {/* Coupon Form */}
              {couponCode ? (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between text-xs text-emerald-800">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <span>Coupon "{couponCode}" Active</span>
                  </div>
                  <button type="button" onClick={removeCoupon} className="text-rose-600 font-semibold hover:underline">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={inputCoupon}
                    onChange={e => setInputCoupon(e.target.value.toUpperCase())}
                    placeholder="Coupon code (e.g. ES10)"
                    className="flex-1 px-3 py-2 text-xs uppercase bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-600"
                  />
                  <button
                    type="submit"
                    disabled={isApplying}
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && <p className="text-xs text-rose-600">{couponError}</p>}

              {/* Pricing breakdown */}
              <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-200">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">{formatAED(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span className="font-bold">-{formatAED(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>UAE VAT (5%)</span>
                  <span className="font-bold text-slate-900">{formatAED(vatAmount)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Standard UAE Delivery</span>
                  <span className="font-bold text-slate-900">
                    {deliveryFee === 0 ? <span className="text-emerald-600">FREE</span> : formatAED(deliveryFee)}
                  </span>
                </div>

                <div className="flex justify-between text-base font-black text-slate-950 pt-3 border-t border-slate-200">
                  <span>Estimated Total</span>
                  <span className="text-brand-700">{formatAED(total)}</span>
                </div>
              </div>

              {/* Installments */}
              <div className="space-y-2 pt-2">
                <TabbyWidget price={total} />
                <TamaraWidget price={total} />
              </div>

              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className="w-full py-3.5 px-6 bg-brand-700 hover:bg-brand-800 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <span>Proceed to UAE Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Trust highlights */}
            <div className="p-4 bg-white rounded-2xl border border-slate-100 text-xs text-slate-500 space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Genuine with UAE Official Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-brand-600" />
                <span>Fast Courier Delivery to all 7 Emirates</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-amber-600" />
                <span>7 Days Easy Return & Replacement</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
