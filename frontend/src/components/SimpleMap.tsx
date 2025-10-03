'use client';

interface SimpleMapProps {
  onLocationSelect: (location: string, coordinates: { lat: number; lon: number }) => void;
  selectedLocation: string;
}

const locations = {
  iowa: { name: 'Iowa Corn Belt', lat: 42.0308, lon: -93.6319, climate: 'Continental' },
  california: { name: 'Central Valley', lat: 36.7783, lon: -119.4179, climate: 'Mediterranean' },
  kansas: { name: 'Great Plains', lat: 38.5266, lon: -96.7265, climate: 'Semi-arid' },
  nebraska: { name: 'Corn Belt', lat: 41.1254, lon: -98.2681, climate: 'Continental' }
};

export default function SimpleMap({ onLocationSelect, selectedLocation }: SimpleMapProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-blue-800">Farm Locations</h3>
      
      <div className="grid grid-cols-1 gap-2">
        {Object.entries(locations).map(([key, location]) => (
          <button
            key={key}
            onClick={() => onLocationSelect(key, { lat: location.lat, lon: location.lon })}
            className={`p-3 rounded-lg border-2 text-left transition-all ${
              selectedLocation === key
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="font-semibold text-gray-800">{location.name}</div>
            <div className="text-sm text-gray-600">{location.climate}</div>
            <div className="text-xs text-gray-500">
              {location.lat.toFixed(2)}, {location.lon.toFixed(2)}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}