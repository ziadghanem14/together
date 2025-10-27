# 📦 تعليمات التثبيت الكاملة | Complete Installation Guide

## ✅ مجاني 100% - لا يحتاج بطاقة ائتمان!

---

## المتطلبات الأساسية | Prerequisites

- **Node.js** 18.x أو أعلى ([تحميل](https://nodejs.org/))
- **npm** (يأتي مع Node.js) أو **yarn**
- **محرر نصوص** (VS Code موصى به)
- **متصفح حديث** (Chrome, Firefox, Safari, Edge)

---

## الطريقة 1: التثبيت السريع (موصى به) ⚡

### خطوة واحدة:

```bash
# استنساخ المشروع
git clone https://github.com/yourusername/live-location-sharing.git
cd live-location-sharing

# تثبيت كل شيء دفعة واحدة
npm run install:all

# إعداد متغيرات البيئة (نسخ من الأمثلة)
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# تشغيل المشروع
npm run dev
```

**تم! المشروع يعمل الآن على http://localhost:5173** 🎉

---

## الطريقة 2: التثبيت اليدوي (خطوة بخطوة) 📋

### 1. استنساخ المشروع

```bash
git clone https://github.com/yourusername/live-location-sharing.git
cd live-location-sharing
```

### 2. تثبيت Backend

```bash
cd backend
npm install
```

**الحزم المثبتة:**
- express (خادم الويب)
- socket.io (WebSocket)
- cors (Cross-Origin)
- helmet (أمان)
- typescript (لغة البرمجة)
- والمزيد...

### 3. تثبيت Frontend

```bash
cd ../frontend
npm install
```

**الحزم المثبتة:**
- react + react-dom (واجهة المستخدم)
- leaflet + react-leaflet (الخرائط - مجاني!)
- socket.io-client (WebSocket)
- tailwindcss (تصميم)
- typescript (لغة البرمجة)
- والمزيد...

### 4. إعداد متغيرات البيئة

#### Backend Environment

أنشئ ملف `backend/.env`:

```env
NODE_ENV=development
PORT=3000
ALLOWED_ORIGINS=http://localhost:5173
```

#### Frontend Environment

أنشئ ملف `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
VITE_WS_URL=http://localhost:3000
```

> ✅ **لاحظ:** لا تحتاج أي API tokens! الخرائط مجانية بالكامل.

### 5. تشغيل المشروع

افتح **نافذتي Terminal**:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

يجب أن ترى:
```
🚀 Server running on port 3000
📡 WebSocket server ready
🌍 Environment: development
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

يجب أن ترى:
```
VITE v5.0.8  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: http://192.168.1.x:5173/
```

### 6. افتح المتصفح

اذهب إلى: **http://localhost:5173**

---

## الطريقة 3: استخدام Docker 🐳

### متطلبات Docker:
- Docker Desktop ([تحميل](https://www.docker.com/products/docker-desktop))
- Docker Compose (يأتي مع Docker Desktop)

### التشغيل:

```bash
# بناء الحاويات
docker-compose build

# تشغيل المشروع
docker-compose up

# (اختياري) تشغيل في الخلفية
docker-compose up -d

# إيقاف المشروع
docker-compose down
```

افتح: **http://localhost:5173**

---

## التحقق من التثبيت ✅

### 1. تحقق من Backend

افتح في المتصفح: http://localhost:3000/health

يجب أن ترى:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 2. تحقق من Frontend

افتح: http://localhost:5173

يجب أن ترى:
- ✅ صفحة LiveShare
- ✅ خريطة OpenStreetMap
- ✅ زر "Create New Session"

### 3. اختبر الوظائف

1. انقر "Create New Session"
2. اسمح بالوصول للموقع
3. انقر "Share My Location"
4. يجب أن ترى موقعك على الخريطة!

---

## حل المشاكل الشائعة 🔧

### Backend لا يعمل

**المشكلة:** `Error: Cannot find module`
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

**المشكلة:** `Port 3000 is already in use`
```bash
# أوقف العملية على المنفذ 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <رقم_العملية> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9

# أو غيّر المنفذ في backend/.env:
PORT=3001
```

### Frontend لا يعمل

**المشكلة:** `Module not found: react-leaflet`
```bash
cd frontend
npm install leaflet react-leaflet @types/leaflet
```

**المشكلة:** الخريطة لا تظهر
- تحقق من اتصال الإنترنت (OpenStreetMap تحتاج إنترنت)
- افتح Console في المتصفح (F12) وابحث عن أخطاء

### WebSocket لا يتصل

**المشكلة:** `WebSocket connection failed`

1. تحقق أن Backend يعمل:
```bash
curl http://localhost:3000/health
```

2. تحقق من `frontend/.env`:
```env
VITE_WS_URL=http://localhost:3000  # يجب أن يطابق منفذ Backend
```

3. أعد تشغيل Frontend:
```bash
cd frontend
npm run dev
```

### أخطاء TypeScript

```bash
# احذف الملفات المترجمة وأعد البناء
cd backend
rm -rf dist
npm run build

cd ../frontend
rm -rf dist
npm run build
```

---

## الأوامر المفيدة 📝

### Root Commands (من المجلد الرئيسي)

```bash
npm run install:all   # تثبيت كل التبعيات
npm run dev           # تشغيل Frontend و Backend معاً
npm run build         # بناء المشروع للإنتاج
npm run docker:up     # تشغيل بـ Docker
npm run docker:down   # إيقاف Docker
```

### Backend Commands

```bash
cd backend
npm run dev           # تشغيل مع nodemon (auto-reload)
npm run build         # بناء TypeScript
npm start             # تشغيل الإنتاج
npm test              # تشغيل الاختبارات
```

### Frontend Commands

```bash
cd frontend
npm run dev           # تشغيل التطوير (Vite)
npm run build         # بناء للإنتاج
npm run preview       # معاينة البناء
npm run lint          # فحص الكود
```

---

## التحديث والصيانة 🔄

### تحديث التبعيات

```bash
# تحقق من التحديثات المتاحة
npm outdated

# تحديث Backend
cd backend
npm update

# تحديث Frontend
cd ../frontend
npm update
```

### تنظيف المشروع

```bash
# حذف node_modules وإعادة التثبيت
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

---

## البناء للإنتاج 🚀

### Backend

```bash
cd backend
npm run build
# سينشئ مجلد dist/
```

### Frontend

```bash
cd frontend
npm run build
# سينشئ مجلد dist/
```

راجع [DEPLOYMENT.md](DEPLOYMENT.md) للتفاصيل الكاملة.

---

## موارد إضافية 📚

- 🚀 [QUICK_START.md](QUICK_START.md) - دليل البدء السريع
- 📖 [README.md](README.md) - التوثيق الكامل
- 📡 [API.md](API.md) - توثيق API
- 🚢 [DEPLOYMENT.md](DEPLOYMENT.md) - دليل النشر
- 🆓 [NO_CREDIT_CARD_NEEDED.md](NO_CREDIT_CARD_NEEDED.md) - لماذا مجاني؟

---

## الدعم 💬

إذا واجهت مشاكل:

1. راجع قسم "حل المشاكل" أعلاه
2. ابحث في [Issues](https://github.com/yourusername/live-location-sharing/issues)
3. افتح Issue جديد مع:
   - نظام التشغيل
   - إصدار Node.js (`node --version`)
   - رسالة الخطأ الكاملة
   - الخطوات للإعادة

---

**مبروك! المشروع مثبت ويعمل! 🎉**

الآن جرب: http://localhost:5173

