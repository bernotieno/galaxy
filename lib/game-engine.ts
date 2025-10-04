// Farm Game Engine - Core game logic and state management

import { CROP_DATA, FARM_LOCATIONS, type CropType, type FarmCell, type GameState, type Crop, type CropStage, type FarmLocation } from "./game-types"
import { generateMockSoilMoisture, generateMockNDVI, generateMockWeather, nasaAPI } from "./nasa-api"

export class FarmGameEngine {
  private state: GameState
  private listeners: Set<(state: GameState) => void> = new Set()

  constructor(gridSize = 8) {
    this.state = this.initializeGame(gridSize)

    // Update to current date on client-side only
    if (typeof window !== 'undefined') {
      const now = new Date()
      this.state.currentDate = now
      this.state.startDate = now
      this.state.daysElapsed = 0
    }
  }

  // Initialize game state
  private initializeGame(gridSize: number): GameState {
    const grid: FarmCell[][] = []

    // Use deterministic values for SSR compatibility
    for (let row = 0; row < gridSize; row++) {
      grid[row] = []
      for (let col = 0; col < gridSize; col++) {
        // Use deterministic pseudo-random values based on position
        const seed = (row * gridSize + col) / (gridSize * gridSize)
        grid[row][col] = {
          id: `cell-${row}-${col}`,
          row,
          col,
          crop: null,
          soilMoisture: 0.3 + (seed * 0.2), // 30-50% initial moisture
          soilQuality: 60 + (seed * 30), // 60-90 quality
          irrigated: false,
          fertilized: false,
        }
      }
    }

    // Use a fixed date for SSR compatibility, will be updated client-side
    const fixedDate = new Date('2024-01-01T00:00:00Z')

    return {
      farmGrid: grid,
      currentDate: fixedDate,
      startDate: fixedDate,
      daysElapsed: 0,
      farmLocation: FARM_LOCATIONS['iowa-corn-belt'], // Default to Iowa Corn Belt
      resources: {
        water: 1000,
        fertilizer: 500,
        seeds: {
          wheat: 50,
          corn: 50,
          soybeans: 50,
          cotton: 30,
          rice: 30,
        },
        money: 10000,
      },
      score: {
        sustainability: 100,
        efficiency: 100,
        yield: 0,
        cropYield: 0,
      },
      weather: {
        temperature: 20,
        precipitation: 0,
        forecast: [],
      },
    }
  }

  // Subscribe to state changes
  subscribe(listener: (state: GameState) => void) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  // Notify all listeners of state change
  private notifyListeners() {
    // Create a deep copy to ensure React detects changes
    const stateCopy = JSON.parse(JSON.stringify(this.state))
    stateCopy.currentDate = new Date(this.state.currentDate)
    this.listeners.forEach((listener) => listener(stateCopy))
  }

  // Get current state
  getState(): GameState {
    // Return a copy to prevent external mutations
    const stateCopy = JSON.parse(JSON.stringify(this.state))
    stateCopy.currentDate = new Date(this.state.currentDate)
    return stateCopy
  }

  // Plant a crop
  plantCrop(row: number, col: number, cropType: CropType): boolean {
    const cell = this.state.farmGrid[row]?.[col]
    if (!cell || cell.crop || this.state.resources.seeds[cropType] <= 0) {
      return false
    }

    cell.crop = {
      type: cropType,
      stage: "planted",
      health: 100,
      growthProgress: 0,
      waterLevel: cell.soilMoisture * 100,
      daysPlanted: 0,
    }

    this.state.resources.seeds[cropType]--
    this.notifyListeners()
    return true
  }

  // Irrigate a cell
  irrigate(row: number, col: number): boolean {
    const cell = this.state.farmGrid[row]?.[col]
    const waterCost = 10

    if (!cell || this.state.resources.water < waterCost) {
      return false
    }

    cell.irrigated = true
    cell.soilMoisture = Math.min(1, cell.soilMoisture + 0.3)

    if (cell.crop) {
      cell.crop.waterLevel = Math.min(100, cell.crop.waterLevel + 30)
      // Immediate growth boost from irrigation
      cell.crop.growthProgress = Math.min(100, cell.crop.growthProgress + 2)
      // Update crop stage if needed
      cell.crop.stage = this.determineCropStage(cell.crop)
    }

    this.state.resources.water -= waterCost
    this.state.score.sustainability -= 1 // Irrigation has environmental cost
    this.notifyListeners()
    return true
  }

