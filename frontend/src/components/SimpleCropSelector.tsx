'use client';

interface SimpleCropSelectorProps {
  selectedCrop: string;
  onCropSelect: (crop: string) => void;
}

const crops = {
  corn: { name: 'Corn', emoji: '🌽', cost: 50 },
  wheat: { name: 'Wheat', emoji: '🌾', cost: 30 },
  soybean: { name: 'Soybean', emoji: '🫘', cost: 40 },
  tomato: { name: 'Tomato', emoji: '🍅', cost: 60 }
};

export default function SimpleCropSelector({ selectedCrop, onCropSelect }: SimpleCropSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-green-800">Select Crop</h3>
      
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(crops).map(([key, crop]) => (
          <button
            key={key}
            onClick={() => onCropSelect(key)}
            className={`p-3 rounded-lg border-2 transition-all text-center ${
              selectedCrop === key
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 hover:border-green-300'
            }`}
          >
            <div className="text-2xl mb-1">{crop.emoji}</div>
            <div className="text-sm font-medium">{crop.name}</div>
            <div className="text-xs text-gray-600">${crop.cost}</div>
          </button>
        ))}
      </div>
    </div>
  );
}