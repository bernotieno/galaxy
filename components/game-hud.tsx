"use client"

import { Button } from "@/components/ui/button"
import { GameSettings } from "@/components/game-settings"
import { TutorialTrigger } from "@/components/onboarding-tutorial"
import { Satellite } from "lucide-react"

interface GameHUDProps {
  onUpdateNASAData: () => void
  onStartTutorial: () => void
}

export function GameHUD({
  onUpdateNASAData,
  onStartTutorial
}: GameHUDProps) {

  return (
    <div className="bg-black border-b border-gray-800 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">

          {/* Left: Simple Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-md">
              <Satellite className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">GeoHarvest</h1>
              <p className="text-xs text-gray-400">Sustainable Farming Simulator</p>
            </div>
          </div>

          {/* Right: Simple Actions */}
          <div className="flex items-center gap-2">
            <Button
              onClick={onUpdateNASAData}
              size="sm"
              variant="outline"
              className="text-white border-gray-600 hover:bg-gray-800"
            >
              <Satellite className="w-4 h-4 mr-1" />
              Update Data
            </Button>
            <GameSettings />
            <TutorialTrigger onStart={onStartTutorial} />
          </div>
        </div>
      </div>
    </div>
  )
}