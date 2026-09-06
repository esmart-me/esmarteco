import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext.js';
import { formatAED } from '../../lib/utils.js';
import { TabbyWidget } from '../product/TabbyWidget.js';

export const CartDrawer: React.FC = () => {
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
    isDrawerOpen,
    setIsDrawerOpen,
    updateQuantity,
    removeFromCart,
    couponCode,
    couponMessage,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const navigate = useNavigate();

  if (!isDrawerOpen) return null;

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

  const handleProceedCheckout = () => {
    setIsDrawerOpen(false);
    navigate('/checkout');
  };

  const handleViewCartPage = () => {
    setIsDrawerOpen(false);
    navigate('/cart');
  };

  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl z-10 flex flex-col justify-between">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brand-700" />
            <h2 className="text-base font-extrabold text-slate-900">Your Shopping Cart</h2>
            <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full">
              {itemCount}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsDrawerOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Meter */}
        <div className="bg-slate-50 px-5 py-2.5 border-b border-slate-100 text-xs">
          {isFreeDelivery ? (
            <p className="text-emerald-700 font-bold flex items-center gap-1.5">
              <span>🎉 Congratulations! You have unlocked FREE UAE Delivery!</span>
            </p>
          ) : (
            <div>
              <p className="text-slate-600">
                Add <span className="font-bold text-brand-700">{formatAED(remainingForFreeDelivery)}</span> more for <span className="font-bold text-slate-900">FREE UAE Delivery</span>
              </p>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-brand-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (subtotal / freeDeliveryThreshold) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Your cart is empty</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Explore our catalog of smartphones, laptops, smartwatches, and audio products.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsDrawerOpen(false);
                  navigate('/shop');
                }}
                className="mt-4 px-5 py-2.5 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
              >
                Start Shopping Now
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {cart.map(item => (
                <div key={`${item.product.id}-${item.selectedVariant?.id || 'base'}`} className="py-3 flex gap-3">
                  <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 p-1 flex-shrink-0 flex items-center justify-center">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{item.product.title}</h4>
                    {item.selectedVariant && (
                      <p className="text-[11px] text-slate-500">{item.selectedVariant.name}</p>
                    )}
                    <div className="text-xs font-black text-slate-900 mt-1">
                      {formatAED(item.unitPrice)}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedVariant?.id)}
                          className="px-2 py-1 text-slate-500 hover:bg-slate-100 text-xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-bold text-slate-800">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedVariant?.id)}
                          className="px-2 py-1 text-slate-500 hover:bg-slate-100 text-xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id, item.selectedVariant?.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer & Checkout Calculations */}
        {cart.length > 0 && (
          <div className="p-5 bg-white border-t border-slate-100 space-y-3">
            {/* Coupon input */}
            {couponCode ? (
              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between text-xs text-emerald-800">
                <div className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-bold">Code "{couponCode}" Applied</span>
                </div>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-xs text-rose-600 hover:underline font-semibold"
                >
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
                  className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl uppercase outline-none focus:border-brand-600"
                />
                <button
                  type="submit"
                  disabled={isApplying}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
                >
                  {isApplying ? 'Applying...' : 'Apply'}
                </button>
              </form>
            )}
            {couponError && <p className="text-[11px] text-rose-600">{couponError}</p>}

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">{formatAED(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Coupon Discount</span>
                  <span className="font-semibold">-{formatAED(discount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated UAE VAT (5%)</span>
                <span className="font-semibold text-slate-900">{formatAED(vatAmount)}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="font-semibold text-slate-900">
                  {deliveryFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : formatAED(deliveryFee)}
                </span>
              </div>

              <div className="flex justify-between text-sm font-black text-slate-950 pt-2 border-t border-slate-100">
                <span>Total Due</span>
                <span className="text-brand-700 text-base">{formatAED(total)}</span>
              </div>
            </div>

            {/* Tabby Preview */}
            <TabbyWidget price={total} />

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={handleViewCartPage}
                className="py-3 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors text-center"
              >
                View Full Cart
              </button>

              <button
                type="button"
                onClick={handleProceedCheckout}
                className="py-3 px-3 bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                <span>Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
