import { GameState } from '@/types';

interface GameHeaderProps {
  gameState: GameState;
}

export default function GameHeader({ gameState }: GameHeaderProps) {
  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-green-800">🌾 Lake Galaxy Farm</h1>
          
          <div className="flex gap-8">
            <div className="text-center">
              <div className="text-sm text-gray-600">Season</div>
              <div className="text-lg font-semibold text-green-800">{gameState.season}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Budget</div>
              <div className="text-lg font-semibold text-green-800">${gameState.budget.toLocaleString()}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Score</div>
              <div className="text-lg font-semibold text-green-800">{gameState.score.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}