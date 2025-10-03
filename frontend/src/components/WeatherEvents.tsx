'use client';

import { useState, useEffect } from 'react';

interface WeatherEvent {
  type: string;
  severity: number;
  duration: number;
  impact: string;
  probability: number;
}

export default function WeatherEvents() {
  const [events, setEvents] = useState<WeatherEvent[]>([]);
  const [activeEvent, setActiveEvent] = useState<WeatherEvent | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/weather-events');
        const result = await response.json();
        setEvents(result);
        
        // Simulate random weather events
        const randomEvent = result[Math.floor(Math.random() * result.length)];
        if (Math.random() < randomEvent.probability) {
          setActiveEvent(randomEvent);
          setTimeout(() => setActiveEvent(null), randomEvent.duration * 1000);
        }
      } catch (error) {
        console.error('Failed to fetch weather events:', error);
      }
    };

    fetchEvents();
    const interval = setInterval(fetchEvents, 30000);
    return () => clearInterval(interval);
  }, []);

  const getEventEmoji = (type: string) => {
    const emojis: Record<string, string> = {
      drought: '🌵',
      flood: '🌊',
      heatwave: '🔥',
      frost: '❄️',
      hail: '🧊'
    };
    return emojis[type] || '🌤️';
  };

  const getSeverityColor = (severity: number) => {
    if (severity >= 0.8) return 'bg-red-100 border-red-400 text-red-800';
    if (severity >= 0.6) return 'bg-orange-100 border-orange-400 text-orange-800';
    return 'bg-yellow-100 border-yellow-400 text-yellow-800';
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
      <h2 className="text-2xl font-bold text-blue-800 mb-4">⛈️ Weather Events</h2>
      
      {activeEvent && (
        <div className={`p-4 rounded-lg border-2 mb-4 ${getSeverityColor(activeEvent.severity)}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{getEventEmoji(activeEvent.type)}</span>
            <span className="font-bold capitalize">{activeEvent.type} Alert!</span>
          </div>
          <p className="text-sm mb-2">{activeEvent.impact}</p>
          <div className="text-xs">
            Severity: {Math.round(activeEvent.severity * 100)}% | Duration: {activeEvent.duration} days
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-800">Potential Weather Risks</h3>
        {events.map((event, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-xl">{getEventEmoji(event.type)}</span>
              <div>
                <div className="font-medium capitalize">{event.type}</div>
                <div className="text-sm text-gray-600">
                  {Math.round(event.probability * 100)}% chance
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">
                Severity: {Math.round(event.severity * 100)}%
              </div>
              <div className="text-xs text-gray-500">
                {event.duration} day{event.duration > 1 ? 's' : ''}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-1">💡 Climate Adaptation Tips</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Plant drought-resistant varieties in dry regions</li>
          <li>• Use cover crops to protect soil during extreme weather</li>
          <li>• Install drainage systems in flood-prone areas</li>
          <li>• Monitor weather forecasts for planting decisions</li>
        </ul>
      </div>
    </div>
  );
}