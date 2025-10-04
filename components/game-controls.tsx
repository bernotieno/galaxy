"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { HelpTooltip } from "@/components/help-tooltip"
import type { CropType, GameState } from "@/lib/game-types"
import { CROP_DATA } from "@/lib/game-types"
import { Sprout, Droplets, Sparkles, Calendar, Play } from "lucide-react"

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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>Farm Actions</span>
            <HelpTooltip content="Select a farm cell first, then choose actions to plant crops, irrigate, fertilize, or harvest. Time progresses when you click 'Next Day'." />
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={onAdvanceDay} size="sm" variant="outline" className="gap-2 bg-transparent">
              <Calendar className="w-4 h-4" />
              Next Day
            </Button>
            <HelpTooltip content="Advance time by one day. Your crops will grow and weather conditions may change." />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!selectedCell ? (
          <div className="text-center py-8">
            <Sprout className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground font-medium">Select a farm cell to begin</p>
            <p className="text-xs text-muted-foreground">Click any empty green cell on the grid above</p>
          </div>
        ) : (
          <>
            {/* Plant Crops */}
            {canPlant && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Sprout className="w-4 h-4" />
                  Plant Crops
                  <HelpTooltip content="Choose a crop to plant in the selected cell. Each crop has different growth requirements - check the details below!" />
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
                          <Sprout className="w-4 h-4 mr-2" />
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
              <div className="space-y-2 pt-4 border-t">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  Crop Management
                  <HelpTooltip content="Care for your planted crops with irrigation and fertilization. Harvest when crops reach maturity!" />
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={onIrrigate}
                    disabled={gameState.resources.water < 10}
                    size="sm"
                    variant="outline"
                    className="gap-2 bg-transparent"
                  >
                    <Droplets className="w-4 h-4" />
                    Irrigate
                    <Badge variant="secondary" className="ml-auto">
                      10
                    </Badge>
                  </Button>

                  <Button
                    onClick={onFertilize}
                    disabled={gameState.resources.fertilizer < 5}
                    size="sm"
                    variant="outline"
                    className="gap-2 bg-transparent"
                  >
                    <Sparkles className="w-4 h-4" />
                    Fertilize
                    <Badge variant="secondary" className="ml-auto">
                      5
                    </Badge>
                  </Button>
                </div>

                {canHarvest && (
                  <Button onClick={onHarvest} className="w-full gap-2" size="sm">
                    <Play className="w-4 h-4" />
                    Harvest Crop
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