  // Fertilize a cell
  fertilize(row: number, col: number): boolean {
    const cell = this.state.farmGrid[row]?.[col]
    const fertilizerCost = 5

    if (!cell || this.state.resources.fertilizer < fertilizerCost) {
      return false
    }

    cell.fertilized = true
    cell.soilQuality = Math.min(100, cell.soilQuality + 20)

    if (cell.crop) {
      cell.crop.health = Math.min(100, cell.crop.health + 15)
      // Immediate growth boost from fertilization
      cell.crop.growthProgress = Math.min(100, cell.crop.growthProgress + 3)
      // Update crop stage if needed
      cell.crop.stage = this.determineCropStage(cell.crop)
    }

    this.state.resources.fertilizer -= fertilizerCost
    this.state.score.sustainability -= 2 // Fertilizer has environmental cost
    this.notifyListeners()
    return true
  }

  // Harvest a crop
  harvestCrop(row: number, col: number): number {
    const cell = this.state.farmGrid[row]?.[col]
    if (!cell || !cell.crop || cell.crop.stage !== "harvest") {
      return 0
    }

    const crop = cell.crop
    const cropData = CROP_DATA[crop.type]

    // Calculate crop yield based on health and growth
    const baseYield = 100
    const healthMultiplier = crop.health / 100
    const qualityMultiplier = cell.soilQuality / 100
    const cropYield = Math.floor(baseYield * healthMultiplier * qualityMultiplier)

    // Calculate money earned
    const pricePerUnit = {
      wheat: 5,
      corn: 6,
      soybeans: 7,
      cotton: 10,
      rice: 8,
    }
    const earnings = cropYield * pricePerUnit[crop.type]

    this.state.resources.money += earnings
    this.state.score.yield += cropYield
    this.state.score.cropYield += cropYield

    // Reset cell
    cell.crop = null
    cell.irrigated = false
    cell.fertilized = false
    cell.soilQuality = Math.max(40, cell.soilQuality - 10) // Soil depletes after harvest

    this.notifyListeners()
    return earnings
  }

  // Advance game by one day
  advanceDay() {
    this.state.currentDate = new Date(this.state.currentDate.getTime() + 24 * 60 * 60 * 1000)
    this.state.daysElapsed = Math.floor((this.state.currentDate.getTime() - this.state.startDate.getTime()) / (24 * 60 * 60 * 1000))

    // Update all crops
    this.state.farmGrid.forEach((row) => {
      row.forEach((cell) => {
        if (cell.crop) {
          this.updateCrop(cell)
        }

        // Natural soil moisture decrease
        cell.soilMoisture = Math.max(0.1, cell.soilMoisture - 0.05)
        cell.irrigated = false
      })
    })

    // Update weather
    this.updateWeather()

    // Regenerate resources
    this.state.resources.water = Math.min(2000, this.state.resources.water + 50)
    this.state.resources.fertilizer = Math.min(1000, this.state.resources.fertilizer + 10)

    this.notifyListeners()
  }

  // Update individual crop
  private updateCrop(cell: FarmCell) {
    if (!cell.crop) return

    const crop = cell.crop
    const cropData = CROP_DATA[crop.type]

    crop.daysPlanted++

    // Update water level based on soil moisture
    crop.waterLevel = cell.soilMoisture * 100

    // Check if crop has enough water
    const waterStress = crop.waterLevel < cropData.waterNeeds.critical * 100
    if (waterStress) {
      crop.health = Math.max(0, crop.health - 5)
    }

    // Check temperature stress
    const tempStress =
      this.state.weather.temperature < cropData.optimalTemp[0] ||
      this.state.weather.temperature > cropData.optimalTemp[1]
    if (tempStress) {
      crop.health = Math.max(0, crop.health - 2)
    }

    // Update growth progress
    const growthRate = this.calculateGrowthRate(cell)
    crop.growthProgress = Math.min(100, crop.growthProgress + growthRate)

    // Update crop stage
    crop.stage = this.determineCropStage(crop)

    // Soil quality affects health
    if (cell.soilQuality < 50) {
      crop.health = Math.max(0, crop.health - 1)
    }
  }

