// Environment variable helpers for NASA API integration

export const getEnvVar = (key: string, defaultValue?: string): string | undefined => {
  if (typeof window !== 'undefined') {
    // Client-side: only allow NEXT_PUBLIC_ variables
    if (key.startsWith('NEXT_PUBLIC_')) {
      return (window as { __ENV?: Record<string, string> }).__ENV?.[key] || defaultValue
    }
    return defaultValue
  }

  // Server-side: access process.env
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || defaultValue
  }

  return defaultValue
}

export const getNASACredentials = () => {
  const username = getEnvVar('NASA_EARTHDATA_USERNAME')
  const password = getEnvVar('NASA_EARTHDATA_PASSWORD')
  const apiKey = getEnvVar('NASA_API_KEY')
  const bearerToken = getEnvVar('NASA_BEARER_TOKEN')

  return { username, password, apiKey, bearerToken }
}

export const getNASAAPIConfig = () => ({
  ursBaseUrl: getEnvVar('NASA_URS_BASE_URL', 'https://urs.earthdata.nasa.gov'),
  appearsBaseUrl: getEnvVar('NASA_APPEEARS_BASE_URL', 'https://appeears.earthdatacloud.nasa.gov/api'),
  worldviewBaseUrl: getEnvVar('NASA_WORLDVIEW_BASE_URL', 'https://worldview.earthdata.nasa.gov'),
})

export const getDefaultFarmLocation = () => ({
  latitude: parseFloat(getEnvVar('DEFAULT_FARM_LATITUDE', '40.7128') || '40.7128'),
  longitude: parseFloat(getEnvVar('DEFAULT_FARM_LONGITUDE', '-74.006') || '-74.006'),
  bbox: getEnvVar('DEFAULT_FARM_BBOX', '-74.1,40.6,-73.9,40.8') || '-74.1,40.6,-73.9,40.8',
})