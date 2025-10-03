'use client';

import { useState } from 'react';

interface LocationSelectorProps {
  onLocationSelect: (location: string, coordinates: { lat: number; lon: number }) => void;
  selectedLocation: string;
}

export default function LocationSelector({ onLocationSelect, selectedLocation }: LocationSelectorProps) {
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser');
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        onLocationSelect('current', { lat, lon });
        setIsGettingLocation(false);
        
        // Optional: Get location name using reverse geocoding
        fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=YOUR_API_KEY`)
          .then(response => response.json())
          .then(data => {
            if (data.length > 0) {
              console.log(`Current location: ${data[0].name}, ${data[0].country}`);
            }
          })
          .catch(error => console.log('Reverse geocoding failed:', error));
      },
      (error) => {
        setIsGettingLocation(false);
        switch(error.code) {
          case error.PERMISSION_DENIED:
            alert('Location access denied. Please enable location permissions.');
            break;
          case error.POSITION_UNAVAILABLE:
            alert('Location information unavailable.');
            break;
          case error.TIMEOUT:
            alert('Location request timed out.');
            break;
          default:
            alert('An unknown error occurred while getting location.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  return (
    <div className="mb-4">
      <button
        onClick={getCurrentLocation}
        disabled={isGettingLocation}
        className={`w-full p-3 rounded-lg border-2 transition-all ${
          selectedLocation === 'current'
            ? 'border-green-500 bg-green-50'
            : 'border-blue-300 hover:border-blue-500 bg-blue-50'
        } ${isGettingLocation ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="flex items-center justify-center gap-2">
          <span className="text-xl">📍</span>
          <div>
            <div className="font-semibold text-blue-800">
              {isGettingLocation ? 'Getting Location...' : 'Use My Current Location'}
            </div>
            <div className="text-sm text-blue-600">
              {isGettingLocation ? 'Please allow location access' : 'Get real NASA data for your area'}
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}