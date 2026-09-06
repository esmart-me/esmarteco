import {
  INITIAL_CATEGORIES,
  INITIAL_BRANDS,
  INITIAL_PRODUCTS,
  INITIAL_BANNERS,
  INITIAL_WEEKLY_OFFERS,
  INITIAL_FLASH_SALES,
  INITIAL_COUPONS,
  INITIAL_REVIEWS,
  INITIAL_ORDERS
} from '../../server/src/database/seedData.js';
import { Product, Order, OrderStatus, WeeklyOffer, FlashSale, Banner, Coupon, Review, User } from '../types/index.js';

class ClientStore {
  private products: Product[] = INITIAL_PRODUCTS;
  private categories = INITIAL_CATEGORIES;
  private brands = INITIAL_BRANDS;
  private banners: Banner[] = INITIAL_BANNERS;
  private weeklyOffers: WeeklyOffer[] = INITIAL_WEEKLY_OFFERS;
  private flashSales: FlashSale[] = INITIAL_FLASH_SALES;
  private coupons: Coupon[] = INITIAL_COUPONS;
  private reviews: Review[] = INITIAL_REVIEWS;
  private orders: Order[] = INITIAL_ORDERS;

  public handleRequest(endpoint: string, options: RequestInit = {}): any {
    const url = new URL(endpoint, 'http://localhost');
    const path = url.pathname;
    const method = (options.method || 'GET').toUpperCase();
    const query = Object.fromEntries(url.searchParams.entries());

    // GET /api/health
    if (path === '/health') {
      return { success: true, status: 'online', store: 'E Smart Electronics LLC', location: 'Abu Dhabi, UAE' };
    }

    // GET /api/categories
    if (path === '/categories') {
      const cats = this.categories.map(c => ({
        ...c,
        productCount: this.products.filter(p => p.categorySlug.toLowerCase() === c.slug.toLowerCase()).length
      }));
      return { success: true, categories: cats };
    }

    // GET /api/brands
    if (path === '/brands') {
      const bnds = this.brands.map(b => ({
        ...b,
        productCount: this.products.filter(p => p.brand.toLowerCase() === b.name.toLowerCase()).length
      }));
      return { success: true, brands: bnds };
    }

    // GET /api/banners
    if (path === '/banners') {
      const type = query.type;
      let list = this.banners.filter(b => b.active);
      if (type) list = list.filter(b => b.type === type);
      return { success: true, banners: list.sort((a, b) => a.order - b.order) };
    }

    // GET /api/offers/weekly
    if (path === '/offers/weekly') {
      const list = this.weeklyOffers
        .filter(o => o.active)
        .map(o => ({ ...o, product: this.products.find(p => p.id === o.productId) }))
        .filter(o => Boolean(o.product));
      return { success: true, weeklyOffers: list };
    }

    // GET /api/offers/flash
    if (path === '/offers/flash') {
      const list = this.flashSales
        .filter(f => f.active)
        .map(f => ({ ...f, product: this.products.find(p => p.id === f.productId) }))
        .filter(f => Boolean(f.product));
      return { success: true, flashSales: list };
    }

    // GET /api/products/autocomplete
    if (path === '/products/autocomplete') {
      const q = (query.q || '').toLowerCase();
      const matched = this.products.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.model.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
      ).slice(0, 6);
      return {
        success: true,
        results: matched.map(m => ({
          id: m.id,
          slug: m.slug,
          title: m.title,
          brand: m.brand,
          model: m.model,
          sku: m.sku,
          image: m.images[0],
          salePrice: m.salePrice,
          originalPrice: m.originalPrice,
          stock: m.stock,
          inStock: m.stock > 0
        }))
      };
    }

    // GET /api/products/compare
    if (path === '/products/compare') {
      const ids = (query.ids || '').split(',').map(i => i.trim());
      const prods = ids.map(i => this.products.find(p => p.id === i || p.slug === i)).filter(Boolean);
      return { success: true, products: prods };
    }

    // GET /api/products/:slugOrId
    if (path.startsWith('/products/')) {
      const slugOrId = path.replace('/products/', '');
      if (slugOrId && slugOrId !== 'autocomplete' && slugOrId !== 'compare') {
        const prod = this.products.find(p => p.slug === slugOrId || p.id === slugOrId);
        if (!prod) return { success: false, message: 'Product not found' };

        const related = this.products.filter(p => p.categorySlug === prod.categorySlug && p.id !== prod.id).slice(0, 4);
        const frequentlyBoughtTogether = this.products.filter(p => p.id !== prod.id && p.categorySlug === 'chargers').slice(0, 2);
        const revs = this.reviews.filter(r => r.productId === prod.id);

        return { success: true, product: prod, related, frequentlyBoughtTogether, reviews: revs };
      }
    }

