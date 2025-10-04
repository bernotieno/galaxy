# NASA Farm Simulation Game - Development Prompt & API Guide

## 🎮 Game Development Prompt

### Project Vision
Create an engaging, educational farming simulation game that leverages NASA's real-time Earth observation data to teach sustainable agricultural practices. Players will manage virtual farms using actual satellite imagery, climate data, and soil moisture measurements to make informed decisions about irrigation, fertilization, and crop management.

### Core Game Mechanics

#### 1. **Farm Management Simulation**
- **Crop Selection**: Choose crops based on real climate data and soil conditions
- **Resource Management**: Balance water, fertilizer, and energy usage
- **Livestock Integration**: Manage grazing patterns using vegetation health data
- **Market Dynamics**: Respond to supply/demand influenced by regional weather patterns

#### 2. **Data-Driven Decisions**
- **Satellite View Mode**: Toggle between game graphics and actual NASA imagery
- **Weather Forecasting**: Use real precipitation and temperature data for planning
- **Soil Analysis**: Access SMAP soil moisture data to optimize irrigation
- **Vegetation Health**: Monitor NDVI values to track crop growth

#### 3. **Educational Components**
- **Tutorial Missions**: Learn to interpret satellite data
- **Challenge Scenarios**: Respond to drought, floods, and extreme heat events
- **Sustainability Score**: Track environmental impact and efficiency
- **Global Leaderboard**: Compare farming strategies worldwide

### Technical Requirements
- **Platform**: Web-based (HTML5/JavaScript) with mobile responsiveness
- **Real-time Data**: Integration with NASA APIs for live satellite data
- **Visualization**: Interactive maps and time-series graphs
- **Storage**: Cloud-based save system with progress tracking

---

## 📡 NASA API Integration Guide

### 1. **Earthdata Login (Required for All APIs)**

#### Registration Process
1. Create account at: https://urs.earthdata.nasa.gov/users/new
2. Verify email address
3. Accept terms of service

#### Authentication Methods

**Option A: Bearer Token (Recommended)**
```javascript
// Generate token (valid for 60 days)
const getToken = async () => {
  const response = await fetch('https://urs.earthdata.nasa.gov/api/users/token', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + btoa(username + ':' + password)
    }
  });
  return await response.json();
};
```

**Option B: OAuth 2.0 Flow**
- Redirect users to: `https://urs.earthdata.nasa.gov/oauth/authorize`
- Exchange authorization code for access token
- Refresh tokens as needed

---

### 2. **AppEEARS API** - Primary Data Source

#### Base URL
`https://appeears.earthdatacloud.nasa.gov/api/`

#### Authentication
```javascript
// Login to AppEEARS
const appearsLogin = async (username, password) => {
  const response = await fetch('https://appeears.earthdatacloud.nasa.gov/api/login', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + btoa(username + ':' + password),
      'Content-Length': '0'
    }
  });
  const data = await response.json();
  return data.token; // Use for subsequent requests
};
```

#### Key Endpoints for Game Data

**1. Soil Moisture (SMAP)**
```javascript
const getSoilMoisture = async (token, lat, lon, startDate, endDate) => {
  const task = {
    task_type: "point",
    task_name: "soil_moisture_query",
    params: {
      coordinates: [{latitude: lat, longitude: lon}],
      dates: [{startDate, endDate}],
      layers: [{
        product: "SPL3SMP_E.003",
        layer: "Soil_Moisture_Retrieval_Data_AM_soil_moisture"
      }]
    }
  };
  
  // Submit task
  const response = await fetch('https://appeears.earthdatacloud.nasa.gov/api/task', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(task)
  });
  return await response.json();
};
```

**2. Vegetation Health (MODIS NDVI)**
```javascript
const layers = [
  {
    product: "MOD13Q1.061",
    layer: "250m_16_days_NDVI"
  }
];
```

**3. Land Surface Temperature**
```javascript
const layers = [
  {
    product: "MOD11A2.061",
    layer: "LST_Day_1km"
  },
  {
    product: "MOD11A2.061",
    layer: "LST_Night_1km"
  }
];
```

---

### 3. **CMR (Common Metadata Repository) Search API**

#### Base URL
`https://cmr.earthdata.nasa.gov/search/`

#### No Authentication Required for Search

