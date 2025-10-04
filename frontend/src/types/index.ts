export interface NASAData {
  weather: WeatherData;
  soil: SoilData;
  vegetation: VegetationData;
  precipitation: PrecipitationData;
  timestamp: string;
  coordinates: Coordinates;
  location: LocationInfo;
}

export interface LocationInfo {
  city: string;
  region: string;
  country: string;
  zone: string;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  cloudCover: number;
  solarRadiation: number;
  source: string;
}

export interface SoilData {
  surfaceMoisture: number;
  rootZoneMoisture: number;
  soilTemperature: number;
  organicMatter: number;
  pH: number;
  salinity: number;
  source: string;
  resolution: string;
}

export interface VegetationData {
  ndvi: number;
  evi: number;
  lai: number;
  vegetationHealth: string;
  source: string;
  resolution: string;
}

export interface PrecipitationData {
  dailyPrecipitation: number;
  weeklyTotal: number;
  monthlyTotal: number;
  precipitationType: string;
  source: string;
  resolution: string;
}

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface GameState {
  season: string;
  day: number;
  budget: number;
  score: number;
  plots: Plot[];
  livestock: Livestock[];
  farmType: string;
  sustainabilityScore: number;
  waterUsage: number;
  carbonFootprint: number;
  lastUpdated: string;
}

export interface Livestock {
  id: number;
  type: string;
  count: number;
  health: number;
  productivity: number;
  feedNeed: number;
  waterNeed: number;
}

export interface Plot {
  id: number;
  crop: string;
  plantedDay: number;
  growthStage: string;
  growthProgress: number;
  soilMoisture: number;
  fertility: number;
  health: number;
  needsWater: boolean;
  needsFertilizer: boolean;
  yield: number;
}

export interface ActionRequest {
  plotId: number;
  action: string;
  crop?: string;
}

export interface MapData {
  region: string;
  coordinates: Coordinates;
  climate: string;
  soilType: string;
  elevation: number;
}

export interface CropInfo {
  name: string;
  growthTime: number;
  waterNeed: number;
  tempMin: number;
  tempMax: number;
  cost: number;
  baseYield: number;
  emoji: string;
}