'use client';

import { useState } from 'react';
import { NASAData } from '@/types';

interface DataDashboardProps {
  nasaData: NASAData;
}

export default function DataDashboard({ nasaData }: DataDashboardProps) {
  const [activeTab, setActiveTab] = useState<'weather' | 'soil' | 'vegetation'>('weather');

  const getRecommendations = () => {
    const recommendations = [];
    
    // Check if APIs are available before making recommendations
    if (nasaData.weather.source === 'API Error' || nasaData.weather.source === 'API Unavailable') {
      recommendations.push('⚠️ Weather data unavailable. Configure OpenWeatherMap API key.');
    }
    
    if (nasaData.soil.source === 'API Error' || nasaData.soil.source === 'API Unavailable') {
      recommendations.push('⚠️ Soil data unavailable. Check USDA API connection.');
    }
    
    if (nasaData.vegetation.source === 'API Error' || nasaData.vegetation.source === 'API Unavailable') {
      recommendations.push('⚠️ Vegetation data unavailable. Giovanni API required.');
    }
    
    // Only provide agricultural recommendations if data is available
    if (nasaData.soil.surfaceMoisture && nasaData.soil.surfaceMoisture < 40) {
      recommendations.push('🚨 Low soil moisture detected. Consider irrigation.');
    }
    
    if (nasaData.weather.temperature && nasaData.weather.temperature > 28) {
      recommendations.push('🌡️ High temperatures may stress crops.');
    }
    
    if (nasaData.precipitation.dailyPrecipitation && nasaData.precipitation.dailyPrecipitation < 10) {
      recommendations.push('☔ Low precipitation forecast. Plan irrigation.');
    }
    
    if (nasaData.vegetation.ndvi && nasaData.vegetation.ndvi < 0.5) {
      recommendations.push('📊 NDVI indicates poor vegetation health.');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('✅ Configure API keys for real-time recommendations.');
    }
    
    return recommendations;
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-blue-800">🛰️ NASA Satellite Data</h2>
        <div className="text-right">
          <div className="text-sm font-medium text-gray-700">{nasaData.location?.city || 'Unknown'}, {nasaData.location?.region || 'Unknown'}</div>
          <div className="text-xs text-gray-500">{nasaData.location?.zone || 'Unknown Zone'}</div>
        </div>
      </div>
      
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
        {(['weather', 'soil', 'vegetation'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-4 rounded-md transition-all ${
              activeTab === tab
                ? 'bg-white shadow-sm text-blue-600 font-medium'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'weather' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Climate Conditions</h3>
          {nasaData.weather.source === 'API Error' || nasaData.weather.source === 'API Unavailable' ? (
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <div className="text-red-600 font-medium">Weather Data Unavailable</div>
              <div className="text-sm text-red-500 mt-2">Configure OpenWeatherMap API key</div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Temperature</div>
                <div className="text-xl font-bold text-blue-600">{nasaData.weather.temperature || 0}°C</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Humidity</div>
                <div className="text-xl font-bold text-blue-600">{nasaData.weather.humidity || 0}%</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Wind Speed</div>
                <div className="text-xl font-bold text-blue-600">{nasaData.weather.windSpeed || 0} km/h</div>
              </div>
            </div>
          )}
          <div className="text-xs text-gray-500">Source: {nasaData.weather.source}</div>
        </div>
      )}

      {activeTab === 'soil' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Soil Analysis</h3>
          {nasaData.soil.source === 'API Error' || nasaData.soil.source === 'API Unavailable' ? (
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <div className="text-red-600 font-medium">Soil Data Unavailable</div>
              <div className="text-sm text-red-500 mt-2">USDA API connection required</div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-amber-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Surface Moisture</div>
                <div className="text-xl font-bold text-amber-600">{nasaData.soil.surfaceMoisture || 0}%</div>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Soil Temperature</div>
                <div className="text-xl font-bold text-amber-600">{nasaData.soil.soilTemperature || 0}°C</div>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">pH Level</div>
                <div className="text-xl font-bold text-amber-600">{(nasaData.soil.pH || 0).toFixed(1)}</div>
              </div>
            </div>
          )}
          <div className="text-xs text-gray-500">Source: {nasaData.soil.source} ({nasaData.soil.resolution})</div>
        </div>
      )}

      {activeTab === 'vegetation' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Vegetation Health (NDVI)</h3>
          {nasaData.vegetation.source === 'API Error' || nasaData.vegetation.source === 'API Unavailable' ? (
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <div className="text-red-600 font-medium">Vegetation Data Unavailable</div>
              <div className="text-sm text-red-500 mt-2">Giovanni API access required</div>
            </div>
          ) : (
            <>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">{(nasaData.vegetation.ndvi || 0).toFixed(3)}</div>
                <div className="text-lg text-gray-600">{nasaData.vegetation.vegetationHealth || 'Unknown'}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">EVI</div>
                  <div className="text-xl font-bold text-green-600">{(nasaData.vegetation.evi || 0).toFixed(3)}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">LAI</div>
                  <div className="text-xl font-bold text-green-600">{(nasaData.vegetation.lai || 0).toFixed(2)}</div>
                </div>
              </div>
            </>
          )}
          <div className="text-xs text-gray-500">Source: {nasaData.vegetation.source} ({nasaData.vegetation.resolution})</div>
        </div>
      )}

      <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">🤖 AI Recommendations</h3>
        <div className="space-y-2">
          {getRecommendations().map((rec, index) => (
            <p key={index} className="text-sm text-gray-700">{rec}</p>
          ))}
        </div>
      </div>
    </div>
  );
}