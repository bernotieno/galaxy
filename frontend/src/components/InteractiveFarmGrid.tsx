'use client';

import { useState, useEffect } from 'react';
import { Plot } from '@/types';

interface InteractiveFarmGridProps {
  plots: Plot[];
  selectedPlot: number | null;
  onPlotSelect: (plotId: number) => void;
  selectedCrop: string;
  onAction: (action: string) => void;
}

export default function InteractiveFarmGrid({ plots, selectedPlot, onPlotSelect, selectedCrop, onAction }: InteractiveFarmGridProps) {
  const [draggedCrop, setDraggedCrop] = useState<string | null>(null);
  const [hoveredPlot, setHoveredPlot] = useState<number | null>(null);
  const [animations, setAnimations] = useState<Record<number, string>>({});

  const cropEmojis: Record<string, string> = {
    corn: '🌽', wheat: '🌾', soybean: '🫘', tomato: '🍅'
  };

  const getGrowthEmoji = (stage: string, crop: string) => {
    if (!stage || stage === 'empty') return '🟫';
    if (stage === 'seedling') return '🌱';
    if (stage === 'vegetative') return '🌿';
    if (stage === 'flowering') return '🌸';
    if (stage === 'fruiting') return '🟢';
    if (stage === 'mature') return cropEmojis[crop] || '🌾';
    return cropEmojis[crop] || '🌾';
  };

  const handleDrop = (e: React.DragEvent, plotId: number) => {
    e.preventDefault();
    if (draggedCrop && !plots[plotId].crop) {
      onPlotSelect(plotId);
      onAction('plant');
      playSound('plant');
      triggerAnimation(plotId, 'plant');
    }
    setDraggedCrop(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const playSound = (action: string) => {
    const audio = new Audio();
    switch (action) {
      case 'plant': audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'; break;
      case 'water': audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'; break;
      case 'harvest': audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'; break;
    }
    audio.volume = 0.3;
    audio.play().catch(() => {}); // Ignore autoplay restrictions
  };

  const triggerAnimation = (plotId: number, type: string) => {
    setAnimations(prev => ({ ...prev, [plotId]: type }));
    setTimeout(() => {
      setAnimations(prev => {
        const newAnimations = { ...prev };
        delete newAnimations[plotId];
        return newAnimations;
      });
    }, 1000);
  };

  const getPlotClass = (plot: Plot, index: number) => {
    let baseClass = 'aspect-square border-3 rounded-xl flex flex-col items-center justify-center text-xl cursor-pointer transition-all duration-300 relative overflow-hidden min-h-[120px]';
    
    if (animations[index]) {
      baseClass += ` animate-${animations[index]}`;
    }
    
    if (plot.id === selectedPlot) {
      baseClass += ' border-blue-500 bg-blue-100 scale-105 shadow-lg';
    } else if (hoveredPlot === index) {
      baseClass += ' scale-105 shadow-md';
    }
    
    if (plot.crop) {
      if (plot.needsWater) {
        baseClass += ' border-orange-400 bg-gradient-to-br from-orange-200 to-yellow-200';
      } else if (plot.health > 0.8) {
        baseClass += ' border-green-400 bg-gradient-to-br from-green-200 to-green-300';
      } else {
        baseClass += ' border-green-300 bg-gradient-to-br from-green-100 to-green-200';
      }
    } else {
      baseClass += ' border-gray-300 bg-gradient-to-br from-amber-100 to-amber-200 hover:border-green-400';
      if (draggedCrop) {
        baseClass += ' border-dashed border-green-500 bg-green-50';
      }
    }
    
    return baseClass;
  };

  const handlePlotClick = (plotId: number) => {
    onPlotSelect(plotId);
    playSound('select');
    
    const plot = plots[plotId];
    if (plot.growthStage === 'mature') {
      triggerAnimation(plotId, 'bounce');
    }
  };

  const handleQuickAction = (e: React.MouseEvent, plotId: number, action: string) => {
    e.stopPropagation();
    onPlotSelect(plotId);
    onAction(action);
    playSound(action);
    triggerAnimation(plotId, action);
  };

  return (
    <div className="space-y-6">
      {/* Drag and Drop Crop Seeds */}
      <div className="grid grid-cols-4 gap-4 p-6 bg-green-50 rounded-xl">
        <h4 className="col-span-4 text-lg font-semibold text-green-800 mb-4">🌱 Drag Seeds to Plant</h4>
        {Object.entries(cropEmojis).map(([crop, emoji]) => (
          <div
            key={crop}
            draggable
            onDragStart={() => setDraggedCrop(crop)}
            className="p-4 bg-white rounded-xl border-2 border-green-300 cursor-grab active:cursor-grabbing hover:scale-110 transition-transform text-center shadow-sm"
          >
            <div className="text-3xl mb-2">{emoji}</div>
            <div className="text-sm font-medium capitalize">{crop}</div>
          </div>
        ))}
      </div>

      {/* Interactive Farm Grid */}
      <div className="grid grid-cols-4 gap-4">
        {plots.map((plot, index) => (
          <div
            key={plot.id}
            className={getPlotClass(plot, index)}
            onClick={() => handlePlotClick(plot.id)}
            onMouseEnter={() => setHoveredPlot(index)}
            onMouseLeave={() => setHoveredPlot(null)}
            onDrop={(e) => handleDrop(e, plot.id)}
            onDragOver={handleDragOver}
          >
            {/* Main Crop/Plot Display */}
            <div className="text-5xl mb-2 transition-transform duration-300 hover:scale-110">
              {getGrowthEmoji(plot.growthStage || 'empty', plot.crop || '')}
            </div>

            {/* Growth Progress Bar */}
            {plot.crop && (
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div 
                  className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(plot.growthProgress || 0) * 100}%` }}
                />
              </div>
            )}

            {/* Health Indicator */}
            {plot.crop && (
              <div className="text-sm font-bold text-gray-700">
                {Math.round((plot.health || 1) * 100)}%
              </div>
            )}

            {/* Quick Action Buttons */}
            {plot.crop && (
              <div className="absolute top-2 right-2 flex gap-2">
                {plot.needsWater && (
                  <button
                    onClick={(e) => handleQuickAction(e, plot.id, 'irrigate')}
                    className="w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-sm flex items-center justify-center transition-colors shadow-lg"
                    title="Water crop"
                  >
                    💧
                  </button>
                )}
                {plot.needsFertilizer && (
                  <button
                    onClick={(e) => handleQuickAction(e, plot.id, 'fertilize')}
                    className="w-8 h-8 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-sm flex items-center justify-center transition-colors shadow-lg"
                    title="Fertilize crop"
                  >
                    🧪
                  </button>
                )}
                {plot.growthStage === 'mature' && (
                  <button
                    onClick={(e) => handleQuickAction(e, plot.id, 'harvest')}
                    className="w-8 h-8 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full text-sm flex items-center justify-center transition-colors animate-pulse shadow-lg"
                    title="Harvest crop"
                  >
                    ✂️
                  </button>
                )}
              </div>
            )}

            {/* Hover Tooltip */}
            {hoveredPlot === index && plot.crop && (
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                {plot.crop} - {plot.growthStage} - Day {plot.plantedDay || 0}
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes plant {
          0% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.2) rotate(5deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        @keyframes water {
          0% { transform: scale(1); filter: hue-rotate(0deg); }
          50% { transform: scale(1.1); filter: hue-rotate(180deg); }
          100% { transform: scale(1); filter: hue-rotate(0deg); }
        }
        @keyframes harvest {
          0% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(0.9) rotate(-5deg); }
          75% { transform: scale(1.1) rotate(5deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-plant { animation: plant 1s ease-in-out; }
        .animate-water { animation: water 1s ease-in-out; }
        .animate-harvest { animation: harvest 1s ease-in-out; }
        .animate-bounce { animation: bounce 0.5s ease-in-out; }
      `}</style>
    </div>
  );
}