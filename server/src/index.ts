import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { APP_CONFIG } from './config/constants.js';

// Import Routes
import authRoutes from './routes/auth.js';
import productsRoutes from './routes/products.js';
import categoriesRoutes from './routes/categories.js';
import brandsRoutes from './routes/brands.js';
import offersRoutes from './routes/offers.js';
import bannersRoutes from './routes/banners.js';
import deliveryRoutes from './routes/delivery.js';
import couponsRoutes from './routes/coupons.js';
import ordersRoutes from './routes/orders.js';
import reviewsRoutes from './routes/reviews.js';
import uploadRoutes from './routes/upload.js';
import adminRoutes from './routes/admin.js';

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-access', 'x-admin-key']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ensure uploads directory exists and serve statically
const UPLOADS_DIR = path.resolve(process.cwd(), 'server', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use('/uploads', express.static(UPLOADS_DIR));

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    store: APP_CONFIG.COMPANY_NAME,
    location: `${APP_CONFIG.CITY}, ${APP_CONFIG.COUNTRY}`,
    time: new Date().toISOString()
  });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/brands', brandsRoutes);
app.use('/api/offers', offersRoutes);
app.use('/api/banners', bannersRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/coupons', couponsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);

// 404 Handler for undefined API routes
app.use('/api/*', (_req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found' });
});

// Serve frontend build if dist folder exists
const DIST_DIR = path.resolve(process.cwd(), 'dist');
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
}

// Error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = APP_CONFIG.PORT;
app.listen(PORT, () => {
  console.log(`[E Smart Electronics Server] Running on http://localhost:${PORT}`);
  console.log(`[UAE Electronics] Serving Abu Dhabi, Dubai & all 7 Emirates`);
});

export default app;
