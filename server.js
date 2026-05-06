const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure data directories exist
['data', 'public/uploads'].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Init data files
const DATA_FILES = {
  posts: 'data/posts.json',
  files: 'data/files.json',
  images: 'data/images.json',
  settings: 'data/settings.json'
};

Object.entries(DATA_FILES).forEach(([key, file]) => {
  if (!fs.existsSync(file)) {
    const defaults = {
      settings: { siteName: 'My Admin Panel', adminUser: 'admin', adminPass: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' }
    };
    fs.writeFileSync(file, JSON.stringify(defaults[key] || [], null, 2));
  }
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'admin-secret-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

app.use(flash());

// Auth middleware
const requireAuth = (req, res, next) => {
  if (req.session.authenticated) return next();
  res.redirect('/login');
};

// Helper functions
const readData = (file) => {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch { return []; }
};

const writeData = (file, data) => {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

app.use((req, res, next) => {
  const settings = readData(DATA_FILES.settings);
  res.locals.siteName = settings.siteName || 'Admin Panel';
  res.locals.flash = req.flash();
  res.locals.user = req.session.user || null;
  next();
});

// Routes
app.use('/', require('./routes/auth'));
app.use('/admin', requireAuth, require('./routes/dashboard'));
app.use('/admin/posts', requireAuth, require('./routes/posts'));
app.use('/admin/files', requireAuth, require('./routes/files'));
app.use('/admin/images', requireAuth, require('./routes/images'));
app.use('/admin/settings', requireAuth, require('./routes/settings'));

app.get('/', (req, res) => res.redirect('/admin'));

app.listen(PORT, () => {
  console.log(`✅ Admin Panel running at http://localhost:${PORT}`);
});
