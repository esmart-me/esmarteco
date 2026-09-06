import { Router } from 'express';
import { db } from '../database/db.js';

const router = Router();

// GET /api/products
router.get('/', (req, res) => {
  const {
    category,
    brand,
    q,
    minPrice,
    maxPrice,
    featured,
    isNew,
    bestseller,
    weeklyOffer,
    flashSale,
    sort,
    offset,
    limit
  } = req.query;

  const result = db.getProducts({
    category: category as string,
    brand: brand as string,
    query: q as string,
    minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
    featured: featured === 'true',
    isNew: isNew === 'true',
    bestseller: bestseller === 'true',
    weeklyOffer: weeklyOffer === 'true',
    flashSale: flashSale === 'true',
    sort: sort as any,
    offset: offset ? parseInt(offset as string) : 0,
    limit: limit ? parseInt(limit as string) : 50
  });

  return res.json({
    success: true,
    total: result.total,
    products: result.products
  });
});

// GET /api/products/autocomplete?q=...
router.get('/autocomplete', (req, res) => {
  const query = (req.query.q as string || '').trim();
  if (!query || query.length < 2) {
    return res.json({ success: true, results: [] });
  }

  const { products } = db.getProducts({ query, limit: 6 });
  const results = products.map(p => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    brand: p.brand,
    model: p.model,
    sku: p.sku,
    image: p.images[0],
    salePrice: p.salePrice,
    originalPrice: p.originalPrice,
    stock: p.stock,
    inStock: p.stock > 0
  }));

  return res.json({ success: true, results });
});

// GET /api/products/compare?ids=prod-1,prod-2
router.get('/compare', (req, res) => {
  const idsStr = req.query.ids as string;
  if (!idsStr) {
    return res.status(400).json({ success: false, message: 'No product IDs provided for comparison.' });
  }

  const ids = idsStr.split(',').map(id => id.trim());
  const products = ids.map(id => db.getProductById(id) || db.getProductBySlug(id)).filter(Boolean);

  return res.json({ success: true, products });
});

// GET /api/products/:slugOrId
router.get('/:slugOrId', (req, res) => {
  const { slugOrId } = req.params;
  const product = db.getProductBySlug(slugOrId) || db.getProductById(slugOrId);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  // Related products from same category
  const { products: categoryProducts } = db.getProducts({
    category: product.categorySlug,
    limit: 6
  });
  const related = categoryProducts.filter(p => p.id !== product.id).slice(0, 4);

  // Frequently bought together (accessories/chargers/cables)
  const { products: accessories } = db.getProducts({
    category: product.categorySlug === 'smartphones' || product.categorySlug === 'tablets'
      ? 'chargers'
      : 'cables',
    limit: 3
  });
  const frequentlyBoughtTogether = accessories.filter(p => p.id !== product.id).slice(0, 2);

  // Reviews
  const reviews = db.getReviews(product.id);

  return res.json({
    success: true,
    product,
    related,
    frequentlyBoughtTogether,
    reviews
  });
});

export default router;
