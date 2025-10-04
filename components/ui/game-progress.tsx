"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const gameProgressVariants = cva(
  "relative overflow-hidden rounded-full transition-all duration-500",
  {
    variants: {
      variant: {
        default: "bg-secondary",
        energy: "bg-gradient-to-r from-purple-900 to-pink-900 border border-purple-400/30",
        health: "bg-gradient-to-r from-red-900 to-pink-900 border border-red-400/30",
        water: "bg-gradient-to-r from-blue-900 to-cyan-900 border border-blue-400/30",
        growth: "bg-gradient-to-r from-green-900 to-emerald-900 border border-green-400/30",
        xp: "bg-gradient-to-r from-amber-900 to-yellow-900 border border-amber-400/30",
        magic: "bg-gradient-to-r from-purple-900 to-indigo-900 border border-purple-400/30",
      },
      size: {
        sm: "h-2",
        default: "h-3",
        lg: "h-4",
        xl: "h-6",
      },
      glow: {
        none: "",
        soft: "shadow-sm",
        medium: "shadow-md",
        strong: "shadow-lg",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      glow: "none",
    },
  }
)

const gameProgressFillVariants = cva(
  "h-full transition-all duration-700 ease-out relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary",
        energy: "bg-gradient-to-r from-purple-400 to-pink-400",
        health: "bg-gradient-to-r from-red-400 to-pink-400",
        water: "bg-gradient-to-r from-blue-400 to-cyan-400",
        growth: "bg-gradient-to-r from-green-400 to-emerald-400",
        xp: "bg-gradient-to-r from-amber-400 to-yellow-400",
        magic: "bg-gradient-to-r from-purple-400 to-indigo-400",
      },
      animated: {
        true: "after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/30 after:to-transparent after:animate-pulse",
        false: "",
      }
    },
    defaultVariants: {
      variant: "default",
      animated: false,
    },
  }
)

export interface GameProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gameProgressVariants> {
  value?: number
  max?: number
  animated?: boolean
  showValue?: boolean
  label?: string
}

const GameProgress = React.forwardRef<HTMLDivElement, GameProgressProps>(
  ({ 
    className, 
    variant, 
    size, 
    glow, 
    value = 0, 
    max = 100, 
    animated = false,
    showValue = false,
    label,
    ...props 
  }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
    
    return (
      <div className="space-y-1">
        {(label || showValue) && (
          <div className="flex justify-between items-center text-xs">
            {label && <span className="text-muted-foreground">{label}</span>}
            {showValue && (
              <span className="font-medium">
                {value}/{max}
              </span>
            )}
          </div>
        )}
        <div
          ref={ref}
          className={cn(gameProgressVariants({ variant, size, glow, className }))}
          {...props}
        >
          <div
            className={cn(gameProgressFillVariants({ variant, animated }))}
            style={{ width: `${percentage}%` }}
          >
            {animated && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
            )}
          </div>
          
          {/* Glow effect overlay */}
          {glow !== "none" && (
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"
              style={{ width: `${percentage}%` }}
            />
          )}
        </div>
      </div>
    )
  }
)
GameProgress.displayName = "GameProgress"

export { GameProgress, gameProgressVariants }