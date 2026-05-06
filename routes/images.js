const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const FILE = 'data/images.json';
const readData = () => { try { return JSON.parse(fs.readFileSync(FILE, 'utf8')); } catch { return []; } };
const writeData = (d) => fs.writeFileSync(FILE, JSON.stringify(d, null, 2));

const storage = multer.diskStorage({
  destination: 'public/uploads/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `img-${uuidv4()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowed.includes(file.mimetype)) return cb(new Error('শুধু ছবি ফাইল আপলোড করুন!'));
    cb(null, true);
  }
});

router.get('/', (req, res) => {
  const images = readData().reverse();
  res.render('images/index', { images, page: 'images' });
});

router.post('/upload', upload.array('images', 20), (req, res) => {
  if (!req.files || req.files.length === 0) {
    req.flash('error', 'কোনো ছবি সিলেক্ট করা হয়নি!');
    return res.redirect('/admin/images');
  }
  const images = readData();
  req.files.forEach(file => {
    images.push({
      id: uuidv4(),
      originalName: file.originalname,
      filename: file.filename,
      size: file.size,
      path: `/uploads/${file.filename}`,
      alt: req.body.alt || '',
      uploadedAt: new Date().toISOString()
    });
  });
  writeData(images);
  req.flash('success', `${req.files.length}টি ছবি আপলোড হয়েছে!`);
  res.redirect('/admin/images');
});

router.post('/delete/:id', (req, res) => {
  const images = readData();
  const img = images.find(i => i.id === req.params.id);
  if (img) {
    const p = `public${img.path}`;
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }
  writeData(images.filter(i => i.id !== req.params.id));
  req.flash('success', 'ছবি ডিলেট হয়েছে!');
  res.redirect('/admin/images');
});

module.exports = router;
