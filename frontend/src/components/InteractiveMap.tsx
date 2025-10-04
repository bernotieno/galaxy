'use client';

import { useState, useEffect } from 'react';
import { MapData } from '@/types';
import { fetchMapLocations, fetchNASAData } from '@/lib/api';

interface InteractiveMapProps {
  onLocationSelect: (location: string, coordinates: { lat: number; lon: number }) => void;
  selectedLocation: string;
}

export default function InteractiveMap({ onLocationSelect, selectedLocation }: InteractiveMapProps) {
  const [locations, setLocations] = useState<Record<string, MapData>>({});

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const data = await fetchMapLocations();
        setLocations(data);
      } catch (error) {
        console.error('Failed to load map locations:', error);
      }
    };
    loadLocations();
  }, []);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
      <h2 className="text-2xl font-bold text-green-800 mb-4">🗺️ Farm Locations</h2>
      
      <div className="relative bg-gradient-to-br from-green-100 to-blue-100 rounded-xl p-4 h-64 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-200/30 to-blue-200/30"></div>
        
        {Object.entries(locations).map(([key, location]) => (
          <button
            key={key}
            onClick={() => onLocationSelect(key, location.coordinates)}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 transition-all hover:scale-150 ${
              selectedLocation === key 
                ? 'bg-red-500 border-red-700 animate-pulse' 
                : 'bg-yellow-400 border-yellow-600 hover:bg-yellow-500'
            }`}
            style={{
              left: `${((location.coordinates.lon + 125) / 60) * 100}%`,
              top: `${((50 - location.coordinates.lat) / 25) * 100}%`
            }}
            title={location.region}
          />
        ))}
      </div>
      
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        {Object.entries(locations).map(([key, location]) => (
          <button
            key={key}
            onClick={() => onLocationSelect(key, location.coordinates)}
            className={`p-3 rounded-lg border-2 text-left transition-all ${
              selectedLocation === key
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
            }`}
          >
            <div className="font-semibold text-green-800">{location.region}</div>
            <div className="text-sm text-gray-600">{location.climate} • {location.soilType}</div>
            <div className="text-xs text-gray-500">{location.elevation}m elevation</div>
          </button>
        ))}
      </div>
    </div>
  );
}