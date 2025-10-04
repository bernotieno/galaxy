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

export interface GameState {
  farmGrid: FarmCell[][]
  currentDate: Date
  farmLocation: {
    latitude: number
    longitude: number
    bbox: string
  }
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
    forecast: any[]
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
