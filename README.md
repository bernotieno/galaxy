# Lake Galaxy Farm 🌾

A modern educational farming simulation game with Go backend and Next.js frontend that utilizes NASA's open datasets to teach sustainable agriculture practices.

## 🏗️ Architecture

- **Backend**: Go with Gorilla Mux (REST API)
- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Data**: Simulated NASA satellite data (MODIS, SMAP, Landsat, GPM)

## 🚀 Quick Start

### Prerequisites
- Go 1.21+
- Node.js 18+
- npm or yarn

### Backend Setup
```bash
cd backend

# Install dependencies
go mod tidy

# Copy environment template
cp .env.example .env

# Add your API keys to .env file
# Get OpenWeatherMap key: https://openweathermap.org/api
# Get NASA Earthdata account: https://urs.earthdata.nasa.gov/

# Run server
go run main.go
```
Server runs on http://localhost:8080

**Note**: Without API keys, the system uses enhanced simulation with realistic patterns.

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on http://localhost:3000

## 🎮 Game Features

### NASA Data Integration
- **Real-time Weather**: Temperature, humidity, wind speed
- **Soil Analysis**: Moisture levels, pH, temperature
- **Vegetation Health**: NDVI, EVI, LAI indices
- **Precipitation**: Daily, weekly, monthly data

### Gameplay Mechanics
- **16-Plot Farm**: Interactive grid-based farming
- **4 Crop Types**: Corn, wheat, soybean, tomato
- **Resource Management**: Budget and scoring system
- **Data-Driven Decisions**: AI recommendations based on NASA data

## 🛰️ Real NASA Data Integration

| Data Source | API/Service | Resolution | Status |
|-------------|-------------|------------|--------|
| **Weather** | OpenWeatherMap API | Point | ✅ Real-time |
| **Soil Moisture** | NASA SMAP via AppEEARS | 36km | ✅ Real NASA data |
| **Vegetation** | MODIS via Giovanni | 250m-1km | ✅ Real NASA data |
| **Precipitation** | GPM IMERG + NOAA | 10km | ✅ Real NASA data |

### 🔑 API Setup Required

1. **OpenWeatherMap** (Free): [Get API key](https://openweathermap.org/api)
2. **NASA Earthdata** (Free): [Create account](https://urs.earthdata.nasa.gov/)
3. **AppEEARS Token**: [Generate token](https://appeears.earthdatacloud.nasa.gov/)

Add your keys to `backend/.env`:
```bash
OPENWEATHER_API_KEY=your_key_here
EARTHDATA_TOKEN=your_token_here
```

## 📊 API Endpoints

### GET /api/nasa-data
Fetch NASA satellite data for coordinates
```
Query params: lat, lon (optional, defaults to Iowa)
```

### GET /api/game-state
Get current game state

### POST /api/action
Perform farming action
```json
{
  "plotId": 0,
  "action": "plant|irrigate|fertilize",
  "crop": "corn|wheat|soybean|tomato"
}
```

## 🎯 Educational Objectives

1. **Data Literacy**: Understanding satellite remote sensing
2. **Sustainable Agriculture**: Resource optimization
3. **Climate Awareness**: Weather impact on farming
4. **Decision Making**: Data-driven agricultural choices

## 🔧 Development

### Project Structure
```
lake_galaxy/
├── backend/
│   ├── main.go          # Go server with real NASA APIs
│   ├── .env             # API keys (create from .env.example)
│   └── go.mod           # Go dependencies
└── frontend/
    ├── src/
    │   ├── app/         # Next.js app router
    │   ├── components/  # React components
    │   ├── lib/         # API client
    │   └── types/       # TypeScript definitions
    ├── package.json
    └── next.config.js   # API proxy configuration
```

### Real NASA Data Sources

- **OpenWeatherMap**: Real-time weather conditions
- **NASA AppEEARS**: SMAP soil moisture data
- **NASA Giovanni**: MODIS vegetation indices (NDVI, EVI, LAI)
- **NASA GPM**: Global precipitation measurements
- **NOAA Weather**: US precipitation forecasts
- **USDA Web Soil Survey**: Soil properties proxy

### Key Components
- **FarmGrid**: Interactive plot management
- **DataDashboard**: NASA data visualization
- **GameHeader**: Score and budget display

## 🌱 Current Features

✅ **Real NASA API Integration**
- Live weather data from OpenWeatherMap
- SMAP soil moisture via AppEEARS
- MODIS vegetation health via Giovanni
- GPM precipitation via Giovanni + NOAA

✅ **Enhanced Simulation Fallbacks**
- Realistic climate patterns when APIs unavailable
- Geographic and seasonal variations
- Educational value maintained

## 🚀 Future Enhancements

- WebSocket for real-time updates
- Historical NASA data analysis
- Advanced crop modeling with ML
- Multiplayer farming challenges
- Integration with more NASA datasets

## 📚 Learning Resources

- [NASA Earthdata](https://earthdata.nasa.gov/)
- [MODIS Data](https://modis.gsfc.nasa.gov/)
- [SMAP Mission](https://smap.jpl.nasa.gov/)
- [Precision Agriculture](https://www.precisionag.com/)

## 📄 License

MIT License - Educational use encouraged

---

**Transform agriculture education with NASA data!** 🛰️🌾