```javascript
// Search for granules
const searchGranules = async (bbox, temporal) => {
  const params = new URLSearchParams({
    collection_concept_id: 'C1234567890-PROVIDER',
    bounding_box: bbox, // format: "west,south,east,north"
    temporal: temporal,  // format: "2024-01-01T00:00:00Z,2024-12-31T23:59:59Z"
    page_size: 100
  });
  
  const response = await fetch(`https://cmr.earthdata.nasa.gov/search/granules.json?${params}`);
  return await response.json();
};
```

---

### 4. **NASA Worldview Snapshots API**

#### Generate Map Images
```javascript
const getWorldviewSnapshot = async (bbox, date, layers) => {
  const params = {
    REQUEST: 'GetSnapshot',
    TIME: date, // YYYY-MM-DD
    BBOX: bbox,
    LAYERS: layers.join(','),
    FORMAT: 'image/png',
    WIDTH: 1024,
    HEIGHT: 1024
  };
  
  const url = `https://worldview.earthdata.nasa.gov/service/snapshot?${new URLSearchParams(params)}`;
  return url; // Direct image URL
};
```

#### Useful Layers for Farming
- `MODIS_Terra_CorrectedReflectance_TrueColor` - True color imagery
- `MODIS_Terra_NDVI_8Day` - Vegetation health
- `VIIRS_NOAA20_Thermal_Anomalies_375m_Day` - Fire detection
- `GPM_3IMERGM_Precipitation` - Precipitation data

---

### 5. **Giovanni API** - Time Series Analysis

#### Base URL
`https://giovanni.gsfc.nasa.gov/giovanni/`

#### Data Processing Workflow
1. Submit analysis request
2. Poll for completion
3. Download results

```javascript
const submitGiovanniAnalysis = async (params) => {
  const request = {
    service: 'TmAvMp',  // Time Averaged Map
    starttime: '2024-01-01T00:00:00Z',
    endtime: '2024-12-31T23:59:59Z',
    bbox: '-90,30,-85,35',  // Gulf Coast example
    data: 'TRMM_3B43_7_precipitation',
    variableFacets: 'dataFieldMeasurement:Precipitation'
  };
  
  // Submit job and get job ID
  // Poll status endpoint until complete
  // Download resulting NetCDF or GeoTIFF files
};
```

---

### 6. **Crop-CASMA (Soil Moisture Analytics)**

#### WMS Service
```javascript
const getCropCASMALayer = (bbox, date) => {
  const wmsUrl = 'https://nassgeo.csiss.gmu.edu/CropCASMA/wms';
  const params = {
    SERVICE: 'WMS',
    VERSION: '1.3.0',
    REQUEST: 'GetMap',
    LAYERS: 'soil_moisture_daily',
    BBOX: bbox,
    WIDTH: 512,
    HEIGHT: 512,
    FORMAT: 'image/png',
    TIME: date
  };
  return `${wmsUrl}?${new URLSearchParams(params)}`;
};
```

---

### 7. **U.S. Drought Monitor Integration**

```javascript
const getDroughtData = async (state, date) => {
  const response = await fetch(`https://droughtmonitor.unl.edu/data/json/usdm_${date}.json`);
  const data = await response.json();
  return data.features.filter(f => f.properties.STATE === state);
};
```

---

## 🔧 Implementation Strategy

### Phase 1: Core Infrastructure
- Set up Earthdata Login authentication
- Create API wrapper classes
- Implement data caching layer
- Build basic farm grid system

### Phase 2: Data Integration
- Connect AppEEARS for point/area sampling
- Integrate Worldview for visual layers
- Implement soil moisture monitoring
- Add weather data feeds

### Phase 3: Game Mechanics
- Develop crop growth simulation
- Create irrigation system based on soil moisture
- Implement pest/disease models
- Add market price fluctuations

### Phase 4: Educational Content
- Design tutorial missions
- Create data interpretation guides
- Build achievement system
- Develop sustainability metrics

### Phase 5: Polish & Testing
- Performance optimization
- Mobile responsiveness
- Multiplayer features
- Beta testing

---

## 🛠️ Sample Game Architecture

```javascript
class NASAFarmGame {
  constructor() {
    this.apiManager = new APIManager();
    this.farmGrid = new FarmGrid(10, 10);
    this.dataCache = new DataCache();
    this.gameState = new GameState();
  }
  
  async initialize(username, password) {
    // Authenticate with NASA services
    await this.apiManager.authenticate(username, password);
    
    // Load initial satellite data
    await this.loadSatelliteData();
    
    // Initialize game world
    this.initializeWorld();
  }
  
  async updateFarmConditions() {
    const currentDate = this.gameState.currentDate;
    const farmLocation = this.gameState.farmLocation;
    
    // Fetch real-time data
    const soilMoisture = await this.apiManager.getSoilMoisture(
      farmLocation.lat, 
      farmLocation.lon, 
      currentDate
    );
    
    const vegetation = await this.apiManager.getVegetationIndex(
      farmLocation.bbox, 
      currentDate
    );
    
    const weather = await this.apiManager.getWeatherForecast(
      farmLocation.lat, 
      farmLocation.lon
    );
    
    // Update game state
    this.gameState.updateConditions({
      soilMoisture,
      vegetation,
      weather
    });
    
    // Calculate crop growth
    this.calculateCropGrowth();
  }
  
