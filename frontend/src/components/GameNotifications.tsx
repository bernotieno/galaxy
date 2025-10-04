'use client';

import { useState, useEffect } from 'react';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
}

interface GameNotificationsProps {
  gameState: any;
  nasaData: any;
}

export default function GameNotifications({ gameState, nasaData }: GameNotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!gameState || !nasaData) return;

    const newNotifications: Notification[] = [];

    // Weather alerts
    if (nasaData.weather.temperature > 35) {
      newNotifications.push({
        id: `heat-${Date.now()}`,
        type: 'warning',
        title: 'Extreme Heat Warning',
        message: `Temperature is ${nasaData.weather.temperature}°C. Consider extra irrigation.`,
        timestamp: new Date()
      });
    }

    // Soil moisture alerts
    if (nasaData.soil.surfaceMoisture < 25) {
      newNotifications.push({
        id: `drought-${Date.now()}`,
        type: 'error',
        title: 'Drought Conditions',
        message: `Soil moisture at ${nasaData.soil.surfaceMoisture}%. Immediate irrigation needed.`,
        timestamp: new Date()
      });
    }

    // Crop ready for harvest
    const matureCrops = gameState.plots?.filter((plot: any) => plot.growthStage === 'mature').length || 0;
    if (matureCrops > 0) {
      newNotifications.push({
        id: `harvest-${Date.now()}`,
        type: 'success',
        title: 'Crops Ready!',
        message: `${matureCrops} crop${matureCrops > 1 ? 's' : ''} ready for harvest. Click to collect!`,
        timestamp: new Date()
      });
    }

    // Budget warnings
    if (gameState.budget < 100) {
      newNotifications.push({
        id: `budget-${Date.now()}`,
        type: 'warning',
        title: 'Low Budget',
        message: `Only $${gameState.budget} remaining. Harvest crops to earn money.`,
        timestamp: new Date()
      });
    }

    // Sustainability achievements
    if (gameState.sustainabilityScore > 80) {
      newNotifications.push({
        id: `sustain-${Date.now()}`,
        type: 'success',
        title: 'Sustainability Champion!',
        message: `Excellent sustainability score: ${gameState.sustainabilityScore}%`,
        timestamp: new Date()
      });
    }

    // Add new notifications
    newNotifications.forEach(notification => {
      addNotification(notification);
    });
  }, [gameState, nasaData]);

  const addNotification = (notification: Notification) => {
    setNotifications(prev => {
      // Avoid duplicates
      if (prev.some(n => n.title === notification.title)) return prev;
      
      const updated = [notification, ...prev].slice(0, 5); // Keep only 5 most recent
      return updated;
    });

    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeNotification(notification.id);
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '🚨';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-green-500 bg-green-50 text-green-800';
      case 'warning': return 'border-yellow-500 bg-yellow-50 text-yellow-800';
      case 'error': return 'border-red-500 bg-red-50 text-red-800';
      case 'info': return 'border-blue-500 bg-blue-50 text-blue-800';
      default: return 'border-gray-500 bg-gray-50 text-gray-800';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg border-l-4 shadow-lg backdrop-blur-sm transition-all duration-300 transform hover:scale-105 ${getNotificationColor(notification.type)}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-2">
              <span className="text-lg">{getNotificationIcon(notification.type)}</span>
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{notification.title}</h4>
                <p className="text-xs mt-1 opacity-90">{notification.message}</p>
                <p className="text-xs mt-2 opacity-70">
                  {notification.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="text-gray-500 hover:text-gray-700 ml-2"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}