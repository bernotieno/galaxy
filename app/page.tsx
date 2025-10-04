"use client"

import { useState, useEffect } from "react"
import { useGameState } from "@/hooks/use-game-state"
import { FarmGrid } from "@/components/farm-grid"
import { CellDetails } from "@/components/cell-details"
import { GameControls } from "@/components/game-controls"
import { ResourcePanel } from "@/components/resource-panel"
import { SatelliteDashboard } from "@/components/satellite-dashboard"
import { DataInsights } from "@/components/data-insights"
import { EducationalContent } from "@/components/educational-content"
import { NASAStatus } from "@/components/nasa-status"
import { OnboardingTutorial, TutorialTrigger } from "@/components/onboarding-tutorial"
import { GettingStartedCard } from "@/components/getting-started-card"
import { QuickTip } from "@/components/help-tooltip"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/sonner"
import type { CropType } from "@/lib/game-types"
import { Satellite, Tractor, BookOpen } from "lucide-react"
import { toast } from "sonner"

export default function Home() {
  const { state, plantCrop, irrigate, fertilize, harvestCrop, advanceDay, updateWithNASAData } = useGameState()
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [showTutorial, setShowTutorial] = useState(false)
  const [showGettingStarted, setShowGettingStarted] = useState(true)

  // Check if this is a first-time user
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial')
    if (!hasSeenTutorial) {
      setShowGettingStarted(true)
    } else {
      setShowGettingStarted(false)
    }
  }, [])

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell({ row, col })
  }

  const handlePlantCrop = (cropType: CropType) => {
    if (selectedCell) {
      const success = plantCrop(selectedCell.row, selectedCell.col, cropType)
      if (success) {
        toast.success(`🌱 Planted ${cropType} successfully!`, {
          description: `Cell (${selectedCell.row}, ${selectedCell.col})`
        })
      } else {
        toast.error("Cannot plant crop", {
          description: "Not enough seeds or cell already occupied"
        })
      }
    }
  }

  const handleIrrigate = () => {
    if (selectedCell) {
      const success = irrigate(selectedCell.row, selectedCell.col)
      if (success) {
        toast.success("💧 Irrigation successful!", {
          description: `Added water & +2% growth to cell (${selectedCell.row}, ${selectedCell.col})`
        })
      } else {
        toast.error("Cannot irrigate", {
          description: "Not enough water (-10L required)"
        })
      }
    }
  }

  const handleFertilize = () => {
    if (selectedCell) {
      const success = fertilize(selectedCell.row, selectedCell.col)
      if (success) {
        toast.success("✨ Fertilized successfully!", {
          description: `Enhanced soil quality & +3% growth at cell (${selectedCell.row}, ${selectedCell.col})`
        })
      } else {
        toast.error("Cannot fertilize", {
          description: "Not enough fertilizer (-5kg required)"
        })
      }
    }
  }

  const handleHarvest = () => {
    if (selectedCell) {
      const earnings = harvestCrop(selectedCell.row, selectedCell.col)
      if (earnings > 0) {
        toast.success(`🌾 Harvest successful! +$${earnings}`, {
          description: `Cell (${selectedCell.row}, ${selectedCell.col}) is now ready for replanting`
        })
      } else {
        toast.error("Cannot harvest", {
          description: "Crop is not ready or no crop planted"
        })
      }
    }
  }

  const handleAdvanceDay = () => {
    const currentDate = state.currentDate
    advanceDay()
    updateWithNASAData()

    const newDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000)
    toast.info("📅 Day advanced", {
      description: `New date: ${newDate.toLocaleDateString()}`
    })
  }

  const handleNASAAuthenticate = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/nasa/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (data.authenticated) {
        // Trigger data update after successful authentication
        setTimeout(() => updateWithNASAData(), 1000)
      }

      return data.authenticated
    } catch (error) {
      console.error('NASA authentication error:', error)
      return false
    }
  }

  const handleStartTutorial = () => {
    setShowTutorial(true)
    setShowGettingStarted(false)
  }

  const handleCompleteTutorial = () => {
    setShowTutorial(false)
    localStorage.setItem('hasSeenTutorial', 'true')
  }

  const handleDismissGettingStarted = () => {
    setShowGettingStarted(false)
  }

  const cell = selectedCell ? state.farmGrid[selectedCell.row][selectedCell.col] : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">NASA Farm Game</h1>
              <p className="text-sm text-muted-foreground">Learn sustainable farming with real satellite data</p>
            </div>
            <div className="flex items-center gap-2">
              <TutorialTrigger onStart={handleStartTutorial} />
              <Button onClick={updateWithNASAData} variant="outline" size="sm" className="gap-2 bg-transparent">
                <Satellite className="w-4 h-4" />
                Update NASA Data
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Getting Started Card */}
        {showGettingStarted && (
          <div className="mb-6">
            <GettingStartedCard
              onStartTutorial={handleStartTutorial}
              onDismiss={handleDismissGettingStarted}
            />
          </div>
        )}

        <Tabs defaultValue="farm" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="farm" className="gap-2">
              <Tractor className="w-4 h-4" />
              Farm
            </TabsTrigger>
            <TabsTrigger value="satellite" className="gap-2">
              <Satellite className="w-4 h-4" />
              Satellite
            </TabsTrigger>
            <TabsTrigger value="learn" className="gap-2">
              <BookOpen className="w-4 h-4" />
              Learn
            </TabsTrigger>
          </TabsList>

          {/* Farm Management Tab */}
          <TabsContent value="farm" className="space-y-6">
            {/* Quick Tips for New Users */}
            {!selectedCell && (
              <QuickTip
                title="Getting Started"
                description="Click any empty green cell on the farm grid below to select it, then you can plant crops!"
              />
            )}

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column - Farm Grid */}
              <div className="lg:col-span-2 space-y-4">
                <FarmGrid grid={state.farmGrid} onCellClick={handleCellClick} selectedCell={selectedCell} />
                <GameControls
                  selectedCell={selectedCell}
                  onPlantCrop={handlePlantCrop}
                  onIrrigate={handleIrrigate}
                  onFertilize={handleFertilize}
                  onHarvest={handleHarvest}
                  onAdvanceDay={handleAdvanceDay}
                  gameState={state}
                />
              </div>

              {/* Right Column - Details & Resources */}
              <div className="space-y-4">
                <CellDetails cell={cell} />
                <ResourcePanel gameState={state} />
                <NASAStatus onAuthenticate={handleNASAAuthenticate} />
              </div>
            </div>
          </TabsContent>

          {/* Satellite Data Tab */}
          <TabsContent value="satellite" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <SatelliteDashboard />
              </div>
              <div>
                <DataInsights />
              </div>
            </div>
          </TabsContent>

          {/* Educational Tab */}
          <TabsContent value="learn" className="space-y-6">
            <EducationalContent />
          </TabsContent>
        </Tabs>

        {/* Tutorial Modal */}
        <OnboardingTutorial
          isOpen={showTutorial}
          onClose={() => setShowTutorial(false)}
          onComplete={handleCompleteTutorial}
        />
      </main>

      {/* Toast Notifications */}
      <Toaster richColors position="bottom-right" />
    </div>
  )
}
