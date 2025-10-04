"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { HelpTooltip } from "@/components/help-tooltip"
import type { GameState } from "@/lib/game-types"
import { Droplets, Sparkles, Sprout, DollarSign, Leaf, TrendingUp, Award } from "lucide-react"

interface ResourcePanelProps {
  gameState: GameState
}

export function ResourcePanel({ gameState }: ResourcePanelProps) {
  const { resources, score } = gameState

  const totalSeeds = Object.values(resources.seeds).reduce((sum, count) => sum + count, 0)

  return (
    <div className="space-y-4">
      {/* Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-500" />
                Water
                <HelpTooltip content="Water is used to irrigate crops. Each irrigation costs 10L. Good soil moisture helps crops grow healthy." />
              </span>
              <span className="font-bold">{resources.water}L</span>
            </div>
            <Progress value={(resources.water / 2000) * 100} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-green-500" />
                Fertilizer
                <HelpTooltip content="Fertilizer boosts crop growth and health. Each application costs 5kg. Use wisely - overuse hurts sustainability!" />
              </span>
              <span className="font-bold">{resources.fertilizer}kg</span>
            </div>
            <Progress value={(resources.fertilizer / 1000) * 100} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <Sprout className="w-4 h-4 text-amber-500" />
                Seeds
                <HelpTooltip content="Seeds are needed to plant crops. Different crops have different growth times and requirements. Check crop details before planting!" />
              </span>
              <span className="font-bold">{totalSeeds}</span>
            </div>
            <div className="grid grid-cols-5 gap-1 text-xs">
              {Object.entries(resources.seeds).map(([crop, count]) => (
                <div key={crop} className="text-center">
                  <div className="font-medium">{count}</div>
                  <div className="text-muted-foreground capitalize">{crop.slice(0, 3)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-emerald-500" />
                Money
              </span>
              <span className="text-xl font-bold">${resources.money.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Score */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="w-5 h-5" />
            Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-green-600" />
                Sustainability
                <HelpTooltip content="Measures your environmental impact. Efficient water/fertilizer use, crop diversity, and soil health increase this score." />
              </span>
              <span className="font-bold">{Math.floor(score.sustainability)}</span>
            </div>
            <Progress value={score.sustainability} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                Efficiency
              </span>
              <span className="font-bold">{Math.floor(score.efficiency)}</span>
            </div>
            <Progress value={score.efficiency} className="h-2" />
          </div>

          <div className="pt-2 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Crop Yield</span>
              <span className="text-lg font-bold">{score.cropYield.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Game Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Farm Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Date</span>
            <span className="font-medium">{gameState.currentDate.toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Temperature</span>
            <span className="font-medium">{Math.floor(gameState.weather.temperature)}°C</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Precipitation</span>
            <span className="font-medium">{gameState.weather.precipitation.toFixed(1)}mm</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Location</span>
            <span className="font-medium text-xs">
              {gameState.farmLocation.latitude.toFixed(2)}°, {gameState.farmLocation.longitude.toFixed(2)}°
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
