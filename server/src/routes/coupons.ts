import { Router } from 'express';
import { db } from '../database/db.js';

const router = Router();

// POST /api/coupons/validate
router.post('/validate', (req, res) => {
  const { code, subtotal } = req.body;
  if (!code) {
    return res.status(400).json({ success: false, message: 'Coupon code is required.' });
  }

  const result = db.validateCoupon(code, Number(subtotal) || 0);
  if (!result.valid) {
    return res.status(400).json({ success: false, message: result.message });
  }

  return res.json({
    success: true,
    code: result.coupon!.code,
    discountAmount: Number(result.discount.toFixed(2)),
    message: result.message
  });
});

export default router;
