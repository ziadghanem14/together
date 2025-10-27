# Project Specification: Real-Time Live Location Sharing Web App

## 📍 Project Overview
Create a complete, production-ready web application that enables users to share their GPS location in real-time and display it on an interactive map. The app should support view-only sharing links and work seamlessly on desktop and mobile devices.

---

## 🎯 Core Features

### 1. User Management
- **Optional Authentication**: Users can share anonymously or create accounts
- **Session Management**: Generate unique shareable links for location sessions
- **Privacy Controls**: Users control when their location is shared

### 2. Location Sharing
- **Start/Stop Sharing**: Toggle location broadcasting with clear UI feedback
- **Real-time Updates**: Live position updates without page reload (2-5 second intervals)
- **Accuracy Display**: Show GPS accuracy radius and signal quality
- **Last Update Timestamp**: Display time of last location update for each participant

### 3. Map Visualization
- **Interactive Map**: Pan, zoom, and interact with the map
- **Participant Markers**: Display all active participants with custom icons
- **Auto-centering**: Option to follow user's location
- **Clustering**: Group nearby markers when zoomed out

### 4. Advanced Features (Optional)
- **Location History**: Store and display travel path/route
- **Geofencing**: Alerts when entering/leaving areas
- **Rate Limiting**: Prevent abuse with configurable update throttling
- **Offline Support**: Cache last known positions

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **Styling**: Tailwind CSS for responsive design
- **Maps**: Leaflet + OpenStreetMap (100% free, no API key/credit card) or Mapbox GL JS or Google Maps JS API
- **State Management**: React Context API or Zustand
- **Build Tool**: Vite

### Backend
- **Runtime**: Node.js 18+ with Express
- **Real-time**: Socket.IO for WebSocket connections
- **Database**: 
  - Option A: Firebase Realtime Database (serverless)
  - Option B: PostgreSQL + PostGIS (for advanced geo queries)
  - Option C: In-memory store (Redis) for ephemeral data

### Geolocation
- **HTML5 Geolocation API**: `navigator.geolocation.watchPosition()`
- **Position Smoothing**: Debounce updates when location is stationary
- **Accuracy Threshold**: Filter low-quality GPS readings

---

## 📡 API & Real-time Protocol

### REST Endpoints
```
POST   /api/sessions          # Create new sharing session
GET    /api/sessions/:id      # Get session info
DELETE /api/sessions/:id      # End session
GET    /api/sessions/:id/participants  # Get active participants
```

### WebSocket Events
```javascript
// Client → Server
socket.emit('location:update', {
  sessionId: string,
  userId: string,
  latitude: number,
  longitude: number,
  accuracy: number,
  timestamp: number
})

socket.emit('session:join', { sessionId, userId, displayName })
socket.emit('session:leave', { sessionId, userId })

// Server → Client
socket.on('location:broadcast', {
  userId: string,
  latitude: number,
  longitude: number,
  accuracy: number,
  timestamp: number,
  displayName: string
})

socket.on('participant:joined', { userId, displayName })
socket.on('participant:left', { userId })
```

---

## 🔐 Security & Privacy

### Security Measures
1. **HTTPS Only**: Enforce SSL/TLS for all connections
2. **Token-based Access**: Session tokens for view-only links
3. **Rate Limiting**: Max 1 update per second per user
4. **Input Validation**: Sanitize all location data
5. **CORS Configuration**: Whitelist allowed origins

### Privacy Features
1. **User Consent**: Explicit permission request before sharing
2. **Visual Indicators**: Clear "sharing" status indicator
3. **Auto-expiration**: Sessions expire after 24 hours
4. **Data Deletion**: Purge location history after session ends
5. **Anonymous Sharing**: No PII required for basic usage

### Privacy Warnings
- Display banner: "Your location is being shared with X participants"
- Confirm before starting share: "Allow this app to access your location?"
- Show who can see your location

---

## 🎨 User Interface Requirements

### Main Screen
```
┌─────────────────────────────────────┐
│  🗺️ LiveShare Location             │
│  ┌─────────────────────────────┐   │
│  │                             │   │
│  │    [Interactive Map]        │   │
│  │    - User markers           │   │
│  │    - Accuracy circles       │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│  📍 Share My Location [Toggle]     │
│  🔗 Share Link: [Copy]             │
│  👥 Active Participants (3):       │
│    • Alice (2s ago) ✓             │
│    • Bob (5s ago) ✓               │
│    • You (sharing) 📍             │
│  ⚡ GPS Accuracy: ±15m            │
└─────────────────────────────────────┘
```

### UI Components
1. **Share Button**: Large, prominent toggle ("Share My Location" / "Stop Sharing")
2. **Link Generator**: Auto-generate shareable URL with copy button
3. **Participants List**: Sidebar or bottom sheet with active users
4. **Status Indicators**:
   - Green dot: Sharing active
   - Red dot: Sharing stopped
   - Gray dot: Stale location (>30s old)
5. **Accuracy Badge**: Display GPS accuracy in meters
6. **Toast Notifications**: For join/leave events

### Responsive Design
- Mobile-first approach
- Breakpoints: 640px (mobile), 768px (tablet), 1024px (desktop)
- Touch-friendly controls (min 44px tap targets)
- Fullscreen map on mobile, sidebar on desktop

---

## 👤 User Flows

### Flow 1: Start Sharing Location
1. User opens app
2. Click "Create Session" or "Share My Location"
3. Browser prompts for location permission → User allows
4. App generates unique session link
5. Location updates every 3 seconds
6. User copies link to share with others

### Flow 2: Join Existing Session
1. User clicks shared link
2. App loads session map
3. Browser prompts for location permission → User allows (optional)
4. User sees other participants' locations
5. If permission granted, user's location appears on map

