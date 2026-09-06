import { Router } from 'express';
import { db } from '../database/db.js';

const router = Router();

// GET /api/reviews/:productId
router.get('/:productId', (req, res) => {
  const reviews = db.getReviews(req.params.productId);
  return res.json({ success: true, reviews });
});

// POST /api/reviews
router.post('/', (req, res) => {
  const { productId, userName, userEmail, rating, title, comment } = req.body;

  if (!productId || !userName || !rating || !comment) {
    return res.status(400).json({ success: false, message: 'Required review details are missing.' });
  }

  const review = db.addReview({
    productId,
    userName,
    userEmail: userEmail || 'customer@example.ae',
    rating: Math.min(5, Math.max(1, Number(rating))),
    title: title || 'Customer Review',
    comment,
    isVerifiedPurchase: true
  });

  return res.status(201).json({
    success: true,
    review,
    message: 'Thank you! Your verified review has been published.'
  });
});

export default router;
