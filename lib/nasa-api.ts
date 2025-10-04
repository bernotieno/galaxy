// NASA API Integration Layer
// Handles authentication and data fetching from NASA Earth observation APIs

import { getNASACredentials, getNASAAPIConfig } from './env'

export interface Coordinates {
  latitude: number
  longitude: number
}

export interface DateRange {
  startDate: string
  endDate: string
}

export interface SoilMoistureData {
  date: string
  value: number
  coordinates: Coordinates
}

export interface VegetationData {
  date: string
  ndvi: number
  coordinates: Coordinates
}

export interface WeatherData {
  date: string
  temperature: number
  precipitation: number
  coordinates: Coordinates
}

class NASAAPIManager {
  private token: string | null = null
  private appearsToken: string | null = null
  private baseURL = "https://appeears.earthdatacloud.nasa.gov/api"
  private authenticated = false

  constructor() {
    // Auto-authenticate on startup if credentials are available
    this.initializeAuthentication()
  }

  private async initializeAuthentication() {
    // Only attempt auto-authentication on server-side
    if (typeof window === 'undefined') {
      const { username, password, apiKey, bearerToken } = getNASACredentials()

      if (apiKey) {
        console.log('[NASA API] Attempting authentication with API key...')
        await this.authenticateWithApiKey(apiKey)
      } else if (bearerToken) {
        console.log('[NASA API] Using bearer token...')
        this.appearsToken = bearerToken
        this.authenticated = true
      } else if (username && password) {
        console.log('[NASA API] Attempting authentication with username/password...')
        await this.authenticate(username, password)
      } else {
        console.log('[NASA API] No credentials found in environment variables')
      }
    }
  }

  // Authenticate with API Key
  async authenticateWithApiKey(apiKey: string): Promise<boolean> {
    try {
      console.log('[NASA API] Authenticating with API key...')

      // For NASA APIs, we can use the API key directly as a bearer token
      this.appearsToken = apiKey
      this.authenticated = true

      console.log('[NASA API] API key authentication successful')
      return true
    } catch (error) {
      console.error('[NASA API] API key authentication error:', error)
      this.authenticated = false
      return false
    }
  }

