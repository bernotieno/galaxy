"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import type { FarmCell, CropType } from "@/lib/game-types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Zap,
  Droplets,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Eye,
  Maximize2,
  Grid3X3,
  Layers,
  BarChart3
} from "lucide-react"

interface EnhancedFarmGridProps {
  grid: FarmCell[][]
  onCellClick: (row: number, col: number) => void
  selectedCell: { row: number; col: number } | null
}

type ViewMode = "normal" | "soil" | "moisture" | "health" | "analytics"

const CROP_COLORS: Record<CropType, string> = {
  wheat: "bg-gradient-to-br from-amber-300 to-amber-500",
  corn: "bg-gradient-to-br from-yellow-400 to-yellow-600",
  soybeans: "bg-gradient-to-br from-green-500 to-green-700",
  cotton: "bg-gradient-to-br from-gray-100 to-gray-300",
  rice: "bg-gradient-to-br from-emerald-400 to-emerald-600",
}

const CROP_EMOJIS: Record<CropType, string> = {
  wheat: "🌾",
  corn: "🌽",
  soybeans: "🫘",
  cotton: "🌿",
  rice: "🌾",
}

const STAGE_STYLES: Record<string, string> = {
  planted: "opacity-40 scale-75 grayscale",
  germination: "opacity-60 scale-85",
  vegetative: "opacity-80 scale-95",
  flowering: "opacity-90 scale-100",
  mature: "opacity-95 scale-105",
  harvest: "opacity-100 scale-110 animate-pulse shadow-lg",
}

