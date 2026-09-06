import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { APP_CONFIG } from '../config/constants.js';
import { db } from '../database/db.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'admin' | 'customer';
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(); // Guest mode allowed
  }

  try {
    const decoded = jwt.verify(token, APP_CONFIG.JWT_SECRET) as {
      id: string;
      email: string;
      role: 'admin' | 'customer';
    };
    req.user = decoded;
    next();
  } catch (err) {
    // If token invalid, proceed as guest or return 403
    next();
  }
};

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required. Please sign in.' });
  }
  next();
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access denied. Unauthorized role.' });
  }
  next();
};
