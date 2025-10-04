'use client';

import { useState } from 'react';

interface Livestock {
  id: number;
  type: string;
  count: number;
  health: number;
  productivity: number;
  feedNeed: number;
  waterNeed: number;
}

interface LivestockManagerProps {
  livestock: Livestock[];
  onManage: (action: string, type: string, count: number) => void;
}

export default function LivestockManager({ livestock, onManage }: LivestockManagerProps) {
  const [selectedType, setSelectedType] = useState<string>('cattle');

  const getTypeEmoji = (type: string) => {
    const emojis: Record<string, string> = {
      cattle: '🐄',
      chickens: '🐔',
      sheep: '🐑',
      pigs: '🐷'
    };
    return emojis[type] || '🐾';
  };

  const getHealthColor = (health: number) => {
    if (health >= 0.8) return 'text-green-600';
    if (health >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
      <h2 className="text-2xl font-bold text-purple-800 mb-4">🐄 Livestock Management</h2>
      
      <div className="space-y-4 mb-6">
        {livestock.map((animal) => (
          <div key={animal.id} className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getTypeEmoji(animal.type)}</span>
                <div>
                  <div className="font-semibold capitalize">{animal.type}</div>
                  <div className="text-sm text-gray-600">Count: {animal.count}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-medium ${getHealthColor(animal.health)}`}>
                  Health: {Math.round(animal.health * 100)}%
                </div>
                <div className="text-sm text-gray-600">
                  Productivity: {Math.round(animal.productivity * 100)}%
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Feed Need: {animal.feedNeed} kg/day</div>
              <div>Water Need: {animal.waterNeed} L/day</div>
            </div>
            
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => onManage('feed', animal.type, animal.count)}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                🌾 Feed ($10/head)
              </button>
              <button
                onClick={() => onManage('water', animal.type, animal.count)}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                💧 Water ($5/head)
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
        <h3 className="font-semibold text-purple-800 mb-2">🌱 Sustainable Practices</h3>
        <ul className="text-sm text-purple-700 space-y-1">
          <li>• Rotational grazing improves soil health</li>
          <li>• Proper nutrition reduces methane emissions</li>
          <li>• Water efficiency saves resources</li>
          <li>• Healthy animals are more productive</li>
        </ul>
      </div>
    </div>
  );
}