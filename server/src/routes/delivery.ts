import { Router } from 'express';
import { APP_CONFIG, UAE_EMIRATES } from '../config/constants.js';

const router = Router();

// GET /api/delivery/emirates
router.get('/emirates', (req, res) => {
  return res.json({
    success: true,
    freeDeliveryThreshold: APP_CONFIG.FREE_DELIVERY_THRESHOLD,
    emirates: UAE_EMIRATES
  });
});

// POST /api/delivery/calculate
router.post('/calculate', (req, res) => {
  const { emirateId, subtotal, deliveryType } = req.body;
  const targetEmirate = UAE_EMIRATES.find(e => e.id === emirateId || e.name.toLowerCase() === (emirateId || '').toLowerCase()) || UAE_EMIRATES[0];

  const isFree = subtotal >= APP_CONFIG.FREE_DELIVERY_THRESHOLD && deliveryType !== 'express';
  let fee = 0;

  if (deliveryType === 'express') {
    fee = targetEmirate.expressFee;
  } else {
    fee = isFree ? 0 : targetEmirate.deliveryFee;
  }

  return res.json({
    success: true,
    emirate: targetEmirate,
    deliveryFee: fee,
    isFreeDelivery: isFree,
    estimatedDays: targetEmirate.estimatedDays
  });
});

export default router;
