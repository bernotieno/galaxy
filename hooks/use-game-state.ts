"use client"

import { useEffect, useState } from "react"
import { gameEngine } from "@/lib/game-engine"
import type { GameState } from "@/lib/game-types"

export function useGameState() {
  const [state, setState] = useState<GameState>(gameEngine.getState())

  useEffect(() => {
    const unsubscribe = gameEngine.subscribe((newState) => {
      setState(newState)
    })

    return unsubscribe
  }, [])

  return {
    state,
    plantCrop: gameEngine.plantCrop.bind(gameEngine),
    irrigate: gameEngine.irrigate.bind(gameEngine),
    fertilize: gameEngine.fertilize.bind(gameEngine),
    harvestCrop: gameEngine.harvestCrop.bind(gameEngine),
    advanceDay: gameEngine.advanceDay.bind(gameEngine),
    updateWithNASAData: gameEngine.updateWithNASAData.bind(gameEngine),
    changeFarmLocation: gameEngine.changeFarmLocation.bind(gameEngine),
    getAvailableLocations: gameEngine.getAvailableLocations.bind(gameEngine),
  }
}
