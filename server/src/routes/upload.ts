import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

const UPLOADS_DIR = path.resolve(process.cwd(), 'server', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, `img-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|avif|gif/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) {
      return cb(null, true);
    }
    cb(new Error('Only image files (JPEG, PNG, WebP, AVIF) are supported.'));
  }
});

router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image file uploaded.' });
  }

  const imageUrl = `/uploads/${req.file.filename}`;
  return res.json({
    success: true,
    imageUrl,
    filename: req.file.filename,
    message: 'Image uploaded successfully.'
  });
});

export default router;
