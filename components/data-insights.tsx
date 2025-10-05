"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, CheckCircle, Info, TrendingUp } from "lucide-react"
import { generateMockSoilMoisture, generateMockNDVI } from "@/lib/nasa-api"
import { useEffect, useState } from "react"

interface Insight {
  type: "warning" | "success" | "info"
  title: string
  message: string
}

export function DataInsights() {
  const [insights, setInsights] = useState<Insight[]>([])

  useEffect(() => {
    // Generate insights based on satellite data
    const soilData = generateMockSoilMoisture(7)
    const ndviData = generateMockNDVI(7)

    const newInsights: Insight[] = []

    // Analyze soil moisture trend
    const avgSoil = soilData.reduce((sum, d) => sum + d.value, 0) / soilData.length
    if (avgSoil < 0.25) {
      newInsights.push({
        type: "warning",
        title: "Low Soil Moisture Detected",
        message: `Average soil moisture is ${Math.floor(avgSoil * 100)}%. Consider increasing irrigation to prevent crop stress.`,
      })
    } else if (avgSoil > 0.5) {
      newInsights.push({
        type: "info",
        title: "High Soil Moisture",
        message: `Soil moisture is ${Math.floor(avgSoil * 100)}%. You may reduce irrigation to save water and improve sustainability score.`,
      })
    } else {
      newInsights.push({
        type: "success",
        title: "Optimal Soil Moisture",
        message: `Soil moisture levels are ideal at ${Math.floor(avgSoil * 100)}%. Maintain current irrigation schedule.`,
      })
    }

    // Analyze vegetation health
    const avgNDVI = ndviData.reduce((sum, d) => sum + d.ndvi, 0) / ndviData.length
    if (avgNDVI > 0.7) {
      newInsights.push({
        type: "success",
        title: "Healthy Vegetation",
        message: `NDVI index is ${avgNDVI.toFixed(2)}, indicating strong crop health. Crops are growing well.`,
      })
    } else if (avgNDVI < 0.5) {
      newInsights.push({
        type: "warning",
        title: "Vegetation Stress",
        message: `NDVI index is ${avgNDVI.toFixed(2)}. Check for water stress, nutrient deficiency, or pest issues.`,
      })
    }

    // Growth trend analysis
    const ndviTrend = ndviData[ndviData.length - 1].ndvi - ndviData[0].ndvi
    if (ndviTrend > 0.05) {
      newInsights.push({
        type: "info",
        title: "Positive Growth Trend",
        message: "Vegetation health is improving over the past week. Your farming practices are working well.",
      })
    }

    setInsights(newInsights)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          AI-Powered Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((insight, index) => (
          <Alert key={index} variant={insight.type === "warning" ? "destructive" : "default"}>
            {insight.type === "warning" && <AlertTriangle className="h-4 w-4" />}
            {insight.type === "success" && <CheckCircle className="h-4 w-4" />}
            {insight.type === "info" && <Info className="h-4 w-4" />}
            <AlertDescription>
              <p className="font-semibold">{insight.title}</p>
              <p className="text-sm mt-1">{insight.message}</p>
            </AlertDescription>
          </Alert>
        ))}

        <div className="pt-4 border-t">
          <h4 className="text-sm font-semibold mb-2">Data Sources:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• SMAP - Soil Moisture Active Passive</li>
            <li>• MODIS - Moderate Resolution Imaging Spectroradiometer</li>
            <li>• AppEEARS - Application for Extracting and Exploring Analysis Ready Samples</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
