import { Router } from 'express';
import { db } from '../database/db.js';

const router = Router();

// GET /api/brands
router.get('/', (req, res) => {
  const brands = db.getBrands();
  return res.json({ success: true, brands });
});

export default router;
