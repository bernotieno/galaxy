'use client';

import { useState, useEffect } from 'react';
import { NASAData } from '@/types';

interface InteractiveDataDashboardProps {
  nasaData: NASAData;
}

export default function InteractiveDataDashboard({ nasaData }: InteractiveDataDashboardProps) {
  const [activeTab, setActiveTab] = useState<'weather' | 'soil' | 'vegetation'>('weather');
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({});
  const [alerts, setAlerts] = useState<string[]>([]);

  useEffect(() => {
    // Animate value changes
    const newAnimatedValues: Record<string, number> = {};
    
    if (nasaData) {
      // Animate temperature
      animateValue('temperature', nasaData.weather.temperature, newAnimatedValues);
      animateValue('humidity', nasaData.weather.humidity, newAnimatedValues);
      animateValue('soilMoisture', nasaData.soil.surfaceMoisture, newAnimatedValues);
      animateValue('ndvi', nasaData.vegetation.ndvi * 100, newAnimatedValues);
    }
    
    setAnimatedValues(newAnimatedValues);
    
    // Generate alerts
    generateAlerts();
  }, [nasaData]);

  const animateValue = (key: string, targetValue: number, values: Record<string, number>) => {
    const currentValue = animatedValues[key] || targetValue;
    const step = (targetValue - currentValue) / 10;
    
    let current = currentValue;
    const interval = setInterval(() => {
      current += step;
      values[key] = current;
      setAnimatedValues(prev => ({ ...prev, [key]: current }));
      
      if (Math.abs(current - targetValue) < 0.1) {
        clearInterval(interval);
        values[key] = targetValue;
        setAnimatedValues(prev => ({ ...prev, [key]: targetValue }));
      }
    }, 50);
  };

  const generateAlerts = () => {
    const newAlerts: string[] = [];
    
    if (nasaData.soil.surfaceMoisture < 30) {
      newAlerts.push('🚨 Low soil moisture detected!');
    }
    if (nasaData.weather.temperature > 35) {
      newAlerts.push('🔥 Extreme heat warning!');
    }
    if (nasaData.vegetation.ndvi < 0.4) {
      newAlerts.push('📉 Poor vegetation health detected!');
    }
    if (nasaData.precipitation.dailyPrecipitation > 50) {
      newAlerts.push('🌊 Heavy rainfall alert!');
    }
    
    setAlerts(newAlerts);
  };

  const getValueColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return 'text-green-600';
    if (value >= thresholds.warning) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressBarColor = (value: number, max: number) => {
    const percentage = (value / max) * 100;
    if (percentage >= 70) return 'bg-green-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-800">🛰️ Live NASA Data</h2>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Live</span>
        </div>
      </div>

      {/* Alert Banner */}
      {alerts.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg animate-pulse">
          <div className="font-semibold text-red-800 mb-1">⚠️ Active Alerts</div>
          {alerts.map((alert, index) => (
            <div key={index} className="text-sm text-red-700">{alert}</div>
          ))}
        </div>
      )}

      {/* Interactive Tabs */}
      <div className="flex mb-8 bg-gray-100 rounded-xl p-2">
        {(['weather', 'soil', 'vegetation'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 px-6 rounded-lg transition-all duration-300 text-lg ${
              activeTab === tab
                ? 'bg-white shadow-sm text-blue-600 font-medium transform scale-105'
                : 'text-gray-600 hover:text-blue-600 hover:bg-white/50'
            }`}
          >
            {tab === 'weather' && '🌡️'} 
            {tab === 'soil' && '🌱'} 
            {tab === 'vegetation' && '📊'}
            {' '}{tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Weather Tab */}
      {activeTab === 'weather' && (
        <div className="space-y-6 animate-fadeIn">
          <h3 className="text-xl font-semibold text-gray-800">Climate Conditions</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div className="text-base text-gray-600 mb-2">Temperature</div>
              <div className={`text-4xl font-bold ${getValueColor(nasaData.weather.temperature, { good: 20, warning: 15 })}`}>
                {Math.round(animatedValues.temperature || nasaData.weather.temperature)}°C
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-1000 ${getProgressBarColor(nasaData.weather.temperature, 40)}`}
                  style={{ width: `${Math.min((nasaData.weather.temperature / 40) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-4 rounded-lg hover:shadow-md transition-shadow">
              <div className="text-sm text-gray-600">Humidity</div>
              <div className={`text-3xl font-bold ${getValueColor(nasaData.weather.humidity, { good: 50, warning: 30 })}`}>
                {Math.round(animatedValues.humidity || nasaData.weather.humidity)}%
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-cyan-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${nasaData.weather.humidity}%` }}
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg hover:shadow-md transition-shadow">
              <div className="text-sm text-gray-600">Wind Speed</div>
              <div className="text-3xl font-bold text-gray-600">{nasaData.weather.windSpeed} km/h</div>
              <div className="text-xs text-gray-500 mt-1">
                {nasaData.weather.windSpeed > 20 ? 'High' : nasaData.weather.windSpeed > 10 ? 'Moderate' : 'Low'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Soil Tab */}
      {activeTab === 'soil' && (
        <div className="space-y-4 animate-fadeIn">
          <h3 className="text-lg font-semibold text-gray-800">Soil Analysis</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg hover:shadow-md transition-shadow">
              <div className="text-sm text-gray-600">Surface Moisture</div>
              <div className={`text-3xl font-bold ${getValueColor(nasaData.soil.surfaceMoisture, { good: 50, warning: 30 })}`}>
                {Math.round(animatedValues.soilMoisture || nasaData.soil.surfaceMoisture)}%
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-1000 ${getProgressBarColor(nasaData.soil.surfaceMoisture, 100)}`}
                  style={{ width: `${nasaData.soil.surfaceMoisture}%` }}
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg hover:shadow-md transition-shadow">
              <div className="text-sm text-gray-600">Soil Temperature</div>
              <div className="text-3xl font-bold text-orange-600">{nasaData.soil.soilTemperature}°C</div>
              <div className="text-xs text-gray-500 mt-1">0-10cm depth</div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg hover:shadow-md transition-shadow">
              <div className="text-sm text-gray-600">pH Level</div>
              <div className={`text-3xl font-bold ${getValueColor(nasaData.soil.pH, { good: 6.5, warning: 6.0 })}`}>
                {nasaData.soil.pH.toFixed(1)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {nasaData.soil.pH > 7.5 ? 'Alkaline' : nasaData.soil.pH < 6.0 ? 'Acidic' : 'Optimal'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vegetation Tab */}
      {activeTab === 'vegetation' && (
        <div className="space-y-4 animate-fadeIn">
          <h3 className="text-lg font-semibold text-gray-800">Vegetation Health (NDVI)</h3>
          
          <div className="text-center">
            <div className={`text-6xl font-bold mb-2 ${getValueColor(nasaData.vegetation.ndvi * 100, { good: 60, warning: 40 })}`}>
              {(animatedValues.ndvi || nasaData.vegetation.ndvi * 100).toFixed(0)}%
            </div>
            <div className="text-lg text-gray-600 mb-4">{nasaData.vegetation.vegetationHealth}</div>
            
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div 
                className={`h-4 rounded-full transition-all duration-2000 ${getProgressBarColor(nasaData.vegetation.ndvi * 100, 100)}`}
                style={{ width: `${nasaData.vegetation.ndvi * 100}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">EVI</div>
              <div className="text-2xl font-bold text-green-600">{nasaData.vegetation.evi.toFixed(3)}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">LAI</div>
              <div className="text-2xl font-bold text-green-600">{nasaData.vegetation.lai.toFixed(2)}</div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 text-xs text-gray-500 text-center">
        Data source: {nasaData.weather.source} • Updated: {new Date(nasaData.timestamp).toLocaleTimeString()}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}