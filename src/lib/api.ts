import { clientStore } from './clientDb.js';
import { supabase, isSupabaseConfigured } from './supabase.js';

const BASE_URL = '/api';
const isGitHubPages = typeof window !== 'undefined' && window.location.hostname.includes('github.io');

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string; [key: string]: any }> {
  // If Supabase is active, handle key read endpoints directly with Supabase
  if (isSupabaseConfigured) {
    const url = new URL(endpoint, 'http://localhost');
    const path = url.pathname;
    const query = Object.fromEntries(url.searchParams.entries());

    try {
      // 1. Categories
      if (path === '/categories') {
        const { data } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });
        if (data && data.length > 0) {
          const formatted = data.map((c: any) => ({
            id: c.id,
            slug: c.slug,
            name: c.name,
            icon: c.icon || 'Cpu',
            image: c.image_url || '',
            description: c.description || ''
          }));
          return { success: true, categories: formatted };
        }
      }

      // 2. Brands
      if (path === '/brands') {
        const { data } = await supabase
          .from('brands')
          .select('*')
          .eq('is_active', true);
        if (data && data.length > 0) {
          const formatted = data.map((b: any) => ({
            id: b.id,
            slug: b.slug,
            name: b.name,
            logo: b.logo_url || '',
            featured: b.is_featured
          }));
          return { success: true, brands: formatted };
        }
      }

      // 3. Banners
      if (path === '/banners') {
        const { data } = await supabase
          .from('homepage_banners')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });
        if (data && data.length > 0) {
          const formatted = data.map((b: any) => ({
            id: b.id,
            title: b.title,
            subtitle: b.subtitle || '',
            offerText: b.offer_text || '',
            badge: b.badge || '',
            image: b.image_url,
            ctaText: b.cta_text || 'Shop Now',
            ctaLink: b.cta_link || '/shop',
            type: b.banner_type || 'hero',
            order: b.display_order || 1,
            active: b.is_active
          }));
          return { success: true, banners: formatted };
        }
      }

      // 4. Products query
      if (path === '/products') {
        let q = supabase
          .from('products')
          .select(`
            *,
            category:categories(slug, name),
            brand:brands(name, slug),
            images:product_images(image_url, is_primary, display_order)
          `)
          .eq('status', 'active');

        if (query.featured === 'true') q = q.eq('is_featured', true);
        if (query.weeklyOffer === 'true') q = q.eq('is_weekly_offer', true);
        if (query.flashSale === 'true') q = q.eq('is_flash_sale', true);

        const { data } = await q;
        if (data && data.length > 0) {
          const mapped = data.map((p: any) => ({
            id: p.id,
            slug: p.slug,
            title: p.name,
            brand: p.brand?.name || 'Electronics',
            model: p.name,
            sku: p.sku,
            barcode: p.barcode || '',
            categorySlug: p.category?.slug || 'smartphones',
            description: p.description || '',
            shortSpecs: p.short_description ? [p.short_description] : [],
            originalPrice: Number(p.original_price),
            salePrice: Number(p.sale_price),
            costPrice: p.cost_price ? Number(p.cost_price) : undefined,
            stock: Number(p.stock_quantity),
            stockAlertThreshold: Number(p.low_stock_threshold || 5),
            rating: 4.8,
            reviewCount: 15,
            isWeeklyOffer: Boolean(p.is_weekly_offer),
            isFlashSale: Boolean(p.is_flash_sale),
            isFeatured: Boolean(p.is_featured),
            isNew: Boolean(p.is_new_arrival),
            isBestseller: Boolean(p.is_best_seller),
            warranty: p.warranty || '1 Year Official UAE Warranty',
            whatsInBox: ['Device', 'Charger (UAE 3-pin)', 'Manual'],
            images: (p.images && p.images.length > 0)
              ? p.images.sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0)).map((img: any) => img.image_url)
              : ['https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop&q=85'],
            specifications: {},
            createdAt: p.created_at
          }));
          return { success: true, products: mapped, total: mapped.length };
        }
      }
    } catch (e) {
      console.warn('Supabase request error, proceeding with standard API / clientStore fallback:', e);
    }
  }

  // If hosted on static GitHub Pages or server is offline, handle immediately via in-memory store
  if (isGitHubPages) {
    const res = clientStore.handleRequest(endpoint, options);
    return Promise.resolve(res);
  }

  const token = localStorage.getItem('esmart_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const fallback = clientStore.handleRequest(endpoint, options);
      return Promise.resolve(fallback);
    }

    const data = await response.json();
    return { success: true, ...data, data };
  } catch (err) {
    const fallback = clientStore.handleRequest(endpoint, options);
    return Promise.resolve(fallback);
  }
}
