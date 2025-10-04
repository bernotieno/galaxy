# 🛰️ NASA Data Setup Guide

This guide helps you set up real NASA data integration for Lake Galaxy Farm.

## 🔑 Required API Keys

### 1. OpenWeatherMap API (Free)
- **Purpose**: Real-time weather data
- **Sign up**: https://openweathermap.org/api
- **Steps**:
  1. Create free account
  2. Verify email
  3. Go to API Keys section
  4. Copy your API key

### 2. NASA Earthdata Login (Free)
- **Purpose**: Access to NASA satellite data
- **Sign up**: https://urs.earthdata.nasa.gov/
- **Steps**:
  1. Create free account
  2. Verify email
  3. Note your username/password

### 3. NASA AppEEARS Token (Free)
- **Purpose**: SMAP soil moisture data
- **Get token**: https://appeears.earthdatacloud.nasa.gov/
- **Steps**:
  1. Login with Earthdata credentials
  2. Go to "Generate Token" 
  3. Copy the bearer token

## ⚙️ Configuration

1. **Copy environment template**:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. **Edit `.env` file**:
   ```bash
   # Add your actual API keys
   OPENWEATHER_API_KEY=your_openweather_key_here
   EARTHDATA_USERNAME=your_nasa_username
   EARTHDATA_PASSWORD=your_nasa_password
   EARTHDATA_TOKEN=your_appeears_token_here
   ```

3. **Secure your .env file**:
   ```bash
   # Make sure .env is in .gitignore
   echo ".env" >> .gitignore
   
   # Or tell git to ignore changes
   git update-index --assume-unchanged backend/.env
   ```

## 🚀 Start the Application

```bash
# Backend (Terminal 1)
cd backend
go run main.go

# Frontend (Terminal 2)  
cd frontend
npm run dev
```

## 📊 Data Source Status

Visit http://localhost:3000 and check the "NASA Data Sources" panel to see:
- ✅ **Live**: Real API data
- ⚠️ **Simulated**: Enhanced simulation (when API unavailable)

## 🌍 Available Data

| Data Type | Source | Coverage | Update Frequency |
|-----------|--------|----------|------------------|
| Weather | OpenWeatherMap | Global | Real-time |
| Soil Moisture | NASA SMAP | Global, 36km | Daily |
| Vegetation | MODIS | Global, 250m-1km | 16-day |
| Precipitation | GPM + NOAA | Global/US | Daily |

## 🔧 Troubleshooting

### No API Keys
- System automatically uses enhanced simulation
- Still educational and realistic
- Geographic and seasonal patterns included

### API Errors
- Check API key validity
- Verify internet connection
- Check rate limits (OpenWeatherMap: 1000 calls/day free)

### CORS Issues
- Make sure backend is running on :8080
- Frontend proxy configured in next.config.js

## 📚 Learn More

- **NASA Earthdata**: https://earthdata.nasa.gov/
- **AppEEARS Tutorial**: https://appeears.earthdatacloud.nasa.gov/help
- **MODIS Data**: https://modis.gsfc.nasa.gov/
- **SMAP Mission**: https://smap.jpl.nasa.gov/
- **GPM Mission**: https://gpm.nasa.gov/

## 🎯 Educational Goals

Even without API keys, the system provides:
- Realistic climate simulation
- Geographic variations
- Seasonal patterns
- NASA data concepts
- Satellite remote sensing education

**Ready to start farming with NASA data!** 🌾🛰️