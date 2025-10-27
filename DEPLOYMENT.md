# 🚀 Deployment Guide

This guide covers multiple deployment options for LiveShare application.

## Table of Contents

- [Vercel (Frontend) + Railway (Backend)](#vercel--railway)
- [Heroku (Full Stack)](#heroku)
- [Firebase (Full Stack)](#firebase)
- [Docker](#docker)
- [VPS (DigitalOcean, AWS, etc)](#vps)

---

## Vercel + Railway

### Frontend on Vercel

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy Frontend**
```bash
cd frontend
vercel login
vercel
```

3. **Set Environment Variables**
Go to Vercel Dashboard → Your Project → Settings → Environment Variables:
```
VITE_MAPBOX_ACCESS_TOKEN=pk.ey...
VITE_API_URL=https://your-backend.railway.app
VITE_WS_URL=https://your-backend.railway.app
VITE_LOCATION_UPDATE_INTERVAL=3000
```

4. **Deploy to Production**
```bash
vercel --prod
```

### Backend on Railway

1. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Login and Initialize**
```bash
railway login
cd backend
railway init
```

3. **Set Environment Variables**
```bash
railway variables set NODE_ENV=production
railway variables set PORT=3000
railway variables set ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

4. **Deploy**
```bash
railway up
```

5. **Get Backend URL**
```bash
railway domain
```

Copy this URL and update your frontend's `VITE_API_URL` and `VITE_WS_URL`.

---

## Heroku

### Backend Deployment

1. **Create Heroku App**
```bash
cd backend
heroku login
heroku create your-app-name-backend
```

2. **Set Environment Variables**
```bash
heroku config:set NODE_ENV=production
heroku config:set ALLOWED_ORIGINS=https://your-app-name-frontend.herokuapp.com
```

3. **Deploy**
```bash
git init
git add .
git commit -m "Initial commit"
heroku git:remote -a your-app-name-backend
git push heroku main
```

### Frontend Deployment

1. **Create Static Site Buildpack**
```bash
cd frontend
heroku create your-app-name-frontend
heroku buildpacks:set mars/create-react-app
```

2. **Set Environment Variables**
Create `frontend/.env.production`:
```env
VITE_MAPBOX_ACCESS_TOKEN=your_token
VITE_API_URL=https://your-app-name-backend.herokuapp.com
VITE_WS_URL=https://your-app-name-backend.herokuapp.com
```

3. **Deploy**
```bash
git init
git add .
git commit -m "Deploy frontend"
heroku git:remote -a your-app-name-frontend
git push heroku main
```

---

## Firebase

1. **Install Firebase CLI**
```bash
npm install -g firebase-tools
firebase login
```

2. **Initialize Project**
```bash
firebase init
# Select: Hosting, Functions
```

3. **Configure firebase.json**
```json
{
  "hosting": {
    "public": "frontend/dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  },
  "functions": {
    "source": "backend"
  }
}
```

4. **Build Frontend**
```bash
cd frontend
npm run build
```

5. **Deploy**
```bash
firebase deploy
```

---

## Docker

### Build and Run Locally

1. **Build Images**
```bash
docker-compose build
```

2. **Start Services**
```bash
docker-compose up -d
```

3. **View Logs**
```bash
docker-compose logs -f
```

4. **Stop Services**
```bash
docker-compose down
```

### Deploy to Docker Hub

1. **Tag Images**
```bash
docker tag live-location-backend yourusername/live-location-backend:latest
docker tag live-location-frontend yourusername/live-location-frontend:latest
```

2. **Push to Docker Hub**
```bash
docker push yourusername/live-location-backend:latest
docker push yourusername/live-location-frontend:latest
```

---

## VPS (DigitalOcean, AWS, Linode, etc.)

### Prerequisites

- Ubuntu 20.04+ server
- Domain name (optional)
- SSH access

### 1. Server Setup

```bash
# SSH into server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install Nginx
apt install -y nginx

# Install PM2
npm install -g pm2
```

### 2. Clone and Setup Backend

```bash
# Clone repository
git clone https://github.com/yourusername/live-location-sharing.git
cd live-location-sharing/backend

# Install dependencies
npm install

# Create .env file
nano .env
# Add:
# NODE_ENV=production
# PORT=3000
# ALLOWED_ORIGINS=https://yourdomain.com

# Build
npm run build

# Start with PM2
pm2 start dist/server.js --name live-location-backend
pm2 save
pm2 startup
```

### 3. Build and Deploy Frontend

```bash
cd ../frontend

# Create .env.production
nano .env.production
# Add:
# VITE_MAPBOX_ACCESS_TOKEN=your_token
# VITE_API_URL=https://yourdomain.com
# VITE_WS_URL=wss://yourdomain.com

# Install and build
npm install
npm run build

# Copy to Nginx directory
cp -r dist /var/www/live-location
```

### 4. Configure Nginx

```bash
nano /etc/nginx/sites-available/live-location
```

Add:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        root /var/www/live-location;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket
    location /socket.io {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
ln -s /etc/nginx/sites-available/live-location /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### 5. SSL with Let's Encrypt

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d yourdomain.com

# Auto-renewal
certbot renew --dry-run
```

---

## Environment Variables Reference

### Backend
```env
NODE_ENV=production
PORT=3000
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
MAX_SESSION_DURATION_HOURS=24
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend
```env
VITE_MAPBOX_ACCESS_TOKEN=pk.ey...
VITE_API_URL=https://api.yourdomain.com
VITE_WS_URL=wss://api.yourdomain.com
VITE_LOCATION_UPDATE_INTERVAL=3000
VITE_STALE_THRESHOLD=30000
```

---

## Post-Deployment Checklist

- [ ] Verify HTTPS is working
- [ ] Test location sharing on mobile
- [ ] Check WebSocket connection
- [ ] Verify CORS headers
- [ ] Test session creation and joining
- [ ] Monitor server logs
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)
- [ ] Configure backup/disaster recovery
- [ ] Set up analytics (optional)

---

## Monitoring & Maintenance

### PM2 Commands
```bash
pm2 status                 # Check status
pm2 logs live-location-backend  # View logs
pm2 restart live-location-backend  # Restart app
pm2 stop live-location-backend     # Stop app
```

### Server Monitoring
```bash
# CPU and Memory
htop

# Disk usage
df -h

# Network connections
netstat -tulpn
```

---

## Troubleshooting

### Backend not starting
```bash
# Check logs
pm2 logs live-location-backend

# Check port availability
netstat -tulpn | grep 3000

# Restart
pm2 restart live-location-backend
```

### WebSocket connection failed
- Verify Nginx WebSocket proxy configuration
- Check firewall rules
- Ensure CORS headers allow WebSocket upgrade

### High memory usage
- Increase server RAM
- Implement Redis for session storage
- Add horizontal scaling with load balancer

---

**Need help?** Open an issue on GitHub or contact support.