  calculateCropGrowth() {
    this.farmGrid.forEach(cell => {
      if (cell.hasCrop) {
        const growthRate = this.calculateGrowthRate(
          cell.crop,
          cell.soilMoisture,
          cell.temperature,
          cell.sunlight
        );
        cell.crop.grow(growthRate);
      }
    });
  }
}
```

---

## 📊 Data Usage Examples

### 1. **Irrigation Decision System**
```javascript
const shouldIrrigate = (soilMoisture, cropType, growthStage) => {
  const threshold = CROP_WATER_NEEDS[cropType][growthStage];
  if (soilMoisture < threshold.critical) {
    return { action: 'IRRIGATE_NOW', amount: 'HIGH' };
  } else if (soilMoisture < threshold.optimal) {
    return { action: 'IRRIGATE_SOON', amount: 'MODERATE' };
  }
  return { action: 'NO_IRRIGATION', amount: 0 };
};
```

### 2. **Harvest Timing Optimizer**
```javascript
const calculateOptimalHarvest = async (field, cropType) => {
  const ndviHistory = await getNDVITimeSeries(field.bbox, 30);
  const peakVegetation = findPeak(ndviHistory);
  const maturityIndicator = CROP_MATURITY[cropType].ndviThreshold;
  
  if (ndviHistory.latest >= maturityIndicator) {
    const weatherForecast = await getWeatherForecast(field.location, 7);
    if (weatherForecast.precipitation < 10) {
      return { harvest: 'READY', window: '3-5 days' };
    }
  }
  return { harvest: 'WAIT', estimatedDays: calculateDaysToMaturity() };
};
```

---

## 🔐 API Rate Limits & Best Practices

### Rate Limits
- **AppEEARS**: 100 requests/minute, 1000 tasks/day
- **CMR Search**: 5000 requests/minute
- **Worldview**: 100 snapshots/hour
- **Giovanni**: 10 concurrent jobs

### Best Practices
1. **Cache aggressively**: Store satellite imagery locally
2. **Batch requests**: Combine multiple coordinates in single AppEEARS tasks
3. **Use webhooks**: AppEEARS supports callbacks for task completion
4. **Implement retry logic**: Handle 503 errors gracefully
5. **Respect quotas**: Monitor usage to avoid throttling

### Error Handling
```javascript
const apiRequest = async (url, options, retries = 3) => {
  try {
    const response = await fetch(url, options);
    if (response.status === 429) {
      // Rate limited - wait and retry
      await sleep(60000);
      return apiRequest(url, options, retries - 1);
    }
    if (response.status === 503 && retries > 0) {
      // Service unavailable - retry with exponential backoff
      await sleep(Math.pow(2, 4 - retries) * 1000);
      return apiRequest(url, options, retries - 1);
    }
    return response;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};
```

---

## 🎯 Success Metrics

### Educational Goals
- Players can interpret NDVI values
- Understanding of soil moisture impact on crops
- Recognition of weather pattern effects
- Awareness of sustainable farming practices

### Engagement Metrics
- Average session duration > 20 minutes
- Return rate > 60% weekly
- Tutorial completion > 80%
- Social sharing rate > 15%

### Technical Performance
- API response time < 2 seconds
- Data accuracy > 95%
## 🚀 Launch Checklist
- Uptime > 99.5%
- Mobile performance > 30 FPS

---


- [ ] Earthdata Login integration complete
- [ ] All NASA APIs authenticated and tested
- [ ] Data caching layer implemented
- [ ] Game mechanics balanced with real data
- [ ] Tutorial content created
- [ ] Mobile UI responsive
- [ ] Performance optimized
- [ ] Beta testing completed
- [ ] Documentation finalized
- [ ] Community features enabled

---

## 📚 Additional Resources

### NASA Documentation
- [Earthdata Developer Portal](https://www.earthdata.nasa.gov/engage/open-data-services-software/earthdata-developer-portal)
- [AppEEARS API Docs](https://appeears.earthdatacloud.nasa.gov/api/)
- [CMR API Guide](https://cmr.earthdata.nasa.gov/search/site/docs/search/api.html)
- [GIBS Documentation](https://nasa-gibs.github.io/gibs-api-docs/)

### Community Resources
- [NASA Earthdata Forum](https://forum.earthdata.nasa.gov/)
- [GitHub Examples](https://github.com/nasa/AppEEARS-Data-Resources)
- [ARSET Training](https://appliedsciences.nasa.gov/arset)

### Support Contacts
- LP DAAC User Services: LPDAAC@usgs.gov
- Earthdata Support: support@earthdata.nasa.gov
- API Issues: Report via [Earthdata Forum](https://forum.earthdata.nasa.gov/)