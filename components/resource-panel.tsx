"use client"

import { useState, useEffect } from "react"
import { GameCard, GameCardContent, GameCardHeader, GameCardTitle } from "@/components/ui/game-card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { HelpTooltip } from "@/components/help-tooltip"
import type { GameState } from "@/lib/game-types"
import { Droplets, Sparkles, Sprout, DollarSign, Leaf, TrendingUp, Award, Zap, AlertTriangle } from "lucide-react"

interface ResourcePanelProps {
  gameState: GameState
}

export function ResourcePanel({ gameState }: ResourcePanelProps) {
  const { resources, score } = gameState
  const [animatedResources, setAnimatedResources] = useState<string[]>([])
  const [previousResources, setPreviousResources] = useState(resources)

  const totalSeeds = Object.values(resources.seeds).reduce((sum, count) => sum + count, 0)

  // Detect resource changes and trigger animations
  useEffect(() => {
    const changes: string[] = []
    if (resources.money !== previousResources.money) changes.push('money')
    if (resources.water !== previousResources.water) changes.push('water')
    if (resources.fertilizer !== previousResources.fertilizer) changes.push('fertilizer')
    
    if (changes.length > 0) {
      setAnimatedResources(changes)
      setTimeout(() => setAnimatedResources([]), 1000)
    }
    
    setPreviousResources(resources)
  }, [resources, previousResources])

  const getResourceStatus = (current: number, max: number) => {
    const percentage = (current / max) * 100
    if (percentage < 20) return { status: 'critical', color: 'text-red-500', bgColor: 'bg-red-500' }
    if (percentage < 50) return { status: 'low', color: 'text-amber-500', bgColor: 'bg-amber-500' }
    return { status: 'good', color: 'text-green-500', bgColor: 'bg-green-500' }
  }

  return (
    <div className="space-y-4">
      {/* Resources */}
      <GameCard variant="default">
        <GameCardHeader>
          <GameCardTitle className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-green-600" />
            Resources
          </GameCardTitle>
        </GameCardHeader>
        <GameCardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 border border-blue-200 rounded-lg bg-blue-50">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Water</span>
            </div>
            <span className="font-bold text-blue-900">{resources.water}L</span>
          </div>

          <div className="flex items-center justify-between p-3 border border-green-200 rounded-lg bg-green-50">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Fertilizer</span>
            </div>
            <span className="font-bold text-green-900">{resources.fertilizer}kg</span>
          </div>

          <div className="p-3 border border-teal-200 rounded-lg bg-teal-50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sprout className="w-4 h-4 text-teal-600" />
                <span className="text-sm font-medium text-teal-800">Seeds</span>
              </div>
              <span className="font-bold text-teal-900">{totalSeeds}</span>
            </div>
            <div className="grid grid-cols-5 gap-1 text-xs">
              {Object.entries(resources.seeds).map(([crop, count]) => (
                <div key={crop} className="text-center p-1 bg-white rounded border border-teal-100">
                  <div className="font-bold text-teal-800">{count}</div>
                  <div className="text-teal-600 capitalize">{crop.slice(0, 3)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 border border-green-300 rounded-lg bg-gradient-to-r from-green-100 to-green-50">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">Money</span>
            </div>
            <span className="text-lg font-bold text-green-900">
              ${resources.money.toLocaleString()}
            </span>
          </div>
        </GameCardContent>
      </GameCard>

      {/* Score */}
      <GameCard variant="default">
        <GameCardHeader>
          <GameCardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            Performance
          </GameCardTitle>
        </GameCardHeader>
        <GameCardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 border border-green-200 rounded-lg bg-green-50">
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Sustainability</span>
            </div>
            <span className="font-bold text-green-900">{Math.floor(score.sustainability)}%</span>
          </div>
          
          <div className="flex items-center justify-between p-3 border border-blue-200 rounded-lg bg-blue-50">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Efficiency</span>
            </div>
            <span className="font-bold text-blue-900">{Math.floor(score.efficiency)}%</span>
          </div>

          <div className="flex items-center justify-between p-3 border border-teal-200 rounded-lg bg-gradient-to-r from-teal-100 to-blue-50">
            <span className="text-sm font-medium text-teal-800">Total Harvest</span>
            <span className="font-bold text-teal-900">
              {score.cropYield.toLocaleString()}
            </span>
          </div>
        </GameCardContent>
      </GameCard>
    </div>
  )
}
