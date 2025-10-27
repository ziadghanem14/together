# ⚡ Quick Start Guide

Get LiveShare running in 5 minutes!

## 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

## 2. Configure Environment

**Note:** ✅ **No credit card or API token needed!** Using free OpenStreetMap.

**Backend** - Create `backend/.env`:
```env
NODE_ENV=development
PORT=3000
ALLOWED_ORIGINS=http://localhost:5173
```

**Frontend** - Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:3000
VITE_WS_URL=http://localhost:3000
```

## 3. Start Servers

**Terminal 1** (Backend):
```bash
cd backend
npm run dev
```

**Terminal 2** (Frontend):
```bash
cd frontend
npm run dev
```

## 4. Open Browser

Go to: http://localhost:5173

## 5. Test It!

1. Click **"Create New Session"**
2. Allow location permission
3. Click **"Share My Location"**
4. Copy the share link
5. Open in another browser/device to see real-time updates!

---

## Troubleshooting

### "Map not loading"
→ Check internet connection (using free OpenStreetMap - no token needed)

### "Location permission denied"
→ Browser Settings → Site Settings → Location → Allow

### "Cannot connect to server"
→ Make sure backend is running on port 3000

---

**Need help?** Check README.md for detailed documentation.

