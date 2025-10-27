import { useState } from 'react';
import { Share2, StopCircle, Link as LinkIcon, Copy, Check, AlertCircle } from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { formatAccuracy } from '../utils/userUtils';

export default function ControlPanel() {
  const {
    sessionId,
    isSharing,
    gpsAccuracy,
    error,
    createSession,
    startSharing,
    stopSharing
  } = useLocation();

  const [copied, setCopied] = useState(false);

  const handleCreateSessionAndShare = async () => {
    const newSessionId = await createSession();
    if (newSessionId) {
      // Auto-start sharing after creating session
      setTimeout(() => {
        startSharing();
      }, 500);
    }
  };

  const handleToggleSharing = () => {
    if (isSharing) {
      stopSharing();
    } else {
      startSharing();
    }
  };

  const shareUrl = sessionId 
    ? `${window.location.origin}?session=${sessionId}`
    : '';

  const copyShareLink = async () => {
    if (shareUrl) {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Control Panel</h2>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Session Creation */}
      {!sessionId && (
        <button
          onClick={handleCreateSessionAndShare}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center gap-2"
        >
          <Share2 className="w-5 h-5" />
          Start Sharing Location
        </button>
      )}

      {/* Sharing Toggle */}
      {sessionId && (
        <>
          <button
            onClick={handleToggleSharing}
            className={`w-full font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 ${
              isSharing
                ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
                : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
            }`}
          >
            {isSharing ? (
              <>
                <StopCircle className="w-5 h-5" />
                Stop Sharing
              </>
            ) : (
              <>
                <Share2 className="w-5 h-5" />
                Share My Location
              </>
            )}
          </button>

          {/* GPS Accuracy */}
          {isSharing && gpsAccuracy !== null && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">GPS Accuracy</span>
                <span className="text-sm font-bold text-blue-700">
                  {formatAccuracy(gpsAccuracy)}
                </span>
              </div>
              <div className="mt-2 h-2 bg-blue-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all"
                  style={{
                    width: `${Math.max(10, Math.min(100, 100 - (gpsAccuracy / 50) * 100))}%`
                  }}
                />
              </div>
            </div>
          )}

          {/* Share Link */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <LinkIcon className="w-4 h-4" />
              Share Link
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={copyShareLink}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors flex-shrink-0"
                title="Copy link"
              >
                {copied ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
            {copied && (
              <p className="text-xs text-green-600 font-medium">✓ Link copied to clipboard!</p>
            )}
          </div>

          {/* Privacy Warning */}
          {isSharing && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs text-amber-800">
                <strong>🔒 Privacy Notice:</strong> Your location is being shared with participants in this session. 
                Stop sharing at any time using the button above.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

