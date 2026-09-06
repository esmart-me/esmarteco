import { supabase, isSupabaseConfigured } from './supabase.js';
import { apiRequest } from './api.js';
import { Product, Category, Brand, Banner, WeeklyOffer, FlashSale, Order, Review } from '../types/index.js';

/**
 * Service providing high-level catalog, order, banner, and review operations
 * prioritizing Supabase PostgreSQL with seamless fallback to clientStore / api.
 */

export const supabaseService = {
  // --- Products ---
  async getProducts(): Promise<Product[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(
            *,
            category:categories(slug, name),
            brand:brands(name, slug),
            images:product_images(image_url, is_primary, display_order),
            variants:product_variants(*)
          )
          .eq('status', 'active');

        if (!error && data && data.length > 0) {
          return data.map((row: any) => ({
            id: row.id,
            slug: row.slug,
            title: row.name,
            brand: row.brand?.name || 'Electronics',
            model: row.name,
            sku: row.sku || '',
            barcode: row.barcode || '',
            categorySlug: row.category?.slug || 'smartphones',
            description: row.description || '',
            shortSpecs: row.short_description ? [row.short_description] : [],
            originalPrice: Number(row.original_price),
            salePrice: Number(row.sale_price),
            costPrice: row.cost_price ? Number(row.cost_price) : undefined,
            stock: Number(row.stock_quantity),
            stockAlertThreshold: Number(row.low_stock_threshold || 5),
            rating: 4.8,
            reviewCount: 12,
            isWeeklyOffer: Boolean(row.is_weekly_offer),
            isFlashSale: Boolean(row.is_flash_sale),
            isFeatured: Boolean(row.is_featured),
            isNew: Boolean(row.is_new_arrival),
            isBestseller: Boolean(row.is_best_seller),
            warranty: row.warranty || '1 Year Official UAE Warranty',
            whatsInBox: ['Device', 'Fast Charger (UAE 3-pin)', 'Charging Cable', 'Quick Start Guide'],
            images: (row.images && row.images.length > 0)
              ? row.images.sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0)).map((img: any) => img.image_url)
              : ['https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop&q=85'],
            specifications: {},
            variants: (row.variants || []).map((v: any) => ({
              id: v.id,
              name: v.name,
              color: v.color,
              storage: v.storage,
              ram: v.ram,
              size: v.size,
              priceAdjustment: Number(v.price_adjustment || 0),
              sku: v.sku || '',
              stock: Number(v.stock_quantity || 0)
            })),
            createdAt: row.created_at
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch failed, using fallback:', err);
      }
    }

    const res = await apiRequest<{ products: Product[] }>('/products');
    return (res.products || []) as Product[];
  },

  // --- Categories ---
  async getCategories(): Promise<Category[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (!error && data && data.length > 0) {
          return data.map((c: any) => ({
            id: c.id,
            slug: c.slug,
            name: c.name,
            icon: c.icon || 'Cpu',
            image: c.image_url || 'https://images.unsplash.com/photo-1511707171634-5f897ff02544?w=400&auto=format&fit=crop&q=80',
            description: c.description || ''
          }));
        }
      } catch (err) {
        console.warn('Supabase categories fetch failed:', err);
      }
    }

    const res = await apiRequest<{ categories: Category[] }>('/categories');
    return (res.categories || []) as Category[];
  },

  // --- Brands ---
  async getBrands(): Promise<Brand[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('brands')
          .select('*')
          .eq('is_active', true);

        if (!error && data && data.length > 0) {
          return data.map((b: any) => ({
            id: b.id,
            slug: b.slug,
            name: b.name,
            logo: b.logo_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
            featured: b.is_featured
          }));
        }
      } catch (err) {
        console.warn('Supabase brands fetch failed:', err);
      }
    }

    const res = await apiRequest<{ brands: Brand[] }>('/brands');
    return (res.brands || []) as Brand[];
  },

  // --- Banners ---
  async getBanners(): Promise<Banner[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('homepage_banners')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (!error && data && data.length > 0) {
          return data.map((b: any) => ({
            id: b.id,
            title: b.title,
            subtitle: b.subtitle || '',
            offerText: b.offer_text || '',
            badge: b.badge || 'EXCLUSIVE UAE OFFER',
            image: b.image_url,
            ctaText: b.cta_text || 'Shop Now',
            ctaLink: b.cta_link || '/shop',
            type: (b.banner_type || 'hero') as any,
            order: b.display_order || 1,
            active: b.is_active
          }));
        }
      } catch (err) {
        console.warn('Supabase banners fetch failed:', err);
      }
    }

    const res = await apiRequest<{ banners: Banner[] }>('/banners');
    return (res.banners || []) as Banner[];
  },

  // --- Weekly Offers ---
  async getWeeklyOffers(): Promise<WeeklyOffer[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('offers')
          .select('*, product:products(*)')
          .eq('is_active', true);

        if (!error && data && data.length > 0) {
          return data.map((o: any) => ({
            id: o.id,
            productId: o.product_id,
            offerPrice: Number(o.offer_price),
            originalPrice: Number(o.original_price),
            discountPercent: Math.round(((Number(o.original_price) - Number(o.offer_price)) / Number(o.original_price)) * 100),
            expiresAt: o.expires_at,
            stockQuantity: Number(o.stock_limit || 10),
            active: o.is_active,
            product: o.product ? {
              id: o.product.id,
              slug: o.product.slug,
              title: o.product.name,
              brand: 'Electronics',
              model: o.product.name,
              sku: o.product.sku,
              barcode: o.product.barcode || '',
              categorySlug: 'smartphones',
              description: o.product.description || '',
              shortSpecs: [],
              originalPrice: Number(o.product.original_price),
              salePrice: Number(o.product.sale_price),
              stock: Number(o.product.stock_quantity),
              stockAlertThreshold: 5,
              rating: 4.9,
              reviewCount: 15,
              isWeeklyOffer: true,
              isFlashSale: false,
              isFeatured: true,
              isNew: false,
              isBestseller: true,
              warranty: '1 Year Official UAE Warranty',
              whatsInBox: ['Device'],
              images: ['https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop&q=85'],
              specifications: {},
              createdAt: o.product.created_at
            } : undefined
          }));
        }
      } catch (err) {
        console.warn('Supabase weekly offers fetch failed:', err);
      }
    }

    const res = await apiRequest<{ offers: WeeklyOffer[] }>('/offers/weekly');
    return (res.offers || []) as WeeklyOffer[];
  },

  // --- Flash Sales ---
  async getFlashSales(): Promise<FlashSale[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('flash_sales')
          .select('*, product:products(*)')
          .eq('is_active', true);

        if (!error && data && data.length > 0) {
          return data.map((f: any) => ({
            id: f.id,
            productId: f.product_id,
            flashPrice: Number(f.flash_price),
            originalPrice: Number(f.original_price),
            discountPercent: Math.round(((Number(f.original_price) - Number(f.flash_price)) / Number(f.original_price)) * 100),
            totalStock: Number(f.total_stock),
            remainingStock: Number(f.remaining_stock),
            endsAt: f.ends_at,
            active: f.is_active
          }));
        }
      } catch (err) {
        console.warn('Supabase flash sales fetch failed:', err);
      }
    }

    const res = await apiRequest<{ flashSales: FlashSale[] }>('/offers/flash');
    return (res.flashSales || []) as FlashSale[];
  },

  // --- Orders ---
  async createOrder(orderPayload: Partial<Order>): Promise<{ success: boolean; order?: Order; message?: string }> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .insert({
            order_number: orderPayload.orderNumber,
            customer_name: orderPayload.customer?.fullName,
            customer_email: orderPayload.customer?.email,
            customer_phone: orderPayload.customer?.phone,
            shipping_address: orderPayload.shippingAddress,
            subtotal: orderPayload.subtotal,
            discount_amount: orderPayload.discountAmount || 0,
            vat_rate: 0.05,
            vat_amount: orderPayload.vatAmount,
            delivery_fee: orderPayload.deliveryFee || 0,
            delivery_type: orderPayload.deliveryType || 'standard',
            total_amount: orderPayload.total,
            payment_method: orderPayload.paymentMethod,
            payment_status: orderPayload.paymentStatus || 'pending',
            order_status: 'PROCESSING',
            invoice_number: orderPayload.invoiceNumber,
            invoice_date: new Date().toISOString().split('T')[0]
          })
          .select()
          .single();

        if (!error && data) {
          // Insert items if available
          if (orderPayload.items && orderPayload.items.length > 0) {
            const itemsToInsert = orderPayload.items.map(item => ({
              order_id: data.id,
              product_id: item.productId.length === 36 ? item.productId : null,
              product_name: item.productTitle,
              product_image: item.productImage,
              sku: item.sku || 'SKU-UAE',
              variant_name: item.variantName || null,
              unit_price: item.unitPrice,
              quantity: item.quantity,
              total_price: item.totalPrice
            }));
            await supabase.from('order_items').insert(itemsToInsert);
          }

          return { success: true, order: { ...orderPayload, id: data.id } as Order };
        }
      } catch (err) {
        console.warn('Supabase order insert failed, using fallback:', err);
      }
    }

    const res = await apiRequest<{ order: Order }>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderPayload)
    });
    return res;
  }
};
