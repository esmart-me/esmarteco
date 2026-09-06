import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import {
  User, Category, Brand, Product, Banner, WeeklyOffer, FlashSale,
  Coupon, Review, Order, OrderStatus
} from '../types/index.js';
import {
  INITIAL_CATEGORIES, INITIAL_BRANDS, INITIAL_PRODUCTS, INITIAL_BANNERS,
  INITIAL_WEEKLY_OFFERS, INITIAL_FLASH_SALES, INITIAL_COUPONS,
  INITIAL_REVIEWS, INITIAL_ORDERS
} from './seedData.js';

interface DatabaseSchema {
  users: User[];
  categories: Category[];
  brands: Brand[];
  products: Product[];
  banners: Banner[];
  weeklyOffers: WeeklyOffer[];
  flashSales: FlashSale[];
  coupons: Coupon[];
  reviews: Review[];
  orders: Order[];
}

const DATA_DIR = path.resolve(process.cwd(), 'server', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

class JSONDatabase {
  private data: DatabaseSchema;
  private isLoaded: boolean = false;

  constructor() {
    this.data = this.getDefaultData();
    this.init();
  }

  private getDefaultData(): DatabaseSchema {
    return {
      users: [],
      categories: INITIAL_CATEGORIES,
      brands: INITIAL_BRANDS,
      products: INITIAL_PRODUCTS,
      banners: INITIAL_BANNERS,
      weeklyOffers: INITIAL_WEEKLY_OFFERS,
      flashSales: INITIAL_FLASH_SALES,
      coupons: INITIAL_COUPONS,
      reviews: INITIAL_REVIEWS,
      orders: INITIAL_ORDERS
    };
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(fileContent);
        this.isLoaded = true;
      } else {
        // Initial seed with hashed user passwords
        const salt = bcrypt.genSaltSync(10);
        const adminUser: User = {
          id: 'usr-admin',
          name: 'E Smart Admin',
          email: 'admin@esmartelectronics.ae',
          password: bcrypt.hashSync('Admin@123', salt),
          phone: '+971 2 642 8990',
          role: 'admin',
          createdAt: new Date().toISOString()
        };

        const demoCustomer: User = {
          id: 'usr-customer-1',
          name: 'Rashid Al Nuaimi',
          email: 'customer@gmail.com',
          password: bcrypt.hashSync('Customer@123', salt),
          phone: '+971 50 123 4567',
          role: 'customer',
          addresses: [
            {
              id: 'addr-1',
              title: 'Home (Al Raha)',
              fullName: 'Rashid Al Nuaimi',
              phone: '+971 50 123 4567',
              apartmentVilla: 'Villa 14, Al Raha Gardens',
              street: 'Al Raha Blvd',
              area: 'Khalifa City',
              city: 'Abu Dhabi',
              emirate: 'Abu Dhabi',
              country: 'United Arab Emirates',
              isDefault: true
            }
          ],
          createdAt: new Date().toISOString()
        };

        this.data = this.getDefaultData();
        this.data.users = [adminUser, demoCustomer];
        this.persist();
        this.isLoaded = true;
      }
    } catch (err) {
      console.error('Error initializing database:', err);
      this.data = this.getDefaultData();
      this.isLoaded = true;
    }
  }

  private persist() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const tempFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempFile, DB_FILE);
    } catch (err) {
      console.error('Database write error:', err);
    }
  }

  // --- Products ---
  public getProducts(params?: {
    category?: string;
    brand?: string;
    query?: string;
    minPrice?: number;
    maxPrice?: number;
    featured?: boolean;
    isNew?: boolean;
    bestseller?: boolean;
    weeklyOffer?: boolean;
    flashSale?: boolean;
    sort?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'popularity';
    limit?: number;
    offset?: number;
  }) {
    let list = [...this.data.products];

    if (params?.category) {
      list = list.filter(p => p.categorySlug.toLowerCase() === params.category!.toLowerCase());
    }

    if (params?.brand) {
      const brands = params.brand.split(',').map(b => b.trim().toLowerCase());
      list = list.filter(p => brands.includes(p.brand.toLowerCase()));
    }

    if (params?.query) {
      const q = params.query.toLowerCase().trim();
      list = list.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.model.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.categorySlug.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.shortSpecs && p.shortSpecs.some(s => s.toLowerCase().includes(q)))
      );
    }

    if (params?.minPrice !== undefined && !isNaN(params.minPrice)) {
      list = list.filter(p => p.salePrice >= params.minPrice!);
    }

    if (params?.maxPrice !== undefined && !isNaN(params.maxPrice)) {
      list = list.filter(p => p.salePrice <= params.maxPrice!);
    }

    if (params?.featured) {
      list = list.filter(p => p.isFeatured);
    }
    if (params?.isNew) {
      list = list.filter(p => p.isNew);
    }
    if (params?.bestseller) {
      list = list.filter(p => p.isBestseller);
    }
    if (params?.weeklyOffer) {
      list = list.filter(p => p.isWeeklyOffer);
    }
    if (params?.flashSale) {
      list = list.filter(p => p.isFlashSale);
    }

    // Sorting
    if (params?.sort) {
      switch (params.sort) {
        case 'price_asc':
          list.sort((a, b) => a.salePrice - b.salePrice);
          break;
        case 'price_desc':
          list.sort((a, b) => b.salePrice - a.salePrice);
          break;
        case 'rating':
          list.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case 'popularity':
        default:
          list.sort((a, b) => b.reviewCount - a.reviewCount);
          break;
      }
    }

    const total = list.length;
    const offset = params?.offset || 0;
    const limit = params?.limit || list.length;
    const paginated = list.slice(offset, offset + limit);

    return { products: paginated, total };
  }

  public getProductById(id: string): Product | undefined {
    return this.data.products.find(p => p.id === id);
  }

  public getProductBySlug(slug: string): Product | undefined {
    return this.data.products.find(p => p.slug === slug);
  }

  public createProduct(product: Omit<Product, 'id' | 'createdAt'>): Product {
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.data.products.push(newProduct);
    this.persist();
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | null {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.data.products[idx] = { ...this.data.products[idx], ...updates };
    this.persist();
    return this.data.products[idx];
  }

  public deleteProduct(id: string): boolean {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    if (this.data.products.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // --- Categories & Brands ---
  public getCategories(): (Category & { productCount: number })[] {
    return this.data.categories.map(cat => ({
      ...cat,
      productCount: this.data.products.filter(p => p.categorySlug.toLowerCase() === cat.slug.toLowerCase()).length
    }));
  }

  public getBrands(): (Brand & { productCount: number })[] {
    return this.data.brands.map(brand => ({
      ...brand,
      productCount: this.data.products.filter(p => p.brand.toLowerCase() === brand.name.toLowerCase()).length
    }));
  }

  // --- Offers & Flash Sales ---
  public getWeeklyOffers(): (WeeklyOffer & { product: Product })[] {
    const now = new Date();
    return this.data.weeklyOffers
      .filter(o => o.active && new Date(o.expiresAt) > now)
      .map(o => {
        const prod = this.data.products.find(p => p.id === o.productId);
        return prod ? { ...o, product: prod } : null;
      })
      .filter(Boolean) as (WeeklyOffer & { product: Product })[];
  }

  public getAllWeeklyOffersAdmin(): (WeeklyOffer & { product?: Product })[] {
    return this.data.weeklyOffers.map(o => ({
      ...o,
      product: this.data.products.find(p => p.id === o.productId)
    }));
  }

  public saveWeeklyOffer(offer: Omit<WeeklyOffer, 'id'> & { id?: string }): WeeklyOffer {
    if (offer.id) {
      const idx = this.data.weeklyOffers.findIndex(o => o.id === offer.id);
      if (idx !== -1) {
        this.data.weeklyOffers[idx] = { ...this.data.weeklyOffers[idx], ...offer } as WeeklyOffer;
        this.persist();
        return this.data.weeklyOffers[idx];
      }
    }
    const newOffer: WeeklyOffer = {
      id: `wo-${Date.now()}`,
      productId: offer.productId,
      offerPrice: offer.offerPrice,
      originalPrice: offer.originalPrice,
      discountPercent: offer.discountPercent,
      expiresAt: offer.expiresAt,
      stockQuantity: offer.stockQuantity,
      active: offer.active ?? true
    };
    this.data.weeklyOffers.push(newOffer);
    // Sync product isWeeklyOffer flag
    this.updateProduct(offer.productId, { isWeeklyOffer: true, salePrice: offer.offerPrice });
    this.persist();
    return newOffer;
  }

  public deleteWeeklyOffer(id: string): boolean {
    const offer = this.data.weeklyOffers.find(o => o.id === id);
    if (offer) {
      this.updateProduct(offer.productId, { isWeeklyOffer: false });
    }
    this.data.weeklyOffers = this.data.weeklyOffers.filter(o => o.id !== id);
    this.persist();
    return true;
  }

  public getFlashSales(): (FlashSale & { product: Product })[] {
    const now = new Date();
    return this.data.flashSales
      .filter(f => f.active && f.remainingStock > 0 && new Date(f.endsAt) > now)
      .map(f => {
        const prod = this.data.products.find(p => p.id === f.productId);
        return prod ? { ...f, product: prod } : null;
      })
      .filter(Boolean) as (FlashSale & { product: Product })[];
  }

  public getAllFlashSalesAdmin(): (FlashSale & { product?: Product })[] {
    return this.data.flashSales.map(f => ({
      ...f,
      product: this.data.products.find(p => p.id === f.productId)
    }));
  }

  public saveFlashSale(sale: Omit<FlashSale, 'id'> & { id?: string }): FlashSale {
    if (sale.id) {
      const idx = this.data.flashSales.findIndex(f => f.id === sale.id);
      if (idx !== -1) {
        this.data.flashSales[idx] = { ...this.data.flashSales[idx], ...sale } as FlashSale;
        this.persist();
        return this.data.flashSales[idx];
      }
    }
    const newSale: FlashSale = {
      id: `fs-${Date.now()}`,
      productId: sale.productId,
      flashPrice: sale.flashPrice,
      originalPrice: sale.originalPrice,
      discountPercent: sale.discountPercent,
      totalStock: sale.totalStock,
      remainingStock: sale.remainingStock,
      endsAt: sale.endsAt,
      active: sale.active ?? true
    };
    this.data.flashSales.push(newSale);
    this.updateProduct(sale.productId, { isFlashSale: true, salePrice: sale.flashPrice });
    this.persist();
    return newSale;
  }

  public deleteFlashSale(id: string): boolean {
    const sale = this.data.flashSales.find(f => f.id === id);
    if (sale) {
      this.updateProduct(sale.productId, { isFlashSale: false });
    }
    this.data.flashSales = this.data.flashSales.filter(f => f.id !== id);
    this.persist();
    return true;
  }

  // --- Banners CMS ---
  public getBanners(type?: 'hero' | 'promo_mid' | 'promo_small'): Banner[] {
    let list = this.data.banners.filter(b => b.active);
    if (type) {
      list = list.filter(b => b.type === type);
    }
    return list.sort((a, b) => a.order - b.order);
  }

  public getAllBannersAdmin(): Banner[] {
    return [...this.data.banners].sort((a, b) => a.order - b.order);
  }

  public saveBanner(banner: Omit<Banner, 'id'> & { id?: string }): Banner {
    if (banner.id) {
      const idx = this.data.banners.findIndex(b => b.id === banner.id);
      if (idx !== -1) {
        this.data.banners[idx] = { ...this.data.banners[idx], ...banner } as Banner;
        this.persist();
        return this.data.banners[idx];
      }
    }
    const newBanner: Banner = {
      id: `ban-${Date.now()}`,
      title: banner.title,
      subtitle: banner.subtitle,
      offerText: banner.offerText,
      badge: banner.badge,
      image: banner.image,
      ctaText: banner.ctaText,
      ctaLink: banner.ctaLink,
      type: banner.type || 'hero',
      order: banner.order || (this.data.banners.length + 1),
      active: banner.active ?? true
    };
    this.data.banners.push(newBanner);
    this.persist();
    return newBanner;
  }

  public deleteBanner(id: string): boolean {
    this.data.banners = this.data.banners.filter(b => b.id !== id);
    this.persist();
    return true;
  }

  // --- Coupons ---
  public getCoupons(): Coupon[] {
    return this.data.coupons;
  }

  public validateCoupon(code: string, subtotal: number): { valid: boolean; discount: number; message: string; coupon?: Coupon } {
    const coupon = this.data.coupons.find(c => c.code.toUpperCase() === code.toUpperCase().trim() && c.active);
    if (!coupon) {
      return { valid: false, discount: 0, message: 'Invalid or expired promo coupon code.' };
    }

    if (new Date(coupon.expiryDate) < new Date()) {
      return { valid: false, discount: 0, message: 'This coupon code has expired.' };
    }

    if (coupon.timesUsed >= coupon.usageLimit) {
      return { valid: false, discount: 0, message: 'Coupon usage limit has been reached.' };
    }

    if (subtotal < coupon.minOrderValue) {
      return {
        valid: false,
        discount: 0,
        message: `Minimum order amount of AED ${coupon.minOrderValue} required for this coupon.`
      };
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    return { valid: true, discount: Math.min(discount, subtotal), message: 'Coupon applied successfully!', coupon };
  }

  public saveCoupon(coupon: Omit<Coupon, 'id' | 'timesUsed'> & { id?: string }): Coupon {
    if (coupon.id) {
      const idx = this.data.coupons.findIndex(c => c.id === coupon.id);
      if (idx !== -1) {
        this.data.coupons[idx] = { ...this.data.coupons[idx], ...coupon };
        this.persist();
        return this.data.coupons[idx];
      }
    }
    const newCoupon: Coupon = {
      id: `c-${Date.now()}`,
      code: coupon.code.toUpperCase().trim(),
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderValue: coupon.minOrderValue,
      maxDiscount: coupon.maxDiscount,
      expiryDate: coupon.expiryDate,
      usageLimit: coupon.usageLimit,
      timesUsed: 0,
      active: coupon.active ?? true
    };
    this.data.coupons.push(newCoupon);
    this.persist();
    return newCoupon;
  }

  // --- Orders ---
  public getOrders(userId?: string): Order[] {
    let list = [...this.data.orders];
    if (userId) {
      list = list.filter(o => o.customer.userId === userId);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getOrderById(idOrNumber: string): Order | undefined {
    return this.data.orders.find(o => o.id === idOrNumber || o.orderNumber.toUpperCase() === idOrNumber.toUpperCase());
  }

  public createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'invoiceNumber' | 'invoiceDate' | 'createdAt' | 'statusHistory'>): Order {
    const timestamp = Date.now();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ESM-${new Date().getFullYear()}-${randomSuffix}`;
    const invoiceNumber = `INV-UAE-${new Date().getFullYear()}-${randomSuffix}`;
    const now = new Date().toISOString();

    const newOrder: Order = {
      ...orderData,
      id: `ord-${timestamp}`,
      orderNumber,
      invoiceNumber,
      invoiceDate: now.split('T')[0],
      createdAt: now,
      statusHistory: [
        {
          status: 'Order Received',
          timestamp: now,
          note: 'Customer placed order via online store'
        }
      ]
    };

    if (newOrder.paymentStatus === 'confirmed') {
      newOrder.statusHistory.push({
        status: 'Payment Confirmed',
        timestamp: new Date().toISOString(),
        note: `Payment of AED ${newOrder.total.toFixed(2)} received via ${newOrder.paymentMethod.toUpperCase()}`
      });
      newOrder.orderStatus = 'Payment Confirmed';
    }

    // Decrement stock for ordered items
    for (const item of newOrder.items) {
      const product = this.getProductById(item.productId);
      if (product) {
        const updatedStock = Math.max(0, product.stock - item.quantity);
        this.updateProduct(product.id, { stock: updatedStock });

        // If flash sale item, update flash sale remaining stock
        const flash = this.data.flashSales.find(f => f.productId === item.productId && f.active);
        if (flash) {
          flash.remainingStock = Math.max(0, flash.remainingStock - item.quantity);
        }
      }
    }

    // If coupon used, increment coupon timesUsed
    if (newOrder.couponCode) {
      const coupon = this.data.coupons.find(c => c.code.toUpperCase() === newOrder.couponCode!.toUpperCase());
      if (coupon) {
        coupon.timesUsed += 1;
      }
    }

    this.data.orders.unshift(newOrder);
    this.persist();
    return newOrder;
  }

  public updateOrderStatus(orderId: string, status: OrderStatus, note?: string): Order | null {
    const order = this.data.orders.find(o => o.id === orderId);
    if (!order) return null;

    order.orderStatus = status;
    order.statusHistory.push({
      status,
      timestamp: new Date().toISOString(),
      note: note || `Order status updated to ${status}`
    });

    if (status === 'Delivered') {
      order.paymentStatus = 'confirmed';
    } else if (status === 'Refunded') {
      order.paymentStatus = 'refunded';
    }

    this.persist();
    return order;
  }

  public updateOrderTracking(orderId: string, trackingNumber: string, carrier: string): Order | null {
    const order = this.data.orders.find(o => o.id === orderId);
    if (!order) return null;
    order.trackingNumber = trackingNumber;
    order.carrier = carrier;
    this.persist();
    return order;
  }

  // --- Reviews ---
  public getReviews(productId: string): Review[] {
    return this.data.reviews.filter(r => r.productId === productId && r.status === 'approved');
  }

  public getAllReviewsAdmin(): (Review & { product?: Product })[] {
    return this.data.reviews.map(r => ({
      ...r,
      product: this.data.products.find(p => p.id === r.productId)
    }));
  }

  public addReview(review: Omit<Review, 'id' | 'createdAt' | 'status'>): Review {
    const newReview: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'approved' // Auto-approved for demo/UAE store
    };
    this.data.reviews.push(newReview);

    // Update product rating and review count
    const prodReviews = this.data.reviews.filter(r => r.productId === review.productId && r.status === 'approved');
    const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
    this.updateProduct(review.productId, {
      rating: Number(avg.toFixed(1)),
      reviewCount: prodReviews.length
    });

    this.persist();
    return newReview;
  }

  public moderateReview(id: string, status: 'approved' | 'rejected'): boolean {
    const rev = this.data.reviews.find(r => r.id === id);
    if (!rev) return false;
    rev.status = status;
    this.persist();
    return true;
  }

  // --- Users & Auth ---
  public findUserByEmail(email: string): User | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  }

  public findUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public createUser(userData: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      ...userData,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.data.users.push(newUser);
    this.persist();
    return newUser;
  }

  public updateUser(id: string, updates: Partial<User>): User | null {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    this.data.users[idx] = { ...this.data.users[idx], ...updates };
    this.persist();
    return this.data.users[idx];
  }

  public getAllCustomersAdmin(): (Omit<User, 'password'> & { ordersCount: number; totalSpent: number })[] {
    return this.data.users
      .filter(u => u.role === 'customer')
      .map(u => {
        const userOrders = this.data.orders.filter(o => o.customer.email.toLowerCase() === u.email.toLowerCase());
        const totalSpent = userOrders.reduce((sum, o) => sum + o.total, 0);
        const { password, ...safeUser } = u;
        return {
          ...safeUser,
          ordersCount: userOrders.length,
          totalSpent
        };
      });
  }

  // --- Admin Analytics & Dashboard ---
  public getAnalytics() {
    const totalOrders = this.data.orders.length;
    const totalSales = this.data.orders
      .filter(o => o.orderStatus !== 'Cancelled' && o.orderStatus !== 'Refunded')
      .reduce((sum, o) => sum + o.total, 0);

    const todayStr = new Date().toISOString().split('T')[0];
    const todaySales = this.data.orders
      .filter(o => o.createdAt.startsWith(todayStr) && o.orderStatus !== 'Cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    const currentMonthStr = new Date().toISOString().substring(0, 7);
    const monthlySales = this.data.orders
      .filter(o => o.createdAt.startsWith(currentMonthStr) && o.orderStatus !== 'Cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    const pendingOrders = this.data.orders.filter(o => ['Order Received', 'Payment Pending', 'Processing'].includes(o.orderStatus)).length;
    const deliveredOrders = this.data.orders.filter(o => o.orderStatus === 'Delivered').length;
    const aov = totalOrders > 0 ? totalSales / totalOrders : 0;

    const lowStockProducts = this.data.products.filter(p => p.stock <= p.stockAlertThreshold);
    const outOfStockProducts = this.data.products.filter(p => p.stock === 0);

    return {
      totalSales: Number(totalSales.toFixed(2)),
      todaySales: Number(todaySales.toFixed(2)),
      monthlySales: Number(monthlySales.toFixed(2)),
      totalOrders,
      pendingOrders,
      deliveredOrders,
      averageOrderValue: Number(aov.toFixed(2)),
      totalCustomers: this.data.users.filter(u => u.role === 'customer').length,
      totalProducts: this.data.products.length,
      lowStockCount: lowStockProducts.length,
      outOfStockCount: outOfStockProducts.length,
      lowStockProducts,
      recentOrders: this.data.orders.slice(0, 6)
    };
  }
}

export const db = new JSONDatabase();
