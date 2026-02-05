import { apiGet } from './client';
import type { LocationDto } from '../types';

export function getLocations(): Promise<LocationDto[]> {
  return apiGet<LocationDto[]>('/locations');
}

export function getLocation(id: number): Promise<LocationDto> {
  return apiGet<LocationDto>(`/locations/${id}`);
}
