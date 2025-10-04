"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Globe, Thermometer, Droplets } from "lucide-react"
import { FARM_LOCATIONS, type FarmLocation } from "@/lib/game-types"

interface LocationSelectorProps {
  currentLocation: FarmLocation
  onLocationChange: (locationId: string) => void
}

export function LocationSelector({ currentLocation, onLocationChange }: LocationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<FarmLocation | null>(null)

  const locations = Object.values(FARM_LOCATIONS)

  const getClimateColor = (climate: FarmLocation['climate']) => {
    switch (climate) {
      case 'tropical': return 'bg-green-500'
      case 'arid': return 'bg-orange-500'
      case 'temperate': return 'bg-blue-500'
      case 'continental': return 'bg-purple-500'
      case 'mediterranean': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const getClimateDescription = (climate: FarmLocation['climate']) => {
    switch (climate) {
      case 'tropical': return 'Hot & humid year-round'
      case 'arid': return 'Hot & dry, limited rainfall'
      case 'temperate': return 'Moderate temps, regular rainfall'
      case 'continental': return 'Cold winters, warm summers'
      case 'mediterranean': return 'Mild winters, dry summers'
      default: return 'Variable climate'
    }
  }

  const handleLocationSelect = () => {
    if (selectedLocation && selectedLocation.id !== currentLocation.id) {
      onLocationChange(selectedLocation.id)
      setIsOpen(false)
      setSelectedLocation(null)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="glass-button gap-2">
          <MapPin className="w-4 h-4" />
          {currentLocation.name}
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-nasa-blue">
            <Globe className="w-5 h-5" />
            Select Farm Location
          </DialogTitle>
          <DialogDescription>
            Choose your farming region. Each location has unique climate conditions that affect crop growth and NASA data availability.
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-4 py-4">
          {locations.map((location) => (
            <Card
              key={location.id}
              className={`cursor-pointer transition-all glass-panel hover:glow-nasa-blue ${
                selectedLocation?.id === location.id ? 'ring-2 ring-nasa-blue glow-nasa-blue' : ''
              } ${
                currentLocation.id === location.id ? 'border-nasa-red/50' : ''
              }`}
              onClick={() => setSelectedLocation(location)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg text-nasa-blue">{location.name}</CardTitle>
                    <CardDescription className="text-sm">{location.region}</CardDescription>
                  </div>
                  {currentLocation.id === location.id && (
                    <Badge variant="default" className="bg-nasa-red text-white">
                      Current
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{location.description}</p>

                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getClimateColor(location.climate)}`} />
                  <span className="text-sm font-medium capitalize">{location.climate}</span>
                  <span className="text-xs text-muted-foreground">
                    {getClimateDescription(location.climate)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-nasa-blue" />
                    <span>{location.latitude.toFixed(2)}°N, {Math.abs(location.longitude).toFixed(2)}°W</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Globe className="w-3 h-3 text-nasa-red" />
                    <span>NASA Data Available</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleLocationSelect}
            disabled={!selectedLocation || selectedLocation.id === currentLocation.id}
            className="glass-nasa-red"
          >
            Change Location
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}