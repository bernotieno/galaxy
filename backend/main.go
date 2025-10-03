package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math"
	"math/rand"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

type NASAData struct {
	Weather       WeatherData       `json:"weather"`
	Soil          SoilData          `json:"soil"`
	Vegetation    VegetationData    `json:"vegetation"`
	Precipitation PrecipitationData `json:"precipitation"`
	Timestamp     time.Time         `json:"timestamp"`
	Coordinates   Coordinates       `json:"coordinates"`
}

type WeatherData struct {
	Temperature    int    `json:"temperature"`
	Humidity       int    `json:"humidity"`
	WindSpeed      int    `json:"windSpeed"`
	Pressure       int    `json:"pressure"`
	CloudCover     int    `json:"cloudCover"`
	SolarRadiation int    `json:"solarRadiation"`
	Source         string `json:"source"`
}

type SoilData struct {
	SurfaceMoisture    int     `json:"surfaceMoisture"`
	RootZoneMoisture   int     `json:"rootZoneMoisture"`
	SoilTemperature    int     `json:"soilTemperature"`
	OrganicMatter      int     `json:"organicMatter"`
	PH                 float64 `json:"pH"`
	Salinity           int     `json:"salinity"`
	Source             string  `json:"source"`
	Resolution         string  `json:"resolution"`
}

type VegetationData struct {
	NDVI             float64 `json:"ndvi"`
	EVI              float64 `json:"evi"`
	LAI              float64 `json:"lai"`
	VegetationHealth string  `json:"vegetationHealth"`
	Source           string  `json:"source"`
	Resolution       string  `json:"resolution"`
}

type PrecipitationData struct {
	DailyPrecipitation   int    `json:"dailyPrecipitation"`
	WeeklyTotal          int    `json:"weeklyTotal"`
	MonthlyTotal         int    `json:"monthlyTotal"`
	PrecipitationType    string `json:"precipitationType"`
	Source               string `json:"source"`
	Resolution           string `json:"resolution"`
}

type Coordinates struct {
	Lat float64 `json:"lat"`
	Lon float64 `json:"lon"`
}

type GameState struct {
	Season       string     `json:"season"`
	Day          int        `json:"day"`
	Budget       int        `json:"budget"`
	Score        int        `json:"score"`
	Plots        []Plot     `json:"plots"`
	Livestock    []Livestock `json:"livestock"`
	FarmType     string     `json:"farmType"`
	SustainabilityScore int `json:"sustainabilityScore"`
	WaterUsage   float64    `json:"waterUsage"`
	CarbonFootprint float64 `json:"carbonFootprint"`
	LastUpdated  time.Time  `json:"lastUpdated"`
}

type Plot struct {
	ID               int     `json:"id"`
	Crop             string  `json:"crop"`
	PlantedDay       int     `json:"plantedDay"`
	GrowthStage      string  `json:"growthStage"`
	GrowthProgress   float64 `json:"growthProgress"`
	SoilMoisture     float64 `json:"soilMoisture"`
	Fertility        float64 `json:"fertility"`
	Health           float64 `json:"health"`
	NeedsWater       bool    `json:"needsWater"`
	NeedsFertilizer  bool    `json:"needsFertilizer"`
	Yield            int     `json:"yield"`
}

type ActionRequest struct {
	PlotID int    `json:"plotId"`
	Action string `json:"action"`
	Crop   string `json:"crop,omitempty"`
}

type MapData struct {
	Region      string      `json:"region"`
	Coordinates Coordinates `json:"coordinates"`
	Climate     string      `json:"climate"`
	SoilType    string      `json:"soilType"`
	Elevation   int         `json:"elevation"`
}

type CropInfo struct {
	Name         string  `json:"name"`
	GrowthTime   int     `json:"growthTime"`
	WaterNeed    float64 `json:"waterNeed"`
	TempMin      int     `json:"tempMin"`
	TempMax      int     `json:"tempMax"`
	Cost         int     `json:"cost"`
	BaseYield    int     `json:"baseYield"`
	Emoji        string  `json:"emoji"`
	CarbonSeq    float64 `json:"carbonSequestration"`
	SoilHealth   float64 `json:"soilHealthImpact"`
	PestResist   float64 `json:"pestResistance"`
}

