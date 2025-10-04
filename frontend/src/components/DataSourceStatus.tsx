'use client';

import { useState, useEffect } from 'react';
import { fetchDataSources } from '@/lib/api';

interface DataSource {
  name: string;
  status: string;
  source: string;
  endpoint: string;
  available: boolean;
}

interface DataSourcesResponse {
  sources: DataSource[];
  lastUpdated: string;
  summary: {
    totalSources: number;
    realDataSources: number;
    simulatedSources: number;
  };
}

export default function DataSourceStatus() {
  const [dataSources, setDataSources] = useState<DataSourcesResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDataSources = async () => {
      try {
        const data = await fetchDataSources();
        setDataSources(data);
      } catch (error) {
        console.error('Failed to fetch data sources:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDataSources();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">🛰️ NASA Data Sources</h3>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!dataSources) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">🛰️ NASA Data Sources</h3>
        <p className="text-red-600">Failed to load data source status</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">🛰️ NASA Data Sources</h3>
        <div className="text-sm text-gray-500">
          {dataSources.summary.realDataSources}/{dataSources.summary.totalSources} real APIs
        </div>
      </div>

      <div className="grid gap-3 mb-4">
        {dataSources.sources.map((source, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border-l-4 ${
              source.available
                ? 'border-green-500 bg-green-50'
                : 'border-yellow-500 bg-yellow-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{source.name}</h4>
                <p className="text-sm text-gray-600">{source.status}</p>
                <p className="text-xs text-gray-500">{source.source}</p>
              </div>
              <div className="flex items-center">
                {source.available ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✓ Live
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    ⚠ Simulated
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">🔑 Enable Real NASA Data</h4>
        <div className="text-sm text-blue-800 space-y-1">
          <p>• Get free OpenWeatherMap API key: <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer" className="underline">openweathermap.org/api</a></p>
          <p>• Create NASA Earthdata account: <a href="https://urs.earthdata.nasa.gov/" target="_blank" rel="noopener noreferrer" className="underline">urs.earthdata.nasa.gov</a></p>
          <p>• Add keys to backend/.env file</p>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        Last updated: {new Date(dataSources.lastUpdated).toLocaleTimeString()}
      </div>
    </div>
  );
}