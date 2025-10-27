export interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface Participant {
  userId: string;
  displayName: string;
  location: Location | null;
  lastUpdate: number;
  isActive: boolean;
}

export interface Session {
  id: string;
  createdAt: number;
  expiresAt: number;
  participants: Map<string, Participant>;
  creatorId: string;
}

export interface LocationUpdate {
  sessionId: string;
  userId: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface JoinSessionData {
  sessionId: string;
  userId: string;
  displayName: string;
}

export interface LeaveSessionData {
  sessionId: string;
  userId: string;
}