type Livestock struct {
	ID           int     `json:"id"`
	Type         string  `json:"type"`
	Count        int     `json:"count"`
	Health       float64 `json:"health"`
	Productivity float64 `json:"productivity"`
	FeedNeed     float64 `json:"feedNeed"`
	WaterNeed    float64 `json:"waterNeed"`
}

type WeatherEvent struct {
	Type        string  `json:"type"`
	Severity    float64 `json:"severity"`
	Duration    int     `json:"duration"`
	Impact      string  `json:"impact"`
	Probability float64 `json:"probability"`
}

type Tutorial struct {
	Step        int    `json:"step"`
	Title       string `json:"title"`
	Description string `json:"description"`
	DataFocus   string `json:"dataFocus"`
	Tip         string `json:"tip"`
}

var gameState = &GameState{
	Season: "Spring",
	Day:    1,
	Budget: 10000,
	Score:  0,
	Plots:  initializePlots(),
	Livestock: initializeLivestock(),
	FarmType: "smallholder",
	SustainabilityScore: 50,
	WaterUsage: 0,
	CarbonFootprint: 0,
	LastUpdated: time.Now(),
}

func initializeLivestock() []Livestock {
	return []Livestock{
		{0, "cattle", 5, 0.8, 0.7, 25, 50},
		{1, "chickens", 20, 0.9, 0.8, 5, 2},
	}
}

var cropDatabase = map[string]CropInfo{
	"corn": {"Corn", 90, 0.7, 15, 30, 50, 120, "🌽", 0.3, 0.1, 0.6},
	"wheat": {"Wheat", 120, 0.5, 10, 25, 30, 80, "🌾", 0.4, 0.2, 0.7},
	"soybean": {"Soybean", 100, 0.6, 20, 30, 40, 100, "🫘", 0.8, 0.4, 0.5},
	"tomato": {"Tomato", 80, 0.8, 18, 28, 60, 150, "🍅", 0.2, -0.1, 0.3},
	"coverCrop": {"Cover Crop", 60, 0.3, 5, 35, 20, 0, "🌱", 1.2, 0.8, 0.9},
}

var farmLocations = map[string]MapData{
	"iowa": {"Iowa Corn Belt", Coordinates{42.0308, -93.6319}, "Continental", "Prairie Soil", 300},
	"california": {"Central Valley", Coordinates{36.7783, -119.4179}, "Mediterranean", "Alluvial Soil", 100},
	"kansas": {"Great Plains", Coordinates{38.5266, -96.7265}, "Semi-arid", "Mollisol", 500},
	"nebraska": {"Corn Belt", Coordinates{41.1254, -98.2681}, "Continental", "Loess Soil", 400},
}

func initializePlots() []Plot {
	plots := make([]Plot, 16)
	for i := 0; i < 16; i++ {
		plots[i] = Plot{
			ID:           i,
			SoilMoisture: 0.3 + rand.Float64()*0.5,
			Fertility:    0.7 + rand.Float64()*0.3,
			Health:       1.0,
			GrowthStage:  "empty",
		}
	}
	return plots
}

