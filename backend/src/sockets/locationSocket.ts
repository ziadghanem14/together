import { Server, Socket } from 'socket.io';
import { sessionService } from '../services/sessionService';
import { LocationUpdate, JoinSessionData, LeaveSessionData } from '../types';

const RATE_LIMIT_MS = 1000; // 1 update per second max
const userLastUpdate = new Map<string, number>();

export function setupSocketHandlers(io: Server) {
  io.on('connection', (socket: Socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Join session
    socket.on('session:join', (data: JoinSessionData) => {
      try {
        const { sessionId, userId, displayName } = data;

        // Validate session exists
        const session = sessionService.getSession(sessionId);
        if (!session) {
          socket.emit('error', { message: 'Session not found or expired' });
          return;
        }

        // Join socket room
        socket.join(sessionId);

        // Add participant
        const participant = sessionService.addParticipant(sessionId, userId, displayName);
        
        if (participant) {
          // Notify others in the session
          socket.to(sessionId).emit('participant:joined', {
            userId,
            displayName,
            timestamp: Date.now()
          });

          // Send current participants to the new joiner
          const participants = sessionService.getActiveParticipants(sessionId);
          socket.emit('session:participants', {
            participants: participants.map(p => ({
              userId: p.userId,
              displayName: p.displayName,
              location: p.location,
              lastUpdate: p.lastUpdate
            }))
          });

          console.log(`✅ ${displayName} joined session ${sessionId}`);
        }
      } catch (error) {
        console.error('Error joining session:', error);
        socket.emit('error', { message: 'Failed to join session' });
      }
    });

    // Leave session
    socket.on('session:leave', (data: LeaveSessionData) => {
      try {
        const { sessionId, userId } = data;

        socket.leave(sessionId);
        sessionService.removeParticipant(sessionId, userId);

        // Notify others
        socket.to(sessionId).emit('participant:left', {
          userId,
          timestamp: Date.now()
        });

        console.log(`👋 User ${userId} left session ${sessionId}`);
      } catch (error) {
        console.error('Error leaving session:', error);
      }
    });

    // Location update
    socket.on('location:update', (data: LocationUpdate) => {
      try {
        const { sessionId, userId, latitude, longitude, accuracy, timestamp } = data;

        // Rate limiting
        const lastUpdate = userLastUpdate.get(userId) || 0;
        const now = Date.now();
        
        if (now - lastUpdate < RATE_LIMIT_MS) {
          return; // Skip this update
        }

        // Validate data
        if (
          typeof latitude !== 'number' ||
          typeof longitude !== 'number' ||
          latitude < -90 || latitude > 90 ||
          longitude < -180 || longitude > 180
        ) {
          socket.emit('error', { message: 'Invalid location data' });
          return;
        }

        // Update location in service
        const updated = sessionService.updateLocation(sessionId, userId, {
          latitude,
          longitude,
          accuracy,
          timestamp
        });

        if (updated) {
          userLastUpdate.set(userId, now);

          // Broadcast to all others in the session
          socket.to(sessionId).emit('location:broadcast', {
            userId,
            latitude,
            longitude,
            accuracy,
            timestamp
          });
        }
      } catch (error) {
        console.error('Error updating location:', error);
        socket.emit('error', { message: 'Failed to update location' });
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
      // Cleanup would happen here if we track socket-to-user mapping
    });
  });

  console.log('✅ Socket.IO handlers configured');
}

