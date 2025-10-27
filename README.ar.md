# 📍 Together - مع بعض

تطبيق ويب حديث وآمن لمشاركة موقع GPS الخاص بك في الوقت الفعلي مع الأصدقاء والعائلة أو الزملاء. شارك موقعك، ابقى متصل.

## ✨ الميزات الرئيسية

- 🗺️ **مشاركة الموقع الحي**: شارك موقعك بتأخير أقل من 5 ثوانٍ
- 🔗 **مشاركة سهلة**: إنشاء روابط قابلة للمشاركة للعرض فقط
- 🔒 **الخصوصية أولاً**: تحكم كامل في متى ومع من تشارك
- 📱 **تصميم متجاوب**: يعمل بسلاسة على الهاتف وسطح المكتب
- 🎯 **عرض دقة GPS**: تغذية راجعة بصرية حول دقة الموقع
- 👥 **دعم متعدد المشاركين**: شاهد جميع المشاركين على نفس الخريطة
- ⏱️ **انتهاء تلقائي**: تُحذف الجلسات تلقائيًا بعد 24 ساعة
- 🚀 **بدون تسجيل**: ابدأ المشاركة فورًا بدون حساب

## 🚀 البدء السريع

### المتطلبات الأساسية

- **Node.js** 18.x أو أعلى
- **npm** أو **yarn**
- ✅ **لا يحتاج API token!** (يستخدم OpenStreetMap المجانية)

### التثبيت

1. **استنساخ المستودع**
```bash
git clone https://github.com/yourusername/live-location-sharing.git
cd live-location-sharing
```

2. **تثبيت جميع التبعيات**
```bash
npm run install:all
```

3. **إعداد متغيرات البيئة**

الخلفية (`backend/.env`):
```env
NODE_ENV=development
PORT=3000
ALLOWED_ORIGINS=http://localhost:5173
```

الواجهة الأمامية (`frontend/.env`):
```env
VITE_API_URL=http://localhost:3000
VITE_WS_URL=http://localhost:3000
```

> ✅ **لا يحتاج بطاقة ائتمان أو API token!** يستخدم OpenStreetMap المجانية.

4. **بدء التطوير**
```bash
npm run dev
```

5. **افتح المتصفح**
```
http://localhost:5173
```

## 📖 دليل الاستخدام

### إنشاء جلسة

1. انقر فوق زر **"إنشاء جلسة جديدة"**
2. سيطلب المتصفح إذن الموقع - انقر فوق **السماح**
3. سيتم إنشاء رابط جلسة فريد
4. انقر فوق **"مشاركة موقعي"** لبدء البث
5. انسخ الرابط وشاركه مع الآخرين

### الانضمام إلى جلسة

1. انقر فوق الرابط المشترك
2. سيطلب المتصفح إذن الموقع (اختياري)
3. إذا سمحت، سيظهر موقعك على الخريطة
4. يمكنك عرض مواقع الآخرين حتى بدون مشاركة موقعك

### إيقاف المشاركة

1. انقر فوق زر **"إيقاف المشاركة"**
2. لن يتم بث موقعك بعد الآن
3. ستختفي علامتك من خرائط الآخرين

## 🏗️ هيكل المشروع

```
live-location-sharing/
├── backend/                 # Node.js + Express + Socket.IO
│   ├── src/
│   │   ├── server.ts       # نقطة الدخول الرئيسية
│   │   ├── routes/         # نقاط REST API
│   │   ├── sockets/        # معالجات WebSocket
│   │   ├── services/       # منطق الأعمال
│   │   └── types/          # تعريفات TypeScript
│   └── package.json
├── frontend/               # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/     # مكونات React
│   │   ├── context/        # إدارة الحالة
│   │   ├── hooks/          # React hooks مخصصة
│   │   └── utils/          # وظائف مساعدة
│   └── package.json
├── PROMPT.md              # مواصفات المشروع الكاملة
├── README.md              # التوثيق الإنجليزي
├── README.ar.md           # هذا الملف (بالعربية)
├── API.md                 # توثيق API
├── DEPLOYMENT.md          # دليل النشر
└── QUICK_START.md         # دليل البدء السريع
```

## 🛠️ التقنيات المستخدمة

### الواجهة الأمامية
- **React 18** مع TypeScript
- **Vite** كأداة بناء
- **Tailwind CSS** للتصميم
- **Leaflet.js + OpenStreetMap** للخرائط (مجاني 100%)
- **Socket.IO Client** للاتصال الحي

### الخلفية
- **Node.js + Express** للخادم
- **Socket.IO** لـ WebSocket
- **TypeScript** للأمان النوعي
- **Helmet.js** للأمان
- **Express Rate Limit** لحماية من الهجمات

## 🔒 الأمان والخصوصية

### إجراءات الأمان المطبقة

- ✅ فرض HTTPS في الإنتاج
- ✅ تحديد المعدل (Rate Limiting)
- ✅ التحقق من صحة المدخلات
- ✅ حماية CORS
- ✅ رؤوس الأمان (Helmet.js)
- ✅ انتهاء الجلسات التلقائي (24 ساعة)
- ✅ عدم التخزين الدائم