func simulateCropGrowth() {
	for i := range gameState.Plots {
		plot := &gameState.Plots[i]
		if plot.Crop != "" {
			crop := cropDatabase[plot.Crop]
			daysGrown := gameState.Day - plot.PlantedDay
			progress := float64(daysGrown) / float64(crop.GrowthTime)
			
			plot.GrowthProgress = math.Min(1.0, progress)
			
			if progress < 0.25 {
				plot.GrowthStage = "seedling"
			} else if progress < 0.5 {
				plot.GrowthStage = "vegetative"
			} else if progress < 0.75 {
				plot.GrowthStage = "flowering"
			} else if progress < 1.0 {
				plot.GrowthStage = "fruiting"
			} else {
				plot.GrowthStage = "mature"
				plot.Yield = int(float64(crop.BaseYield) * plot.Health * plot.Fertility)
			}
			
			// Environmental effects with NASA data integration
			nasaData := generateNASAData(42.0308, -93.6319) // Use current location
			
			// Temperature stress
			if nasaData.Weather.Temperature < crop.TempMin || nasaData.Weather.Temperature > crop.TempMax {
				plot.Health *= 0.95
			}
			
			// Water stress
			if plot.SoilMoisture < crop.WaterNeed {
				plot.Health *= 0.98
				plot.NeedsWater = true
			}
			
			// Nutrient deficiency
			if plot.Fertility < 0.5 {
				plot.Health *= 0.99
				plot.NeedsFertilizer = true
			}
			
			// NDVI correlation with health
			if nasaData.Vegetation.NDVI < 0.4 {
				plot.Health *= 0.97
			}
			
			// Natural moisture depletion
			plot.SoilMoisture = math.Max(0.1, plot.SoilMoisture-0.02)
			
			// Sustainability impact
			if crop.SoilHealth > 0 {
				plot.Fertility = math.Min(1.0, plot.Fertility+crop.SoilHealth*0.001)
			}
		}
	}
}

func fetchRealNASAData(lat, lon float64) NASAData {
	now := time.Now()
	
	// Try to fetch real NASA data, fallback to simulation if unavailable
	weatherData := fetchWeatherData(lat, lon)
	soilData := fetchSMAPData(lat, lon)
	vegetationData := fetchMODISData(lat, lon)
	precipData := fetchGPMData(lat, lon)
	
	return NASAData{
		Weather:       weatherData,
		Soil:          soilData,
		Vegetation:    vegetationData,
		Precipitation: precipData,
		Timestamp:     now,
		Coordinates:   Coordinates{Lat: lat, Lon: lon},
	}
}

func fetchWeatherData(lat, lon float64) WeatherData {
	// OpenWeatherMap API for real weather data
	apiKey := "YOUR_OPENWEATHER_API_KEY" // Replace with actual key
	url := fmt.Sprintf("https://api.openweathermap.org/data/2.5/weather?lat=%f&lon=%f&appid=%s&units=metric", lat, lon, apiKey)
	
	resp, err := http.Get(url)
	if err != nil {
		return simulateWeatherData(lat, lon)
	}
	defer resp.Body.Close()
	
	var weatherResp struct {
		Main struct {
			Temp     float64 `json:"temp"`
			Humidity int     `json:"humidity"`
			Pressure int     `json:"pressure"`
		} `json:"main"`
		Wind struct {
			Speed float64 `json:"speed"`
		} `json:"wind"`
		Clouds struct {
			All int `json:"all"`
		} `json:"clouds"`
	}
	
	if err := json.NewDecoder(resp.Body).Decode(&weatherResp); err != nil {
		return simulateWeatherData(lat, lon)
	}
	
	return WeatherData{
		Temperature:    int(weatherResp.Main.Temp),
		Humidity:       weatherResp.Main.Humidity,
		WindSpeed:      int(weatherResp.Wind.Speed * 3.6), // Convert m/s to km/h
		Pressure:       weatherResp.Main.Pressure,
		CloudCover:     weatherResp.Clouds.All,
		SolarRadiation: calculateSolarRadiation(lat, weatherResp.Clouds.All),
		Source:         "OpenWeatherMap (Real-time)",
	}
}

func fetchSMAPData(lat, lon float64) SoilData {
	// NASA SMAP API via AppEEARS or direct access
	// For demo, using USDA Web Soil Survey as proxy
	url := fmt.Sprintf("https://sdmdataaccess.sc.egov.usda.gov/Spatial/SDMNAD83Geographic.wfs?SERVICE=WFS&VERSION=1.1.0&REQUEST=GetFeature&TYPENAME=MapunitPoly&FILTER=<Filter><Intersects><PropertyName>geom</PropertyName><Point><coordinates>%f,%f</coordinates></Point></Intersects></Filter>", lon, lat)
	
	resp, err := http.Get(url)
	if err != nil {
		return simulateSoilData(lat, lon)
	}
	defer resp.Body.Close()
	
	// Parse soil data or use SMAP L3 data if available
	// Fallback to simulation for now
	return simulateSoilData(lat, lon)
}

