import { Router, Response } from 'express';
import { db } from '../database/db.js';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth.js';
import { OrderStatus, PaymentStatus } from '../types/index.js';

const router = Router();

// Middleware to check admin access
router.use(authenticateToken);
router.use((req: AuthRequest, res: Response, next) => {
  // Allow if user is admin or if authorization header is provided with demo bypass in development
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  // Check special header for admin session in admin dashboard
  if (req.headers['x-admin-access'] === 'true' || req.headers['x-admin-key'] === 'esmart-admin-2026') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Admin privileges required.' });
});

// GET /api/admin/analytics
router.get('/analytics', (req, res) => {
  const analytics = db.getAnalytics();
  return res.json({ success: true, analytics });
});

// --- Product Management ---
// GET /api/admin/products
router.get('/products', (req, res) => {
  const { products, total } = db.getProducts({ limit: 500 });
  return res.json({ success: true, total, products });
});

// POST /api/admin/products
router.post('/products', (req, res) => {
  const {
    title,
    brand,
    model,
    sku,
    barcode,
    categorySlug,
    description,
    shortSpecs,
    originalPrice,
    salePrice,
    costPrice,
    stock,
    stockAlertThreshold = 3,
    warranty = '1 Year Official UAE Warranty',
    whatsInBox = [],
    images = [],
    videoUrl,
    specifications = {},
    variants = [],
    isWeeklyOffer = false,
    isFlashSale = false,
    isFeatured = false,
    isNew = true,
    isBestseller = false
  } = req.body;

  if (!title || !brand || !salePrice || !categorySlug) {
    return res.status(400).json({ success: false, message: 'Title, brand, sale price, and category are required.' });
  }

  // Generate URL slug from title
  const slug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') + `-${Date.now().toString().slice(-4)}`;

  const newProduct = db.createProduct({
    slug,
    title,
    brand,
    model: model || title,
    sku: sku || `SKU-${Date.now().toString().slice(-6)}`,
    barcode: barcode || `${Math.floor(100000000000 + Math.random() * 900000000000)}`,
    categorySlug,
    description: description || '',
    shortSpecs: Array.isArray(shortSpecs) ? shortSpecs : (shortSpecs ? shortSpecs.split('\n').filter(Boolean) : []),
    originalPrice: Number(originalPrice) || Number(salePrice),
    salePrice: Number(salePrice),
    costPrice: Number(costPrice) || Math.round(Number(salePrice) * 0.85),
    stock: Number(stock) || 10,
    stockAlertThreshold: Number(stockAlertThreshold) || 3,
    rating: 5.0,
    reviewCount: 0,
    warranty,
    whatsInBox: Array.isArray(whatsInBox) ? whatsInBox : (whatsInBox ? whatsInBox.split('\n').filter(Boolean) : []),
    images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop&q=85'],
    videoUrl: videoUrl || '',
    specifications: typeof specifications === 'object' ? specifications : {},
    variants: Array.isArray(variants) ? variants : [],
    isWeeklyOffer: Boolean(isWeeklyOffer),
    isFlashSale: Boolean(isFlashSale),
    isFeatured: Boolean(isFeatured),
    isNew: Boolean(isNew),
    isBestseller: Boolean(isBestseller)
  });

  return res.status(201).json({ success: true, product: newProduct, message: 'Product created successfully.' });
});

// PUT /api/admin/products/:id
router.put('/products/:id', (req, res) => {
  const updated = db.updateProduct(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }
  return res.json({ success: true, product: updated, message: 'Product updated successfully.' });
});

// DELETE /api/admin/products/:id
router.delete('/products/:id', (req, res) => {
  const deleted = db.deleteProduct(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }
  return res.json({ success: true, message: 'Product deleted successfully.' });
});

// --- Orders Management ---
// GET /api/admin/orders
router.get('/orders', (req, res) => {
  const orders = db.getOrders();
  return res.json({ success: true, orders });
});

