import { MapPin } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MapPin className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold">Together</h1>
            <p className="text-xs text-blue-100">Share Your Location, Stay Connected</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Secure & Private</span>
          </div>
        </div>
      </div>
    </header>
  );
}

