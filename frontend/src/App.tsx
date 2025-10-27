import { useState, useEffect } from 'react';
import { LocationProvider } from './context/LocationContext';
import Map from './components/Map';
import ControlPanel from './components/ControlPanel';
import ParticipantsList from './components/ParticipantsList';
import Header from './components/Header';
import WelcomeModal from './components/WelcomeModal';
import { useSessionFromUrl } from './hooks/useSessionFromUrl';

// Inner component that uses the LocationContext
function AppContent() {
  useSessionFromUrl();

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-50">
      <Header />
      
      <div className="flex-1 flex flex-col lg:flex-row relative">
        {/* Map Container */}
        <div className="flex-1 relative">
          <Map />
        </div>

        {/* Control Panel - Overlay on mobile, sidebar on desktop */}
        <div className="absolute bottom-0 left-0 right-0 lg:relative lg:w-96 lg:h-full z-10">
          <div className="bg-white shadow-lg lg:shadow-none lg:border-l border-gray-200 rounded-t-2xl lg:rounded-none h-full">
            <div className="p-4 lg:p-6 h-full overflow-y-auto">
              <ControlPanel />
              <ParticipantsList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main App component with LocationProvider wrapper
function App() {
  return (
    <LocationProvider>
      <AppContent />
    </LocationProvider>
  );
}

export default App;

