const express = require('express');
const router = express.Router();
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const FILE = 'data/posts.json';
const readData = () => { try { return JSON.parse(fs.readFileSync(FILE, 'utf8')); } catch { return []; } };
const writeData = (d) => fs.writeFileSync(FILE, JSON.stringify(d, null, 2));

router.get('/', (req, res) => {
  const posts = readData().reverse();
  res.render('posts/index', { posts, page: 'posts' });
});

router.get('/new', (req, res) => {
  res.render('posts/form', { post: null, page: 'posts' });
});

router.post('/new', (req, res) => {
  const posts = readData();
  const { title, content, status, tags } = req.body;
  posts.push({
    id: uuidv4(),
    title,
    content,
    status: status || 'draft',
    tags: tags ? tags.split(',').map(t => t.trim()) : [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  writeData(posts);
  req.flash('success', 'পোস্ট সফলভাবে তৈরি হয়েছে!');
  res.redirect('/admin/posts');
});

router.get('/edit/:id', (req, res) => {
  const posts = readData();
  const post = posts.find(p => p.id === req.params.id);
  if (!post) return res.redirect('/admin/posts');
  res.render('posts/form', { post, page: 'posts' });
});

router.post('/edit/:id', (req, res) => {
  const posts = readData();
  const idx = posts.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.redirect('/admin/posts');
  const { title, content, status, tags } = req.body;
  posts[idx] = { ...posts[idx], title, content, status, tags: tags ? tags.split(',').map(t => t.trim()) : [], updatedAt: new Date().toISOString() };
  writeData(posts);
  req.flash('success', 'পোস্ট আপডেট হয়েছে!');
  res.redirect('/admin/posts');
});

router.post('/delete/:id', (req, res) => {
  const posts = readData().filter(p => p.id !== req.params.id);
  writeData(posts);
  req.flash('success', 'পোস্ট ডিলেট হয়েছে!');
  res.redirect('/admin/posts');
});

module.exports = router;
