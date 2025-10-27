# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-01

### Added
- Real-time location sharing with WebSocket
- Interactive Mapbox-powered map
- Session creation and sharing via links
- GPS accuracy display
- Participants list with status indicators
- Responsive mobile and desktop UI
- Privacy controls (start/stop sharing)
- Auto-expiring sessions (24 hours)
- Rate limiting for API and WebSocket
- Docker support
- Comprehensive documentation
- Deployment guides (Vercel, Railway, Heroku, VPS)
- TypeScript throughout
- Security headers with Helmet.js
- CORS protection
- Welcome modal with privacy information
- Copy-to-clipboard for share links
- Visual GPS accuracy indicator
- Stale location detection
- Auto-cleanup of expired sessions

### Security
- Implemented rate limiting
- Added input validation
- Configured CORS whitelist
- Added Helmet.js security headers
- HTTPS enforcement in production

---

## [0.1.0] - 2023-12-20

### Added
- Initial project setup
- Basic REST API
- WebSocket foundation
- Simple map display

---

## Future Releases

### [1.1.0] - Planned
- [ ] Dark mode toggle
- [ ] Geofencing alerts
- [ ] Route playback
- [ ] Export location history (GPX/KML)
- [ ] Custom marker icons
- [ ] Multi-language support

### [2.0.0] - Planned
- [ ] PostgreSQL + PostGIS support
- [ ] User accounts (optional)
- [ ] Private sessions with passwords
- [ ] Mobile app (React Native)
- [ ] Offline mode

---

[1.0.0]: https://github.com/yourusername/live-location-sharing/releases/tag/v1.0.0
[0.1.0]: https://github.com/yourusername/live-location-sharing/releases/tag/v0.1.0

