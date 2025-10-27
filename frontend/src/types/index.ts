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
}

export interface LocationContextType {
  sessionId: string | null;
  userId: string;
  displayName: string;
  isSharing: boolean;
  currentLocation: Location | null;
  participants: Participant[];
  gpsAccuracy: number | null;
  error: string | null;
  createSession: () => Promise<void>;
  joinSession: (sessionId: string, displayName?: string) => Promise<void>;
  startSharing: () => void;
  stopSharing: () => void;
  updateDisplayName: (name: string) => void;
}

