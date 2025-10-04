"use client"

import { useState, useEffect } from "react"
import { useGameState } from "@/hooks/use-game-state"
import { FarmGrid } from "@/components/farm-grid"
import { EnhancedFarmGrid } from "@/components/enhanced-farm-grid"
import { CellDetails } from "@/components/cell-details"
import { GameControls } from "@/components/game-controls"
import { ResourcePanel } from "@/components/resource-panel"
import { GameDashboard } from "@/components/game-dashboard"
import { WeatherWidget } from "@/components/weather-widget"
import { SatelliteDashboard } from "@/components/satellite-dashboard"
import { DataInsights } from "@/components/data-insights"
import { EducationalContent } from "@/components/educational-content"
import { NASAStatus } from "@/components/nasa-status"
import { OnboardingTutorial, TutorialTrigger } from "@/components/onboarding-tutorial"
import { GettingStartedCard } from "@/components/getting-started-card"
import { QuickTip } from "@/components/help-tooltip"
import { GameSettings } from "@/components/game-settings"
import { SoundEffectsProvider, useSoundEffects } from "@/components/sound-effects"
import { AnimatedEffectsProvider, ParticleSystem, effects, celebrate } from "@/components/animated-effects"
import { GameHUD } from "@/components/game-hud"
import { LocationSelector } from "@/components/location-selector"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/sonner"
import type { CropType } from "@/lib/game-types"
import { Satellite, Tractor, BookOpen, Target, Cloud } from "lucide-react"
import { toast } from "sonner"

