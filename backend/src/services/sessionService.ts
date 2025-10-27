import { v4 as uuidv4 } from 'uuid';
import { Session, Participant, Location } from '../types';

class SessionService {
  private sessions: Map<string, Session>;
  private readonly SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  private readonly CLEANUP_INTERVAL = 60 * 60 * 1000; // 1 hour

  constructor() {
    this.sessions = new Map();
    this.startCleanupTimer();
  }

  createSession(creatorId: string): Session {
    const sessionId = uuidv4();
    const now = Date.now();
    
    const session: Session = {
      id: sessionId,
      createdAt: now,
      expiresAt: now + this.SESSION_DURATION,
      participants: new Map(),
      creatorId
    };

    this.sessions.set(sessionId, session);
    console.log(`✅ Session created: ${sessionId}`);
    
    return session;
  }

  getSession(sessionId: string): Session | undefined {
    const session = this.sessions.get(sessionId);
    
    if (session && Date.now() > session.expiresAt) {
      this.deleteSession(sessionId);
      return undefined;
    }
    
    return session;
  }

  deleteSession(sessionId: string): boolean {
    const deleted = this.sessions.delete(sessionId);
    if (deleted) {
      console.log(`🗑️ Session deleted: ${sessionId}`);
    }
    return deleted;
  }

  addParticipant(sessionId: string, userId: string, displayName: string): Participant | null {
    const session = this.getSession(sessionId);
    if (!session) return null;

    const participant: Participant = {
      userId,
      displayName,
      location: null,
      lastUpdate: Date.now(),
      isActive: true
    };

    session.participants.set(userId, participant);
    console.log(`👤 Participant added: ${displayName} to session ${sessionId}`);
    
    return participant;
  }

  removeParticipant(sessionId: string, userId: string): boolean {
    const session = this.getSession(sessionId);
    if (!session) return false;

    const removed = session.participants.delete(userId);
    if (removed) {
      console.log(`👋 Participant removed: ${userId} from session ${sessionId}`);
    }
    
    return removed;
  }

  updateLocation(sessionId: string, userId: string, location: Location): boolean {
    const session = this.getSession(sessionId);
    if (!session) return false;

    const participant = session.participants.get(userId);
    if (!participant) return false;

    participant.location = location;
    participant.lastUpdate = Date.now();
    participant.isActive = true;

    return true;
  }

  getParticipants(sessionId: string): Participant[] {
    const session = this.getSession(sessionId);
    if (!session) return [];

    return Array.from(session.participants.values());
  }

  getActiveParticipants(sessionId: string): Participant[] {
    const participants = this.getParticipants(sessionId);
    const now = Date.now();
    const STALE_THRESHOLD = 30 * 1000; // 30 seconds

    return participants.filter(p => {
      const isRecent = (now - p.lastUpdate) < STALE_THRESHOLD;
      return p.isActive && isRecent;
    });
  }

  getAllSessions(): Session[] {
    return Array.from(this.sessions.values());
  }

  getSessionStats() {
    const sessions = this.getAllSessions();
    const totalParticipants = sessions.reduce(
      (sum, session) => sum + session.participants.size,
      0
    );

    return {
      totalSessions: sessions.length,
      totalParticipants,
      activeSessions: sessions.filter(s => s.participants.size > 0).length
    };
  }

  private startCleanupTimer() {
    setInterval(() => {
      const now = Date.now();
      let cleaned = 0;

      for (const [sessionId, session] of this.sessions.entries()) {
        if (now > session.expiresAt) {
          this.deleteSession(sessionId);
          cleaned++;
        }
      }

      if (cleaned > 0) {
        console.log(`🧹 Cleaned up ${cleaned} expired sessions`);
      }
    }, this.CLEANUP_INTERVAL);
  }
}

export const sessionService = new SessionService();

