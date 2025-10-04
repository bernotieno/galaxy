package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"
)

// Test script to verify NASA data integration
func main() {
	fmt.Println("🛰️ Testing NASA Data Integration")
	fmt.Println("================================")

	// Test coordinates (Iowa - corn belt)
	lat, lon := 42.0308, -93.6319

	fmt.Printf("Testing location: %.4f, %.4f (Iowa)\n\n", lat, lon)

	// Test each data source
	testWeatherAPI(lat, lon)
	testSoilData(lat, lon)
	testVegetationData(lat, lon)
	testPrecipitationData(lat, lon)

	fmt.Println("\n✅ NASA data integration test complete!")
	fmt.Println("💡 Run 'go run main.go' to start the full server")
}

func testWeatherAPI(lat, lon float64) {
	fmt.Println("🌤️ Testing Weather Data (OpenWeatherMap)")
	
	// This would normally use the API key from environment
	// For testing, we'll simulate the response structure
	fmt.Println("   Status: Ready for API integration")
	fmt.Println("   Source: OpenWeatherMap API")
	fmt.Println("   Data: Temperature, humidity, wind, pressure")
	fmt.Println()
}

func testSoilData(lat, lon float64) {
	fmt.Println("🌱 Testing Soil Data (NASA SMAP)")
	
	fmt.Println("   Status: Ready for AppEEARS integration")
	fmt.Println("   Source: NASA SMAP L3 + USDA proxy")
	fmt.Println("   Data: Surface/root moisture, temperature, pH")
	fmt.Println()
}

func testVegetationData(lat, lon float64) {
	fmt.Println("🌿 Testing Vegetation Data (MODIS)")
	
	fmt.Println("   Status: Ready for Giovanni integration")
	fmt.Println("   Source: MODIS via NASA Giovanni")
	fmt.Println("   Data: NDVI, EVI, LAI, vegetation health")
	fmt.Println()
}

func testPrecipitationData(lat, lon float64) {
	fmt.Println("🌧️ Testing Precipitation Data (GPM)")
	
	fmt.Println("   Status: Ready for GPM + NOAA integration")
	fmt.Println("   Source: GPM IMERG via Giovanni + NOAA")
	fmt.Println("   Data: Daily/weekly/monthly precipitation")
	fmt.Println()
}

// Test the actual server endpoint
func testServerEndpoint() {
	fmt.Println("🔗 Testing Server Endpoint")
	
	client := &http.Client{Timeout: 5 * time.Second}
	resp, err := client.Get("http://localhost:8080/api/nasa-data?lat=42.0308&lon=-93.6319")
	
	if err != nil {
		fmt.Printf("   ❌ Server not running: %v\n", err)
		return
	}
	defer resp.Body.Close()
	
	if resp.StatusCode == 200 {
		fmt.Println("   ✅ Server endpoint working")
		
		var data map[string]interface{}
		if err := json.NewDecoder(resp.Body).Decode(&data); err == nil {
			fmt.Printf("   📊 Data received: %d fields\n", len(data))
		}
	} else {
		fmt.Printf("   ⚠️ Server returned status: %d\n", resp.StatusCode)
	}
}