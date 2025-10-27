# 📡 API Documentation

Complete API reference for LiveShare backend.

## Base URL

- **Development**: `http://localhost:3000`
- **Production**: `https://your-domain.com`

---

## REST API Endpoints

### Sessions

#### Create Session

Create a new location sharing session.

**Endpoint**: `POST /api/sessions`

**Request**:
```json
{
  "creatorId": "user_12345"
}
```

**Response** (201 Created):
```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": 1704067200000,
  "expiresAt": 1704153600000
}
```

**Error Responses**:
- `400 Bad Request`: Missing creatorId
- `500 Internal Server Error`: Server error

---

#### Get Session Info

Retrieve session details.

**Endpoint**: `GET /api/sessions/:sessionId`

**Response** (200 OK):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": 1704067200000,
  "expiresAt": 1704153600000,
  "participantCount": 3
}
```

**Error Responses**:
- `404 Not Found`: Session not found or expired
- `500 Internal Server Error`: Server error

---

#### Get Participants

Get all active participants in a session.

**Endpoint**: `GET /api/sessions/:sessionId/participants`

**Response** (200 OK):
```json
{
  "participants": [
    {
      "userId": "user_123",
      "displayName": "BoldEagle42",
      "location": {
        "latitude": 40.7128,
        "longitude": -74.0060,
        "accuracy": 15,
        "timestamp": 1704067200000
      },
      "lastUpdate": 1704067200000,
      "isActive": true
    },
    {
      "userId": "user_456",
      "displayName": "SwiftTiger89",
      "location": {
        "latitude": 40.7580,
        "longitude": -73.9855,
        "accuracy": 20,
        "timestamp": 1704067195000
      },
      "lastUpdate": 1704067195000,
      "isActive": true
    }
  ]
}
```

**Error Responses**:
- `404 Not Found`: Session not found
- `500 Internal Server Error`: Server error

---

#### Delete Session

Delete a session and all its data.

**Endpoint**: `DELETE /api/sessions/:sessionId`

**Response** (200 OK):
```json
{
  "message": "Session deleted successfully"
}
```

**Error Responses**:
- `404 Not Found`: Session not found
- `500 Internal Server Error`: Server error

---

### Admin/Debug

#### Get Server Stats

Get server statistics (sessions, participants).

**Endpoint**: `GET /api/sessions/admin/stats`

**Response** (200 OK):
```json
{
  "totalSessions": 42,
  "totalParticipants": 127,
  "activeSessions": 15
}
```

---

### Health Check

Check if server is running.

**Endpoint**: `GET /health`

**Response** (200 OK):
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

## WebSocket API

### Connection

Connect to WebSocket server.

**URL**: `ws://localhost:3000` or `wss://your-domain.com`

**Client**:
```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  transports: ['websocket', 'polling'],
  reconnection: true
});

socket.on('connect', () => {
  console.log('Connected:', socket.id);
});
```

---

### Events (Client → Server)

#### session:join

Join a session.

**Emit**:
```javascript
socket.emit('session:join', {
  sessionId: '550e8400-e29b-41d4-a716-446655440000',
  userId: 'user_123',
  displayName: 'BoldEagle42'
});
```

**Server Response**:
- Joins the socket room for the session
- Sends `session:participants` event with current participants
- Broadcasts `participant:joined` to other participants

---

#### location:update

Update your location.

**Emit**:
```javascript
socket.emit('location:update', {
  sessionId: '550e8400-e29b-41d4-a716-446655440000',
  userId: 'user_123',
  latitude: 40.7128,
  longitude: -74.0060,
  accuracy: 15,
  timestamp: Date.now()
});
```

**Rate Limit**: Max 1 update per second

**Validation**:
- `latitude`: -90 to 90
- `longitude`: -180 to 180
- `accuracy`: positive number

**Server Response**:
- Broadcasts `location:broadcast` to other participants in session

---

#### session:leave

Leave a session.

**Emit**:
```javascript
socket.emit('session:leave', {
  sessionId: '550e8400-e29b-41d4-a716-446655440000',
  userId: 'user_123'
});
```

**Server Response**:
- Removes from socket room
- Broadcasts `participant:left` to other participants

---

### Events (Server → Client)

#### session:participants

