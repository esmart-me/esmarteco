import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Eye, ShoppingCart, Star, Zap, Layers, Check } from 'lucide-react';
import { Product } from '../../types/index.js';
import { formatAED, formatDiscount } from '../../lib/utils.js';
import { useCart } from '../../context/CartContext.js';
import { useWishlist } from '../../context/WishlistContext.js';
import { useCompare } from '../../context/CompareContext.js';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  layout?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView, layout = 'grid' }) => {
  const [isAdded, setIsAdded] = useState(false);
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, addToCompare } = useCompare();

  const isWishlisted = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);
  const discountPercent = formatDiscount(product.originalPrice, product.salePrice);
  const inStock = product.stock > 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;
    addToCart(product, 1);
    navigate('/checkout');
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCompare(product);
  };

  const handleOpenQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  if (layout === 'list') {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-4 hover:shadow-card-hover transition-all duration-200 flex flex-col sm:flex-row gap-4 items-center group">
        <Link to={`/product/${product.slug}`} className="w-full sm:w-48 h-48 bg-slate-50/50 rounded-xl p-3 flex-shrink-0 flex items-center justify-center relative overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {discountPercent > 0 && (
            <span className="absolute top-2 left-2 px-2 py-0.5 bg-rose-600 text-white text-[10px] font-black rounded-md">
              -{discountPercent}%
            </span>
          )}
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-brand-700 tracking-wider uppercase">{product.brand}</span>
            <span className="text-[11px] text-slate-400">SKU: {product.sku}</span>
          </div>

          <Link to={`/product/${product.slug}`} className="block mt-1">
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-brand-700 transition-colors line-clamp-2">
              {product.title}
            </h3>
          </Link>

          {/* Model & Short specs */}
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-medium text-slate-700">Model: {product.model}</span>
            {product.shortSpecs && product.shortSpecs.length > 0 && (
              <span className="hidden md:inline text-slate-400">• {product.shortSpecs.slice(0, 2).join(' • ')}</span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center text-amber-400 text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="ml-1 font-bold text-slate-800">{product.rating}</span>
            </div>
            <span className="text-xs text-slate-400">({product.reviewCount} reviews)</span>
            <span className="text-slate-300">•</span>
            {inStock ? (
              <span className="text-xs font-semibold text-emerald-600">In Stock ({product.stock} units)</span>
            ) : (
              <span className="text-xs font-semibold text-rose-600">Out of Stock</span>
            )}
          </div>
        </div>

        <div className="w-full sm:w-48 flex-shrink-0 flex flex-col justify-between sm:border-l sm:border-slate-100 sm:pl-4">
          <div>
            <div className="text-lg font-black text-slate-900">{formatAED(product.salePrice)}</div>
            {product.originalPrice > product.salePrice && (
              <div className="text-xs text-slate-400 line-through">{formatAED(product.originalPrice)}</div>
            )}
            <div className="text-[10px] text-emerald-600 font-semibold mt-1">
              or {formatAED(product.salePrice / 4)}/mo with Tabby
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!inStock}
              className={`w-full py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
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
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              disabled={!inStock}
              className="w-full py-1.5 px-3 text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-xl transition-colors flex items-center justify-center gap-1"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid layout (Default)
  return (
    <div className="bg-white rounded-2xl border border-slate-100 hover:border-slate-200 p-3.5 hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between relative group">
      {/* Top Badges & Action Buttons */}
      <div className="flex items-start justify-between gap-1 mb-2 z-10">
        <div className="flex flex-col gap-1">
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-black rounded-md shadow-sm">
              -{discountPercent}%
            </span>
          )}
          {product.isWeeklyOffer && (
            <span className="px-2 py-0.5 bg-brand-700 text-white text-[9px] font-black rounded-md tracking-wider uppercase">
              WEEKLY DEAL
            </span>
          )}
          {product.isFlashSale && (
            <span className="px-2 py-0.5 bg-amber-500 text-slate-950 text-[9px] font-black rounded-md tracking-wider uppercase">
              FLASH SALE
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* Wishlist Button */}
          <button
            type="button"
            onClick={handleToggleWishlist}
            className={`p-1.5 rounded-full transition-colors ${
              isWishlisted
                ? 'bg-rose-50 text-rose-600'
                : 'bg-white/80 text-slate-400 hover:text-rose-600 hover:bg-rose-50'
            }`}
            title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600' : ''}`} />
          </button>

          {/* Quick View Button */}
          {onQuickView && (
            <button
              type="button"
              onClick={handleOpenQuickView}
              className="p-1.5 rounded-full bg-white/80 text-slate-400 hover:text-brand-700 hover:bg-brand-50 transition-colors hidden sm:inline-flex"
              title="Quick Preview"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}

          {/* Compare Button */}
          <button
            type="button"
            onClick={handleToggleCompare}
            className={`p-1.5 rounded-full transition-colors hidden sm:inline-flex ${
              isCompared
                ? 'bg-brand-100 text-brand-800'
                : 'bg-white/80 text-slate-400 hover:text-brand-700 hover:bg-brand-50'
            }`}
            title="Compare"
          >
            <Layers className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Image Link */}
      <Link
        to={`/product/${product.slug}`}
        className="w-full h-44 sm:h-52 bg-white rounded-xl p-2 flex items-center justify-center overflow-hidden relative group/img mb-3"
      >
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-contain mix-blend-multiply group-hover/img:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </Link>

      {/* Product Information */}
      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-between text-[11px] mb-1">
          <span className="font-bold text-brand-700 uppercase tracking-wider">{product.brand}</span>
          <span className="text-slate-400 text-[10px]">Model: {product.model}</span>
        </div>

        <Link to={`/product/${product.slug}`} className="block">
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-brand-700 transition-colors line-clamp-2 min-h-[2.5rem]">
            {product.title}
          </h3>
        </Link>

        {/* Short Specs Snippet */}
        {product.shortSpecs && product.shortSpecs.length > 0 && (
          <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
            {product.shortSpecs[0]}
          </p>
        )}

        {/* Rating & Stock */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50 text-[11px]">
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-bold text-slate-800">{product.rating}</span>
            <span className="text-slate-400">({product.reviewCount})</span>
          </div>

          {inStock ? (
            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              In Stock
            </span>
          ) : (
            <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
              Out of Stock
            </span>
          )}
        </div>

        {/* Price Section */}
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-black text-slate-900">
              {formatAED(product.salePrice)}
            </span>
            {product.originalPrice > product.salePrice && (
              <span className="text-xs text-slate-400 line-through">
                {formatAED(product.originalPrice)}
              </span>
            )}
          </div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-0.5 flex items-center gap-1">
            <span>or 4x {formatAED(product.salePrice / 4)}/mo</span>
            <span className="text-[9px] bg-emerald-100 text-emerald-900 px-1 rounded font-bold">Tabby</span>
          </div>
        </div>

        {/* Action Buttons: Add to Cart & Buy Now */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!inStock}
            className={`py-2 px-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-all ${
              !inStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed col-span-2'
                : isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-brand-700 hover:bg-brand-800 text-white shadow-sm'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span className="truncate">Added</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span className="truncate">Add to Cart</span>
              </>
            )}
          </button>

          {inStock && (
            <button
              type="button"
              onClick={handleBuyNow}
              className="py-2 px-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-brand-50 hover:text-brand-700 rounded-xl transition-colors flex items-center justify-center gap-1"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span className="truncate">Buy Now</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
