const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const fs = require('fs');

const readSettings = () => {
  try { return JSON.parse(fs.readFileSync('data/settings.json', 'utf8')); }
  catch { return { adminUser: 'admin', adminPass: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' }; }
};

router.get('/login', (req, res) => {
  if (req.session.authenticated) return res.redirect('/admin');
  res.render('login', { error: req.flash('error') });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const settings = readSettings();
  
  if (username === settings.adminUser) {
    const match = await bcrypt.compare(password, settings.adminPass);
    if (match) {
      req.session.authenticated = true;
      req.session.user = username;
      return res.redirect('/admin');
    }
  }
  req.flash('error', 'ভুল username বা password!');
  res.redirect('/login');
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

module.exports = router;
        