Sent when joining a session. Contains all current participants.

**Listen**:
```javascript
socket.on('session:participants', (data) => {
  console.log('Participants:', data.participants);
  // data.participants: Array<Participant>
});
```

**Data**:
```json
{
  "participants": [
    {
      "userId": "user_123",
      "displayName": "BoldEagle42",
      "location": {
        "latitude": 40.7128,
        "longitude": -74.0060,
        "accuracy": 15,
        "timestamp": 1704067200000
      },
      "lastUpdate": 1704067200000
    }
  ]
}
```

---

#### participant:joined

Broadcast when a new participant joins.

**Listen**:
```javascript
socket.on('participant:joined', (data) => {
  console.log('Participant joined:', data);
});
```

**Data**:
```json
{
  "userId": "user_456",
  "displayName": "SwiftTiger89",
  "timestamp": 1704067200000
}
```

---

#### location:broadcast

Broadcast when a participant updates their location.

**Listen**:
```javascript
socket.on('location:broadcast', (data) => {
  console.log('Location update:', data);
  // Update map marker for this user
});
```

**Data**:
```json
{
  "userId": "user_123",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "accuracy": 15,
  "timestamp": 1704067200000
}
```

---

#### participant:left

Broadcast when a participant leaves.

**Listen**:
```javascript
socket.on('participant:left', (data) => {
  console.log('Participant left:', data.userId);
  // Remove marker from map
});
```

**Data**:
```json
{
  "userId": "user_123",
  "timestamp": 1704067200000
}
```

---

#### error

Error event from server.

**Listen**:
```javascript
socket.on('error', (data) => {
  console.error('Error:', data.message);
});
```

**Data**:
```json
{
  "message": "Session not found or expired"
}
```

---

## TypeScript Types

```typescript
interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

interface Participant {
  userId: string;
  displayName: string;
  location: Location | null;
  lastUpdate: number;
  isActive: boolean;
}

interface Session {
  id: string;
  createdAt: number;
  expiresAt: number;
  participants: Map<string, Participant>;
  creatorId: string;
}

interface LocationUpdate {
  sessionId: string;
  userId: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

interface JoinSessionData {
  sessionId: string;
  userId: string;
  displayName: string;
}

interface LeaveSessionData {
  sessionId: string;
  userId: string;
}
```

---

## Rate Limiting

### REST API
- **Window**: 15 minutes
- **Max Requests**: 100 per IP
- **Response**: 429 Too Many Requests

### WebSocket
- **Location Updates**: Max 1 per second per user
- **Behavior**: Silently drops excess updates

---

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid parameters |
| 404 | Not Found - Session doesn't exist |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

---

## Examples

### Complete Flow (JavaScript)

```javascript
import { io } from 'socket.io-client';

// 1. Create session
const response = await fetch('http://localhost:3000/api/sessions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ creatorId: 'user_123' })
});
const { sessionId } = await response.json();

// 2. Connect WebSocket
const socket = io('http://localhost:3000');

// 3. Join session
socket.emit('session:join', {
  sessionId,
  userId: 'user_123',
  displayName: 'BoldEagle42'
});

// 4. Listen for participants
socket.on('session:participants', (data) => {
  console.log('Current participants:', data.participants);
});

// 5. Watch location
navigator.geolocation.watchPosition((position) => {
  socket.emit('location:update', {
    sessionId,
    userId: 'user_123',
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    accuracy: position.coords.accuracy,
    timestamp: Date.now()
  });
});

// 6. Listen for broadcasts
socket.on('location:broadcast', (data) => {
  console.log('User moved:', data.userId, data.latitude, data.longitude);
});
```

---

## Testing with cURL

```bash
# Create session
curl -X POST http://localhost:3000/api/sessions \
  -H "Content-Type: application/json" \
  -d '{"creatorId":"user_123"}'

# Get session
curl http://localhost:3000/api/sessions/YOUR_SESSION_ID

# Get participants
curl http://localhost:3000/api/sessions/YOUR_SESSION_ID/participants

# Delete session
curl -X DELETE http://localhost:3000/api/sessions/YOUR_SESSION_ID

# Health check
curl http://localhost:3000/health
```

---

**Need help?** Open an issue on GitHub!

