import { Users, MapPin, Clock } from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { formatTimestamp } from '../utils/userUtils';

export default function ParticipantsList() {
  const { participants, userId, displayName, currentLocation } = useLocation();

  // Include current user in the list
  const allParticipants = [
    {
      userId,
      displayName: `${displayName} (You)`,
      location: currentLocation,
      lastUpdate: Date.now(),
      isActive: !!currentLocation
    },
    ...participants.filter(p => p.userId !== userId)
  ];

  const activeCount = allParticipants.filter(p => p.isActive && p.location).length;

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Participants
        </h3>
        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">
          {activeCount} active
        </span>
      </div>

      {allParticipants.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No participants yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {allParticipants.map((participant) => {
            const isStale = participant.location && 
              (Date.now() - participant.lastUpdate > 30000);
            
            return (
              <div
                key={participant.userId}
                className={`bg-white border rounded-lg p-3 transition-all ${
                  participant.location
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          participant.location && !isStale
                            ? 'bg-green-500 animate-pulse'
                            : participant.location && isStale
                            ? 'bg-yellow-500'
                            : 'bg-gray-300'
                        }`}
                      />
                      <span className="font-medium text-gray-900 text-sm truncate">
                        {participant.displayName}
                      </span>
                    </div>

                    {participant.location && (
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <MapPin className="w-3 h-3" />
                          <span>
                            {participant.location.latitude.toFixed(6)}, {participant.location.longitude.toFixed(6)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{formatTimestamp(participant.lastUpdate)}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {participant.location && (
                    <div className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded flex-shrink-0">
                      ±{Math.round(participant.location.accuracy)}m
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

