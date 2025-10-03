'use client';

import { useState } from 'react';

export default function NASAResourcesPanel() {
  const [showResources, setShowResources] = useState(false);
  const [activeCategory, setActiveCategory] = useState('tools');

  const resources = {
    tools: [
      {
        name: "AppEEARS",
        description: "Extract and explore NASA satellite data for your location",
        url: "https://appeears.earthdatacloud.nasa.gov/",
        icon: "🛰️",
        useCase: "Download MODIS NDVI and soil temperature data for your farm"
      },
      {
        name: "NASA Worldview",
        description: "Interactive visualization of 1000+ satellite imagery layers",
        url: "https://worldview.earthdata.nasa.gov/",
        icon: "🌍",
        useCase: "View real-time crop conditions and weather patterns"
      },
      {
        name: "Giovanni",
        description: "Analyze and visualize geophysical parameters",
        url: "https://giovanni.gsfc.nasa.gov/giovanni/",
        icon: "📊",
        useCase: "Create time series plots of precipitation and temperature"
      },
      {
        name: "Crop-CASMA",
        description: "High-resolution SMAP soil moisture and MODIS data",
        url: "https://nassgeo.csiss.gmu.edu/CropCASMA/",
        icon: "🌱",
        useCase: "Monitor soil moisture for irrigation planning"
      }
    ],
    programs: [
      {
        name: "NASA Acres",
        description: "U.S. agriculture and food security program using satellite data",
        url: "https://www.nasa.gov/nasa-acres/",
        icon: "🇺🇸",
        useCase: "Access tools for U.S. farmers and agricultural stakeholders"
      },
      {
        name: "NASA Harvest",
        description: "Global consortium for agricultural satellite applications",
        url: "https://nasaharvest.org/",
        icon: "🌾",
        useCase: "Learn about global food security and crop monitoring"
      },
      {
        name: "ARSET Training",
        description: "Free remote sensing training for agriculture",
        url: "https://appliedsciences.nasa.gov/what-we-do/capacity-building/arset",
        icon: "📚",
        useCase: "Take courses on using satellite data for farming"
      }
    ],
    data: [
      {
        name: "SMAP Soil Moisture",
        description: "Global soil moisture data from NASA's SMAP mission",
        url: "https://smap.jpl.nasa.gov/",
        icon: "💧",
        useCase: "Monitor root zone moisture for crop water management"
      },
      {
        name: "MODIS Vegetation Indices",
        description: "NDVI and EVI data for crop health monitoring",
        url: "https://modis.gsfc.nasa.gov/",
        icon: "🌿",
        useCase: "Track vegetation health and growth patterns"
      },
      {
        name: "GPM Precipitation",
        description: "Global precipitation measurements for weather planning",
        url: "https://gpm.nasa.gov/",
        icon: "🌧️",
        useCase: "Plan irrigation based on rainfall forecasts"
      },
      {
        name: "U.S. Drought Monitor",
        description: "Weekly drought conditions using NASA satellite data",
        url: "https://droughtmonitor.unl.edu/",
        icon: "🌵",
        useCase: "Prepare for drought conditions and water restrictions"
      }
    ],
    pathfinders: [
      {
        name: "Agriculture & Water Management",
        description: "Drought, vegetation health, and soil moisture tracking",
        url: "https://www.earthdata.nasa.gov/learn/pathfinders/agricultural-and-water-resources-data-pathfinder",
        icon: "🚜",
        useCase: "Find datasets for irrigation and crop management"
      },
      {
        name: "Floods Data Pathfinder",
        description: "NASA datasets for flood response and mitigation",
        url: "https://www.earthdata.nasa.gov/learn/pathfinders/disasters-data-pathfinder",
        icon: "🌊",
        useCase: "Prepare for and respond to flooding events"
      },
      {
        name: "Extreme Heat Pathfinder",
        description: "Monitor and forecast extreme heat events",
        url: "https://www.earthdata.nasa.gov/learn/pathfinders/disasters-data-pathfinder",
        icon: "🔥",
        useCase: "Protect crops during heat waves and high temperatures"
      }
    ]
  };

  if (!showResources) {
    return (
      <button
        onClick={() => setShowResources(true)}
        className="fixed bottom-4 left-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg transition-colors z-50 flex items-center gap-2"
      >
        <span>🛰️</span>
        <span>NASA Resources</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-800">🛰️ NASA Data & Resources</h1>
          <button
            onClick={() => setShowResources(false)}
            className="text-gray-500 hover:text-gray-700 text-3xl"
          >
            ×
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            Explore real NASA tools and datasets used in the game. These resources help farmers make data-driven decisions for sustainable agriculture.
          </p>
          
          <div className="flex flex-wrap gap-2">
            {Object.keys(resources).map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources[activeCategory as keyof typeof resources].map((resource, index) => (
            <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
              <div className="flex items-start gap-4">
                <div className="text-3xl">{resource.icon}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-blue-800 mb-2">{resource.name}</h3>
                  <p className="text-gray-700 mb-3">{resource.description}</p>
                  
                  <div className="bg-green-50 p-3 rounded-lg mb-4">
                    <h4 className="font-semibold text-green-800 mb-1">💡 How to Use:</h4>
                    <p className="text-sm text-green-700">{resource.useCase}</p>
                  </div>
                  
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <span>Visit Resource</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl">
          <h3 className="text-xl font-bold text-gray-800 mb-4">🎓 Getting Started with NASA Data</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">1. Create Account</h4>
              <p className="text-sm text-gray-700">
                Register for free at <a href="https://urs.earthdata.nasa.gov/" target="_blank" className="text-blue-600 underline">Earthdata Login</a> to access NASA datasets
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">2. Learn the Basics</h4>
              <p className="text-sm text-gray-700">
                Take ARSET training courses to understand satellite data interpretation and applications
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">3. Apply to Farming</h4>
              <p className="text-sm text-gray-700">
                Use tools like AppEEARS and Crop-CASMA to download data for your specific location and crops
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            All NASA Earth science data is free and open to the public. Start exploring today!
          </p>
        </div>
      </div>
    </div>
  );
}