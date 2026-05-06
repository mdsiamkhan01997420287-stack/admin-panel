const express = require('express');
const router = express.Router();
const fs = require('fs');

const readData = (file) => {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return []; }
};

router.get('/', (req, res) => {
  const posts = readData('data/posts.json');
  const files = readData('data/files.json');
  const images = readData('data/images.json');
  
  const stats = {
    posts: posts.length,
    files: files.length,
    images: images.length,
    published: posts.filter(p => p.status === 'published').length
  };
  
  const recentPosts = posts.slice(-5).reverse();
  res.render('dashboard', { stats, recentPosts, page: 'dashboard' });
});

module.exports = router;
