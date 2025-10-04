import axios from 'axios';
import { NASAData, GameState, ActionRequest, MapData, CropInfo } from '@/types';

const api = axios.create({
  baseURL: '/api',
});

export const fetchNASAData = async (lat: number = 42.0308, lon: number = -93.6319): Promise<NASAData> => {
  const response = await api.get(`/nasa-data?lat=${lat}&lon=${lon}`);
  return response.data;
};

export const fetchGameState = async (): Promise<GameState> => {
  const response = await api.get('/game-state');
  return response.data;
};

export const performAction = async (action: ActionRequest): Promise<GameState> => {
  const response = await api.post('/action', action);
  return response.data;
};

export const fetchMapLocations = async (): Promise<Record<string, MapData>> => {
  const response = await api.get('/map-locations');
  return response.data;
};

export const fetchCrops = async (): Promise<Record<string, CropInfo>> => {
  const response = await api.get('/crops');
  return response.data;
};

export const fetchDataSources = async () => {
  const response = await api.get('/data-sources');
  return response.data;
};

export const fetchWeatherEvents = async () => {
  const response = await api.get('/weather-events');
  return response.data;
};

export const fetchTutorials = async () => {
  const response = await api.get('/tutorials');
  return response.data;
};

export const fetchSustainability = async () => {
  const response = await api.get('/sustainability');
  return response.data;
};