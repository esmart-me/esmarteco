import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Heart,
  Layers,
  ShoppingCart,
  Zap,
  ChevronRight,
  Package,
  Plus,
  Minus,
  MessageCircle,
  Share2,
  CheckCircle2
} from 'lucide-react';
import { apiRequest } from '../lib/api.js';
import { Product, ProductVariant, Review } from '../types/index.js';
import { formatAED, formatDiscount } from '../lib/utils.js';
import { useCart } from '../context/CartContext.js';
import { useWishlist } from '../context/WishlistContext.js';
import { useCompare } from '../context/CompareContext.js';
import { TabbyWidget } from '../components/product/TabbyWidget.js';
import { TamaraWidget } from '../components/product/TamaraWidget.js';
import { ProductCard } from '../components/product/ProductCard.js';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [frequentlyBought, setFrequentlyBought] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // New review state
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmittedMsg, setReviewSubmittedMsg] = useState('');

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, addToCompare } = useCompare();

  useEffect(() => {
    const loadProduct = async () => {
      if (!slug) return;
      setIsLoading(true);
      try {
        const res = await apiRequest(`/products/${slug}`);
        if (res.success && res.product) {
          setProduct(res.product);
          setRelated(res.related || []);
          setFrequentlyBought(res.frequentlyBoughtTogether || []);
          setReviews(res.reviews || []);
          setSelectedImg(0);
          if (res.product.variants && res.product.variants.length > 0) {
            setSelectedVariant(res.product.variants[0]);
          } else {
            setSelectedVariant(undefined);
          }
        }
      } catch (err) {
        console.error('Error loading product details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-700 rounded-full animate-spin" />
        <p className="text-xs font-bold text-slate-500 mt-3">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-black text-slate-900">Product Not Found</h2>
        <p className="text-xs text-slate-500 mt-2">The product you requested could not be found or is out of stock.</p>
        <Link to="/shop" className="mt-4 inline-block px-5 py-2.5 bg-brand-700 text-white rounded-xl text-xs font-bold">
          Return to Electronics Shop
        </Link>
      </div>
    );
  }

  const effectivePrice = selectedVariant ? product.salePrice + selectedVariant.priceAdjustment : product.salePrice;
  const effectiveOriginal = selectedVariant ? product.originalPrice + selectedVariant.priceAdjustment : product.originalPrice;
  const discountPercent = formatDiscount(effectiveOriginal, effectivePrice);
  const inStock = product.stock > 0;
  const isWishlisted = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);

  const handleAddToCart = () => {
    if (!inStock) return;
    addToCart(product, quantity, selectedVariant);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleBuyNow = () => {
    if (!inStock) return;
    addToCart(product, quantity, selectedVariant);
    navigate('/checkout');
  };

  const handleAddBundle = () => {
    addToCart(product, 1, selectedVariant);
    frequentlyBought.forEach(p => addToCart(p, 1));
    navigate('/cart');
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;
    setIsSubmittingReview(true);
    try {
      const res = await apiRequest('/reviews', {
        method: 'POST',
        body: JSON.stringify({
          productId: product.id,
          userName: newReviewAuthor,
          rating: newReviewRating,
          comment: newReviewComment
        })
      });

      if (res.success && res.review) {
        setReviews([res.review, ...reviews]);
        setReviewSubmittedMsg('Thank you! Your review has been added.');
        setNewReviewAuthor('');
        setNewReviewComment('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-6 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
          <Link to="/" className="hover:text-slate-700">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/shop" className="hover:text-slate-700">Shop</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to={`/shop?category=${product.categorySlug}`} className="hover:text-slate-700 capitalize">
            {product.categorySlug.replace('-', ' ')}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-800 font-semibold truncate max-w-xs">{product.title}</span>
        </div>

        {/* Main Product Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Image with Zoom container */}
            <div className="relative w-full h-80 sm:h-[450px] bg-slate-50/50 rounded-3xl border border-slate-100 p-6 flex items-center justify-center overflow-hidden group">
              <img
                src={product.images[selectedImg] || product.images[0]}
                alt={product.title}
                className="max-w-full max-h-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-110"
              />

              {discountPercent > 0 && (
                <span className="absolute top-4 left-4 px-3 py-1 bg-rose-600 text-white text-xs font-black rounded-lg shadow-sm">
                  SAVE {discountPercent}%
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImg(idx)}
                    className={`w-20 h-20 rounded-2xl border p-2 bg-white flex-shrink-0 transition-all ${
                      selectedImg === idx ? 'border-brand-700 ring-2 ring-brand-100' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Actions & Details */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-700 uppercase tracking-wider">{product.brand}</span>
                <span className="text-xs text-slate-400">SKU: {product.sku} | Barcode: {product.barcode}</span>
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 mt-1 leading-snug">
                {product.title}
              </h1>

              {/* Rating & Review */}
              <div className="flex items-center gap-3 mt-2 text-xs">
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-slate-900 ml-1">{product.rating}</span>
                </div>
                <span className="text-slate-400">({product.reviewCount} customer reviews)</span>
                <span className="text-slate-300">•</span>
                {inStock ? (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>In Stock ({product.stock} units in Abu Dhabi warehouse)</span>
                  </span>
                ) : (
                  <span className="text-rose-600 font-bold">Out of Stock</span>
                )}
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-slate-950">{formatAED(effectivePrice)}</span>
                {effectiveOriginal > effectivePrice && (
                  <span className="text-base text-slate-400 line-through">{formatAED(effectiveOriginal)}</span>
                )}
                {discountPercent > 0 && (
                  <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-xs font-bold rounded-md">
                    Save {discountPercent}%
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Price includes 5% UAE VAT (FTA Tax Invoice provided)</p>

              {/* BNPL Widgets */}
              <div className="mt-3 space-y-2">
                <TabbyWidget price={effectivePrice} />
                <TamaraWidget price={effectivePrice} />
              </div>
            </div>

            {/* Variants Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-slate-800 block">Select Variant / Storage:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {product.variants.map(v => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                        selectedVariant?.id === v.id
                          ? 'border-brand-700 bg-brand-50 text-brand-900 font-bold ring-2 ring-brand-100'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <p className="truncate">{v.name}</p>
                      {v.priceAdjustment !== 0 && (
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {v.priceAdjustment > 0 ? `+${formatAED(v.priceAdjustment)}` : formatAED(v.priceAdjustment)}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Primary CTAs */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-2.5 text-slate-600 hover:bg-slate-200 font-bold"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 py-2.5 text-xs font-bold text-slate-800">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3.5 py-2.5 text-slate-600 hover:bg-slate-200 font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className={`flex-1 py-3.5 px-6 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
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
                      <span>Added to Cart!</span>
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
                  className="w-full py-3 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Instant Buy Now with UAE Delivery</span>
                </button>
              )}

              {/* Auxiliary action icons */}
              <div className="flex items-center justify-between pt-2 text-xs text-slate-600">
                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className="flex items-center gap-1.5 hover:text-rose-600"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
                  <span>{isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => addToCompare(product)}
                  className="flex items-center gap-1.5 hover:text-brand-700"
                >
                  <Layers className={`w-4 h-4 ${isCompared ? 'text-brand-700' : ''}`} />
                  <span>{isCompared ? 'In Compare List' : 'Compare Specs'}</span>
                </button>

                <a
                  href={`https://wa.me/971508924118?text=Hello,%20I%20am%20interested%20in%20${encodeURIComponent(product.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 font-semibold"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Ask on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* UAE Delivery & Warranty Perforated Trust Box */}
            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-brand-700" />
                <span>Fast Delivery across Abu Dhabi, Dubai & all UAE (1-2 Days). Free over AED 250.</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{product.warranty} (Authorized service centers across Emirates).</span>
              </div>
              <div className="flex items-center gap-2.5">
                <RotateCcw className="w-4 h-4 text-amber-600" />
                <span>7 Days Hassle-Free UAE Return & Replacement Guarantee.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications & Description Tabs */}
        <div className="mt-16 pt-8 border-t border-slate-100">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Description & What's in the Box */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-lg font-black text-slate-900 mb-3">Product Overview</h3>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              {product.whatsInBox && product.whatsInBox.length > 0 && (
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-3">
                    <Package className="w-4 h-4 text-brand-700" />
                    <span>What's In The Box</span>
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                    {product.whatsInBox.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Technical Specifications Table */}
              <div>
                <h3 className="text-lg font-black text-slate-900 mb-4">Technical Specifications</h3>
                <div className="border border-slate-100 rounded-2xl overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <tbody className="divide-y divide-slate-100">
                      <tr className="bg-slate-50">
                        <td className="py-2.5 px-4 font-bold text-slate-700 w-1/3">Brand</td>
                        <td className="py-2.5 px-4 text-slate-800">{product.brand}</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-bold text-slate-700 bg-slate-50">Model Number</td>
                        <td className="py-2.5 px-4 text-slate-800">{product.model}</td>
                      </tr>
                      <tr className="bg-slate-50">
                        <td className="py-2.5 px-4 font-bold text-slate-700">SKU Code</td>
                        <td className="py-2.5 px-4 text-slate-800">{product.sku}</td>
                      </tr>
                      {product.specifications &&
                        Object.entries(product.specifications).map(([key, val], idx) => (
                          <tr key={key} className={idx % 2 === 0 ? '' : 'bg-slate-50'}>
                            <td className="py-2.5 px-4 font-bold text-slate-700">{key}</td>
                            <td className="py-2.5 px-4 text-slate-800">{val}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right: Frequently Bought Together Bundle */}
            <div>
              {frequentlyBought.length > 0 && (
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                    Frequently Bought Together
                  </h4>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2 bg-white rounded-xl border border-slate-100">
                      <img src={product.images[0]} alt="" className="w-12 h-12 object-contain mix-blend-multiply" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-900 truncate">{product.title}</p>
                        <p className="text-xs font-black text-slate-900">{formatAED(product.salePrice)}</p>
                      </div>
                    </div>

                    {frequentlyBought.map(acc => (
                      <div key={acc.id} className="flex items-center gap-3 p-2 bg-white rounded-xl border border-slate-100">
                        <img src={acc.images[0]} alt="" className="w-12 h-12 object-contain mix-blend-multiply" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-900 truncate">{acc.title}</p>
                          <p className="text-xs font-black text-slate-900">{formatAED(acc.salePrice)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-200">
                    <div className="flex justify-between text-xs font-bold text-slate-900 mb-3">
                      <span>Bundle Total Price:</span>
                      <span className="text-brand-700 text-sm">
                        {formatAED(
                          product.salePrice + frequentlyBought.reduce((sum, item) => sum + item.salePrice, 0)
                        )}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddBundle}
                      className="w-full py-2.5 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                    >
                      Add Both to Cart
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-16 pt-8 border-t border-slate-100">
          <div className="max-w-4xl">
            <h3 className="text-xl font-black text-slate-900 mb-4">Customer Reviews ({reviews.length})</h3>

            {/* Review form */}
            <form onSubmit={handleSubmitReview} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 mb-8 space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Write a Verified Review</h4>
              {reviewSubmittedMsg && (
                <div className="p-3 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl">
                  {reviewSubmittedMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={newReviewAuthor}
                    onChange={e => setNewReviewAuthor(e.target.value)}
                    required
                    placeholder="e.g. Sultan Al Marzooqi"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Star Rating</label>
                  <select
                    value={newReviewRating}
                    onChange={e => setNewReviewRating(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-600"
                  >
                    <option value={5}>5 Stars - Outstanding</option>
                    <option value={4}>4 Stars - Great</option>
                    <option value={3}>3 Stars - Good</option>
                    <option value={2}>2 Stars - Fair</option>
                    <option value={1}>1 Star - Poor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Review</label>
                <textarea
                  value={newReviewComment}
                  onChange={e => setNewReviewComment(e.target.value)}
                  required
                  rows={3}
                  placeholder="Share your experience with the product, delivery, or warranty in the UAE..."
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-600"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingReview}
                className="px-5 py-2.5 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
              >
                {isSubmittingReview ? 'Submitting...' : 'Submit Verified Review'}
              </button>
            </form>

            {/* List of Reviews */}
            <div className="space-y-4">
              {reviews.map(rev => (
                <div key={rev.id} className="p-4 rounded-2xl border border-slate-100 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{rev.userName}</span>
                      {rev.isVerifiedPurchase && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          Verified UAE Buyer
                        </span>
                      )}
                    </div>
                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mt-2">{rev.comment}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{rev.createdAt.split('T')[0]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16 pt-8 border-t border-slate-100">
            <h3 className="text-xl font-black text-slate-900 mb-6">Related Electronics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {related.map(prod => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 z-40 flex items-center justify-between gap-3 shadow-dropdown">
        <div>
          <span className="text-xs text-slate-400 block leading-none">Total</span>
          <span className="text-base font-black text-slate-950">{formatAED(effectivePrice)}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!inStock}
            className="px-4 py-2.5 bg-brand-50 text-brand-700 border border-brand-200 rounded-xl text-xs font-bold"
          >
            Add to Cart
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            disabled={!inStock}
            className="px-5 py-2.5 bg-brand-700 text-white rounded-xl text-xs font-bold"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};