export function EnhancedFarmGrid({ grid, onCellClick, selectedCell }: EnhancedFarmGridProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("normal")
  const [isZoomed, setIsZoomed] = useState(false)
  const [hoveredCell, setHoveredCell] = useState<{row: number, col: number} | null>(null)
  const [showGrid, setShowGrid] = useState(true)
  const [animations, setAnimations] = useState(true)

  // Calculate grid statistics
  const totalCells = grid.length * grid[0].length
  const occupiedCells = grid.flat().filter(cell => cell.crop).length
  const readyToHarvest = grid.flat().filter(cell => cell.crop?.stage === "harvest").length
  const needsAttention = grid.flat().filter(cell =>
    cell.crop && (cell.crop.health < 50 || cell.soilMoisture < 0.2)
  ).length

  const getOverlayColor = (cell: FarmCell, mode: ViewMode) => {
    switch (mode) {
      case "soil":
        const quality = cell.soilQuality / 100
        return `rgba(139, 69, 19, ${1 - quality})`
      case "moisture":
        return `rgba(59, 130, 246, ${cell.soilMoisture})`
      case "health":
        if (!cell.crop) return "rgba(128, 128, 128, 0.3)"
        const health = cell.crop.health / 100
        return health > 0.7 ? `rgba(34, 197, 94, ${health})` : `rgba(239, 68, 68, ${1 - health})`
      case "analytics":
        const score = (cell.soilQuality / 100 + cell.soilMoisture + (cell.crop?.health || 50) / 100) / 3
        return `rgba(147, 51, 234, ${score})`
      default:
        return "transparent"
    }
  }

  const getCellInfo = (cell: FarmCell) => {
    switch (viewMode) {
      case "soil":
        return `${Math.floor(cell.soilQuality)}%`
      case "moisture":
        return `${Math.floor(cell.soilMoisture * 100)}%`
      case "health":
        return cell.crop ? `${Math.floor(cell.crop.health)}%` : "N/A"
      case "analytics":
        const score = (cell.soilQuality / 100 + cell.soilMoisture + (cell.crop?.health || 50) / 100) / 3
        return `${Math.floor(score * 100)}%`
      default:
        return ""
    }
  }

  return (
    <div className="space-y-4">
      {/* Control Panel */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2 items-center justify-between">
            {/* View Mode Selector */}
            <div className="flex gap-1">
              <Button
                variant={viewMode === "normal" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("normal")}
                className="gap-2"
              >
                <Eye className="w-4 h-4" />
                Normal
              </Button>
              <Button
                variant={viewMode === "soil" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("soil")}
                className="gap-2"
              >
                <Layers className="w-4 h-4" />
                Soil
              </Button>
              <Button
                variant={viewMode === "moisture" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("moisture")}
                className="gap-2"
              >
                <Droplets className="w-4 h-4" />
                Moisture
              </Button>
              <Button
                variant={viewMode === "health" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("health")}
                className="gap-2"
              >
                <Zap className="w-4 h-4" />
                Health
              </Button>
              <Button
                variant={viewMode === "analytics" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("analytics")}
                className="gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </Button>
            </div>

            {/* Grid Options */}
            <div className="flex gap-2 items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowGrid(!showGrid)}
                className="gap-2"
              >
                <Grid3X3 className="w-4 h-4" />
                {showGrid ? "Hide" : "Show"} Grid
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsZoomed(!isZoomed)}
                className="gap-2"
              >
                <Maximize2 className="w-4 h-4" />
                {isZoomed ? "Zoom Out" : "Zoom In"}
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-3 text-sm">
              <Badge variant="outline" className="gap-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                {occupiedCells}/{totalCells}
              </Badge>
              {readyToHarvest > 0 && (
                <Badge variant="outline" className="gap-1 bg-green-50">
                  🌾 {readyToHarvest} Ready
                </Badge>
              )}
              {needsAttention > 0 && (
                <Badge variant="outline" className="gap-1 bg-red-50">
                  <AlertTriangle className="w-3 h-3 text-red-500" />
                  {needsAttention} Need Care
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Farm Grid */}
      <div className={`relative bg-gradient-to-br from-green-100 via-green-50 to-emerald-100 rounded-xl p-6 shadow-lg transition-all duration-500 ${
        isZoomed ? "scale-110 z-10" : ""
      }`}>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(76,175,80,0.3)_0%,transparent_50%)]"></div>
          <div className="w-full h-full bg-[radial-gradient(circle_at_80%_80%,rgba(139,195,74,0.3)_0%,transparent_50%)]"></div>
        </div>

        {/* Grid Container */}
        <div
          className={`relative grid gap-2 h-full transition-all duration-300 ${
            showGrid ? "border border-green-200 rounded-lg p-2" : ""
          }`}
          style={{
            gridTemplateColumns: `repeat(${grid[0].length}, 1fr)`,
            aspectRatio: "1",
            minHeight: isZoomed ? "600px" : "400px"
          }}
        >
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex
              const isHovered = hoveredCell?.row === rowIndex && hoveredCell?.col === colIndex
              const needsAttention = cell.crop && (cell.crop.health < 50 || cell.soilMoisture < 0.2)

              return (
                <button
                  key={cell.id}
                  onClick={() => onCellClick(rowIndex, colIndex)}
                  onMouseEnter={() => setHoveredCell({row: rowIndex, col: colIndex})}
                  onMouseLeave={() => setHoveredCell(null)}
                  className={cn(
                    "relative rounded-lg border-2 transition-all duration-300 group overflow-hidden",
                    "hover:scale-105 hover:shadow-lg hover:z-10",
                    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
                    isSelected ? "border-blue-500 ring-2 ring-blue-300 scale-105 z-20" : "border-green-300/50",
                    isHovered && !isSelected ? "border-blue-300 scale-102" : "",
                    cell.irrigated && "ring-2 ring-blue-400 shadow-blue-200 shadow-lg",
                    cell.fertilized && "ring-2 ring-green-400 shadow-green-200 shadow-lg",
                    needsAttention && "border-red-400 animate-pulse",
                    showGrid ? "border-opacity-100" : "border-opacity-0"
                  )}
                  style={{
                    background: viewMode === "normal"
                      ? `linear-gradient(135deg,
                          oklch(0.6 0.1 120) 0%,
                          oklch(0.5 0.08 130) 50%,
                          oklch(0.45 0.06 140) 100%)`
                      : `linear-gradient(135deg,
                          oklch(0.6 0.1 120) 0%,
                          oklch(0.5 0.08 130) 100%)`,
                  }}
                >
                  {/* View Mode Overlay */}
                  {viewMode !== "normal" && (
                    <div
                      className="absolute inset-0 rounded-lg transition-all duration-300"
                      style={{ backgroundColor: getOverlayColor(cell, viewMode) }}
                    />
                  )}

                  {/* Soil moisture indicator */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-blue-400/30 to-transparent rounded-lg transition-all duration-300"
                    style={{ opacity: cell.soilMoisture * 0.7 }}
                  />

                  {/* Crop visualization */}
                  {cell.crop && (
                    <div
                      className={cn(
                        "absolute inset-1 rounded-md flex flex-col items-center justify-center transition-all duration-500",
                        CROP_COLORS[cell.crop.type],
                        STAGE_STYLES[cell.crop.stage],
                        animations && "transform-gpu"
                      )}
                    >
                      {/* Crop emoji or letter */}
                      <div className="text-lg font-bold text-white drop-shadow-lg mb-1">
                        {isZoomed ? CROP_EMOJIS[cell.crop.type] : cell.crop.type[0].toUpperCase()}
                      </div>

                      {/* Growth progress ring */}
                      <div
                        className="absolute inset-0 rounded-md"
                        style={{
                          background: `conic-gradient(from 0deg,
                            rgba(255,255,255,0.6) 0deg,
                            rgba(255,255,255,0.6) ${cell.crop.growthProgress * 3.6}deg,
                            transparent ${cell.crop.growthProgress * 3.6}deg,
                            transparent 360deg)`,
                          mask: "radial-gradient(circle, transparent 60%, black 65%)"
                        }}
                      />

                      {/* Stage indicator */}
                      {isZoomed && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 rounded-b-md">
                          {cell.crop.stage}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Status indicators */}
                  <div className="absolute top-1 right-1 flex flex-col gap-1">
                    {/* Health indicator */}
                    {cell.crop && cell.crop.health < 50 && (
                      <div className="w-3 h-3 bg-red-500 rounded-full border border-white animate-pulse"
                           title={`Health: ${Math.floor(cell.crop.health)}%`} />
                    )}

                    {/* Ready to harvest */}
                    {cell.crop?.stage === "harvest" && (
                      <div className="w-3 h-3 bg-yellow-400 rounded-full border border-white animate-bounce"
                           title="Ready to harvest!" />
                    )}
                  </div>

                  {/* Action indicators */}
                  <div className="absolute bottom-1 left-1 flex gap-1">
                    {/* Fertilized indicator */}
                    {cell.fertilized && (
                      <div className="w-3 h-3 bg-green-500 rounded-full border border-white animate-bounce">
                        <Sparkles className="w-2 h-2 text-white m-0.5" />
                      </div>
                    )}

                    {/* Irrigation indicator */}
                    {cell.irrigated && (
                      <div className="w-3 h-3 bg-blue-500 rounded-full border border-white animate-pulse">
                        <Droplets className="w-2 h-2 text-white m-0.5" />
                      </div>
                    )}
                  </div>

                  {/* View mode info overlay */}
                  {viewMode !== "normal" && (isHovered || isSelected) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
                      <div className="text-white font-bold text-sm bg-black/50 px-2 py-1 rounded">
                        {getCellInfo(cell)}
                      </div>
                    </div>
                  )}

                  {/* Selection highlight */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-blue-400/20 rounded-lg animate-pulse" />
                  )}

                  {/* Hover effect */}
                  {isHovered && !isSelected && (
                    <div className="absolute inset-0 bg-white/10 rounded-lg" />
                  )}
                </button>
              )
            })
          )}
        </div>

        {/* Grid coordinates (optional) */}
        {showGrid && isZoomed && (
          <div className="absolute -top-4 left-6 right-6 flex justify-between text-xs text-muted-foreground">
            {Array.from({length: grid[0].length}, (_, i) => (
              <span key={i} className="w-8 text-center">{i}</span>
            ))}
          </div>
        )}
      </div>

      {/* Legend */}
      {viewMode !== "normal" && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-500"></div>
                <span>Poor ({viewMode === "soil" ? "Quality" : viewMode === "moisture" ? "Dry" : "Unhealthy"})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-yellow-500"></div>
                <span>Average</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-500"></div>
                <span>Good ({viewMode === "soil" ? "Quality" : viewMode === "moisture" ? "Moist" : "Healthy"})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-500"></div>
                <span>Excellent</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}