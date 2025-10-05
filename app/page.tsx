"use client"

import { useState, useEffect } from "react"
import { useGameState } from "@/hooks/use-game-state"
import { FarmGrid } from "@/components/farm-grid"
import { CellDetails } from "@/components/cell-details"
import { GameControls } from "@/components/game-controls"
import { ResourcePanel } from "@/components/resource-panel"
import { GameDashboard } from "@/components/game-dashboard"
import { WeatherWidget } from "@/components/weather-widget"
import { SatelliteDashboard } from "@/components/satellite-dashboard"
import { DataInsights } from "@/components/data-insights"
import { NASAStatus } from "@/components/nasa-status"
import { OnboardingTutorial } from "@/components/onboarding-tutorial"
import { GettingStartedCard } from "@/components/getting-started-card"
import { QuickTip } from "@/components/help-tooltip"
import { SoundEffectsProvider, useSoundEffects } from "@/components/sound-effects"
import { AnimatedEffectsProvider, ParticleSystem, effects, celebrate } from "@/components/animated-effects"
import { GameHUD } from "@/components/game-hud"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/sonner"
import type { CropType } from "@/lib/game-types"
import { Satellite, Tractor, Target } from "lucide-react"
import { toast } from "sonner"

function GameContent() {
  const { state, plantCrop, irrigate, fertilize, harvestCrop, advanceDay, updateWithNASAData } = useGameState()
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
        toast.success(`🌾 Harvest successful! +${earnings}`, {
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


  const cell = selectedCell ? state.farmGrid[selectedCell.row][selectedCell.col] : null

  return (
    <div className="min-h-screen">
      {/* Clean Header */}
      <GameHUD
        onUpdateNASAData={updateWithNASAData}
        onStartTutorial={handleStartTutorial}
      />

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

        {/* Gaming Mission Control Tabs */}
        <Tabs defaultValue="farm" className="space-y-6">
          <div className="flex justify-center mb-8 w-full">
            <TabsList className="gaming-panel grid grid-cols-3 gap-2 p-4 rounded-xl border border-cyan-500/60 bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg w-full max-w-2xl h-auto min-h-[80px] items-stretch">
              <TabsTrigger
                value="farm"
                className="
                  flex items-center justify-center gap-2 text-cyan-300 font-bold p-3 rounded-lg
                  transition-all duration-300 ease-in-out min-h-[60px] w-full
                  bg-transparent border border-transparent
                  hover:bg-cyan-900/20 hover:border-cyan-500/50 hover:text-cyan-200 hover:scale-[1.02]
                  data-[state=active]:bg-cyan-900/30 data-[state=active]:border-cyan-400
                  data-[state=active]:text-cyan-100 data-[state=active]:shadow-lg
                  data-[state=active]:shadow-cyan-500/20 data-[state=active]:scale-[1.02]
                "
              >
                <Tractor className="w-5 h-5" />
                <span className="hidden sm:inline">FARM OPS</span>
                <span className="sm:hidden">FARM</span>
              </TabsTrigger>
              <TabsTrigger
                value="dashboard"
                className="
                  flex items-center justify-center gap-2 text-yellow-300 font-bold p-3 rounded-lg
                  transition-all duration-300 ease-in-out min-h-[60px] w-full
                  bg-transparent border border-transparent
                  hover:bg-yellow-900/20 hover:border-yellow-500/50 hover:text-yellow-200 hover:scale-[1.02]
                  data-[state=active]:bg-yellow-900/30 data-[state=active]:border-yellow-400
                  data-[state=active]:text-yellow-100 data-[state=active]:shadow-lg
                  data-[state=active]:shadow-yellow-500/20 data-[state=active]:scale-[1.02]
                "
              >
                <Target className="w-5 h-5" />
                <span className="hidden sm:inline">MISSION CTRL</span>
                <span className="sm:hidden">CTRL</span>
              </TabsTrigger>
              <TabsTrigger
                value="data"
                className="
                  flex items-center justify-center gap-2 text-green-300 font-bold p-3 rounded-lg
                  transition-all duration-300 ease-in-out min-h-[60px] w-full
                  bg-transparent border border-transparent
                  hover:bg-green-900/20 hover:border-green-500/50 hover:text-green-200 hover:scale-[1.02]
                  data-[state=active]:bg-green-900/30 data-[state=active]:border-green-400
                  data-[state=active]:text-green-100 data-[state=active]:shadow-lg
                  data-[state=active]:shadow-green-500/20 data-[state=active]:scale-[1.02]
                "
              >
                <Satellite className="w-5 h-5" />
                <span className="hidden sm:inline">EARTH DATA</span>
                <span className="sm:hidden">DATA</span>
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
                <div className="gaming-card rounded-xl p-6 glow-cyan">
                  <FarmGrid grid={state.farmGrid} onCellClick={handleCellClick} selectedCell={selectedCell} />
                </div>
                <div className="gaming-card rounded-xl p-6 glow-green">
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
                <div className="gaming-card rounded-xl p-6 glow-yellow">
                  <CellDetails cell={cell} />
                </div>
                <div>
                  <ResourcePanel gameState={state} />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Mission Control Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="gaming-card p-6 rounded-xl glow-yellow">
                  <GameDashboard gameState={state} />
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <ResourcePanel gameState={state} />
                </div>
                <div className="gaming-card p-6 rounded-xl glow-cyan">
                  <CellDetails cell={cell} />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Earth Observation Data Tab */}
          <TabsContent value="data" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="gaming-card p-6 rounded-xl glow-green">
                  <WeatherWidget gameState={state} />
                </div>
                <div className="gaming-card p-6 rounded-xl glow-cyan">
                  <SatelliteDashboard />
                </div>
              </div>
              <div className="space-y-6">
                <div className="gaming-card p-6 rounded-xl glow-yellow">
                  <NASAStatus onAuthenticate={handleNASAAuthenticate} />
                </div>
                <div className="gaming-card p-6 rounded-xl glow-green">
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
