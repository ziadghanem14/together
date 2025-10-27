# 🚀 دليل رفع Together على Vercel + Railway

## 📋 المطلوب

1. حساب GitHub (مجاني)
2. حساب Vercel (مجاني)
3. حساب Railway (مجاني)

---

## 🎯 الخطوات

### 1️⃣ رفع الكود على GitHub

```bash
# في مجلد المشروع
git init
git add .
git commit -m "Initial commit - Together App"

# اعمل Repository جديد على GitHub
# ثم:
git remote add origin https://github.com/YOUR_USERNAME/together.git
git branch -M main
git push -u origin main
```

---

### 2️⃣ رفع Backend على Railway

#### أ) سجل في Railway
- اذهب إلى: https://railway.app
- سجل بحساب GitHub

#### ب) أنشئ مشروع جديد
1. اضغط **"New Project"**
2. اختر **"Deploy from GitHub repo"**
3. اختر الـ repo بتاعك
4. اختار المجلد: `backend`

#### ج) إعداد Environment Variables
في Railway Dashboard:
```env
NODE_ENV=production
PORT=3000
ALLOWED_ORIGINS=https://your-app.vercel.app
```

#### د) احفظ الـ Backend URL
بعد النشر، هتلاقي URL زي:
```
https://together-backend-production.up.railway.app
```

---

### 3️⃣ رفع Frontend على Vercel

#### أ) سجل في Vercel
- اذهب إلى: https://vercel.com
- سجل بحساب GitHub

#### ب) Import المشروع
1. اضغط **"Add New Project"**
2. اختر الـ repo من GitHub
3. اضغط **"Import"**

#### ج) إعدادات المشروع
في Vercel Dashboard:

**Root Directory:**
```
frontend
```

**Build Command:**
```bash
npm run build
```

**Output Directory:**
```
dist
```

**Install Command:**
```bash
npm install
```

#### د) Environment Variables
أضف المتغيرات دي:
```env
VITE_API_URL=https://together-backend-production.up.railway.app
VITE_WS_URL=https://together-backend-production.up.railway.app
```

(استبدل الـ URL بالـ URL بتاع Backend من Railway)

#### هـ) Deploy
اضغط **"Deploy"**

---

### 4️⃣ تحديث CORS في Backend

بعد ما Frontend يتنشر، خذ الـ URL بتاعه وحدث Backend:

في Railway → Environment Variables:
```env
ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-app-git-main.vercel.app
```

---

## ✅ التحقق

1. افتح Frontend URL من Vercel
2. اضغط "Start Sharing Location"
3. اسمح بالوصول للموقع
4. تأكد إن الخريطة ظاهرة والموقع بيتحدث

---

## 🔧 حل المشاكل

### مشكلة: CORS Error
**الحل:** تأكد إن `ALLOWED_ORIGINS` في Backend فيه URL الـ Frontend الصحيح

### مشكلة: WebSocket لا يتصل
**الحل:** تأكد إن `VITE_WS_URL` نفس `VITE_API_URL`

### مشكلة: Build فشل
**الحل:** تأكد إن كل التبعيات مثبتة في `package.json`

---

## 📱 اختبار على الموبايل

1. افتح الرابط من أي جهاز
2. التطبيق responsive وهيشتغل على الموبايل
3. شارك الرابط مع أصدقائك!

---

## 🎉 خلاص!

التطبيق دلوقتي:
- ✅ متنشر على الإنترنت
- ✅ مجاني تماماً
- ✅ شغال 24/7
- ✅ يقدر أي حد يفتحه

---

**مبروك! Together دلوقتي Online! 🎊**

