"use client"
import { cn } from "@/lib/utils"
import type { FarmCell, CropType } from "@/lib/game-types"

interface FarmGridProps {
  grid: FarmCell[][]
  onCellClick: (row: number, col: number) => void
  selectedCell: { row: number; col: number } | null
}

const CROP_COLORS: Record<CropType, string> = {
  wheat: "bg-amber-400",
  corn: "bg-yellow-500",
  soybeans: "bg-green-600",
  cotton: "bg-gray-100",
  rice: "bg-emerald-500",
}

const STAGE_OPACITY: Record<string, string> = {
  planted: "opacity-30 scale-75",
  germination: "opacity-50 scale-85",
  vegetative: "opacity-70 scale-95",
  flowering: "opacity-85 scale-100",
  mature: "opacity-95 scale-105",
  harvest: "opacity-100 scale-110 animate-pulse",
}

export function FarmGrid({ grid, onCellClick, selectedCell }: FarmGridProps) {
  return (
    <div className="relative w-full aspect-square bg-gradient-to-b from-[oklch(0.65_0.12_60)] to-[oklch(0.5_0.1_30)] rounded-lg p-4 shadow-lg">
      <div className="grid gap-1 h-full" style={{ gridTemplateColumns: `repeat(${grid[0].length}, 1fr)` }}>
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex
            const moistureLevel = Math.floor(cell.soilMoisture * 100)

            return (
              <button
                key={cell.id}
                onClick={() => onCellClick(rowIndex, colIndex)}
                className={cn(
                  "relative rounded border-2 transition-all duration-300 hover:scale-105 hover:shadow-md",
                  "bg-gradient-to-br from-[oklch(0.45_0.08_40)] to-[oklch(0.35_0.06_35)]",
                  isSelected ? "border-primary ring-2 ring-primary" : "border-[oklch(0.3_0.04_40)]",
                  cell.irrigated && "ring-2 ring-blue-400 animate-pulse",
                  cell.fertilized && "border-green-400",
                )}
              >
                {/* Soil moisture indicator */}
                <div className="absolute inset-0 bg-blue-500/20 rounded" style={{ opacity: cell.soilMoisture }} />

                {/* Crop visualization */}
                {cell.crop && (
                  <div
                    className={cn(
                      "absolute inset-1 rounded flex items-center justify-center transition-all duration-300",
                      CROP_COLORS[cell.crop.type],
                      STAGE_OPACITY[cell.crop.stage],
                    )}
                  >
                    <div className="text-xs font-bold text-white drop-shadow-md">{cell.crop.type[0].toUpperCase()}</div>
                    {/* Growth progress ring */}
                    <div
                      className="absolute inset-0 rounded border-2 border-white/30"
                      style={{
                        background: `conic-gradient(from 0deg, rgba(255,255,255,0.4) ${cell.crop.growthProgress * 3.6}deg, transparent ${cell.crop.growthProgress * 3.6}deg)`
                      }}
                    />
                  </div>
                )}

                {/* Health indicator */}
                {cell.crop && cell.crop.health < 50 && (
                  <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                )}

                {/* Fertilized indicator */}
                {cell.fertilized && (
                  <div className="absolute bottom-0 left-0 w-3 h-3 bg-green-500 rounded-full animate-bounce border border-white" />
                )}

                {/* Irrigation indicator */}
                {cell.irrigated && (
                  <div className="absolute top-0 left-0 w-3 h-3 bg-blue-500 rounded-full animate-pulse border border-white" />
                )}
              </button>
            )
          }),
        )}
      </div>
    </div>
  )
}
