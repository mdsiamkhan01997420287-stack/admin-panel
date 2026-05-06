const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const FILE = 'data/files.json';
const readData = () => { try { return JSON.parse(fs.readFileSync(FILE, 'utf8')); } catch { return []; } };
const writeData = (d) => fs.writeFileSync(FILE, JSON.stringify(d, null, 2));

const storage = multer.diskStorage({
  destination: 'public/uploads/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const blocked = ['.exe', '.sh', '.bat', '.cmd'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (blocked.includes(ext)) return cb(new Error('এই ফাইল টাইপ অনুমোদিত নয়'));
    cb(null, true);
  }
});

router.get('/', (req, res) => {
  const files = readData().reverse();
  res.render('files/index', { files, page: 'files' });
});

router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    req.flash('error', 'কোনো ফাইল সিলেক্ট করা হয়নি!');
    return res.redirect('/admin/files');
  }
  const files = readData();
  files.push({
    id: uuidv4(),
    originalName: req.file.originalname,
    filename: req.file.filename,
    size: req.file.size,
    mimetype: req.file.mimetype,
    path: `/uploads/${req.file.filename}`,
    description: req.body.description || '',
    uploadedAt: new Date().toISOString()
  });
  writeData(files);
  req.flash('success', 'ফাইল আপলোড সফল হয়েছে!');
  res.redirect('/admin/files');
});

router.post('/delete/:id', (req, res) => {
  const files = readData();
  const file = files.find(f => f.id === req.params.id);
  if (file) {
    const filePath = `public${file.path}`;
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
  writeData(files.filter(f => f.id !== req.params.id));
  req.flash('success', 'ফাইল ডিলেট হয়েছে!');
  res.redirect('/admin/files');
});

module.exports = router;
