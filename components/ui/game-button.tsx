"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const gameButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 transform hover:scale-105 active:scale-95 shadow-lg",
  {
    variants: {
      variant: {
        primary: "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-blue-500/25 hover:shadow-blue-500/40 border border-blue-400/50",
        success: "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-green-500/25 hover:shadow-green-500/40 border border-green-400/50",
        warning: "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-amber-500/25 hover:shadow-amber-500/40 border border-amber-400/50",
        danger: "bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-red-500/25 hover:shadow-red-500/40 border border-red-400/50",
        magic: "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-purple-500/25 hover:shadow-purple-500/40 border border-purple-400/50",
        earth: "bg-gradient-to-r from-amber-700 to-yellow-600 text-white shadow-amber-500/25 hover:shadow-amber-500/40 border border-amber-400/50",
        water: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-blue-500/25 hover:shadow-blue-500/40 border border-blue-400/50",
        outline: "border-2 border-primary bg-background/80 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/80",
        ghost: "bg-background/50 backdrop-blur-sm hover:bg-primary/10 border border-border/50",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        default: "h-10 px-4 py-2",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-lg",
        icon: "h-10 w-10",
      },
      glow: {
        none: "",
        soft: "hover:shadow-lg",
        medium: "hover:shadow-xl",
        strong: "hover:shadow-2xl",
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      glow: "medium",
    },
  }
)

export interface GameButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof gameButtonVariants> {
  asChild?: boolean
  loading?: boolean
  icon?: React.ReactNode
}

const GameButton = React.forwardRef<HTMLButtonElement, GameButtonProps>(
  ({ className, variant, size, glow, asChild = false, loading, icon, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(gameButtonVariants({ variant, size, glow, className }))}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {!loading && icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </Comp>
    )
  }
)
GameButton.displayName = "GameButton"

export { GameButton, gameButtonVariants }