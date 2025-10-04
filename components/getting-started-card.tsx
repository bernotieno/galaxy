"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Lightbulb,
  Target,
  Droplets,
  Sprout,
  Calendar,
  TrendingUp,
  X,
  ChevronRight
} from "lucide-react"

interface GettingStartedCardProps {
  onStartTutorial: () => void
  onDismiss: () => void
  className?: string
}

export function GettingStartedCard({ onStartTutorial, onDismiss, className }: GettingStartedCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const quickSteps = [
    {
      icon: <Target className="w-4 h-4 text-blue-500" />,
      title: "Select a cell",
      description: "Click any empty green cell on the farm grid"
    },
    {
      icon: <Sprout className="w-4 h-4 text-green-500" />,
      title: "Plant crops",
      description: "Choose a crop type and plant it (wheat is great for beginners)"
    },
    {
      icon: <Droplets className="w-4 h-4 text-blue-400" />,
      title: "Care for crops",
      description: "Use irrigate and fertilize to help your crops grow"
    },
    {
      icon: <Calendar className="w-4 h-4 text-purple-500" />,
      title: "Advance time",
      description: "Click 'Next Day' to progress through growth stages"
    },
    {
      icon: <TrendingUp className="w-4 h-4 text-orange-500" />,
      title: "Harvest & earn",
      description: "Collect mature crops to earn money and grow your farm"
    }
  ]

  return (
    <Card className={`border-2 border-primary/20 bg-gradient-to-br from-background to-primary/5 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <CardTitle className="text-lg">Getting Started</CardTitle>
            <Badge variant="secondary" className="text-xs">New Player</Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={onDismiss}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Welcome to GeoHarvest! Learn sustainable farming using real satellite data.
        </p>

        <div className="flex gap-2">
          <Button onClick={onStartTutorial} className="gap-2 flex-1">
            <Lightbulb className="w-4 h-4" />
            Start Tutorial
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="gap-2"
          >
            Quick Guide
            <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          </Button>
        </div>

        {isExpanded && (
          <div className="space-y-3 pt-2 border-t">
            <h4 className="text-sm font-semibold">Quick Steps:</h4>
            <div className="space-y-2">
              {quickSteps.map((step, index) => (
                <div key={index} className="flex items-start gap-3 text-sm">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                    {step.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium">{step.title}</p>
                    <p className="text-muted-foreground text-xs">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}