### ميزات الخصوصية

- 🔐 يتطلب موافقة المستخدم قبل المشاركة
- 👁️ مؤشرات مرئية عند المشاركة النشطة
- ⏱️ تحكم يدوي لإيقاف المشاركة في أي وقت
- 🗑️ حذف البيانات عند انتهاء الجلسة
- 🚫 بدون حسابات مستخدمين أو تتبع
- 📍 المشاركة فقط مع مشاركي الجلسة

## 📡 واجهة برمجة التطبيقات (API)

### نقاط REST

```http
POST   /api/sessions              # إنشاء جلسة جديدة
GET    /api/sessions/:id          # الحصول على معلومات الجلسة
GET    /api/sessions/:id/participants  # الحصول على المشاركين
DELETE /api/sessions/:id          # حذف الجلسة
GET    /health                    # فحص صحة الخادم
```

### أحداث WebSocket

**من العميل إلى الخادم:**
- `session:join` - الانضمام إلى جلسة
- `location:update` - تحديث الموقع
- `session:leave` - مغادرة الجلسة

**من الخادم إلى العميل:**
- `session:participants` - قائمة المشاركين
- `participant:joined` - مشارك جديد انضم
- `location:broadcast` - تحديث موقع مشارك
- `participant:left` - مشارك غادر

راجع [API.md](API.md) للتوثيق الكامل.

## 🚢 النشر

### خيارات النشر المتاحة

1. **Vercel** (الواجهة الأمامية) + **Railway** (الخلفية) ⭐ موصى به
2. **Heroku** (كامل)
3. **Firebase** (كامل)
4. **Docker** (أي مكان)
5. **VPS** (DigitalOcean، AWS، إلخ)

راجع [DEPLOYMENT.md](DEPLOYMENT.md) للتعليمات التفصيلية.

### نشر سريع مع Vercel + Railway

**الواجهة الأمامية:**
```bash
cd frontend
npm install -g vercel
vercel --prod
```

**الخلفية:**
```bash
cd backend
npm install -g @railway/cli
railway login
railway init
railway up
```

## 🐛 حل المشاكل

### الخريطة لا تُحمل
→ تحقق من اتصال الإنترنت (تستخدم OpenStreetMap المجانية)

### رفض إذن الموقع
→ إعدادات المتصفح → إعدادات الموقع → الموقع → السماح

### فشل اتصال WebSocket
→ تحقق من أن الخلفية تعمل على المنفذ 3000

### دقة GPS منخفضة
→ انتقل إلى منطقة مفتوحة (ليس داخل مبنى)

## 📚 الوثائق الكاملة

- 📄 [README.md](README.md) - التوثيق الكامل (إنجليزي)
- 🚀 [QUICK_START.md](QUICK_START.md) - دليل البدء السريع
- 📡 [API.md](API.md) - توثيق API
- 🚢 [DEPLOYMENT.md](DEPLOYMENT.md) - دليل النشر الشامل
- 🔒 [SECURITY.md](SECURITY.md) - سياسة الأمان
- 📝 [PROMPT.md](PROMPT.md) - مواصفات المشروع الكاملة
- 🤝 [CONTRIBUTING.md](CONTRIBUTING.md) - دليل المساهمة
- 📋 [CHANGELOG.md](CHANGELOG.md) - سجل التغييرات

## 🎯 الميزات المستقبلية

- [ ] وضع داكن
- [ ] تنبيهات السياج الجغرافي
- [ ] إعادة تشغيل المسار
- [ ] تصدير سجل الموقع (GPX/KML)
- [ ] أيقونات علامات مخصصة
- [ ] دعم متعدد اللغات
- [ ] تطبيق جوال (React Native)
- [ ] دعم PostgreSQL + PostGIS

## 🤝 المساهمة

المساهمات مرحب بها! يرجى اتباع الخطوات:

1. Fork المستودع
2. إنشاء فرع الميزة
3. إجراء التغييرات
4. اختبار شامل
5. فتح Pull Request

راجع [CONTRIBUTING.md](CONTRIBUTING.md) للمزيد.

## 📝 الترخيص

هذا المشروع مرخص بموجب ترخيص MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

## 🙏 شكر وتقدير

- [Mapbox](https://www.mapbox.com) لخدمات الخرائط
- [Socket.IO](https://socket.io) للاتصال في الوقت الفعلي
- [React](https://react.dev) لإطار واجهة المستخدم
- [Express](https://expressjs.com) لإطار الخلفية

## 📧 الدعم

- **المشاكل**: [GitHub Issues](https://github.com/yourusername/live-location-sharing/issues)
- **المناقشات**: [GitHub Discussions](https://github.com/yourusername/live-location-sharing/discussions)

---

**صُنع بـ ❤️ من أجل مشاركة آمنة وسهلة للموقع**

