import { Router } from 'express';
import { db } from '../database/db.js';

const router = Router();

// GET /api/offers/weekly
router.get('/weekly', (req, res) => {
  const weeklyOffers = db.getWeeklyOffers();
  return res.json({ success: true, weeklyOffers });
});

// GET /api/offers/flash
router.get('/flash', (req, res) => {
  const flashSales = db.getFlashSales();
  return res.json({ success: true, flashSales });
});

export default router;
