import { useEffect, useState } from 'react';
import { useLocation } from '../context/LocationContext';

export function useSessionFromUrl(): string | null {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { joinSession } = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sid = params.get('session');

    if (sid) {
      setSessionId(sid);
      joinSession(sid);
    }
  }, [joinSession]);

  return sessionId;
}

