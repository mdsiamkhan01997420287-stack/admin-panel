# 🚀 Admin Panel

একটি সুন্দর, সম্পূর্ণ বাংলা অ্যাডমিন প্যানেল — Node.js + Express দিয়ে তৈরি।

## ✨ ফিচার সমূহ

- 🔐 **সিকিউর লগইন** — bcrypt এনক্রিপশন
- 📝 **পোস্ট ম্যানেজার** — তৈরি, সম্পাদনা, মুছুন, ট্যাগ, ড্রাফট/প্রকাশ
- 🖼️ **ইমেজ গ্যালারি** — একসাথে ২০টি ছবি আপলোড, ড্র্যাগ-ড্রপ
- 📁 **ফাইল ম্যানেজার** — যেকোনো ফাইল আপলোড (৫০MB পর্যন্ত)
- 📊 **ড্যাশবোর্ড** — সব স্ট্যাটিস্টিক্স এক জায়গায়
- ⚙️ **সেটিংস** — সাইটের নাম, ইউজার, পাসওয়ার্ড পরিবর্তন

## 🛠️ ইনস্টলেশন

```bash
# ১. ডাউনলোড ও ইনস্টল
npm install

# ২. সার্ভার চালু করুন
npm start

# ৩. ব্রাউজারে খুলুন
http://localhost:3000
```

## 🔑 ডিফল্ট লগইন

```
Username: admin
Password: password
```
⚠️ **প্রথম লগইনের পর সেটিংস থেকে পাসওয়ার্ড পরিবর্তন করুন!**

## 🌐 হোস্টিং গাইড

### Render.com (ফ্রি)
1. GitHub-এ কোড আপলোড করুন
2. render.com এ নতুন Web Service তৈরি করুন
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Environment Variable: `SESSION_SECRET=আপনার-গোপন-কিছু`

### Railway.app (ফ্রি)
1. GitHub-এ কোড আপলোড করুন
2. railway.app এ Deploy করুন
3. `SESSION_SECRET` environment variable সেট করুন

### VPS (Ubuntu)
```bash
npm install -g pm2
SESSION_SECRET=secret pm2 start server.js --name admin-panel
pm2 save && pm2 startup
```

## 📁 প্রজেক্ট স্ট্রাকচার

```
admin-panel/
├── server.js          # মূল সার্ভার
├── routes/
│   ├── auth.js        # লগইন/লগআউট
│   ├── dashboard.js   # ড্যাশবোর্ড
│   ├── posts.js       # পোস্ট CRUD
│   ├── files.js       # ফাইল আপলোড
│   ├── images.js      # ছবি আপলোড
│   └── settings.js    # সেটিংস
├── views/             # EJS টেমপ্লেট
├── public/uploads/    # আপলোড করা ফাইল
└── data/              # JSON ডেটা
```

## ⚙️ Environment Variables

```env
PORT=3000
SESSION_SECRET=your-super-secret-key-here
```
