"use client"

import { useState, useEffect } from "react"
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
      {/* Mission Info */}
      <div className="gaming-card rounded-lg p-4 glow-cyan">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-yellow-400" />
          <h3 className="text-white font-bold">MISSION STATUS</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border border-cyan-500/60 rounded-lg bg-cyan-900/10">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-cyan-400">Mission Day</span>
            </div>
            <span className="font-bold text-white">DAY {gameState.daysElapsed}</span>
          </div>

          <div className="flex items-center justify-between p-3 border border-yellow-500/60 rounded-lg bg-yellow-900/10">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-yellow-400">Location</span>
            </div>
            <span className="font-bold text-white">{gameState.farmLocation.name}</span>
          </div>
        </div>
      </div>

      {/* Resources */}
      <div className="gaming-card rounded-lg p-4 glow-green">
        <div className="flex items-center gap-2 mb-4">
          <Sprout className="w-5 h-5 text-green-400" />
          <h3 className="text-white font-bold">RESOURCES</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border border-cyan-500/60 rounded-lg bg-cyan-900/10 gaming-button">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-cyan-300">Water</span>
            </div>
            <span className="font-bold text-white">{resources.water}L</span>
          </div>

          <div className="flex items-center justify-between p-3 border border-green-500/60 rounded-lg bg-green-900/10 gaming-button">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-green-300">Fertilizer</span>
            </div>
            <span className="font-bold text-white">{resources.fertilizer}kg</span>
          </div>

          <div className="p-3 border border-yellow-500/60 rounded-lg bg-yellow-900/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sprout className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium text-yellow-300">Seeds</span>
              </div>
              <span className="font-bold text-white">{totalSeeds}</span>
            </div>
            <div className="grid grid-cols-5 gap-1 text-xs">
              {Object.entries(resources.seeds).map(([crop, count]) => (
                <div key={crop} className="text-center p-2 bg-black/50 rounded border border-yellow-500/60">
                  <div className="font-bold text-yellow-300 text-sm">{count}</div>
                  <div className="text-gray-300 capitalize">{crop.slice(0, 3)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 border border-green-500/60 rounded-lg bg-green-900/10 gaming-button">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              <span className="text-sm font-medium text-green-300">Money</span>
            </div>
            <span className="text-lg font-bold text-white">
              ${resources.money.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Score */}
      <div className="gaming-card rounded-lg p-4 glow-yellow">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-yellow-400" />
          <h3 className="text-white font-bold">PERFORMANCE</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border border-green-500/60 rounded-lg bg-green-900/10 gaming-button">
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-green-300">Sustainability</span>
            </div>
            <span className="font-bold text-white">{Math.floor(score.sustainability)}%</span>
          </div>

          <div className="flex items-center justify-between p-3 border border-cyan-500/60 rounded-lg bg-cyan-900/10 gaming-button">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-cyan-300">Efficiency</span>
            </div>
            <span className="font-bold text-white">{Math.floor(score.efficiency)}%</span>
          </div>

          <div className="flex items-center justify-between p-3 border border-yellow-500/60 rounded-lg bg-yellow-900/10 gaming-button">
            <span className="text-sm font-medium text-yellow-300">Total Harvest</span>
            <span className="font-bold text-white">
              {score.cropYield.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
