import { Plot } from '@/types';

interface FarmGridProps {
  plots: Plot[];
  selectedPlot: number | null;
  onPlotSelect: (plotId: number) => void;
}

const cropEmojis: Record<string, string> = {
  corn: '🌽',
  wheat: '🌾',
  soybean: '🫘',
  tomato: '🍅',
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

export default function FarmGrid({ plots, selectedPlot, onPlotSelect }: FarmGridProps) {
  const getPlotClass = (plot: Plot) => {
    let baseClass = 'aspect-square border-2 rounded-lg flex flex-col items-center justify-center text-lg cursor-pointer transition-all hover:scale-105 relative';
    
    if (plot.id === selectedPlot) {
      baseClass += ' border-blue-500 bg-blue-100';
    } else if (plot.crop) {
      if (plot.needsWater) {
        baseClass += ' border-orange-400 bg-gradient-to-br from-orange-200 to-yellow-200';
      } else if (plot.health > 0.8) {
        baseClass += ' border-green-400 bg-gradient-to-br from-green-200 to-green-300';
      } else {
        baseClass += ' border-green-300 bg-gradient-to-br from-green-100 to-green-200';
      }
    } else {
      baseClass += ' border-gray-300 bg-gradient-to-br from-amber-100 to-amber-200 hover:border-green-400';
    }
    
    return baseClass;
  };

  return (
    <div className="grid grid-cols-4 gap-2">
      {plots.map((plot) => (
        <div
          key={plot.id}
          className={getPlotClass(plot)}
          onClick={() => onPlotSelect(plot.id)}
        >
          <div className="text-2xl">
            {getGrowthEmoji(plot.growthStage || 'empty', plot.crop || '')}
          </div>
          {plot.crop && (
            <>
              <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                <div 
                  className="bg-green-500 h-1 rounded-full transition-all duration-500"
                  style={{ width: `${(plot.growthProgress || 0) * 100}%` }}
                />
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {Math.round((plot.health || 1) * 100)}%
              </div>
            </>
          )}
          {plot.needsWater && (
            <div className="absolute top-0 right-0 text-xs">💧</div>
          )}
          {plot.needsFertilizer && (
            <div className="absolute top-0 left-0 text-xs">🧪</div>
          )}
        </div>
      ))}
    </div>
  );
}