import React, { useState, useEffect } from 'react';
import { apiRequest } from '../lib/api.js';
import { Product, Banner, Category, Brand, WeeklyOffer, FlashSale, Review } from '../types/index.js';

import { HeroBannerSlider } from '../components/home/HeroBannerSlider.js';
import { CategoryShortcuts } from '../components/home/CategoryShortcuts.js';
import { WeeklyDealsSection } from '../components/home/WeeklyDealsSection.js';
import { FlashSaleSection } from '../components/home/FlashSaleSection.js';
import { BestSellersSection } from '../components/home/BestSellersSection.js';
import { NewArrivalsSection } from '../components/home/NewArrivalsSection.js';
import { FeaturedProductsSection } from '../components/home/FeaturedProductsSection.js';
import { PromoBanner } from '../components/home/PromoBanner.js';
import { BrandsSlider } from '../components/home/BrandsSlider.js';
import { TrustFeatures } from '../components/home/TrustFeatures.js';
import { CustomerReviewsSection } from '../components/home/CustomerReviewsSection.js';
import { Newsletter } from '../components/home/Newsletter.js';
import { QuickViewModal } from '../components/common/QuickViewModal.js';

export const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [weeklyOffers, setWeeklyOffers] = useState<(WeeklyOffer & { product: Product })[]>([]);
  const [flashSales, setFlashSales] = useState<(FlashSale & { product: Product })[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [
          prodRes,
          bannerRes,
          catRes,
          brandRes,
          weeklyRes,
          flashRes
        ] = await Promise.all([
          apiRequest('/products?limit=50'),
          apiRequest('/banners'),
          apiRequest('/categories'),
          apiRequest('/brands'),
          apiRequest('/offers/weekly'),
          apiRequest('/offers/flash')
        ]);

        if (prodRes.success && prodRes.products) setProducts(prodRes.products);
        if (bannerRes.success && bannerRes.banners) setBanners(bannerRes.banners);
        if (catRes.success && catRes.categories) setCategories(catRes.categories);
        if (brandRes.success && brandRes.brands) setBrands(brandRes.brands);
        if (weeklyRes.success && weeklyRes.weeklyOffers) setWeeklyOffers(weeklyRes.weeklyOffers);
        if (flashRes.success && flashRes.flashSales) setFlashSales(flashRes.flashSales);

        // Fetch sample product reviews
        if (prodRes.products && prodRes.products.length > 0) {
          const revRes = await apiRequest(`/reviews/${prodRes.products[0].id}`);
          if (revRes.success && revRes.reviews) setReviews(revRes.reviews);
        }
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadHomeData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-700 rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-500 tracking-wider uppercase">Loading E Smart Electronics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 3. Hero Promotional Banners */}
      <HeroBannerSlider banners={banners} />

      {/* 4. Category Shortcuts */}
      <CategoryShortcuts categories={categories} />

      {/* 5. Weekly Offers with Countdown */}
      <WeeklyDealsSection offers={weeklyOffers} onQuickView={setQuickViewProduct} />

      {/* 6. Flash Sale Section with Countdown & "Only X left" */}
      <FlashSaleSection flashSales={flashSales} />

      {/* 7. Best Sellers */}
      <BestSellersSection products={products} onQuickView={setQuickViewProduct} />

      {/* 8. New Arrivals */}
      <NewArrivalsSection products={products} onQuickView={setQuickViewProduct} />

      {/* 9. Featured Products */}
      <FeaturedProductsSection products={products} onQuickView={setQuickViewProduct} />

      {/* 10. Promotional Middle Banner */}
      <PromoBanner banners={banners} />

      {/* 11. Popular Brands */}
      <BrandsSlider brands={brands} />

      {/* 12. Why Shop With Us / Trust Section */}
      <TrustFeatures />

      {/* 13. Customer Reviews */}
      <CustomerReviewsSection reviews={reviews} />

      {/* 14. Newsletter */}
      <Newsletter />

      {/* Quick View Modal */}
      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
};
