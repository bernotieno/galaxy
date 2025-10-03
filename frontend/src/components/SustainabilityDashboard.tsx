'use client';

import { useState, useEffect } from 'react';

interface SustainabilityData {
  carbonSequestration: number;
  waterEfficiency: number;
  soilHealth: number;
  biodiversity: number;
  recommendations: string[];
}

export default function SustainabilityDashboard() {
  const [data, setData] = useState<SustainabilityData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sustainability');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Failed to fetch sustainability data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return <div>Loading sustainability metrics...</div>;

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 bg-green-100';
    if (score >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
      <h2 className="text-2xl font-bold text-green-800 mb-4">🌱 Sustainability Metrics</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Carbon Sequestration</div>
          <div className="text-2xl font-bold text-green-600">{data.carbonSequestration.toFixed(1)} t/ha</div>
          <div className="text-xs text-gray-500">Higher is better</div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Water Efficiency</div>
          <div className="text-2xl font-bold text-blue-600">{data.waterEfficiency.toFixed(2)}</div>
          <div className="text-xs text-gray-500">Yield per unit water</div>
        </div>
        
        <div className="bg-amber-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Soil Health</div>
          <div className={`text-2xl font-bold ${getScoreColor(data.soilHealth).split(' ')[0]}`}>
            {Math.round(data.soilHealth * 100)}%
          </div>
          <div className="text-xs text-gray-500">Fertility index</div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Biodiversity</div>
          <div className={`text-2xl font-bold ${getScoreColor(data.biodiversity).split(' ')[0]}`}>
            {Math.round(data.biodiversity * 100)}%
          </div>
          <div className="text-xs text-gray-500">Crop diversity</div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">🎯 Sustainability Recommendations</h3>
        <div className="space-y-1">
          {data.recommendations.map((rec, index) => (
            <p key={index} className="text-sm text-gray-700">• {rec}</p>
          ))}
        </div>
      </div>
    </div>
  );
}