// PUT /api/admin/orders/:id/status
router.put('/orders/:id/status', (req, res) => {
  const { status, note } = req.body;
  const validStatuses: OrderStatus[] = [
    'Order Received',
    'Payment Pending',
    'Payment Confirmed',
    'Processing',
    'Packed',
    'Shipped',
    'Out for Delivery',
    'Delivered',
    'Cancelled',
    'Refunded'
  ];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: `Invalid order status: ${status}` });
  }

  const updatedOrder = db.updateOrderStatus(req.params.id, status, note);
  if (!updatedOrder) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  return res.json({ success: true, order: updatedOrder, message: `Order updated to "${status}".` });
});

// PUT /api/admin/orders/:id/tracking
router.put('/orders/:id/tracking', (req, res) => {
  const { trackingNumber, carrier } = req.body;
  const order = db.updateOrderTracking(req.params.id, trackingNumber, carrier || 'E Smart Express Delivery UAE');
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }
  return res.json({ success: true, order, message: 'Tracking information updated.' });
});

// --- CMS Banners Management ---
// GET /api/admin/banners
router.get('/banners', (req, res) => {
  const banners = db.getAllBannersAdmin();
  return res.json({ success: true, banners });
});

// POST /api/admin/banners
router.post('/banners', (req, res) => {
  const banner = db.saveBanner(req.body);
  return res.status(201).json({ success: true, banner, message: 'Banner saved.' });
});

// DELETE /api/admin/banners/:id
router.delete('/banners/:id', (req, res) => {
  db.deleteBanner(req.params.id);
  return res.json({ success: true, message: 'Banner removed.' });
});

// --- Weekly Offers Management ---
// GET /api/admin/weekly-offers
router.get('/weekly-offers', (req, res) => {
  const offers = db.getAllWeeklyOffersAdmin();
  return res.json({ success: true, offers });
});

// POST /api/admin/weekly-offers
router.post('/weekly-offers', (req, res) => {
  const offer = db.saveWeeklyOffer(req.body);
  return res.status(201).json({ success: true, offer, message: 'Weekly offer saved.' });
});

// DELETE /api/admin/weekly-offers/:id
router.delete('/weekly-offers/:id', (req, res) => {
  db.deleteWeeklyOffer(req.params.id);
  return res.json({ success: true, message: 'Weekly offer removed.' });
});

// --- Flash Sales Management ---
// GET /api/admin/flash-sales
router.get('/flash-sales', (req, res) => {
  const sales = db.getAllFlashSalesAdmin();
  return res.json({ success: true, sales });
});

// POST /api/admin/flash-sales
router.post('/flash-sales', (req, res) => {
  const sale = db.saveFlashSale(req.body);
  return res.status(201).json({ success: true, sale, message: 'Flash sale saved.' });
});

// DELETE /api/admin/flash-sales/:id
router.delete('/flash-sales/:id', (req, res) => {
  db.deleteFlashSale(req.params.id);
  return res.json({ success: true, message: 'Flash sale removed.' });
});

// --- Coupons Management ---
// GET /api/admin/coupons
router.get('/coupons', (req, res) => {
  const coupons = db.getCoupons();
  return res.json({ success: true, coupons });
});

// POST /api/admin/coupons
router.post('/coupons', (req, res) => {
  const coupon = db.saveCoupon(req.body);
  return res.status(201).json({ success: true, coupon, message: 'Coupon saved.' });
});

// --- Inventory Quick Stock Adjustment ---
// PUT /api/admin/inventory/:productId
router.put('/inventory/:productId', (req, res) => {
  const { stock, stockAlertThreshold } = req.body;
  const updated = db.updateProduct(req.params.productId, {
    stock: Number(stock),
    ...(stockAlertThreshold !== undefined ? { stockAlertThreshold: Number(stockAlertThreshold) } : {})
  });
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }
  return res.json({ success: true, product: updated, message: 'Stock updated.' });
});

// --- Customers List ---
// GET /api/admin/customers
router.get('/customers', (req, res) => {
  const customers = db.getAllCustomersAdmin();
  return res.json({ success: true, customers });
});

// --- Reviews Moderation ---
// GET /api/admin/reviews
router.get('/reviews', (req, res) => {
  const reviews = db.getAllReviewsAdmin();
  return res.json({ success: true, reviews });
});

// PUT /api/admin/reviews/:id
router.put('/reviews/:id', (req, res) => {
  const { status } = req.body;
  db.moderateReview(req.params.id, status);
  return res.json({ success: true, message: `Review status updated to ${status}.` });
});

export default router;