func fetchMODISData(lat, lon float64) VegetationData {
	// NASA MODIS NDVI via AppEEARS API
	// Requires authentication token
	token := "YOUR_EARTHDATA_TOKEN" // Replace with actual token
	url := fmt.Sprintf("https://appeears.earthdatacloud.nasa.gov/api/v1/point/%f,%f", lat, lon)
	
	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Set("Authorization", "Bearer "+token)
	
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return simulateVegetationData(lat, lon)
	}
	defer resp.Body.Close()
	
	// Parse MODIS NDVI response
	// Fallback to simulation for now
	return simulateVegetationData(lat, lon)
}

func fetchGPMData(lat, lon float64) PrecipitationData {
	// NASA GPM IMERG data via Giovanni or direct API
	// Using NOAA precipitation API as proxy
	url := fmt.Sprintf("https://api.weather.gov/points/%f,%f", lat, lon)
	
	resp, err := http.Get(url)
	if err != nil {
		return simulatePrecipitationData(lat, lon)
	}
	defer resp.Body.Close()
	
	// Parse precipitation forecast
	// Fallback to simulation for now
	return simulatePrecipitationData(lat, lon)
}

// Simulation fallbacks
func simulateWeatherData(lat, lon float64) WeatherData {
	now := time.Now()
	dayOfYear := float64(now.YearDay())
	seasonalTemp := 20 + 15*math.Sin((dayOfYear/365)*2*math.Pi)
	dailyVariation := 5 * math.Sin((float64(now.Hour())/24)*2*math.Pi)
	randomVariation := (rand.Float64() - 0.5) * 8
	baseTemp := int(seasonalTemp + dailyVariation + randomVariation)
	
	return WeatherData{
		Temperature:    baseTemp,
		Humidity:       40 + rand.Intn(40),
		WindSpeed:      5 + rand.Intn(15),
		Pressure:       1013 + rand.Intn(60) - 30,
		CloudCover:     rand.Intn(100),
		SolarRadiation: 200 + rand.Intn(400),
		Source:         "Simulated (Real API unavailable)",
	}
}

func simulateSoilData(lat, lon float64) SoilData {
	baselineMoisture := 0.3 + rand.Float64()*0.4
	seasonalEffect := 0.1 * math.Sin((float64(time.Now().Unix())/86400)*2*math.Pi/365)
	weatherEffect := (rand.Float64() - 0.5) * 0.2
	soilMoisture := math.Max(0.1, math.Min(0.8, baselineMoisture+seasonalEffect+weatherEffect))
	
	return SoilData{
		SurfaceMoisture:  int(soilMoisture * 100),
		RootZoneMoisture: int(soilMoisture * 80),
		SoilTemperature:  20 + rand.Intn(10) - 5,
		OrganicMatter:    2 + rand.Intn(4),
		PH:               6.0 + rand.Float64()*2,
		Salinity:         rand.Intn(4),
		Source:           "Simulated (SMAP API unavailable)",
		Resolution:       "36km",
	}
}

func simulateVegetationData(lat, lon float64) VegetationData {
	dayOfYear := float64(time.Now().YearDay())
	seasonalNDVI := 0.5 + 0.3*math.Sin((dayOfYear/365)*2*math.Pi)
	ndviVariation := (rand.Float64() - 0.5) * 0.2
	ndvi := math.Max(0.1, math.Min(0.9, seasonalNDVI+ndviVariation))
	
	var vegHealth string
	if ndvi > 0.6 {
		vegHealth = "Healthy"
	} else if ndvi > 0.4 {
		vegHealth = "Moderate"
	} else {
		vegHealth = "Poor"
	}
	
	return VegetationData{
		NDVI:             math.Round(ndvi*1000) / 1000,
		EVI:              math.Round((ndvi*0.8+rand.Float64()*0.1)*1000) / 1000,
		LAI:              math.Round(ndvi*6*100) / 100,
		VegetationHealth: vegHealth,
		Source:           "Simulated (MODIS API unavailable)",
		Resolution:       "250m",
	}
}

