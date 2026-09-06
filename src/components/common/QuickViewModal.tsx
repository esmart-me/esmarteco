import React, { useState } from 'react';
import { X, Star, ShieldCheck, Truck, ShoppingCart, Zap, Check } from 'lucide-react';
import { Product } from '../../types/index.js';
import { formatAED, formatDiscount } from '../../lib/utils.js';
import { useCart } from '../../context/CartContext.js';
import { TabbyWidget } from '../product/TabbyWidget.js';
import { useNavigate } from 'react-router-dom';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const [selectedImg, setSelectedImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  if (!product) return null;

  const discountPercent = formatDiscount(product.originalPrice, product.salePrice);
  const inStock = product.stock > 0;

  const handleAddToCart = () => {
    if (!inStock) return;
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleBuyNow = () => {
    if (!inStock) return;
    addToCart(product, quantity);
    onClose();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-slate-100 p-6"
        onClick={e => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Gallery */}
          <div className="flex flex-col gap-3">
            <div className="w-full h-72 bg-slate-50/50 rounded-2xl p-4 flex items-center justify-center border border-slate-100">
              <img
                src={product.images[selectedImg] || product.images[0]}
                alt={product.title}
                className="max-h-full max-w-full object-contain mix-blend-multiply"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedImg(i)}
                    className={`w-16 h-16 rounded-xl border p-1 bg-white flex-shrink-0 transition-all ${
                      selectedImg === i ? 'border-brand-600 ring-2 ring-brand-100' : 'border-slate-200 opacity-70'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-700 uppercase tracking-wider">{product.brand}</span>
                <span className="text-xs text-slate-400">SKU: {product.sku}</span>
              </div>

              <h2 className="text-lg font-extrabold text-slate-900 mt-1">{product.title}</h2>

              <div className="flex items-center gap-3 mt-2 text-xs">
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-slate-800 ml-1">{product.rating}</span>
                </div>
                <span className="text-slate-400">({product.reviewCount} customer reviews)</span>
                <span className="text-slate-300">•</span>
                {inStock ? (
                  <span className="font-semibold text-emerald-600">In Stock ({product.stock} available)</span>
                ) : (
                  <span className="font-semibold text-rose-600">Out of Stock</span>
                )}
              </div>

              {/* Pricing */}
              <div className="mt-4 pb-4 border-b border-slate-100">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-black text-slate-900">{formatAED(product.salePrice)}</span>
                  {product.originalPrice > product.salePrice && (
                    <>
                      <span className="text-sm text-slate-400 line-through">{formatAED(product.originalPrice)}</span>
                      <span className="px-2 py-0.5 bg-rose-50 text-rose-600 text-xs font-bold rounded">
                        Save {discountPercent}%
                      </span>
                    </>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Inclusive of 5% UAE VAT</p>
                <TabbyWidget price={product.salePrice} className="mt-3" />
              </div>

              {/* Short Specs */}
              {product.shortSpecs && (
                <ul className="mt-4 space-y-1 text-xs text-slate-600">
                  {product.shortSpecs.map((s, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* UAE Badges */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{product.warranty}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-brand-600" />
                  <span>Fast UAE Delivery (1-2 Days)</span>
                </div>
              </div>
            </div>

            {/* Quantity & CTA */}
            <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-200 font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-xs font-bold text-slate-800">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-200 font-bold text-sm"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    !inStock
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-brand-700 hover:bg-brand-800 text-white shadow-sm'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Cart</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
              </div>

              {inStock && (
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Instant Buy Now</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