### Flow 3: Stop Sharing
1. User clicks "Stop Sharing" button
2. Confirmation modal: "Stop sharing your location?"
3. User confirms
4. Location updates stop
5. User marker removed from others' maps

---

## ⚡ Performance Requirements

### Update Frequency
- **Mobile**: Configurable 2-5 seconds (balance battery vs freshness)
- **Desktop**: 1-3 seconds
- **Adaptive**: Reduce frequency when stationary (detect <5m movement)

### Optimization Strategies
1. **Debouncing**: Skip updates if position unchanged (threshold: 10m)
2. **Batching**: Send multiple updates in one packet if needed
3. **Compression**: Minimize payload size (use short keys)
4. **Connection Pooling**: Reuse WebSocket connections
5. **Lazy Loading**: Load map tiles on demand

### Scalability
- Support 100+ concurrent participants per session
- Handle 1000+ active sessions simultaneously
- CDN for static assets
- WebSocket load balancing (sticky sessions)

---

## 📦 Deliverables

### 1. Source Code Repository
```
live-location-sharing/
├── backend/
│   ├── src/
│   │   ├── server.ts
│   │   ├── routes/
│   │   ├── sockets/
│   │   └── services/
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
├── README.md
├── .env.example
└── docker-compose.yml (optional)
```

### 2. README.md
Must include:
- Project description and features
- Prerequisites (Node.js version, API keys)
- Local development setup
- Environment variables explanation
- Deployment instructions (Vercel, Railway, Firebase)
- API documentation
- Troubleshooting guide

### 3. Environment Variables

**Backend** `.env.example`:
```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://...  # if using PostgreSQL
SESSION_SECRET=random_secret
ALLOWED_ORIGINS=http://localhost:5173
MAX_SESSION_DURATION_HOURS=24
UPDATE_INTERVAL_MS=3000
```

**Frontend** `.env.example`:
```env
VITE_API_URL=http://localhost:3000
VITE_WS_URL=http://localhost:3000
# Note: No API keys needed when using OpenStreetMap + Leaflet! 
# If using Mapbox instead: VITE_MAPBOX_ACCESS_TOKEN=your_token_here
```

### 4. Deployment Guides

#### Vercel (Frontend)
```bash
npm install -g vercel
cd frontend
vercel --prod
```

#### Railway (Backend)
```bash
npm install -g railway
railway init
railway up
```

#### Firebase (Full Stack)
```bash
firebase init
firebase deploy
```

### 5. API Documentation
- Swagger/OpenAPI spec for REST endpoints
- WebSocket event schemas
- Example requests/responses
- Error codes and handling

### 6. Basic Tests
- Unit tests for utility functions (distance calculation, debouncing)
- Integration tests for API endpoints
- E2E test for basic sharing flow (optional)

---

## 🚀 Bonus Features

### Advanced Functionality
1. **Route Playback**: Replay historical paths with timeline scrubber
2. **Geofencing**: Set areas and get notified when participants enter/leave
3. **Custom Markers**: Upload profile pictures for map avatars
4. **Dark Mode**: Toggle light/dark map themes
5. **Export Data**: Download location history as GPX/KML

### Developer Experience
1. **Hot Reload**: Fast development with Vite HMR
2. **TypeScript**: Full type safety
3. **Linting**: ESLint + Prettier
4. **Git Hooks**: Pre-commit checks with Husky

### Cost Optimization
1. **Rate Limiting**: Prevent excessive map tile requests
2. **Caching**: Cache map tiles and API responses
3. **Usage Monitoring**: Track Mapbox API calls
4. **Graceful Degradation**: Fall back to simpler features if quota exceeded

---

## 📋 Implementation Checklist

- [ ] Set up monorepo structure (frontend + backend)
- [ ] Configure TypeScript for both projects
- [ ] Implement Express server with CORS and security headers
- [ ] Add Socket.IO with authentication
- [ ] Create session management system
- [ ] Integrate Mapbox GL JS in React
- [ ] Implement HTML5 Geolocation wrapper
- [ ] Build real-time location broadcasting
- [ ] Design responsive UI with Tailwind CSS
- [ ] Add error handling and loading states
- [ ] Implement rate limiting and debouncing
- [ ] Set up environment configuration
- [ ] Write comprehensive README
- [ ] Add deployment scripts
- [ ] Create .env.example with all required vars
- [ ] Test on mobile devices (iOS Safari, Android Chrome)
- [ ] Optimize bundle size (<500KB)
- [ ] Add analytics (optional)
- [ ] Document API with examples

---

## 🎯 Success Criteria

The project is complete when:
1. ✅ Users can share location with a single button click
2. ✅ Locations update in real-time (<5s latency)
3. ✅ Shareable links work without authentication
4. ✅ App works on mobile and desktop browsers
5. ✅ Privacy warnings are clear and prominent
6. ✅ Documentation allows developer to deploy in <30 minutes
7. ✅ No console errors in production build
8. ✅ Graceful handling of denied location permissions

---

## 📚 Resources & References

### Documentation
- [Leaflet Documentation](https://leafletjs.com/) - 100% free maps
- [React-Leaflet Documentation](https://react-leaflet.js.org/)
- [OpenStreetMap](https://www.openstreetmap.org/) - Free map data
- [Mapbox GL JS Docs](https://docs.mapbox.com/mapbox-gl-js/) - Alternative (requires API key)
- [Socket.IO Documentation](https://socket.io/docs/)
- [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

### Example Use Cases
- Family location sharing during trips
- Event meetup coordination
- Delivery tracking
- Emergency responder coordination
- Sports team tracking during races

---

**Note to Developer**: This specification is comprehensive but flexible. Make pragmatic choices that balance features, security, and time-to-delivery. Start with MVP (core sharing + map display), then iterate with advanced features.