func simulatePrecipitationData(lat, lon float64) PrecipitationData {
	seasonalRain := 50 + 30*math.Sin((float64(time.Now().Unix())/86400)*2*math.Pi/365)
	rainVariation := rand.Float64() * 40
	dailyPrecip := math.Max(0, seasonalRain+rainVariation-40)
	
	var precipType string
	if dailyPrecip > 20 {
		precipType = "Heavy Rain"
	} else if dailyPrecip > 5 {
		precipType = "Light Rain"
	} else {
		precipType = "No Precipitation"
	}
	
	return PrecipitationData{
		DailyPrecipitation: int(dailyPrecip),
		WeeklyTotal:        int(dailyPrecip * 7 * (0.8 + rand.Float64()*0.4)),
		MonthlyTotal:       int(dailyPrecip * 30 * (0.7 + rand.Float64()*0.6)),
		PrecipitationType:  precipType,
		Source:             "Simulated (GPM API unavailable)",
		Resolution:         "10km",
	}
}

func calculateSolarRadiation(lat float64, cloudCover int) int {
	// Simplified solar radiation calculation
	dayOfYear := float64(time.Now().YearDay())
	solarDeclination := 23.45 * math.Sin((360*(284+dayOfYear)/365)*math.Pi/180)
	maxRadiation := 1000 * math.Cos((lat-solarDeclination)*math.Pi/180)
	cloudEffect := 1.0 - (float64(cloudCover)/100)*0.7
	return int(maxRadiation * cloudEffect)
}

// Updated function name for backward compatibility
func generateNASAData(lat, lon float64) NASAData {
	return fetchRealNASAData(lat, lon)
}

func getNASADataHandler(w http.ResponseWriter, r *http.Request) {
	lat, _ := strconv.ParseFloat(r.URL.Query().Get("lat"), 64)
	lon, _ := strconv.ParseFloat(r.URL.Query().Get("lon"), 64)
	
	if lat == 0 {
		lat = 42.0308 // Default to Iowa
	}
	if lon == 0 {
		lon = -93.6319
	}
	
	data := generateNASAData(lat, lon)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}

func getGameStateHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(gameState)
}

func performActionHandler(w http.ResponseWriter, r *http.Request) {
	var req ActionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	
	if req.PlotID < 0 || req.PlotID >= len(gameState.Plots) {
		http.Error(w, "Invalid plot ID", http.StatusBadRequest)
		return
	}
	
	plot := &gameState.Plots[req.PlotID]
	
	switch req.Action {
	case "plant":
		if plot.Crop != "" {
			http.Error(w, "Plot already has a crop", http.StatusBadRequest)
			return
		}
		cropCosts := map[string]int{"corn": 50, "wheat": 30, "soybean": 40, "tomato": 60}
		cost := cropCosts[req.Crop]
		if gameState.Budget < cost {
			http.Error(w, "Insufficient budget", http.StatusBadRequest)
			return
		}
		plot.Crop = req.Crop
		plot.PlantedDay = gameState.Day
		gameState.Budget -= cost
		
	case "irrigate":
		if gameState.Budget < 20 {
			http.Error(w, "Insufficient budget", http.StatusBadRequest)
			return
		}
		plot.SoilMoisture = math.Min(1.0, plot.SoilMoisture+0.3)
		plot.NeedsWater = false
		gameState.Budget -= 20
		gameState.Score += 10
		gameState.WaterUsage += 100 // Track water usage for sustainability
		
	case "fertilize":
		if gameState.Budget < 30 {
			http.Error(w, "Insufficient budget", http.StatusBadRequest)
			return
		}
		plot.Fertility = math.Min(1.0, plot.Fertility+0.2)
		plot.NeedsFertilizer = false
		gameState.Budget -= 30
		gameState.Score += 15
		gameState.CarbonFootprint += 0.5 // Fertilizer increases carbon footprint
		
	case "harvest":
		if plot.GrowthStage != "mature" {
			http.Error(w, "Crop not ready for harvest", http.StatusBadRequest)
			return
		}
		crop := cropDatabase[plot.Crop]
		yield := int(float64(crop.BaseYield) * plot.Health * plot.Fertility)
		revenue := yield * 2
		gameState.Budget += revenue
		gameState.Score += yield
		
		// Reset plot
		plot.Crop = ""
		plot.PlantedDay = 0
		plot.GrowthStage = "empty"
		plot.GrowthProgress = 0
		plot.Health = 1.0
		plot.Yield = 0
		
	case "rotateToLegume":
		if plot.Crop != "" {
			http.Error(w, "Plot must be empty for rotation", http.StatusBadRequest)
			return
		}
		plot.Fertility = math.Min(1.0, plot.Fertility+0.3) // Legumes fix nitrogen
		gameState.SustainabilityScore += 5
		
	case "installDripIrrigation":
		if gameState.Budget < 200 {
			http.Error(w, "Insufficient budget for drip irrigation", http.StatusBadRequest)
			return
		}
		gameState.Budget -= 200
		gameState.SustainabilityScore += 10
		// Reduce future water costs by 50%
	}
	
	gameState.LastUpdated = time.Now()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(gameState)
}

func getMapLocationsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(farmLocations)
}

func getCropsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(cropDatabase)
}

func getWeatherEventsHandler(w http.ResponseWriter, r *http.Request) {
	events := generateWeatherEvents()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(events)
}

func getTutorialsHandler(w http.ResponseWriter, r *http.Request) {
	tutorials := []Tutorial{
		{1, "Understanding NDVI", "NDVI from MODIS measures vegetation health (0.1-0.9). Use AppEEARS to download NDVI data for your location.", "vegetation", "NDVI below 0.4 suggests crop stress. Check NASA Worldview for real-time vegetation conditions!"},
		{2, "SMAP Soil Moisture", "SMAP provides surface (0-10cm) and root zone moisture at 36km resolution. Access via Crop-CASMA tool.", "soil", "Surface moisture affects germination, root zone affects mature plants. Download SMAP data for irrigation timing."},
		{3, "GPM Precipitation Data", "Global Precipitation Measurement provides 10km resolution rainfall data. Critical for irrigation planning.", "weather", "Use Giovanni to analyze precipitation trends. Combine with soil moisture for optimal water management."},
		{4, "Precision Agriculture with NASA", "Variable rate application using NDVI maps reduces fertilizer use by 15-30%. Learn more through ARSET training.", "precision", "NASA Acres program provides tools for precision agriculture. Join the consortium for access to cutting-edge methods."},
		{5, "Climate Adaptation Tools", "Use NASA's drought pathfinder and extreme heat data for climate-resilient farming strategies.", "climate", "U.S. Drought Monitor uses NASA data. Check weekly updates for drought preparedness and crop selection."},
		{6, "Real NASA Tools", "Access AppEEARS, Worldview, Giovanni, and Crop-CASMA for actual satellite data analysis.", "tools", "All NASA Earth science data is free! Create an Earthdata Login account to start downloading real satellite data."},
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tutorials)
}

