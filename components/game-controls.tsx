"use client"

import { Button } from "@/components/ui/button"
import { GameCard, GameCardContent, GameCardHeader, GameCardTitle } from "@/components/ui/game-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { HelpTooltip } from "@/components/help-tooltip"
import type { CropType, GameState } from "@/lib/game-types"
import { CROP_DATA } from "@/lib/game-types"
import { Sprout, Droplets, Sparkles, Calendar, Play, Zap } from "lucide-react"

interface GameControlsProps {
  selectedCell: { row: number; col: number } | null
  onPlantCrop: (cropType: CropType) => void
  onIrrigate: () => void
  onFertilize: () => void
  onHarvest: () => void
  onAdvanceDay: () => void
  gameState: GameState
}

export function GameControls({
  selectedCell,
  onPlantCrop,
  onIrrigate,
  onFertilize,
  onHarvest,
  onAdvanceDay,
  gameState,
}: GameControlsProps) {
  const cell = selectedCell ? gameState.farmGrid[selectedCell.row][selectedCell.col] : null
  const canHarvest = cell?.crop?.stage === "harvest"
  const canPlant = cell && !cell.crop

  return (
    <GameCard variant="default">
      <GameCardHeader>
        <GameCardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-green-600" />
            <span>Farm Actions</span>
          </div>
          <Button onClick={onAdvanceDay} size="sm" variant="outline">
            <Calendar className="w-4 h-4 mr-1" />
            Next Day
          </Button>
        </GameCardTitle>
      </GameCardHeader>
      <GameCardContent className="space-y-4">
        {!selectedCell ? (
          <div className="text-center py-6 border rounded-lg bg-gray-50">
            <Sprout className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 font-medium">Select a farm cell to begin</p>
            <p className="text-xs text-gray-500">Click any empty cell on the grid above</p>
          </div>
        ) : (
          <>
            {/* Plant Crops */}
            {canPlant && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-green-600" />
                  Plant Crops
                </h4>
                <Tabs defaultValue="wheat" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="wheat">Wheat</TabsTrigger>
                    <TabsTrigger value="corn">Corn</TabsTrigger>
                    <TabsTrigger value="soybeans">Soy</TabsTrigger>
                    <TabsTrigger value="cotton">Cotton</TabsTrigger>
                    <TabsTrigger value="rice">Rice</TabsTrigger>
                  </TabsList>

                  {(["wheat", "corn", "soybeans", "cotton", "rice"] as CropType[]).map((cropType) => {
                    const cropData = CROP_DATA[cropType]
                    const available = gameState.resources.seeds[cropType]

                    return (
                      <TabsContent key={cropType} value={cropType} className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h5 className="font-semibold capitalize">{cropType}</h5>
                            <p className="text-xs text-muted-foreground">{cropData.description}</p>
                          </div>
                          <Badge variant={available > 0 ? "default" : "secondary"}>{available} seeds</Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">Growth Time:</span>
                            <p className="font-medium">{cropData.growthDays} days</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Water Needs:</span>
                            <p className="font-medium">{Math.floor(cropData.waterNeeds.optimal * 100)}%</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Optimal Temp:</span>
                            <p className="font-medium">
                              {cropData.optimalTemp[0]}-{cropData.optimalTemp[1]}°C
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Difficulty:</span>
                            <p className="font-medium capitalize">{cropData.difficulty}</p>
                          </div>
                        </div>

                        <Button
                          onClick={() => onPlantCrop(cropType)}
                          disabled={available <= 0}
                          className="w-full"
                          size="sm"
                        >
                          <Sprout className="w-4 h-4 mr-1" />
                          Plant {cropType}
                        </Button>
                      </TabsContent>
                    )
                  })}
                </Tabs>
              </div>
            )}

            {/* Crop Management */}
            {cell?.crop && (
              <div className="space-y-3 pt-4 border-t">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  Crop Management
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={onIrrigate}
                    disabled={gameState.resources.water < 10}
                    size="sm"
                    variant="outline"
                  >
                    <Droplets className="w-4 h-4 mr-1" />
                    Irrigate (10L)
                  </Button>

                  <Button
                    onClick={onFertilize}
                    disabled={gameState.resources.fertilizer < 5}
                    size="sm"
                    variant="outline"
                  >
                    <Sparkles className="w-4 h-4 mr-1" />
                    Fertilize (5kg)
                  </Button>
                </div>

                {canHarvest && (
                  <Button 
                    onClick={onHarvest} 
                    className="w-full" 
                    size="sm"
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Harvest Crop
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </GameCardContent>
    </GameCard>
  )
}
