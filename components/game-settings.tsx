"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useSoundEffects } from "@/components/sound-effects"
import {
  Settings,
  Volume2,
  VolumeX,
  Gamepad2,
  Palette,
  Save,
  RotateCcw
} from "lucide-react"


interface GameSettings {
  soundEnabled: boolean
  volume: number
  animationsEnabled: boolean
  particlesEnabled: boolean
  autoSave: boolean
  theme: "light" | "dark" | "system"
  difficulty: "easy" | "medium" | "hard"
  showTooltips: boolean
  showGrid: boolean
  fastMode: boolean
}

const defaultSettings: GameSettings = {
  soundEnabled: true,
  volume: 30,
  animationsEnabled: true,
  particlesEnabled: true,
  autoSave: true,
  theme: "system",
  difficulty: "medium",
  showTooltips: true,
  showGrid: true,
  fastMode: false
}

export function GameSettings() {
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState<GameSettings>(defaultSettings)
  const [hasChanges, setHasChanges] = useState(false)
  const sound = useSoundEffects()

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('farmGameSettings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings(prev => ({ ...prev, ...parsed }))
      } catch (error) {
        console.warn('Failed to parse saved settings:', error)
      }
    }
  }, [])

  // Apply settings
  useEffect(() => {
    sound.setEnabled(settings.soundEnabled)
    sound.setVolume(settings.volume / 100)

    // Apply visual settings
    document.documentElement.style.setProperty(
      '--animations-enabled',
      settings.animationsEnabled ? '1' : '0'
    )

    // Save to localStorage
    localStorage.setItem('farmGameSettings', JSON.stringify(settings))
  }, [settings, sound])

  const updateSetting = <K extends keyof GameSettings>(
    key: K,
    value: GameSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const saveSettings = () => {
    localStorage.setItem('farmGameSettings', JSON.stringify(settings))
    setHasChanges(false)
    sound.playSuccess()
    setIsOpen(false)
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
    setHasChanges(true)
    sound.playClick()
  }

  const testSound = () => {
    sound.playSuccess()
  }

  const getDifficultyDescription = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "More resources, slower time, helpful hints"
      case "medium":
        return "Balanced gameplay experience"
      case "hard":
        return "Limited resources, realistic challenges"
      default:
        return ""
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="w-4 h-4" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Game Settings
            {hasChanges && (
              <Badge variant="outline" className="ml-auto">
                Unsaved Changes
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Audio Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Volume2 className="w-5 h-5" />
                Audio Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">Sound Effects</div>
                  <div className="text-sm text-muted-foreground">
                    Enable game sound effects
                  </div>
                </div>
                <Switch
                  checked={settings.soundEnabled}
                  onCheckedChange={(checked) => updateSetting("soundEnabled", checked)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium">Volume</div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={testSound}
                    disabled={!settings.soundEnabled}
                  >
                    Test
                  </Button>
                </div>
                <div className="flex items-center gap-3">
                  <VolumeX className="w-4 h-4 text-muted-foreground" />
                  <Slider
                    value={[settings.volume]}
                    onValueChange={([value]) => updateSetting("volume", value)}
                    max={100}
                    step={10}
                    disabled={!settings.soundEnabled}
                    className="flex-1"
                  />
                  <Volume2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium w-10">{settings.volume}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visual Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Visual Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">Animations</div>
                  <div className="text-sm text-muted-foreground">
                    Enable smooth transitions and animations
                  </div>
                </div>
                <Switch
                  checked={settings.animationsEnabled}
                  onCheckedChange={(checked) => updateSetting("animationsEnabled", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">Particle Effects</div>
                  <div className="text-sm text-muted-foreground">
                    Show celebration particles and effects
                  </div>
                </div>
                <Switch
                  checked={settings.particlesEnabled}
                  onCheckedChange={(checked) => updateSetting("particlesEnabled", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">Show Grid</div>
                  <div className="text-sm text-muted-foreground">
                    Display grid lines on the farm
                  </div>
                </div>
                <Switch
                  checked={settings.showGrid}
                  onCheckedChange={(checked) => updateSetting("showGrid", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">Tooltips</div>
                  <div className="text-sm text-muted-foreground">
                    Show helpful tooltips and hints
                  </div>
                </div>
                <Switch
                  checked={settings.showTooltips}
                  onCheckedChange={(checked) => updateSetting("showTooltips", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Gameplay Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Gamepad2 className="w-5 h-5" />
                Gameplay Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="font-medium">Difficulty Level</div>
                <div className="grid grid-cols-3 gap-2">
                  {["easy", "medium", "hard"].map((level) => (
                    <Button
                      key={level}
                      variant={settings.difficulty === level ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateSetting("difficulty", level as GameSettings["difficulty"])}
                      className="capitalize"
                    >
                      {level}
                    </Button>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  {getDifficultyDescription(settings.difficulty)}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">Auto-Save</div>
                  <div className="text-sm text-muted-foreground">
                    Automatically save game progress
                  </div>
                </div>
                <Switch
                  checked={settings.autoSave}
                  onCheckedChange={(checked) => updateSetting("autoSave", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">Fast Mode</div>
                  <div className="text-sm text-muted-foreground">
                    Accelerated crop growth for testing
                  </div>
                </div>
                <Switch
                  checked={settings.fastMode}
                  onCheckedChange={(checked) => updateSetting("fastMode", checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={saveSettings} className="flex-1 gap-2">
              <Save className="w-4 h-4" />
              Save Settings
            </Button>
            <Button onClick={resetSettings} variant="outline" className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset to Default
            </Button>
          </div>

          {/* Debug Info */}
          <Card className="bg-muted/50">
            <CardContent className="pt-4">
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="font-medium">Debug Information</div>
                <div>Settings Version: 1.0</div>
                <div>Last Modified: {new Date().toLocaleString()}</div>
                <div>Storage Used: {JSON.stringify(settings).length} bytes</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}