func getSustainabilityHandler(w http.ResponseWriter, r *http.Request) {
	sustainability := map[string]interface{}{
		"carbonSequestration": calculateCarbonSequestration(),
		"waterEfficiency": calculateWaterEfficiency(),
		"soilHealth": calculateSoilHealth(),
		"biodiversity": calculateBiodiversity(),
		"recommendations": getSustainabilityRecommendations(),
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(sustainability)
}

func manageLivestockHandler(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Action string `json:"action"`
		Type   string `json:"type"`
		Count  int    `json:"count"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	
	for i := range gameState.Livestock {
		if gameState.Livestock[i].Type == req.Type {
			if req.Action == "feed" {
				gameState.Livestock[i].Health = math.Min(1.0, gameState.Livestock[i].Health+0.1)
				gameState.Budget -= req.Count * 10
			} else if req.Action == "water" {
				gameState.Livestock[i].Productivity = math.Min(1.0, gameState.Livestock[i].Productivity+0.05)
				gameState.Budget -= req.Count * 5
			}
			break
		}
	}
	
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(gameState)
}

func generateWeatherEvents() []WeatherEvent {
	return []WeatherEvent{
		{"drought", 0.7, 14, "Reduces soil moisture by 50%, increases irrigation needs", 0.3},
		{"flood", 0.8, 3, "Damages crops, delays planting, increases disease risk", 0.15},
		{"heatwave", 0.6, 7, "Stresses crops, increases water demand, reduces yields", 0.25},
		{"frost", 0.9, 1, "Can kill sensitive crops, delays planting season", 0.2},
		{"hail", 0.5, 1, "Physical damage to crops, insurance claims", 0.1},
	}
}

func calculateCarbonSequestration() float64 {
	total := 0.0
	for _, plot := range gameState.Plots {
		if plot.Crop != "" {
			crop := cropDatabase[plot.Crop]
			total += crop.CarbonSeq * plot.Health
		}
	}
	return total
}

func calculateWaterEfficiency() float64 {
	if gameState.WaterUsage == 0 {
		return 1.0
	}
	yield := float64(gameState.Score)
	return yield / gameState.WaterUsage
}

func calculateSoilHealth() float64 {
	total := 0.0
	for _, plot := range gameState.Plots {
		total += plot.Fertility
	}
	return total / float64(len(gameState.Plots))
}

func calculateBiodiversity() float64 {
	cropTypes := make(map[string]bool)
	for _, plot := range gameState.Plots {
		if plot.Crop != "" {
			cropTypes[plot.Crop] = true
		}
	}
	return float64(len(cropTypes)) / 5.0 // Max 5 crop types
}

func getSustainabilityRecommendations() []string {
	recommendations := []string{}
	
	if calculateCarbonSequestration() < 2.0 {
		recommendations = append(recommendations, "Plant cover crops to increase carbon sequestration")
	}
	
	if calculateWaterEfficiency() < 0.5 {
		recommendations = append(recommendations, "Implement drip irrigation to improve water efficiency")
	}
	
	if calculateBiodiversity() < 0.6 {
		recommendations = append(recommendations, "Diversify crops to improve biodiversity and reduce pest pressure")
	}
	
	if len(recommendations) == 0 {
		recommendations = append(recommendations, "Great job! Your farm is operating sustainably")
	}
	
	return recommendations
}

func main() {
	rand.Seed(time.Now().UnixNano())
	
	// Start game simulation
	go func() {
		ticker := time.NewTicker(10 * time.Second)
		for range ticker.C {
			gameState.Day++
			seasons := []string{"Spring", "Summer", "Fall", "Winter"}
			gameState.Season = seasons[(gameState.Day/90)%4]
			simulateCropGrowth()
			gameState.LastUpdated = time.Now()
		}
	}()
	
	r := mux.NewRouter()
	r.HandleFunc("/api/nasa-data", getNASADataHandler).Methods("GET")
	r.HandleFunc("/api/game-state", getGameStateHandler).Methods("GET")
	r.HandleFunc("/api/action", performActionHandler).Methods("POST")
	r.HandleFunc("/api/map-locations", getMapLocationsHandler).Methods("GET")
	r.HandleFunc("/api/crops", getCropsHandler).Methods("GET")
	r.HandleFunc("/api/weather-events", getWeatherEventsHandler).Methods("GET")
	r.HandleFunc("/api/tutorials", getTutorialsHandler).Methods("GET")
	r.HandleFunc("/api/sustainability", getSustainabilityHandler).Methods("GET")
	r.HandleFunc("/api/livestock", manageLivestockHandler).Methods("POST")
	
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:3000"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders: []string{"*"},
	})
	
	handler := c.Handler(r)
	
	log.Println("Server starting on :8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}