"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowRight,
  ArrowLeft,
  X,
  Lightbulb,
  Target,
  CheckCircle,
  Play,
  Sparkles
} from "lucide-react"

interface TutorialStep {
  id: string
  title: string
  description: string
  target?: string
  action?: string
  tip?: string
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: "welcome",
    title: "Welcome to GeoHarvest!",
    description: "Learn sustainable farming using real NASA satellite data. This tutorial will guide you through the basics.",
    tip: "Take your time to learn each step - good farming takes patience!"
  },
  {
    id: "interface",
    title: "Game Interface",
    description: "The game has three main tabs: Farm (manage your crops), Satellite (view NASA data), and Learn (educational content).",
    target: "tabs",
    tip: "Start with the Farm tab to begin growing your first crops."
  },
  {
    id: "resources",
    title: "Your Resources",
    description: "You start with money, seeds, water, and fertilizer. Manage these carefully to grow successful crops.",
    target: "resources",
    tip: "Check your resources regularly - running out can hurt your farm!"
  },
  {
    id: "select-cell",
    title: "Select a Farm Cell",
    description: "Click on any empty green cell in the 8x8 farm grid to select it. This is where you'll plant your crops.",
    target: "farm-grid",
    action: "Click an empty cell"
  },
  {
    id: "plant-crop",
    title: "Plant Your First Crop",
    description: "With a cell selected, choose a crop type and click 'Plant'. Wheat is great for beginners!",
    target: "controls",
    action: "Plant wheat",
    tip: "Each crop has different needs - check the requirements before planting."
  },
  {
    id: "crop-care",
    title: "Care for Your Crops",
    description: "Use the Irrigate and Fertilize buttons to help your crops grow healthy. Monitor their water and health levels.",
    target: "controls",
    tip: "Don't over-water or over-fertilize - balance is key to sustainability!"
  },
  {
    id: "advance-time",
    title: "Advance Days",
    description: "Click 'Next Day' to progress time. Your crops will grow through different stages until ready for harvest.",
    target: "next-day",
    action: "Click Next Day",
    tip: "Crops take several days to grow - be patient and check on them daily."
  },
  {
    id: "harvest",
    title: "Harvest & Earn",
    description: "When crops reach 'Harvest' stage, click them and use the Harvest button to collect them and earn money.",
    tip: "Successful harvests give you money to buy more seeds and expand your farm!"
  },
  {
    id: "nasa-data",
    title: "NASA Integration",
    description: "Switch to the Satellite tab to see real NASA data that affects your farm - soil moisture, temperature, and vegetation health.",
    target: "satellite-tab",
    tip: "Real satellite data makes the game more realistic and educational!"
  },
  {
    id: "sustainability",
    title: "Sustainability Score",
    description: "Your farming choices affect your sustainability score. Efficient water use and crop diversity improve your score.",
    tip: "Good farmers care for the environment while growing food!"
  },
  {
    id: "complete",
    title: "You're Ready to Farm!",
    description: "You now know the basics! Experiment with different crops, monitor NASA data, and build a sustainable farm.",
    tip: "Remember: sustainable farming is about balance, patience, and learning from data."
  }
]

interface OnboardingTutorialProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

export function OnboardingTutorial({ isOpen, onClose, onComplete }: OnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())

  const step = TUTORIAL_STEPS[currentStep]
  const progress = ((currentStep + 1) / TUTORIAL_STEPS.length) * 100

  const handleNext = () => {
    setCompletedSteps(prev => new Set([...prev, step.id]))

    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    onClose()
  }

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              Farm Tutorial
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleSkip}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Step {currentStep + 1} of {TUTORIAL_STEPS.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Navigator */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {TUTORIAL_STEPS.map((tutorialStep, index) => (
              <button
                key={tutorialStep.id}
                onClick={() => handleStepClick(index)}
                className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-medium transition-colors ${
                  index === currentStep
                    ? "border-primary bg-primary text-primary-foreground"
                    : completedSteps.has(tutorialStep.id)
                    ? "border-green-500 bg-green-500 text-white"
                    : index < currentStep
                    ? "border-muted bg-muted text-muted-foreground"
                    : "border-muted-foreground/30 text-muted-foreground hover:border-muted-foreground/50"
                }`}
              >
                {completedSteps.has(tutorialStep.id) ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </button>
            ))}
          </div>

          {/* Current Step Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                {step.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>

              {step.action && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-md border border-blue-200 dark:border-blue-800">
                  <Play className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Action: {step.action}
                  </span>
                </div>
              )}

              {step.tip && (
                <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-md border border-yellow-200 dark:border-yellow-800">
                  <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Tip:</strong> {step.tip}
                  </span>
                </div>
              )}

              {step.target && (
                <Badge variant="outline" className="inline-flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  Focus: {step.target}
                </Badge>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="flex gap-2">
              <Button variant="ghost" onClick={handleSkip}>
                Skip Tutorial
              </Button>
              <Button onClick={handleNext} className="gap-2">
                {currentStep === TUTORIAL_STEPS.length - 1 ? "Complete" : "Next"}
                {currentStep !== TUTORIAL_STEPS.length - 1 && <ArrowRight className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function TutorialTrigger({ onStart }: { onStart: () => void }) {
  return (
    <Button
      onClick={onStart}
      variant="outline"
      size="sm"
      className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 hover:from-blue-600 hover:to-purple-700"
    >
      <Lightbulb className="w-4 h-4" />
      Tutorial
    </Button>
  )
}