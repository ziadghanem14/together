# 🔒 Security Policy

## Reporting Security Vulnerabilities

We take security seriously. If you discover a security vulnerability, please follow these steps:

1. **DO NOT** open a public issue
2. Email: security@example.com (or open a private security advisory on GitHub)
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will respond within 48 hours and work with you to resolve the issue.

---

## Security Measures Implemented

### Transport Security
- ✅ HTTPS enforced in production
- ✅ WSS (WebSocket Secure) for real-time connections
- ✅ Helmet.js security headers
- ✅ CORS configuration with whitelist

### Authentication & Authorization
- ✅ Session-based access control
- ✅ Token-based session URLs
- ✅ No authentication required (privacy by design)

### Rate Limiting
- ✅ REST API: 100 requests per 15 minutes per IP
- ✅ WebSocket: 1 location update per second per user
- ✅ Protection against DoS attacks

### Input Validation
- ✅ Latitude/longitude bounds checking (-90/90, -180/180)
- ✅ Type validation for all inputs
- ✅ Sanitization of user-generated content

### Data Privacy
- ✅ No persistent storage of location data
- ✅ In-memory storage only
- ✅ Auto-deletion after 24 hours
- ✅ No user tracking or analytics

### Dependencies
- ✅ Regular security audits (`npm audit`)
- ✅ Automated dependency updates
- ✅ Minimal dependency footprint

---

## Security Best Practices for Users

### For Developers
1. **Never commit** `.env` files
2. **Rotate** API tokens regularly
3. **Use strong** session secrets
4. **Enable** HTTPS in production
5. **Monitor** logs for suspicious activity

### For End Users
1. **Only share** session links with trusted people
2. **Stop sharing** when done
3. **Use incognito** mode for temporary sessions
4. **Don't share** session links publicly

---

## Known Limitations

- Sessions stored in memory (lost on server restart)
- No end-to-end encryption (HTTPS only)
- No persistent user accounts
- No location data retention

---

## Security Headers

The following security headers are set:

```
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
Content-Security-Policy: default-src 'self'
```

---

## Compliance

- ✅ GDPR compliant (no PII stored)
- ✅ CCPA compliant (no data selling)
- ✅ No cookies used
- ✅ No tracking scripts

---

## Security Audit History

| Date | Type | Result | Actions |
|------|------|--------|---------|
| 2024-01 | npm audit | 0 vulnerabilities | - |

---

## Contact

Security concerns: security@example.com  
General inquiries: support@example.com

---

**Last Updated**: January 2024

