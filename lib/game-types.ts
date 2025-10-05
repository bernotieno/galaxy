// Game type definitions

export type CropType = "wheat" | "corn" | "soybeans" | "cotton" | "rice"

export type CropStage = "planted" | "germination" | "vegetative" | "flowering" | "mature" | "harvest"

export interface Crop {
  type: CropType
  stage: CropStage
  health: number // 0-100
  growthProgress: number // 0-100
  waterLevel: number // 0-100
  daysPlanted: number
}

export interface FarmCell {
  id: string
  row: number
  col: number
  crop: Crop | null
  soilMoisture: number // 0-1
  soilQuality: number // 0-100
  irrigated: boolean
  fertilized: boolean
}

export interface FarmLocation {
  id: string
  name: string
  region: string
  latitude: number
  longitude: number
  bbox: string
  climate: 'temperate' | 'tropical' | 'arid' | 'continental' | 'mediterranean'
  description: string
}

export interface GameState {
  farmGrid: FarmCell[][]
  currentDate: Date
  startDate: Date
  daysElapsed: number
  farmLocation: FarmLocation
  resources: {
    water: number
    fertilizer: number
    seeds: Record<CropType, number>
    money: number
  }
  score: {
    sustainability: number
    efficiency: number
    yield: number
    cropYield: number
  }
  weather: {
    temperature: number
    precipitation: number
    forecast: Array<{
      day: string
      temp: number
      precipitation: number
      condition: string
    }>
  }
}

export interface CropRequirements {
  optimalTemp: [number, number]
  waterNeeds: {
    critical: number
    optimal: number
  }
  growthDays: number
  ndviThreshold: number
  description: string
  difficulty: "easy" | "medium" | "hard"
}

export const CROP_DATA: Record<CropType, CropRequirements> = {
  wheat: {
    optimalTemp: [15, 25],
    waterNeeds: { critical: 0.2, optimal: 0.35 },
    growthDays: 120,
    ndviThreshold: 0.7,
    description: "Hardy grain crop, great for beginners",
    difficulty: "easy",
  },
  corn: {
    optimalTemp: [20, 30],
    waterNeeds: { critical: 0.25, optimal: 0.4 },
    growthDays: 90,
    ndviThreshold: 0.75,
    description: "Fast-growing crop with good yields",
    difficulty: "easy",
  },
  soybeans: {
    optimalTemp: [20, 28],
    waterNeeds: { critical: 0.22, optimal: 0.38 },
    growthDays: 100,
    ndviThreshold: 0.72,
    description: "Nitrogen-fixing legume, improves soil",
    difficulty: "medium",
  },
  cotton: {
    optimalTemp: [25, 35],
    waterNeeds: { critical: 0.28, optimal: 0.42 },
    growthDays: 150,
    ndviThreshold: 0.68,
    description: "Long-season fiber crop, needs warm weather",
    difficulty: "hard",
  },
  rice: {
    optimalTemp: [20, 35],
    waterNeeds: { critical: 0.4, optimal: 0.6 },
    growthDays: 120,
    ndviThreshold: 0.8,
    description: "Water-intensive grain, high nutrition",
    difficulty: "hard",
  },
}

// Farm location presets for different agricultural regions
export const FARM_LOCATIONS: Record<string, FarmLocation> = {
  'iowa-corn-belt': {
    id: 'iowa-corn-belt',
    name: 'Iowa Corn Belt',
    region: 'Midwest USA',
    latitude: 41.8781,
    longitude: -93.0977,
    bbox: "-93.5,41.5,-92.5,42.2",
    climate: 'continental',
    description: 'Premier corn and soybean growing region with rich soil and moderate rainfall'
  },
  'california-central-valley': {
    id: 'california-central-valley',
    name: 'Central Valley, California',
    region: 'California USA',
    latitude: 36.7783,
    longitude: -119.4179,
    bbox: "-120.0,36.0,-119.0,37.5",
    climate: 'mediterranean',
    description: 'Major agricultural region producing fruits, vegetables, and nuts with irrigation'
  },
  'kansas-wheat-belt': {
    id: 'kansas-wheat-belt',
    name: 'Kansas Wheat Belt',
    region: 'Great Plains USA',
    latitude: 38.5266,
    longitude: -96.7265,
    bbox: "-97.2,38.0,-96.2,39.0",
    climate: 'continental',
    description: 'Heart of American wheat production with vast prairies and moderate rainfall'
  },
  'texas-cotton-region': {
    id: 'texas-cotton-region',
    name: 'Texas Cotton Region',
    region: 'Texas USA',
    latitude: 33.2148,
    longitude: -101.8313,
    bbox: "-102.3,32.7,-101.3,33.7",
    climate: 'arid',
    description: 'Major cotton producing area with hot, dry climate requiring irrigation'
  },
  'arkansas-rice-region': {
    id: 'arkansas-rice-region',
    name: 'Arkansas Rice Region',
    region: 'Arkansas USA',
    latitude: 34.3693,
    longitude: -91.4985,
    bbox: "-92.0,33.9,-91.0,34.8",
    climate: 'temperate',
    description: 'Leading rice production area with abundant water and humid subtropical climate'
  },
  'nebraska-agriculture': {
    id: 'nebraska-agriculture',
    name: 'Nebraska Agricultural Region',
    region: 'Nebraska USA',
    latitude: 41.4925,
    longitude: -99.9018,
    bbox: "-100.4,41.0,-99.4,42.0",
    climate: 'continental',
    description: 'Diverse crop production including corn, soybeans, and wheat'
  }
}