  // Authenticate with NASA Earthdata
  async authenticate(username?: string, password?: string): Promise<boolean> {
    // Use provided credentials or fall back to environment variables (server-side only)
    let user = username
    let pass = password

    if (!user || !pass) {
      const credentials = getNASACredentials()

      // Try API key first if available
      if (credentials.apiKey) {
        return this.authenticateWithApiKey(credentials.apiKey)
      }

      user = credentials.username
      pass = credentials.password
    }

    if (!user || !pass) {
      console.error('[NASA API] Missing credentials')
      return false
    }
    try {
      console.log('[NASA API] Authenticating with NASA Earthdata...')
      // Generate bearer token
      const response = await fetch("https://urs.earthdata.nasa.gov/api/users/token", {
        method: "POST",
        headers: {
          Authorization: "Basic " + btoa(user + ":" + pass),
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Earthdata authentication failed: ${response.status} ${errorText}`)
      }

      const data = await response.json()
      this.token = data.access_token
      console.log('[NASA API] Earthdata authentication successful')

      // Login to AppEEARS
      console.log('[NASA API] Authenticating with AppEEARS...')
      const appearsResponse = await fetch(`${this.baseURL}/login`, {
        method: "POST",
        headers: {
          Authorization: "Basic " + btoa(user + ":" + pass),
          "Content-Length": "0",
        },
      })

      if (!appearsResponse.ok) {
        const errorText = await appearsResponse.text()
        throw new Error(`AppEEARS authentication failed: ${appearsResponse.status} ${errorText}`)
      }

      const appearsData = await appearsResponse.json()
      this.appearsToken = appearsData.token
      this.authenticated = true
      console.log('[NASA API] AppEEARS authentication successful')

      return true
    } catch (error) {
      console.error('[NASA API] Authentication error:', error)
      this.authenticated = false
      return false
    }
  }

  // Check if authenticated
  isAuthenticated(): boolean {
    return this.authenticated && !!this.appearsToken
  }

  // Force re-authentication
  async reauthenticate(): Promise<boolean> {
    this.authenticated = false
    this.token = null
    this.appearsToken = null
    return this.authenticate()
  }

  // Get soil moisture data from SMAP
  async getSoilMoisture(coordinates: Coordinates, dateRange: DateRange): Promise<SoilMoistureData[]> {
    if (!this.appearsToken) {
      throw new Error("Not authenticated")
    }

    const task = {
      task_type: "point",
      task_name: `soil_moisture_${Date.now()}`,
      params: {
        coordinates: [coordinates],
        dates: [dateRange],
        layers: [
          {
            product: "SPL3SMP_E.003",
            layer: "Soil_Moisture_Retrieval_Data_AM_soil_moisture",
          },
        ],
      },
    }

    try {
      const response = await fetch(`${this.baseURL}/task`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.appearsToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      })

      if (!response.ok) {
        throw new Error("Failed to submit soil moisture task")
      }

      const taskData = await response.json()

      // Poll for task completion
      const results = await this.pollTaskStatus(taskData.task_id)

      return this.parseSoilMoistureResults(results)
    } catch (error) {
      console.error("[v0] Soil moisture fetch error:", error)
      return []
    }
  }

  // Get vegetation health (NDVI) from MODIS
  async getVegetationIndex(coordinates: Coordinates, dateRange: DateRange): Promise<VegetationData[]> {
    if (!this.appearsToken) {
      throw new Error("Not authenticated")
    }

    const task = {
      task_type: "point",
      task_name: `ndvi_${Date.now()}`,
      params: {
        coordinates: [coordinates],
        dates: [dateRange],
        layers: [
          {
            product: "MOD13Q1.061",
            layer: "250m_16_days_NDVI",
          },
        ],
      },
    }

    try {
      const response = await fetch(`${this.baseURL}/task`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.appearsToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      })

      if (!response.ok) {
        throw new Error("Failed to submit NDVI task")
      }

      const taskData = await response.json()
      const results = await this.pollTaskStatus(taskData.task_id)

      return this.parseVegetationResults(results)
    } catch (error) {
      console.error("[v0] Vegetation index fetch error:", error)
      return []
    }
  }

  // Get land surface temperature
  async getTemperature(coordinates: Coordinates, dateRange: DateRange): Promise<WeatherData[]> {
    if (!this.appearsToken) {
      throw new Error("Not authenticated")
    }

    const task = {
      task_type: "point",
      task_name: `temperature_${Date.now()}`,
      params: {
        coordinates: [coordinates],
        dates: [dateRange],
        layers: [
          {
            product: "MOD11A2.061",
            layer: "LST_Day_1km",
          },
          {
            product: "MOD11A2.061",
            layer: "LST_Night_1km",
          },
        ],
      },
    }

    try {
      const response = await fetch(`${this.baseURL}/task`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.appearsToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      })

      if (!response.ok) {
        throw new Error("Failed to submit temperature task")
      }

      const taskData = await response.json()
      const results = await this.pollTaskStatus(taskData.task_id)

      return this.parseTemperatureResults(results)
    } catch (error) {
      console.error("[v0] Temperature fetch error:", error)
      return []
    }
  }

  // Poll task status until complete
  private async pollTaskStatus(taskId: string, maxAttempts = 30): Promise<any> {
    for (let i = 0; i < maxAttempts; i++) {
      const response = await fetch(`${this.baseURL}/task/${taskId}`, {
        headers: {
          Authorization: `Bearer ${this.appearsToken}`,
        },
      })

      const data = await response.json()

      if (data.status === "done") {
        // Download results
        const resultsResponse = await fetch(`${this.baseURL}/bundle/${taskId}`, {
          headers: {
            Authorization: `Bearer ${this.appearsToken}`,
          },
        })

        return await resultsResponse.json()
      }

      if (data.status === "error") {
        throw new Error("Task failed")
      }

      // Wait 2 seconds before next poll
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }

    throw new Error("Task timeout")
  }

  // Parse soil moisture results
  private parseSoilMoistureResults(results: any): SoilMoistureData[] {
    // Parse the results from AppEEARS format
    // This is a simplified version - actual parsing would depend on response format
    return results.map((item: any) => ({
      date: item.Date,
      value: item.MOD_Grid_MOD15A2H_Lai_500m || 0,
      coordinates: {
        latitude: item.Latitude,
        longitude: item.Longitude,
      },
    }))
  }

  // Parse vegetation results
  private parseVegetationResults(results: any): VegetationData[] {
    return results.map((item: any) => ({
      date: item.Date,
      ndvi: item.MOD13Q1_061_250m_16_days_NDVI || 0,
      coordinates: {
        latitude: item.Latitude,
        longitude: item.Longitude,
      },
    }))
  }

  // Parse temperature results
  private parseTemperatureResults(results: any): WeatherData[] {
    return results.map((item: any) => ({
      date: item.Date,
      temperature: item.MOD11A2_061_LST_Day_1km || 0,
      precipitation: 0, // Would need additional API call for precipitation
      coordinates: {
        latitude: item.Latitude,
        longitude: item.Longitude,
      },
    }))
  }

  // Get NASA Worldview snapshot URL
  getWorldviewSnapshot(bbox: string, date: string, layers: string[]): string {
    const params = new URLSearchParams({
      REQUEST: "GetSnapshot",
      TIME: date,
      BBOX: bbox,
      LAYERS: layers.join(","),
      FORMAT: "image/png",
      WIDTH: "1024",
      HEIGHT: "1024",
    })

    return `https://worldview.earthdata.nasa.gov/service/snapshot?${params}`
  }
}

// Export singleton instance
export const nasaAPI = new NASAAPIManager()

// Mock data generator for development/demo
export function generateMockSoilMoisture(days = 30): SoilMoistureData[] {
  const data: SoilMoistureData[] = []
  const now = new Date()

  for (let i = days; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    data.push({
      date: date.toISOString().split("T")[0],
      value: 0.2 + Math.random() * 0.3, // 20-50% moisture
      coordinates: { latitude: 40.7128, longitude: -74.006 },
    })
  }

  return data
}

export function generateMockNDVI(days = 30): VegetationData[] {
  const data: VegetationData[] = []
  const now = new Date()

  for (let i = days; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    // NDVI ranges from -1 to 1, healthy vegetation is 0.6-0.9
    data.push({
      date: date.toISOString().split("T")[0],
      ndvi: 0.5 + Math.random() * 0.3,
      coordinates: { latitude: 40.7128, longitude: -74.006 },
    })
  }

  return data
}

export function generateMockWeather(days = 7): WeatherData[] {
  const data: WeatherData[] = []
  const now = new Date()

  for (let i = 0; i < days; i++) {
    const date = new Date(now)
    date.setDate(date.getDate() + i)

    data.push({
      date: date.toISOString().split("T")[0],
      temperature: 15 + Math.random() * 15, // 15-30°C
      precipitation: Math.random() * 10, // 0-10mm
      coordinates: { latitude: 40.7128, longitude: -74.006 },
    })
  }

  return data
}
