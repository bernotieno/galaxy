"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { HelpTooltip } from "@/components/help-tooltip"
import type { GameState } from "@/lib/game-types"
import {
  Cloud,
  CloudRain,
  Sun,
  CloudSnow,
  Thermometer,
  Droplets,
  Wind,
  Eye,
  AlertTriangle,
  Info
} from "lucide-react"

interface WeatherWidgetProps {
  gameState: GameState
}

interface WeatherAlert {
  type: "warning" | "info" | "danger"
  title: string
  message: string
  icon: React.ReactNode
}

export function WeatherWidget({ gameState }: WeatherWidgetProps) {
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([])
  const { weather } = gameState

  // Generate weather forecast (mock data for now)
  const generateForecast = () => {
    const days = ['Today', 'Tomorrow', 'Day 3', 'Day 4', 'Day 5']
    return days.map((day, index) => ({
      day,
      temp: weather.temperature + (Math.random() - 0.5) * 6,
      precipitation: Math.random() * 20,
      condition: Math.random() > 0.7 ? 'rain' : Math.random() > 0.5 ? 'cloudy' : 'sunny'
    }))
  }

  const forecast = generateForecast()

  // Calculate weather conditions and alerts
  useEffect(() => {
    const alerts: WeatherAlert[] = []

    // Temperature alerts
    if (weather.temperature > 35) {
      alerts.push({
        type: "danger",
        title: "Extreme Heat Warning",
        message: "High temperatures may stress crops. Increase irrigation frequency.",
        icon: <Thermometer className="w-4 h-4" />
      })
    } else if (weather.temperature < 5) {
      alerts.push({
        type: "warning",
        title: "Frost Warning",
        message: "Low temperatures may damage sensitive crops.",
        icon: <CloudSnow className="w-4 h-4" />
      })
    }

    // Precipitation alerts
    if (weather.precipitation > 15) {
      alerts.push({
        type: "info",
        title: "Heavy Rain Expected",
        message: "Soil moisture will increase naturally. Reduce irrigation.",
        icon: <CloudRain className="w-4 h-4" />
      })
    } else if (weather.precipitation === 0 && weather.temperature > 25) {
      alerts.push({
        type: "warning",
        title: "Dry Conditions",
        message: "No rain expected. Monitor soil moisture closely.",
        icon: <Sun className="w-4 h-4" />
      })
    }

    setWeatherAlerts(alerts)
  }, [weather])

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'rain':
        return <CloudRain className="w-6 h-6 text-blue-500" />
      case 'cloudy':
        return <Cloud className="w-6 h-6 text-gray-500" />
      default:
        return <Sun className="w-6 h-6 text-yellow-500" />
    }
  }

  const getTemperatureColor = (temp: number) => {
    if (temp > 30) return "text-red-500"
    if (temp > 20) return "text-orange-500"
    if (temp > 10) return "text-yellow-500"
    return "text-blue-500"
  }

  const getTemperatureStatus = (temp: number) => {
    if (temp > 35) return { label: "Very Hot", color: "bg-red-500" }
    if (temp > 25) return { label: "Hot", color: "bg-orange-500" }
    if (temp > 15) return { label: "Warm", color: "bg-yellow-500" }
    if (temp > 5) return { label: "Cool", color: "bg-blue-500" }
    return { label: "Cold", color: "bg-blue-700" }
  }

  const tempStatus = getTemperatureStatus(weather.temperature)

  return (
    <div className="space-y-4">
      {/* Current Weather */}
      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getWeatherIcon(weather.precipitation > 5 ? 'rain' : weather.temperature > 25 ? 'sunny' : 'cloudy')}
            Current Weather
            <HelpTooltip content="Weather affects crop growth, water needs, and soil conditions. Monitor alerts for optimal farming decisions." />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Temperature */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Thermometer className={`w-5 h-5 ${getTemperatureColor(weather.temperature)}`} />
              <div>
                <div className={`text-2xl font-bold ${getTemperatureColor(weather.temperature)}`}>
                  {Math.floor(weather.temperature)}°C
                </div>
                <Badge variant="outline" className={tempStatus.color + " text-white border-0"}>
                  {tempStatus.label}
                </Badge>
              </div>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <div>Feels like {Math.floor(weather.temperature + 2)}°C</div>
              <div>Humidity: 65%</div>
            </div>
          </div>

          {/* Precipitation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Droplets className="w-5 h-5 text-blue-500" />
              <div>
                <div className="text-lg font-semibold">
                  {weather.precipitation.toFixed(1)}mm
                </div>
                <div className="text-sm text-muted-foreground">Precipitation</div>
              </div>
            </div>
            <div className="text-right">
              <Progress
                value={Math.min(weather.precipitation * 5, 100)}
                className="w-20 h-2"
              />
              <div className="text-xs text-muted-foreground mt-1">
                {weather.precipitation > 10 ? 'Heavy' : weather.precipitation > 5 ? 'Moderate' : weather.precipitation > 0 ? 'Light' : 'None'}
              </div>
            </div>
          </div>

          {/* Additional Conditions */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
            <div className="flex items-center gap-2 text-sm">
              <Wind className="w-4 h-4 text-gray-500" />
              <span className="text-muted-foreground">Wind:</span>
              <span className="font-medium">12 km/h</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Eye className="w-4 h-4 text-gray-500" />
              <span className="text-muted-foreground">Visibility:</span>
              <span className="font-medium">10 km</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weather Alerts */}
      {weatherAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              Weather Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {weatherAlerts.map((alert, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border-l-4 ${
                  alert.type === 'danger'
                    ? 'bg-red-50 border-red-500'
                    : alert.type === 'warning'
                    ? 'bg-yellow-50 border-yellow-500'
                    : 'bg-blue-50 border-blue-500'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={
                    alert.type === 'danger'
                      ? 'text-red-500'
                      : alert.type === 'warning'
                      ? 'text-yellow-500'
                      : 'text-blue-500'
                  }>
                    {alert.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{alert.title}</h4>
                    <p className="text-xs text-muted-foreground">{alert.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* 5-Day Forecast */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-blue-500" />
            5-Day Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {forecast.map((day, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {getWeatherIcon(day.condition)}
                  <div>
                    <div className="font-medium text-sm">{day.day}</div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {day.condition}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-semibold ${getTemperatureColor(day.temp)}`}>
                    {Math.floor(day.temp)}°C
                  </div>
                  <div className="text-xs text-blue-600">
                    {day.precipitation.toFixed(1)}mm
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Farming Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5 text-green-500" />
            Farming Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {weather.temperature > 30 && (
            <div className="flex items-start gap-2 text-orange-600">
              <Sun className="w-4 h-4 mt-0.5" />
              <span>High temperatures increase water evaporation. Irrigate during cooler hours.</span>
            </div>
          )}
          {weather.precipitation > 10 && (
            <div className="flex items-start gap-2 text-blue-600">
              <CloudRain className="w-4 h-4 mt-0.5" />
              <span>Heavy rain provides natural irrigation. Skip watering today to save resources.</span>
            </div>
          )}
          {weather.temperature < 15 && (
            <div className="flex items-start gap-2 text-purple-600">
              <CloudSnow className="w-4 h-4 mt-0.5" />
              <span>Cool weather slows growth. Consider cold-resistant crops like wheat.</span>
            </div>
          )}
          {weather.precipitation === 0 && weather.temperature > 25 && (
            <div className="flex items-start gap-2 text-red-600">
              <Thermometer className="w-4 h-4 mt-0.5" />
              <span>Hot and dry conditions stress crops. Monitor soil moisture closely.</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}