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
go mod tidy
go run main.go
```
Server runs on http://localhost:8080

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

## 🛰️ NASA Data Sources (Simulated)

| Mission | Data Type | Resolution | Purpose |
|---------|-----------|------------|---------|
| MODIS/VIIRS | Weather | Regional | Temperature, humidity |
| SMAP | Soil Moisture | 36km | Surface and root zone moisture |
| Landsat/MODIS | Vegetation | 250m | NDVI, vegetation health |
| GPM | Precipitation | 10km | Rainfall measurements |

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
│   ├── main.go          # Go server with NASA data simulation
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

### Key Components
- **FarmGrid**: Interactive plot management
- **DataDashboard**: NASA data visualization
- **GameHeader**: Score and budget display

## 🌱 Future Enhancements

- Real NASA API integration
- WebSocket for real-time updates
- Advanced crop modeling
- Multiplayer functionality
- Historical data analysis

## 📚 Learning Resources

- [NASA Earthdata](https://earthdata.nasa.gov/)
- [MODIS Data](https://modis.gsfc.nasa.gov/)
- [SMAP Mission](https://smap.jpl.nasa.gov/)
- [Precision Agriculture](https://www.precisionag.com/)

## 📄 License

MIT License - Educational use encouraged

---

**Transform agriculture education with NASA data!** 🛰️🌾