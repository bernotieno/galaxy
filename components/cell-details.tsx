"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { HelpTooltip } from "@/components/help-tooltip"
import type { FarmCell } from "@/lib/game-types"
import { CROP_DATA } from "@/lib/game-types"
import { MapPin, Droplets, Sprout } from "lucide-react"

interface CellDetailsProps {
  cell: FarmCell | null
}

export function CellDetails({ cell }: CellDetailsProps) {
  if (!cell) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Cell Details
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground font-medium">No cell selected</p>
          <p className="text-xs text-muted-foreground">Click a farm cell to view details</p>
        </CardContent>
      </Card>
    )
  }

  const cropData = cell.crop ? CROP_DATA[cell.crop.type] : null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Cell ({cell.row}, {cell.col})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Soil Information */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <Droplets className="w-3 h-3" />
              Soil Moisture
              <HelpTooltip content="Soil moisture affects crop growth. Higher moisture (blue) is generally better, but too much can cause problems." variant="inline" />
            </span>
            <span className="font-medium">{Math.floor(cell.soilMoisture * 100)}%</span>
          </div>
          <Progress value={cell.soilMoisture * 100} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Soil Quality</span>
            <span className="font-medium">{Math.floor(cell.soilQuality)}</span>
          </div>
          <Progress value={cell.soilQuality} className="h-2" />
        </div>

        {/* Crop Information */}
        {cell.crop ? (
          <>
            <div className="pt-2 border-t">
              <h4 className="font-semibold mb-2 capitalize">{cell.crop.type}</h4>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Growth Stage</span>
                  <span className="font-medium capitalize">{cell.crop.stage}</span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Growth Progress</span>
                    <span className="font-medium text-green-600">{Math.floor(cell.crop.growthProgress)}%</span>
                  </div>
                  <Progress value={cell.crop.growthProgress} className="h-3 transition-all duration-500" />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Health</span>
                    <span className={`font-medium ${cell.crop.health > 75 ? 'text-green-600' : cell.crop.health > 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {Math.floor(cell.crop.health)}%
                    </span>
                  </div>
                  <Progress value={cell.crop.health} className="h-3 transition-all duration-500" />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Water Level</span>
                    <span className={`font-medium ${cell.crop.waterLevel > 60 ? 'text-blue-600' : cell.crop.waterLevel > 30 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {Math.floor(cell.crop.waterLevel)}%
                    </span>
                  </div>
                  <Progress value={cell.crop.waterLevel} className="h-3 transition-all duration-500" />
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Days Planted</span>
                  <span className="font-medium">{cell.crop.daysPlanted}</span>
                </div>
              </div>
            </div>

            {cropData && (
              <div className="pt-2 border-t text-xs text-muted-foreground space-y-1">
                <div>
                  Optimal Temp: {cropData.optimalTemp[0]}-{cropData.optimalTemp[1]}°C
                </div>
                <div>Growth Days: {cropData.growthDays}</div>
                <div>Water Needs: {Math.floor(cropData.waterNeeds.optimal * 100)}%</div>
              </div>
            )}
          </>
        ) : (
          <div className="pt-2 border-t text-center py-4">
            <Sprout className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground font-medium">No crop planted</p>
            <p className="text-xs text-muted-foreground">Use the Farm Actions panel to plant a crop</p>
          </div>
        )}

        {/* Status Indicators */}
        <div className="pt-2 border-t flex gap-2">
          {cell.irrigated && <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">Irrigated</span>}
          {cell.fertilized && <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">Fertilized</span>}
        </div>
      </CardContent>
    </Card>
  )
}
