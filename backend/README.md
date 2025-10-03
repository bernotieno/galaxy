# Lake Galaxy Farm Backend

Go backend server that integrates real NASA satellite data for agricultural simulation.

## 🛰️ NASA Data Integration

### Real Data Sources
- **OpenWeatherMap API**: Real-time weather data
- **NASA AppEEARS**: MODIS NDVI and vegetation indices
- **SMAP L3**: Soil moisture data (36km resolution)
- **GPM IMERG**: Precipitation data (10km resolution)
- **USDA Web Soil Survey**: Soil properties

### Setup Instructions

1. **Get API Keys**:
   ```bash
   # OpenWeatherMap (Free tier available)
   https://openweathermap.org/api
   
   # NASA Earthdata Login (Free)
   https://urs.earthdata.nasa.gov/
   ```

2. **Configure Environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Run Server**:
   ```bash
   go mod tidy
   go run main.go
   ```

## 📊 Data Endpoints

### `/api/nasa-data?lat=42.03&lon=-93.63`
Returns comprehensive NASA data:
- **Weather**: Temperature, humidity, wind, solar radiation
- **Soil**: Surface/root zone moisture, temperature, pH
- **Vegetation**: NDVI, EVI, LAI indices
- **Precipitation**: Daily, weekly, monthly totals

### Using Your Current Location
1. **Enable Location Access**: Click "Use My Current Location" button
2. **Allow Browser Permission**: Grant location access when prompted
3. **Automatic Data Fetch**: Game will use your GPS coordinates for real NASA data
4. **Real-time Updates**: Weather and satellite data for your exact location

### Location Options
- **Current Location**: Uses GPS coordinates (most accurate)
- **Predefined Locations**: Iowa, California, Kansas, Nebraska
- **Custom Coordinates**: Specify lat/lon in API call

### Fallback Behavior
If real NASA APIs are unavailable:
- Uses scientifically accurate simulation
- Maintains realistic data patterns
- Clearly labels data source

## 🔧 API Integration Details

### Weather Data (OpenWeatherMap)
```go
// Real-time weather conditions
GET https://api.openweathermap.org/data/2.5/weather
```

### MODIS NDVI (AppEEARS)
```go
// Vegetation health indices
GET https://appeears.earthdatacloud.nasa.gov/api/v1/point/{lat},{lon}
```

### SMAP Soil Moisture
```go
// Surface and root zone moisture
GET https://n5eil01u.ecs.nsidc.org/SMAP/SPL3SMP.008/
```

### GPM Precipitation
```go
// Global precipitation measurement
GET https://gpm1.gesdisc.eosdis.nasa.gov/data/GPM_L3/
```

## 🎯 Educational Value

### Data Accuracy
- Real satellite observations when available
- Proper resolution awareness (36km SMAP, 250m MODIS)
- Temporal frequency matching actual missions
- Uncertainty representation

### Learning Objectives
- Understanding satellite data applications
- Precision agriculture concepts
- Climate-agriculture interactions
- Sustainable farming practices

## 🚀 Deployment

### Environment Variables
```bash
OPENWEATHER_API_KEY=your_key
EARTHDATA_USERNAME=your_username
EARTHDATA_PASSWORD=your_password
```

### Docker Deployment
```bash
docker build -t lake-galaxy-backend .
docker run -p 8080:8080 --env-file .env lake-galaxy-backend
```

## 📚 NASA Resources

The backend connects to these NASA programs:
- **NASA Acres**: U.S. agriculture consortium
- **NASA Harvest**: Global food security initiative
- **ARSET**: Applied remote sensing training
- **AppEEARS**: Data extraction tool
- **Giovanni**: Data analysis platform