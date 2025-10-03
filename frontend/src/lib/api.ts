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