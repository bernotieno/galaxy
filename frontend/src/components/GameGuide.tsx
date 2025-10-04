'use client';

import { useState } from 'react';

export default function GameGuide() {
  const [showGuide, setShowGuide] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);

  const sections = [
    {
      title: "🌾 Welcome to Lake Galaxy Farm",
      content: (
        <div className="space-y-4">
          <p className="text-lg">Transform agriculture with NASA satellite data!</p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">🎯 Your Mission</h4>
            <p>Manage a sustainable farm using real NASA satellite data to make informed decisions about planting, irrigation, and livestock management.</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">🏆 Win Conditions</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Maximize crop yields and farm revenue</li>
              <li>Maintain high sustainability scores</li>
              <li>Efficiently use water and reduce carbon footprint</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "🗺️ Farm Management Basics",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-amber-50 p-3 rounded-lg">
              <h4 className="font-semibold mb-2">🟫 Farm Grid</h4>
              <p className="text-sm">16 plots for growing crops. Click to select, watch growth stages from 🌱 to 🌽</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <h4 className="font-semibold mb-2">💰 Budget</h4>
              <p className="text-sm">Start with $10,000. Earn money by harvesting crops, spend on seeds and inputs.</p>
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">📊 Progress Bars</h4>
            <p>Each planted plot shows:</p>
            <ul className="list-disc list-inside text-sm mt-2">
              <li>Growth progress (green bar)</li>
              <li>Health percentage</li>
              <li>Need indicators: 💧 (water) 🧪 (fertilizer)</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "🌱 Crop Management",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-yellow-50 p-3 rounded-lg text-center">
              <div className="text-2xl mb-1">🌽</div>
              <div className="font-semibold">Corn</div>
              <div className="text-xs">$50 • 90 days • 15-30°C</div>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg text-center">
              <div className="text-2xl mb-1">🌾</div>
              <div className="font-semibold">Wheat</div>
              <div className="text-xs">$30 • 120 days • 10-25°C</div>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg text-center">
              <div className="text-2xl mb-1">🫘</div>
              <div className="font-semibold">Soybean</div>
              <div className="text-xs">$40 • 100 days • 20-30°C</div>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg text-center">
              <div className="text-2xl mb-1">🍅</div>
              <div className="font-semibold">Tomato</div>
              <div className="text-xs">$60 • 80 days • 18-28°C</div>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">🎮 Actions</h4>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>🌱 <strong>Plant:</strong> Select crop & plot</div>
              <div>💧 <strong>Water:</strong> $20 • Increases soil moisture</div>
              <div>🧪 <strong>Fertilize:</strong> $30 • Boosts fertility</div>
              <div>🌾 <strong>Harvest:</strong> Collect mature crops</div>
              <div>🔄 <strong>Rotate:</strong> Improve soil with legumes</div>
              <div>💧 <strong>Drip:</strong> $200 • Water efficiency</div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "🛰️ NASA Data Dashboard",
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">🌡️ Weather Data (MODIS/VIIRS)</h4>
            <ul className="text-sm space-y-1">
              <li>• <strong>Temperature:</strong> Affects crop growth rates</li>
              <li>• <strong>Humidity:</strong> Influences disease risk</li>
              <li>• <strong>Wind Speed:</strong> Affects evaporation</li>
            </ul>
          </div>
          <div className="bg-amber-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">🌱 Soil Data (SMAP)</h4>
            <ul className="text-sm space-y-1">
              <li>• <strong>Surface Moisture (0-10cm):</strong> For germination</li>
              <li>• <strong>Root Zone:</strong> For mature plant water uptake</li>
              <li>• <strong>pH Level:</strong> Nutrient availability</li>
            </ul>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">📊 Vegetation (MODIS)</h4>
            <ul className="text-sm space-y-1">
              <li>• <strong>NDVI (0.1-0.9):</strong> Vegetation health index</li>
              <li>• <strong>0.6-0.9:</strong> Healthy • <strong>0.4-0.6:</strong> Moderate • <strong>0.1-0.4:</strong> Poor</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "🌱 Sustainability & Livestock",
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">♻️ Sustainability Metrics</h4>
            <ul className="text-sm space-y-1">
              <li>• <strong>Carbon Sequestration:</strong> Plant cover crops</li>
              <li>• <strong>Water Efficiency:</strong> Use drip irrigation</li>
              <li>• <strong>Soil Health:</strong> Rotate crops, add organic matter</li>
              <li>• <strong>Biodiversity:</strong> Grow diverse crop varieties</li>
            </ul>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">🐄 Livestock Management</h4>
            <ul className="text-sm space-y-1">
              <li>• <strong>Feed Animals:</strong> $10/head • Improves health</li>
              <li>• <strong>Provide Water:</strong> $5/head • Boosts productivity</li>
              <li>• <strong>Monitor Health:</strong> Healthy animals = higher yields</li>
            </ul>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">⛈️ Weather Events</h4>
            <p className="text-sm">Prepare for droughts, floods, heatwaves, and frost. Adapt your farming strategy based on climate risks!</p>
          </div>
        </div>
      )
    },
    {
      title: "🎯 Pro Tips & Strategy",
      content: (
        <div className="space-y-4">
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Smart Farming Tips</h4>
            <ul className="text-sm space-y-1">
              <li>• Check NASA data before planting - match crops to conditions</li>
              <li>• Plant wheat in cool seasons, corn in warm seasons</li>
              <li>• Monitor NDVI - values below 0.4 indicate crop stress</li>
              <li>• Use crop rotation to naturally improve soil fertility</li>
              <li>• Install drip irrigation early for long-term water savings</li>
            </ul>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">🏆 Winning Strategy</h4>
            <ul className="text-sm space-y-1">
              <li>• Balance profit with sustainability scores</li>
              <li>• Diversify crops to reduce risk and improve biodiversity</li>
              <li>• Invest in water-efficient technologies</li>
              <li>• Keep livestock healthy for steady income</li>
              <li>• Learn from the tutorial system and apply NASA data insights</li>
            </ul>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">📍 Your Location</h4>
            <p className="text-sm">Use "My Current Location" to get real NASA satellite data for your exact GPS coordinates. Enable location access for the most accurate farming simulation!</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">🛰️ NASA Resources</h4>
            <p className="text-sm">Access real NASA tools like AppEEARS, Worldview, and Crop-CASMA for actual satellite data analysis!</p>
          </div>
        </div>
      )
    }
  ];

  if (!showGuide) {
    return (
      <button
        onClick={() => setShowGuide(true)}
        className="fixed top-4 right-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full shadow-lg transition-colors z-50 flex items-center gap-2"
      >
        <span>❓</span>
        <span>How to Play</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-green-800">Lake Galaxy Farm Guide</h1>
          <button
            onClick={() => setShowGuide(false)}
            className="text-gray-500 hover:text-gray-700 text-3xl"
          >
            ×
          </button>
        </div>

        <div className="flex mb-6">
          {sections.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSection(index)}
              className={`flex-1 py-2 px-3 text-sm border-b-2 transition-colors ${
                currentSection === index
                  ? 'border-green-500 text-green-600 font-semibold'
                  : 'border-gray-200 text-gray-600 hover:text-green-600'
              }`}
            >
              {index + 1}. {sections[index].title.split(' ').slice(1).join(' ')}
            </button>
          ))}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {sections[currentSection].title}
          </h2>
          {sections[currentSection].content}
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
            disabled={currentSection === 0}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          <div className="flex space-x-2">
            {sections.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === currentSection ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => {
              if (currentSection === sections.length - 1) {
                setShowGuide(false);
              } else {
                setCurrentSection(currentSection + 1);
              }
            }}
            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
          >
            {currentSection === sections.length - 1 ? 'Start Playing!' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}