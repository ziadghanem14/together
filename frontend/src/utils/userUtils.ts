const adjectives = [
  'Swift', 'Bold', 'Bright', 'Calm', 'Clever', 'Brave', 'Happy', 'Lucky',
  'Noble', 'Quick', 'Smart', 'Wise', 'Zen', 'Epic', 'Cool', 'Fast'
];

const nouns = [
  'Eagle', 'Tiger', 'Lion', 'Bear', 'Wolf', 'Fox', 'Hawk', 'Panda',
  'Dragon', 'Phoenix', 'Falcon', 'Panther', 'Leopard', 'Jaguar', 'Cobra', 'Viper'
];

export function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function generateDisplayName(): string {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 100);
  return `${adj}${noun}${num}`;
}

export function formatTimestamp(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  return `${Math.floor(seconds / 3600)}h ago`;
}

export function formatAccuracy(accuracy: number): string {
  if (accuracy < 1000) {
    return `±${Math.round(accuracy)}m`;
  }
  return `±${(accuracy / 1000).toFixed(1)}km`;
}

