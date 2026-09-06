import { Router } from 'express';
import { db } from '../database/db.js';

const router = Router();

// GET /api/categories
router.get('/', (req, res) => {
  const categories = db.getCategories();
  return res.json({ success: true, categories });
});

export default router;
