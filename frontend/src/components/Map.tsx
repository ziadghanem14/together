import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useLocation } from '../context/LocationContext';
import { Locate } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom user marker icon (blue)
const userIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40">
      <circle cx="12" cy="12" r="10" fill="#3b82f6" stroke="white" stroke-width="2"/>
      <circle cx="12" cy="12" r="4" fill="white"/>
    </svg>
  `),
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

// Custom participant marker icon (green)
const participantIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36">
      <circle cx="12" cy="12" r="10" fill="#10b981" stroke="white" stroke-width="2"/>
      <circle cx="12" cy="12" r="4" fill="white"/>
    </svg>
  `),
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -18],
});

// Component to handle map centering
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
}

export default function Map() {
  const { currentLocation, participants, userId } = useLocation();
  const [mapCenter, setMapCenter] = useState<[number, number]>([30, 0]);
  const [mapZoom, setMapZoom] = useState(2);
  const mapRef = useRef<L.Map | null>(null);

  // Update map center when user location changes
  useEffect(() => {
    if (currentLocation) {
      setMapCenter([currentLocation.latitude, currentLocation.longitude]);
      setMapZoom(15);
    }
  }, [currentLocation]);

  const recenterMap = () => {
    if (currentLocation) {
      setMapCenter([currentLocation.latitude, currentLocation.longitude]);
      setMapZoom(15);
    }
  };

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        className="w-full h-full"
        ref={mapRef}
        zoomControl={true}
      >
        {/* OpenStreetMap Tile Layer - FREE! */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Map controller for centering */}
        <MapController center={mapCenter} zoom={mapZoom} />

        {/* User's location marker */}
        {currentLocation && (
          <>
            <Marker
              position={[currentLocation.latitude, currentLocation.longitude]}
              icon={userIcon}
            >
              <Popup>
                <strong>You</strong><br />
                Accuracy: ±{Math.round(currentLocation.accuracy)}m
              </Popup>
            </Marker>

            {/* Accuracy circle */}
            <Circle
              center={[currentLocation.latitude, currentLocation.longitude]}
              radius={currentLocation.accuracy}
              pathOptions={{
                color: '#3b82f6',
                fillColor: '#3b82f6',
                fillOpacity: 0.1,
                weight: 2,
              }}
            />
          </>
        )}

        {/* Participants' markers */}
        {participants.map((participant) => {
          if (!participant.location || participant.userId === userId) return null;

          return (
            <Marker
              key={participant.userId}
              position={[participant.location.latitude, participant.location.longitude]}
              icon={participantIcon}
            >
              <Popup>
                <strong>{participant.displayName}</strong><br />
                Accuracy: ±{Math.round(participant.location.accuracy)}m
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Recenter button */}
      {currentLocation && (
        <button
          onClick={recenterMap}
          className="absolute bottom-24 lg:bottom-6 right-6 bg-white hover:bg-gray-50 text-blue-600 p-3 rounded-full shadow-lg transition-all hover:scale-110 z-[1000]"
          title="Center on my location"
        >
          <Locate className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