  // Calculate daily growth rate
  private calculateGrowthRate(cell: FarmCell): number {
    if (!cell.crop) return 0

    const crop = cell.crop
    const cropData = CROP_DATA[crop.type]

    // Base growth rate (to reach 100% in growthDays)
    const rate = 100 / cropData.growthDays

    // Water factor
    const waterFactor = Math.min(1, crop.waterLevel / (cropData.waterNeeds.optimal * 100))

    // Temperature factor
    const temp = this.state.weather.temperature
    const [minTemp, maxTemp] = cropData.optimalTemp
    const optimalTemp = (minTemp + maxTemp) / 2
    const tempFactor = 1 - Math.abs(temp - optimalTemp) / optimalTemp

    // Soil quality factor
    const soilFactor = cell.soilQuality / 100

    // Health factor
    const healthFactor = crop.health / 100

    return rate * waterFactor * Math.max(0.5, tempFactor) * soilFactor * healthFactor
  }

  // Determine crop stage based on growth progress
  private determineCropStage(crop: Crop): CropStage {
    const progress = crop.growthProgress

    if (progress < 10) return "planted"
    if (progress < 30) return "germination"
    if (progress < 60) return "vegetative"
    if (progress < 85) return "flowering"
    if (progress < 100) return "mature"
    return "harvest"
  }

  // Update weather conditions
  private updateWeather() {
    // Simulate weather changes
    const tempChange = (Math.random() - 0.5) * 4
    this.state.weather.temperature = Math.max(5, Math.min(40, this.state.weather.temperature + tempChange))

    // Random precipitation
    this.state.weather.precipitation = Math.random() < 0.3 ? Math.random() * 15 : 0

    // Apply precipitation to soil moisture
    if (this.state.weather.precipitation > 0) {
      this.state.farmGrid.forEach((row) => {
        row.forEach((cell) => {
          cell.soilMoisture = Math.min(1, cell.soilMoisture + this.state.weather.precipitation / 100)
        })
      })
    }
  }

  // Update with real NASA data
  async updateWithNASAData() {
    try {
      console.log('[Game Engine] Updating with NASA data...')

      let soilData, ndviData, weatherData

      // Try to use real NASA API if authenticated
      if (nasaAPI.isAuthenticated()) {
        console.log('[Game Engine] Using real NASA API data')

        const coordinates = {
          latitude: this.state.farmLocation.latitude,
          longitude: this.state.farmLocation.longitude
        }

        const endDate = new Date()
        const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000) // 30 days ago

        const dateRange = {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0]
        }

        try {
          // Fetch real data from NASA APIs
          const [realSoilData, realNdviData, realWeatherData] = await Promise.allSettled([
            nasaAPI.getSoilMoisture(coordinates, dateRange),
            nasaAPI.getVegetationIndex(coordinates, dateRange),
            nasaAPI.getTemperature(coordinates, dateRange)
          ])

          soilData = realSoilData.status === 'fulfilled' ? realSoilData.value : []
          ndviData = realNdviData.status === 'fulfilled' ? realNdviData.value : []
          weatherData = realWeatherData.status === 'fulfilled' ? realWeatherData.value : []

          console.log('[Game Engine] NASA API data fetched:', {
            soilData: soilData.length,
            ndviData: ndviData.length,
            weatherData: weatherData.length
          })

        } catch (apiError) {
          console.warn('[Game Engine] NASA API failed, falling back to mock data:', apiError)
          soilData = generateMockSoilMoisture(1)
          ndviData = generateMockNDVI(1)
          weatherData = generateMockWeather(7)
        }
      } else {
        console.log('[Game Engine] NASA API not authenticated, using mock data')
        soilData = generateMockSoilMoisture(1)
        ndviData = generateMockNDVI(1)
        weatherData = generateMockWeather(7)
      }

      if (soilData.length > 0) {
        // Use most recent soil moisture data
        const latestSoilData = soilData[soilData.length - 1]
        const avgMoisture = Math.max(0.1, Math.min(1.0, latestSoilData.value))

        console.log('[Game Engine] Updating soil moisture:', avgMoisture)

        // Update all cells with satellite data, adding some spatial variation
        this.state.farmGrid.forEach((row) => {
          row.forEach((cell) => {
            const variation = (Math.random() - 0.5) * 0.1
            cell.soilMoisture = Math.max(0.1, Math.min(1.0, avgMoisture + variation))
          })
        })
      }

      if (weatherData.length > 0) {
        // Use most recent weather data
        const latestWeather = weatherData[weatherData.length - 1]

        // Convert Kelvin to Celsius if needed (NASA temperature data is often in Kelvin)
        let temperature = latestWeather.temperature
        if (temperature > 200) { // Likely Kelvin
          temperature = temperature - 273.15
        }

        this.state.weather.temperature = Math.max(-20, Math.min(50, temperature))
        this.state.weather.precipitation = Math.max(0, latestWeather.precipitation)
        this.state.weather.forecast = weatherData.slice(-7) // Keep last 7 days

        console.log('[Game Engine] Updated weather:', {
          temperature: this.state.weather.temperature,
          precipitation: this.state.weather.precipitation
        })
      }

