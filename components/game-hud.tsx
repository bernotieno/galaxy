"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GameSettings } from "@/components/game-settings"
import { TutorialTrigger } from "@/components/onboarding-tutorial"
import type { GameState } from "@/lib/game-types"
import {
  Satellite,
  User,
  Star,
  Zap,
  Crown,
  Gamepad2
} from "lucide-react"

interface GameHUDProps {
  gameState: GameState
  onUpdateNASAData: () => void
  onStartTutorial: () => void
  playerLevel?: number
  playerXP?: number
}

export function GameHUD({ 
  gameState, 
  onUpdateNASAData, 
  onStartTutorial,
  playerLevel = 1,
  playerXP = 0
}: GameHUDProps) {
  const [animateResources, setAnimateResources] = useState<string[]>([])
  const { resources } = gameState

  // Animate resource changes
  useEffect(() => {
    const timer = setTimeout(() => setAnimateResources([]), 1000)
    return () => clearTimeout(timer)
  }, [resources])

  const triggerResourceAnimation = (resource: string) => {
    setAnimateResources(prev => [...prev, resource])
  }

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
              <h1 className="text-lg font-bold text-white">NASA Farm Game</h1>
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