'use client';

import { useState, useEffect } from 'react';
import { NASAData } from '@/types';

interface InteractiveWeatherWidgetProps {
  nasaData: NASAData;
}

export default function InteractiveWeatherWidget({ nasaData }: InteractiveWeatherWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [weatherTrend, setWeatherTrend] = useState<'up' | 'down' | 'stable'>('stable');

  useEffect(() => {
    // Simulate weather trend based on current conditions
    const temp = nasaData.weather.temperature;
    const humidity = nasaData.weather.humidity;
    
    if (temp > 30 && humidity < 40) {
      setWeatherTrend('up'); // Getting hotter and drier
    } else if (temp < 15 && humidity > 70) {
      setWeatherTrend('down'); // Getting cooler and wetter
    } else {
      setWeatherTrend('stable');
    }
  }, [nasaData]);

  const getWeatherIcon = () => {
    const temp = nasaData.weather.temperature;
    const humidity = nasaData.weather.humidity;
    const cloudCover = nasaData.weather.cloudCover;

    if (cloudCover > 80) return '☁️';
    if (humidity > 80) return '🌧️';
    if (temp > 30) return '☀️';
    if (temp < 10) return '❄️';
    return '⛅';
  };

  const getTrendIcon = () => {
    switch (weatherTrend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  };

  const getWeatherAdvice = () => {
    const temp = nasaData.weather.temperature;
    const humidity = nasaData.weather.humidity;
    const windSpeed = nasaData.weather.windSpeed;

    if (temp > 35) return 'Extreme heat! Increase irrigation frequency and provide shade for livestock.';
    if (temp < 5) return 'Frost risk! Protect sensitive crops and ensure livestock have shelter.';
    if (humidity > 85) return 'High humidity may increase disease risk. Monitor crops closely.';
    if (windSpeed > 25) return 'Strong winds detected. Secure equipment and check for crop damage.';
    if (nasaData.weather.cloudCover > 90) return 'Overcast conditions. Reduced solar radiation may slow growth.';
    
    return 'Weather conditions are favorable for farming activities.';
  };

  return (
    <div className="fixed top-4 left-4 z-40">
      <div 
        className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg transition-all duration-300 cursor-pointer ${
          isExpanded ? 'p-6 w-80' : 'p-4 w-32'
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {!isExpanded ? (
          // Compact view
          <div className="text-center">
            <div className="text-3xl mb-1">{getWeatherIcon()}</div>
            <div className="text-lg font-bold text-gray-800">{nasaData.weather.temperature}°C</div>
            <div className="text-xs text-gray-600">Click to expand</div>
          </div>
        ) : (
          // Expanded view
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">🌤️ Weather Station</h3>
              <div className="flex items-center gap-1">
                <span className="text-sm">{getTrendIcon()}</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-xs text-gray-600">Temperature</div>
                <div className="text-xl font-bold text-blue-600">{nasaData.weather.temperature}°C</div>
              </div>
              <div className="bg-cyan-50 p-3 rounded-lg">
                <div className="text-xs text-gray-600">Humidity</div>
                <div className="text-xl font-bold text-cyan-600">{nasaData.weather.humidity}%</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-600">Wind</div>
                <div className="text-xl font-bold text-gray-600">{nasaData.weather.windSpeed} km/h</div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <div className="text-xs text-gray-600">Solar</div>
                <div className="text-xl font-bold text-yellow-600">{nasaData.weather.solarRadiation} W/m²</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-lg">
              <div className="text-xs font-semibold text-gray-700 mb-1">💡 Weather Advice</div>
              <div className="text-xs text-gray-600">{getWeatherAdvice()}</div>
            </div>

            <div className="text-xs text-gray-500 text-center">
              Updated: {new Date(nasaData.timestamp).toLocaleTimeString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}