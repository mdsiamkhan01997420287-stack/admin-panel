const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const fs = require('fs');

const FILE = 'data/settings.json';
const readData = () => { try { return JSON.parse(fs.readFileSync(FILE, 'utf8')); } catch { return {}; } };
const writeData = (d) => fs.writeFileSync(FILE, JSON.stringify(d, null, 2));

router.get('/', (req, res) => {
  const settings = readData();
  res.render('settings', { settings, page: 'settings' });
});

router.post('/', async (req, res) => {
  const settings = readData();
  const { siteName, adminUser, currentPass, newPass, confirmPass } = req.body;
  
  settings.siteName = siteName;
  settings.adminUser = adminUser || settings.adminUser;
  
  if (newPass) {
    if (newPass !== confirmPass) {
      req.flash('error', 'নতুন পাসওয়ার্ড মিলছে না!');
      return res.redirect('/admin/settings');
    }
    const valid = await bcrypt.compare(currentPass, settings.adminPass);
    if (!valid) {
      req.flash('error', 'বর্তমান পাসওয়ার্ড ভুল!');
      return res.redirect('/admin/settings');
    }
    settings.adminPass = await bcrypt.hash(newPass, 10);
  }
  
  writeData(settings);
  req.flash('success', 'সেটিংস সেভ হয়েছে!');
  res.redirect('/admin/settings');
});

module.exports = router;
