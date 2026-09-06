import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../database/db.js';
import { APP_CONFIG } from '../config/constants.js';
import { AuthRequest, requireAuth } from '../middleware/auth.js';

const router = Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  const user = db.findUserByEmail(email);
  if (!user || !user.password) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    APP_CONFIG.JWT_SECRET,
    { expiresIn: '7d' }
  );

  const { password: _, ...safeUser } = user;
  return res.json({
    success: true,
    token,
    user: safeUser,
    message: `Welcome back, ${user.name}!`
  });
});

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
  }

  const existing = db.findUserByEmail(email);
  if (existing) {
    return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const newUser = db.createUser({
    name,
    email,
    password: hashedPassword,
    phone: phone || '',
    role: 'customer',
    addresses: []
  });

  const token = jwt.sign(
    { id: newUser.id, email: newUser.email, role: newUser.role },
    APP_CONFIG.JWT_SECRET,
    { expiresIn: '7d' }
  );

  const { password: _, ...safeUser } = newUser;
  return res.status(201).json({
    success: true,
    token,
    user: safeUser,
    message: 'Account created successfully! Welcome to E Smart Electronics.'
  });
});

// GET /api/auth/me
router.get('/me', requireAuth, (req: AuthRequest, res: Response) => {
  const user = db.findUserById(req.user!.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }
  const { password: _, ...safeUser } = user;
  return res.json({ success: true, user: safeUser });
});

// POST /api/auth/address
router.post('/address', requireAuth, (req: AuthRequest, res: Response) => {
  const user = db.findUserById(req.user!.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  const newAddress = {
    id: `addr-${Date.now()}`,
    title: req.body.title || 'Home',
    fullName: req.body.fullName || user.name,
    phone: req.body.phone || user.phone,
    apartmentVilla: req.body.apartmentVilla,
    street: req.body.street,
    area: req.body.area,
    city: req.body.city,
    emirate: req.body.emirate,
    country: 'United Arab Emirates',
    isDefault: req.body.isDefault ?? true
  };

  const addresses = user.addresses || [];
  if (newAddress.isDefault) {
    addresses.forEach(a => (a.isDefault = false));
  }
  addresses.push(newAddress);

  db.updateUser(user.id, { addresses });
  return res.json({ success: true, addresses, message: 'Address saved successfully.' });
});

export default router;