    // GET /api/products (catalog query)
    if (path === '/products') {
      let list = [...this.products];
      if (query.category) list = list.filter(p => p.categorySlug.toLowerCase() === query.category.toLowerCase());
      if (query.brand) list = list.filter(p => p.brand.toLowerCase() === query.brand.toLowerCase());
      if (query.q) {
        const q = query.q.toLowerCase();
        list = list.filter(p => p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
      }
      if (query.minPrice) list = list.filter(p => p.salePrice >= Number(query.minPrice));
      if (query.maxPrice) list = list.filter(p => p.salePrice <= Number(query.maxPrice));
      if (query.featured === 'true') list = list.filter(p => p.isFeatured);
      if (query.isNew === 'true') list = list.filter(p => p.isNew);
      if (query.bestseller === 'true') list = list.filter(p => p.isBestseller);
      if (query.weeklyOffer === 'true') list = list.filter(p => p.isWeeklyOffer);
      if (query.flashSale === 'true') list = list.filter(p => p.isFlashSale);

      if (query.sort === 'price_asc') list.sort((a, b) => a.salePrice - b.salePrice);
      if (query.sort === 'price_desc') list.sort((a, b) => b.salePrice - a.salePrice);
      if (query.sort === 'rating') list.sort((a, b) => b.rating - a.rating);

      return { success: true, products: list, total: list.length };
    }

    // POST /api/coupons/validate
    if (path === '/coupons/validate' && method === 'POST') {
      const body = JSON.parse(options.body as string || '{}');
      const coupon = this.coupons.find(c => c.code.toUpperCase() === (body.code || '').toUpperCase().trim());
      if (!coupon) return { success: false, message: 'Invalid promo coupon code.' };
      let discount = coupon.discountType === 'percentage' ? ((body.subtotal || 0) * coupon.discountValue) / 100 : coupon.discountValue;
      return { success: true, code: coupon.code, discountAmount: discount, message: 'Coupon applied!' };
    }

    // POST /api/orders
    if (path === '/orders' && method === 'POST') {
      const body = JSON.parse(options.body as string || '{}');
      const orderNumber = `ESM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const invoiceNumber = `INV-UAE-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const now = new Date().toISOString();

      let subtotal = 0;
      const verifiedItems = (body.items || []).map((item: any) => {
        const prod = this.products.find(p => p.id === item.productId) || this.products[0];
        const totalPrice = prod.salePrice * item.quantity;
        subtotal += totalPrice;
        return {
          productId: prod.id,
          productTitle: prod.title,
          productImage: prod.images[0],
          brand: prod.brand,
          model: prod.model,
          sku: prod.sku,
          unitPrice: prod.salePrice,
          quantity: item.quantity,
          totalPrice
        };
      });

      const vatAmount = Number((subtotal * 0.05).toFixed(2));
      const total = subtotal + vatAmount;

      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber,
        invoiceNumber,
        invoiceDate: now.split('T')[0],
        customer: body.customer || { fullName: 'Customer', email: 'customer@gmail.com', phone: '+971 50 123 4567' },
        shippingAddress: body.shippingAddress || { apartmentVilla: 'Villa 1', street: 'Hamdan St', area: 'Central', city: 'Abu Dhabi', emirate: 'Abu Dhabi', country: 'United Arab Emirates' },
        items: verifiedItems,
        subtotal,
        vatRate: 0.05,
        vatAmount,
        deliveryFee: 0,
        deliveryType: body.deliveryType || 'standard',
        discountAmount: 0,
        total,
        paymentMethod: body.paymentMethod || 'card',
        paymentStatus: 'confirmed',
        orderStatus: 'Payment Confirmed',
        trackingNumber: `TRK-UAE-${Math.floor(100000 + Math.random() * 900000)}`,
        carrier: 'E Smart Express Delivery UAE',
        statusHistory: [
          { status: 'Order Received', timestamp: now, note: 'Order placed' },
          { status: 'Payment Confirmed', timestamp: now, note: 'Payment verified' }
        ],
        createdAt: now
      };

      this.orders.unshift(newOrder);
      return { success: true, order: newOrder, message: 'Order placed successfully!' };
    }

    // GET /api/orders/track/:orderNumber
    if (path.startsWith('/orders/track/')) {
      const orderNo = path.replace('/orders/track/', '').toUpperCase();
      const found = this.orders.find(o => o.orderNumber.toUpperCase() === orderNo || o.id === orderNo);
      if (!found) return { success: false, message: `No order found for reference "${orderNo}".` };
      return { success: true, order: found };
    }

    // GET /api/orders/my-orders
    if (path === '/orders/my-orders') {
      return { success: true, orders: this.orders };
    }

    // Admin endpoints
    if (path === '/admin/analytics') {
      const totalSales = this.orders.reduce((sum, o) => sum + o.total, 0);
      return {
        success: true,
        analytics: {
          totalSales: Number(totalSales.toFixed(2)),
          todaySales: Number((totalSales * 0.4).toFixed(2)),
          monthlySales: Number(totalSales.toFixed(2)),
          totalOrders: this.orders.length,
          pendingOrders: 1,
          deliveredOrders: this.orders.length - 1,
          averageOrderValue: Math.round(totalSales / (this.orders.length || 1)),
          totalProducts: this.products.length,
          lowStockCount: this.products.filter(p => p.stock <= 3).length,
          lowStockProducts: this.products.filter(p => p.stock <= 3)
        }
      };
    }

    if (path === '/admin/products') return { success: true, products: this.products, total: this.products.length };
    if (path === '/admin/orders') return { success: true, orders: this.orders };
    if (path === '/admin/banners') return { success: true, banners: this.banners };
    if (path === '/admin/weekly-offers') return { success: true, offers: this.weeklyOffers.map(o => ({ ...o, product: this.products.find(p => p.id === o.productId) })) };
    if (path === '/admin/flash-sales') return { success: true, sales: this.flashSales.map(f => ({ ...f, product: this.products.find(p => p.id === f.productId) })) };
    if (path === '/admin/coupons') return { success: true, coupons: this.coupons };
    if (path === '/admin/customers') return { success: true, customers: [{ id: '1', name: 'Rashid Al Nuaimi', email: 'customer@gmail.com', phone: '+971 50 123 4567', ordersCount: 2, totalSpent: 4800 }] };

    // Default fallback
    return { success: true, data: [] };
  }
}

export const clientStore = new ClientStore();
