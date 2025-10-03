'use client';

import { useState, useEffect } from 'react';
import { NASAData, GameState } from '@/types';
import { fetchNASAData, fetchGameState, performAction } from '@/lib/api';
import FarmGrid from '@/components/FarmGrid';
import DataDashboard from '@/components/DataDashboard';
import GameHeader from '@/components/GameHeader';
import SimpleCropSelector from '@/components/SimpleCropSelector';
import SimpleMap from '@/components/SimpleMap';
import LocationSelector from '@/components/LocationSelector';
import SustainabilityDashboard from '@/components/SustainabilityDashboard';
import WeatherEvents from '@/components/WeatherEvents';
import TutorialSystem from '@/components/TutorialSystem';
import LivestockManager from '@/components/LivestockManager';
import GameGuide from '@/components/GameGuide';
import NASAResourcesPanel from '@/components/NASAResourcesPanel';
import InteractiveFarmGrid from '@/components/InteractiveFarmGrid';
import InteractiveDataDashboard from '@/components/InteractiveDataDashboard';
import GameNotifications from '@/components/GameNotifications';
import InteractiveWeatherWidget from '@/components/InteractiveWeatherWidget';

export default function Home() {
  const [nasaData, setNasaData] = useState<NASAData | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedPlot, setSelectedPlot] = useState<number | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<string>('corn');
  const [selectedLocation, setSelectedLocation] = useState<string>('iowa');
  const [currentCoords, setCurrentCoords] = useState({ lat: 42.0308, lon: -93.6319 });
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [nasa, game] = await Promise.all([
          fetchNASAData(currentCoords.lat, currentCoords.lon),
          fetchGameState()
        ]);
        setNasaData(nasa);
        setGameState(game);
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };

    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [currentCoords]);

  const handleLocationSelect = (location: string, coordinates: { lat: number; lon: number }) => {
    setSelectedLocation(location);
    setCurrentCoords(coordinates);
  };

  const handleAction = async (action: string) => {
    if (selectedPlot === null && !['harvest', 'rotateToLegume', 'installDripIrrigation'].includes(action)) {
      alert('Please select a plot first!');
      return;
    }

    try {
      const newGameState = await performAction({
        plotId: selectedPlot || 0,
        action,
        crop: action === 'plant' ? selectedCrop : undefined
      });
      setGameState(newGameState);
    } catch (error: any) {
      alert(error.response?.data || 'Action failed');
    }
  };

  const handleLivestockManage = async (action: string, type: string, count: number) => {
    try {
      const response = await fetch('/api/livestock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, type, count })
      });
      const newGameState = await response.json();
      setGameState(newGameState);
    } catch (error) {
      console.error('Livestock management failed:', error);
    }
  };

  if (!nasaData || !gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
        <div className="text-white text-xl">Loading NASA data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 game-container">
      <div className="game-header">
        <GameHeader gameState={gameState} />
      </div>
      
      <main className="min-h-screen w-full px-4 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-green-800 mb-6">🌾 Your Farm</h2>
              <InteractiveFarmGrid 
                plots={gameState.plots}
                selectedPlot={selectedPlot}
                onPlotSelect={setSelectedPlot}
                selectedCrop={selectedCrop}
                onAction={handleAction}
              />
              
              <div className="mt-6 space-y-4">
                <SimpleCropSelector 
                  selectedCrop={selectedCrop}
                  onCropSelect={setSelectedCrop}
                />
                
                <div className="grid grid-cols-3 gap-4">
                  <button onClick={() => handleAction('plant')} className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors">
                    🌱 Plant
                  </button>
                  <button onClick={() => handleAction('irrigate')} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors">
                    💧 Water
                  </button>
                  <button onClick={() => handleAction('fertilize')} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors">
                    🧪 Fertilize
                  </button>
                  <button onClick={() => handleAction('harvest')} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors">
                    🌾 Harvest
                  </button>
                  <button onClick={() => handleAction('rotateToLegume')} className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors">
                    🌱 Rotate
                  </button>
                  <button onClick={() => handleAction('installDripIrrigation')} className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors">
                    💧 Drip
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-blue-800">🗺️ Farm Locations</h2>
                <button 
                  onClick={() => setShowMap(!showMap)}
                  className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {showMap ? 'Hide' : 'Show'} Map
                </button>
              </div>
              {showMap && (
                <div className="space-y-4">
                  <LocationSelector 
                    onLocationSelect={handleLocationSelect}
                    selectedLocation={selectedLocation}
                  />
                  <SimpleMap 
                    onLocationSelect={handleLocationSelect}
                    selectedLocation={selectedLocation}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="xl:col-span-2 space-y-6">
            <InteractiveDataDashboard nasaData={nasaData} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SustainabilityDashboard />
              <WeatherEvents />
            </div>
            
            <LivestockManager 
              livestock={gameState.livestock || []}
              onManage={handleLivestockManage}
            />
          </div>
        </div>
        
        <TutorialSystem />
        <GameGuide />
        <NASAResourcesPanel />
        <GameNotifications gameState={gameState} nasaData={nasaData} />
        <InteractiveWeatherWidget nasaData={nasaData} />
      </main>
    </div>
  );
}