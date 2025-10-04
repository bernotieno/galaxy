"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const gameCardVariants = cva(
  "rounded-xl border shadow-lg transition-all duration-300 hover:shadow-xl",
  {
    variants: {
      variant: {
        default: "bg-card/95 backdrop-blur-sm border-border/50",
        glass: "bg-white/10 backdrop-blur-md border-white/20",
        neon: "bg-slate-900/90 backdrop-blur-sm border-cyan-400/30 shadow-cyan-400/10",
        earth: "bg-gradient-to-br from-amber-50 to-green-50 border-amber-200/50",
        space: "bg-gradient-to-br from-slate-900 to-blue-900 border-blue-400/30 text-white",
        magic: "bg-gradient-to-br from-purple-900/90 to-pink-900/90 backdrop-blur-sm border-purple-400/30 text-white",
        success: "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50",
        warning: "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200/50",
        danger: "bg-gradient-to-br from-red-50 to-pink-50 border-red-200/50",
      },
      glow: {
        none: "",
        soft: "hover:shadow-lg",
        medium: "hover:shadow-xl hover:shadow-primary/10",
        strong: "hover:shadow-2xl hover:shadow-primary/20",
        neon: "hover:shadow-2xl hover:shadow-cyan-400/20",
      },
      interactive: {
        none: "",
        hover: "hover:scale-[1.02] cursor-pointer",
        press: "hover:scale-[1.02] active:scale-[0.98] cursor-pointer",
      }
    },
    defaultVariants: {
      variant: "default",
      glow: "medium",
      interactive: "none",
    },
  }
)

const gameCardHeaderVariants = cva(
  "flex flex-col space-y-1.5 p-4",
  {
    variants: {
      variant: {
        default: "",
        gradient: "bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-xl border-b border-border/50",
        neon: "bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-t-xl border-b border-cyan-400/20",
        space: "bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-t-xl border-b border-blue-400/30",
      }
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface GameCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gameCardVariants> {}

export interface GameCardHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gameCardHeaderVariants> {}

const GameCard = React.forwardRef<HTMLDivElement, GameCardProps>(
  ({ className, variant, glow, interactive, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(gameCardVariants({ variant, glow, interactive, className }))}
      {...props}
    />
  )
)
GameCard.displayName = "GameCard"

const GameCardHeader = React.forwardRef<HTMLDivElement, GameCardHeaderProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} className={cn(gameCardHeaderVariants({ variant, className }))} {...props} />
  )
)
GameCardHeader.displayName = "GameCardHeader"

const GameCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-bold leading-none tracking-tight text-lg", className)}
    {...props}
  />
))
GameCardTitle.displayName = "GameCardTitle"

const GameCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground opacity-80", className)}
    {...props}
  />
))
GameCardDescription.displayName = "GameCardDescription"

const GameCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-4 pt-0", className)} {...props} />
))
GameCardContent.displayName = "GameCardContent"

const GameCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-4 pt-0", className)}
    {...props}
  />
))
GameCardFooter.displayName = "GameCardFooter"

export {
  GameCard,
  GameCardHeader,
  GameCardFooter,
  GameCardTitle,
  GameCardDescription,
  GameCardContent,
}