function GameContent() {
  const { state, plantCrop, irrigate, fertilize, harvestCrop, advanceDay, updateWithNASAData, changeFarmLocation } = useGameState()
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [showTutorial, setShowTutorial] = useState(false)
  const [showGettingStarted, setShowGettingStarted] = useState(true)
  const sound = useSoundEffects()

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
        sound.playPlantCrop()
        toast.success(`🌱 Planted ${cropType} successfully!`, {
          description: `Cell (${selectedCell.row}, ${selectedCell.col})`
        })
      } else {
        sound.playError()
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
        sound.playIrrigate()
        effects.water(10)
        toast.success("💧 Irrigation successful!", {
          description: `Added water & +2% growth to cell (${selectedCell.row}, ${selectedCell.col})`
        })
      } else {
        sound.playError()
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
        sound.playFertilize()
        effects.fertilizer(5)
        toast.success("✨ Fertilized successfully!", {
          description: `Enhanced soil quality & +3% growth at cell (${selectedCell.row}, ${selectedCell.col})`
        })
      } else {
        sound.playError()
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
        sound.playHarvestCrop()
        effects.money(earnings)
        celebrate()
        toast.success(`🌾 Harvest successful! +$${earnings}`, {
          description: `Cell (${selectedCell.row}, ${selectedCell.col}) is now ready for replanting`
        })
      } else {
        sound.playError()
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

    sound.playDayAdvance()
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

  const handleLocationChange = (locationId: string) => {
    const success = changeFarmLocation(locationId)
    if (success) {
      sound.playPlantCrop() // Reuse a pleasant sound
      toast.success("🌍 Location changed successfully!", {
        description: `Now farming in ${state.farmLocation.name}`
      })
    } else {
      sound.playError()
      toast.error("Failed to change location", {
        description: "Please try again"
      })
    }
  }

  const cell = selectedCell ? state.farmGrid[selectedCell.row][selectedCell.col] : null

  return (
    <div className="min-h-screen">
      {/* NASA Mission Control HUD Header */}
      <div className="sticky top-0 z-50 mission-control-panel border-b border-nasa-blue/20">
        <GameHUD
          gameState={state}
          onUpdateNASAData={updateWithNASAData}
          onStartTutorial={handleStartTutorial}
          playerLevel={Math.floor(state.score.cropYield / 100) + 1}
          playerXP={state.score.cropYield % 100}
        />

        {/* Mission Info Bar */}
        <div className="flex justify-between items-center pb-4 px-4">
          <LocationSelector
            currentLocation={state.farmLocation}
            onLocationChange={handleLocationChange}
          />

          <div className="days-counter px-6 py-3 rounded-lg text-center">
            <div className="text-nasa-blue text-sm font-medium">MISSION DAY</div>
            <div className="text-3xl font-bold text-nasa-red">{state.daysElapsed}</div>
            <div className="text-xs text-nasa-blue/80">{state.currentDate.toLocaleDateString()}</div>
          </div>

          <div className="glass-panel px-4 py-2 rounded-lg text-center">
            <div className="text-nasa-blue text-xs font-medium">LOCATION</div>
            <div className="text-sm font-bold text-foreground">{state.farmLocation.name}</div>
            <div className="text-xs text-muted-foreground capitalize">{state.farmLocation.climate}</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Getting Started Card */}
        {showGettingStarted && (
          <div className="glass-card p-6 rounded-xl glow-nasa-blue">
            <GettingStartedCard
              onStartTutorial={handleStartTutorial}
              onDismiss={handleDismissGettingStarted}
            />
          </div>
        )}

        {/* NASA Mission Control Tabs */}
        <Tabs defaultValue="farm" className="space-y-6">
          <div className="flex justify-center">
            <TabsList className="glass-panel grid grid-cols-3 p-2 rounded-xl">
              <TabsTrigger value="farm" className="glass-button gap-2 data-[state=active]:glass-nasa-red">
                <Tractor className="w-4 h-4" />
                Farm Operations
              </TabsTrigger>
              <TabsTrigger value="dashboard" className="glass-button gap-2 data-[state=active]:glass-nasa-red">
                <Target className="w-4 h-4" />
                Mission Control
              </TabsTrigger>
              <TabsTrigger value="data" className="glass-button gap-2 data-[state=active]:glass-nasa-red">
                <Satellite className="w-4 h-4" />
                Earth Observation
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Farm Operations Tab */}
          <TabsContent value="farm" className="space-y-6">
            {!selectedCell && (
              <div className="glass-panel p-4 rounded-lg">
                <QuickTip
                  title="Mission Briefing"
                  description="Click any empty green cell on the farm grid below to select it, then you can plant crops using NASA Earth observation data!"
                />
              </div>
            )}

            <div className="grid xl:grid-cols-4 lg:grid-cols-3 gap-6">
              <div className="xl:col-span-3 lg:col-span-2 space-y-6">
                <div className="glass-card p-6 rounded-xl">
                  <EnhancedFarmGrid grid={state.farmGrid} onCellClick={handleCellClick} selectedCell={selectedCell} />
                </div>
                <div className="glass-card p-6 rounded-xl">
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
              </div>
              <div className="space-y-6">
                <div className="glass-panel p-6 rounded-xl">
                  <CellDetails cell={cell} />
                </div>
                <div className="glass-panel p-6 rounded-xl">
                  <ResourcePanel gameState={state} />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Mission Control Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="glass-card p-6 rounded-xl glow-nasa-blue">
                  <GameDashboard gameState={state} />
                </div>
              </div>
              <div className="space-y-6">
                <div className="glass-panel p-6 rounded-xl">
                  <ResourcePanel gameState={state} />
                </div>
                <div className="glass-panel p-6 rounded-xl">
                  <CellDetails cell={cell} />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Earth Observation Data Tab */}
          <TabsContent value="data" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="glass-card p-6 rounded-xl glow-nasa-red">
                  <WeatherWidget gameState={state} />
                </div>
                <div className="glass-card p-6 rounded-xl">
                  <SatelliteDashboard />
                </div>
              </div>
              <div className="space-y-6">
                <div className="glass-panel p-6 rounded-xl border-nasa-red/20">
                  <NASAStatus onAuthenticate={handleNASAAuthenticate} />
                </div>
                <div className="glass-panel p-6 rounded-xl">
                  <DataInsights />
                </div>
              </div>
            </div>
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
      <AnimatedEffectsProvider />
      <ParticleSystem />
    </div>
  )
}

export default function Home() {
  return (
    <SoundEffectsProvider>
      <GameContent />
    </SoundEffectsProvider>
  )
}
