import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { LocationContextType, Location, Participant } from '../types';
import { generateUserId, generateDisplayName } from '../utils/userUtils';

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3000';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const UPDATE_INTERVAL = parseInt(import.meta.env.VITE_LOCATION_UPDATE_INTERVAL) || 3000;

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userId] = useState(() => generateUserId());
  const [displayName, setDisplayName] = useState(() => generateDisplayName());
  const [isSharing, setIsSharing] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);

  // Initialize WebSocket
  useEffect(() => {
    const newSocket = io(WS_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    newSocket.on('connect', () => {
      console.log('✅ Connected to server');
      setError(null);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from server');
    });

    newSocket.on('error', (err: any) => {
      console.error('Socket error:', err);
      setError(err.message || 'Connection error');
    });

    // Listen for participant events
    newSocket.on('participant:joined', (data: { userId: string; displayName: string }) => {
      console.log('👤 Participant joined:', data.displayName);
    });

    newSocket.on('participant:left', (data: { userId: string }) => {
      console.log('👋 Participant left:', data.userId);
      setParticipants(prev => prev.filter(p => p.userId !== data.userId));
    });

    // Listen for location broadcasts
    newSocket.on('location:broadcast', (data: Location & { userId: string }) => {
      setParticipants(prev => {
        const existing = prev.find(p => p.userId === data.userId);
        if (existing) {
          return prev.map(p =>
            p.userId === data.userId
              ? {
                  ...p,
                  location: {
                    latitude: data.latitude,
                    longitude: data.longitude,
                    accuracy: data.accuracy,
                    timestamp: data.timestamp
                  },
                  lastUpdate: Date.now()
                }
              : p
          );
        }
        return prev;
      });
    });

    // Listen for initial participants list
    newSocket.on('session:participants', (data: { participants: Participant[] }) => {
      setParticipants(data.participants);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  // Create new session
  const createSession = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creatorId: userId })
      });

      if (!response.ok) throw new Error('Failed to create session');

      const data = await response.json();
      setSessionId(data.sessionId);
      
      // Update URL
      window.history.pushState({}, '', `?session=${data.sessionId}`);

      // Join the session
      if (socket) {
        socket.emit('session:join', {
          sessionId: data.sessionId,
          userId,
          displayName
        });
      }

      return data.sessionId;
    } catch (err) {
      setError('Failed to create session');
      console.error(err);
    }
  }, [socket, userId, displayName]);

  // Join existing session
  const joinSession = useCallback(async (sid: string, name?: string) => {
    try {
      // Verify session exists
      const response = await fetch(`${API_URL}/api/sessions/${sid}`);
      if (!response.ok) throw new Error('Session not found');

      setSessionId(sid);
      if (name) setDisplayName(name);

      if (socket) {
        socket.emit('session:join', {
          sessionId: sid,
          userId,
          displayName: name || displayName
        });
      }
    } catch (err) {
      setError('Failed to join session');
      console.error(err);
    }
  }, [socket, userId, displayName]);

  // Start sharing location
  const startSharing = useCallback(() => {
    if (!sessionId) {
      setError('No active session');
      return;
    }

    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    const successCallback = (position: GeolocationPosition) => {
      const location: Location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp
      };

      setCurrentLocation(location);
      setGpsAccuracy(position.coords.accuracy);
      setError(null);

      // Send to server
      if (socket && sessionId) {
        socket.emit('location:update', {
          sessionId,
          userId,
          ...location
        });
      }
    };

    const errorCallback = (err: GeolocationPositionError) => {
      let message = 'Location error';
      switch (err.code) {
        case err.PERMISSION_DENIED:
          message = 'Location permission denied. Please enable location access.';
          break;
        case err.POSITION_UNAVAILABLE:
          message = 'Location unavailable. Please check your GPS.';
          break;
        case err.TIMEOUT:
          message = 'Location request timeout.';
          break;
      }
      setError(message);
      setIsSharing(false);
    };

    const id = navigator.geolocation.watchPosition(
      successCallback,
      errorCallback,
      options
    );

    setWatchId(id);
    setIsSharing(true);
  }, [socket, sessionId, userId]);

  // Stop sharing location
  const stopSharing = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsSharing(false);
    setCurrentLocation(null);
    setGpsAccuracy(null);
  }, [watchId]);

  // Update display name
  const updateDisplayName = useCallback((name: string) => {
    setDisplayName(name);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  // Auto-start sharing when joining an existing session
  useEffect(() => {
    // Check if we have a session ID but haven't started sharing yet
    if (sessionId && !isSharing && socket) {
      const params = new URLSearchParams(window.location.search);
      const urlSessionId = params.get('session');
      
      // If this session came from URL (someone shared it), auto-start sharing
      if (urlSessionId === sessionId) {
        setTimeout(() => {
          startSharing();
        }, 1500);
      }
    }
  }, [sessionId, isSharing, socket, startSharing]);

  const value: LocationContextType = {
    sessionId,
    userId,
    displayName,
    isSharing,
    currentLocation,
    participants,
    gpsAccuracy,
    error,
    createSession,
    joinSession,
    startSharing,
    stopSharing,
    updateDisplayName
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within LocationProvider');
  }
  return context;
};

