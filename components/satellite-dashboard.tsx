"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { generateMockSoilMoisture, generateMockNDVI, generateMockWeather } from "@/lib/nasa-api"
import { useEffect, useState } from "react"
import { useGameState } from "@/hooks/use-game-state"
import { Droplets, Leaf, CloudRain, Thermometer } from "lucide-react"

export function SatelliteDashboard() {
  const { state } = useGameState()
  const [soilData, setSoilData] = useState(generateMockSoilMoisture(30))
  const [ndviData, setNdviData] = useState(generateMockNDVI(30))
  const [weatherData, setWeatherData] = useState(generateMockWeather(7))
  const [lastUpdateDate, setLastUpdateDate] = useState(state.currentDate.getTime())

  useEffect(() => {
    // Update data when game date changes
    if (state.currentDate.getTime() !== lastUpdateDate) {
      setSoilData(generateMockSoilMoisture(30))
      setNdviData(generateMockNDVI(30))
      setWeatherData(generateMockWeather(7))
      setLastUpdateDate(state.currentDate.getTime())
    }
  }, [state.currentDate, lastUpdateDate])

  useEffect(() => {
    // Refresh data periodically for demo purposes
    const interval = setInterval(() => {
      setSoilData(generateMockSoilMoisture(30))
      setNdviData(generateMockNDVI(30))
      setWeatherData(generateMockWeather(7))
    }, 300000) // Every 5 minutes (less frequent than before)

    return () => clearInterval(interval)
  }, [])

  const soilChartData = soilData.map((d) => ({
    date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    moisture: Math.floor(d.value * 100),
  }))

  const ndviChartData = ndviData.map((d) => ({
    date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    ndvi: d.ndvi,
  }))

  const weatherChartData = weatherData.map((d) => ({
    date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    temp: Math.floor(d.temperature),
    precip: d.precipitation,
  }))

  const latestSoil = soilData[soilData.length - 1]
  const latestNDVI = ndviData[ndviData.length - 1]
  const latestWeather = weatherData[0]

  return (
    <div className="space-y-4">
      {/* Current Conditions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-500" />
              Soil Moisture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.floor(latestSoil.value * 100)}%</div>
            <p className="text-xs text-muted-foreground mt-1">SMAP Satellite</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Leaf className="w-4 h-4 text-green-500" />
              Vegetation Index
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestNDVI.ndvi.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">MODIS NDVI</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-orange-500" />
              Temperature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.floor(latestWeather.temperature)}°C</div>
            <p className="text-xs text-muted-foreground mt-1">Surface Temp</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CloudRain className="w-4 h-4 text-blue-600" />
              Precipitation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestWeather.precipitation.toFixed(1)}mm</div>
            <p className="text-xs text-muted-foreground mt-1">Today</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Visualization Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>NASA Satellite Data</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="soil" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="soil">Soil Moisture</TabsTrigger>
              <TabsTrigger value="ndvi">Vegetation Health</TabsTrigger>
              <TabsTrigger value="weather">Weather Forecast</TabsTrigger>
            </TabsList>

            <TabsContent value="soil" className="space-y-4">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={soilChartData}>
                    <defs>
                      <linearGradient id="soilGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.6 0.18 240)" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="oklch(0.6 0.18 240)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.82 0.03 60)" />
                    <XAxis dataKey="date" stroke="oklch(0.5 0.02 60)" style={{ fontSize: "12px" }} />
                    <YAxis stroke="oklch(0.5 0.02 60)" style={{ fontSize: "12px" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "oklch(0.95 0.02 60)",
                        border: "1px solid oklch(0.82 0.03 60)",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="moisture"
                      stroke="oklch(0.6 0.18 240)"
                      fillOpacity={1}
                      fill="url(#soilGradient)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p className="font-semibold">About Soil Moisture Data:</p>
                <p>
                  Data from NASA's SMAP (Soil Moisture Active Passive) satellite. Optimal range for most crops is
                  30-50%.
                </p>
                <p>Below 20% indicates drought stress. Above 60% may indicate waterlogging.</p>
              </div>
            </TabsContent>

            <TabsContent value="ndvi" className="space-y-4">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={ndviChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.82 0.03 60)" />
                    <XAxis dataKey="date" stroke="oklch(0.5 0.02 60)" style={{ fontSize: "12px" }} />
                    <YAxis domain={[0, 1]} stroke="oklch(0.5 0.02 60)" style={{ fontSize: "12px" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "oklch(0.95 0.02 60)",
                        border: "1px solid oklch(0.82 0.03 60)",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="ndvi"
                      stroke="oklch(0.55 0.15 145)"
                      strokeWidth={3}
                      dot={{ fill: "oklch(0.55 0.15 145)", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p className="font-semibold">About NDVI (Normalized Difference Vegetation Index):</p>
                <p>Data from MODIS satellite. NDVI ranges from -1 to 1, measuring vegetation health.</p>
                <p>
                  <span className="font-medium">0.6-0.9:</span> Healthy vegetation |{" "}
                  <span className="font-medium">0.2-0.5:</span> Sparse vegetation |{" "}
                  <span className="font-medium">&lt;0.2:</span> Bare soil
                </p>
              </div>
            </TabsContent>

            <TabsContent value="weather" className="space-y-4">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weatherChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.82 0.03 60)" />
                    <XAxis dataKey="date" stroke="oklch(0.5 0.02 60)" style={{ fontSize: "12px" }} />
                    <YAxis yAxisId="left" stroke="oklch(0.5 0.02 60)" style={{ fontSize: "12px" }} />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="oklch(0.5 0.02 60)"
                      style={{ fontSize: "12px" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "oklch(0.95 0.02 60)",
                        border: "1px solid oklch(0.82 0.03 60)",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="temp"
                      stroke="oklch(0.65 0.2 30)"
                      strokeWidth={2}
                      name="Temperature (°C)"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="precip"
                      stroke="oklch(0.6 0.18 240)"
                      strokeWidth={2}
                      name="Precipitation (mm)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p className="font-semibold">7-Day Weather Forecast:</p>
                <p>Temperature and precipitation predictions help plan irrigation and harvesting schedules.</p>
                <p>Use this data to optimize water usage and protect crops from extreme weather.</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Satellite Imagery Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Satellite Imagery</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-video bg-gradient-to-br from-[oklch(0.3_0.08_120)] to-[oklch(0.5_0.12_145)] rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-2">
                <Leaf className="w-12 h-12 mx-auto text-primary/50" />
                <p className="text-sm text-muted-foreground">NASA Worldview Satellite View</p>
                <p className="text-xs text-muted-foreground">Real-time imagery from MODIS Terra</p>
              </div>
            </div>
            {/* Overlay grid to simulate satellite view */}
            <div className="absolute inset-0 opacity-20">
              <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div key={i} className="border border-white/20" />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
