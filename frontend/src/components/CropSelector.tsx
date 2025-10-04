'use client';

import { useState, useEffect } from 'react';
import { CropInfo, NASAData } from '@/types';
import { fetchCrops } from '@/lib/api';

interface CropSelectorProps {
  selectedCrop: string;
  onCropSelect: (crop: string) => void;
  nasaData: NASAData | null;
}

export default function CropSelector({ selectedCrop, onCropSelect, nasaData }: CropSelectorProps) {
  const [crops, setCrops] = useState<Record<string, CropInfo>>({});

  useEffect(() => {
    const loadCrops = async () => {
      try {
        const data = await fetchCrops();
        setCrops(data);
      } catch (error) {
        console.error('Failed to load crops:', error);
      }
    };
    loadCrops();
  }, []);

  const getCropSuitability = (crop: CropInfo) => {
    if (!nasaData) return 'unknown';
    
    const temp = nasaData.weather.temperature;
    const moisture = nasaData.soil.surfaceMoisture / 100;
    
    let score = 0;
    
    // Temperature suitability
    if (temp >= crop.tempMin && temp <= crop.tempMax) {
      score += 40;
    } else {
      const tempDiff = Math.min(Math.abs(temp - crop.tempMin), Math.abs(temp - crop.tempMax));
      score += Math.max(0, 40 - tempDiff * 5);
    }
    
    // Moisture suitability
    if (moisture >= crop.waterNeed) {
      score += 40;
    } else {
      score += (moisture / crop.waterNeed) * 40;
    }
    
    // Base score
    score += 20;
    
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'fair';
    return 'poor';
  };

  const getSuitabilityColor = (suitability: string) => {
    switch (suitability) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'fair': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-green-800">Select Crop</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(crops).map(([key, crop]) => {
          const suitability = getCropSuitability(crop);
          return (
            <button
              key={key}
              onClick={() => onCropSelect(key)}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                selectedCrop === key
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 hover:border-green-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">{crop.emoji}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${getSuitabilityColor(suitability)}`}>
                  {suitability}
                </span>
              </div>
              <div className="font-medium text-gray-800">{crop.name}</div>
              <div className="text-sm text-gray-600">
                ${crop.cost} • {crop.growthTime} days
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {crop.tempMin}-{crop.tempMax}°C • {Math.round(crop.waterNeed * 100)}% water
              </div>
            </button>
          );
        })}
      </div>
      
      {selectedCrop && crops[selectedCrop] && (
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">
            {crops[selectedCrop].emoji} {crops[selectedCrop].name} Details
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Cost: ${crops[selectedCrop].cost}</div>
            <div>Growth Time: {crops[selectedCrop].growthTime} days</div>
            <div>Water Need: {Math.round(crops[selectedCrop].waterNeed * 100)}%</div>
            <div>Base Yield: {crops[selectedCrop].baseYield} units</div>
          </div>
        </div>
      )}
    </div>
  );
}