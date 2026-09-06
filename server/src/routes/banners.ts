import { Router } from 'express';
import { db } from '../database/db.js';

const router = Router();

// GET /api/banners?type=hero|promo_mid
router.get('/', (req, res) => {
  const type = req.query.type as 'hero' | 'promo_mid' | 'promo_small' | undefined;
  const banners = db.getBanners(type);
  return res.json({ success: true, banners });
});

export default router;