      // Update NDVI data for crop health insights
      if (ndviData.length > 0) {
        const latestNDVI = ndviData[ndviData.length - 1]
        const ndviValue = Math.max(-1, Math.min(1, latestNDVI.ndvi))

        console.log('[Game Engine] NDVI data:', ndviValue)

        // Use NDVI to influence crop health in vegetated areas
        this.state.farmGrid.forEach((row) => {
          row.forEach((cell) => {
            if (cell.crop && ndviValue > 0.3) {
              // Good vegetation health boosts crop health slightly
              const healthBoost = (ndviValue - 0.3) * 5
              cell.crop.health = Math.min(100, cell.crop.health + healthBoost)
            }
          })
        })
      }

      this.notifyListeners()
      console.log('[Game Engine] NASA data update completed')
    } catch (error) {
      console.error('[Game Engine] Failed to update NASA data:', error)
      // Fallback to mock data on error
      const soilData = generateMockSoilMoisture(1)
      const weatherData = generateMockWeather(7)

      if (soilData.length > 0) {
        const avgMoisture = soilData[0].value
        this.state.farmGrid.forEach((row) => {
          row.forEach((cell) => {
            cell.soilMoisture = avgMoisture + (Math.random() - 0.5) * 0.1
          })
        })
      }

      if (weatherData.length > 0) {
        this.state.weather.temperature = weatherData[0].temperature
        this.state.weather.precipitation = weatherData[0].precipitation
        this.state.weather.forecast = weatherData
      }

      this.notifyListeners()
    }
  }

  // Change farm location
  changeFarmLocation(locationId: string): boolean {
    const location = FARM_LOCATIONS[locationId]
    if (!location) {
      console.error(`Location ${locationId} not found`)
      return false
    }

    this.state.farmLocation = location

    // Update weather based on new location's climate
    this.adjustWeatherForClimate(location.climate)

    // Trigger NASA data update for new location
    this.updateWithNASAData()

    this.notifyListeners()
    return true
  }

  // Get all available locations
  getAvailableLocations(): FarmLocation[] {
    return Object.values(FARM_LOCATIONS)
  }

  // Adjust weather based on climate type
  private adjustWeatherForClimate(climate: FarmLocation['climate']) {
    switch (climate) {
      case 'tropical':
        this.state.weather.temperature = 25 + Math.random() * 10 // 25-35°C
        break
      case 'arid':
        this.state.weather.temperature = 20 + Math.random() * 20 // 20-40°C
        this.state.weather.precipitation = Math.random() * 5 // Very low
        break
      case 'temperate':
        this.state.weather.temperature = 15 + Math.random() * 15 // 15-30°C
        break
      case 'continental':
        this.state.weather.temperature = 10 + Math.random() * 20 // 10-30°C
        break
      case 'mediterranean':
        this.state.weather.temperature = 18 + Math.random() * 12 // 18-30°C
        break
    }
  }

  // Calculate sustainability score
  calculateSustainabilityScore(): number {
    let score = 100

    // Penalize excessive irrigation
    const irrigatedCells = this.state.farmGrid.flat().filter((cell) => cell.irrigated).length
    const totalCells = this.state.farmGrid.length * this.state.farmGrid[0].length
    const irrigationRatio = irrigatedCells / totalCells
    score -= irrigationRatio * 20

    // Penalize low soil quality
    const avgSoilQuality = this.state.farmGrid.flat().reduce((sum, cell) => sum + cell.soilQuality, 0) / totalCells
    if (avgSoilQuality < 60) {
      score -= (60 - avgSoilQuality) / 2
    }

    // Reward crop diversity
    const cropTypes = new Set(
      this.state.farmGrid
        .flat()
        .filter((cell) => cell.crop)
        .map((cell) => cell.crop!.type),
    )
    score += cropTypes.size * 5

    return Math.max(0, Math.min(100, score))
  }
}

// Export singleton instance
export const gameEngine = new FarmGameEngine()

// Initialize NASA API connection
if (typeof window === 'undefined') {
  // Server-side initialization
  console.log('[Game Engine] Initializing NASA API connection...')
}
