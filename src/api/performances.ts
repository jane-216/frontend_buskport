import { apiGet, apiPost, apiPut, apiDelete } from './client';
import type { PerformanceDto, PerformanceParticipantDto } from '../types';

function dateParam(d: Date): string {
  return d.toISOString().split('T')[0];
}

export function getPerformances(startDate: Date, endDate: Date): Promise<PerformanceDto[]> {
  const start = dateParam(startDate);
  const end = dateParam(endDate);
  return apiGet<PerformanceDto[]>(`/performances?startDate=${start}&endDate=${end}`);
}

export function getPerformance(id: number): Promise<PerformanceDto> {
  return apiGet<PerformanceDto>(`/performances/${id}`);
}

export function createPerformance(data: PerformanceDto): Promise<PerformanceDto | undefined> {
  return apiPost<PerformanceDto | undefined>('/performances/', data);
}

export function updatePerformance(data: PerformanceDto): Promise<PerformanceDto | undefined> {
  return apiPut<PerformanceDto | undefined>('/performances/', data);
}

export function deletePerformance(id: number): Promise<void> {
  return apiDelete(`/performances/${id}`);
}

export function addParticipants(performanceId: number, participants: PerformanceParticipantDto[]): Promise<void> {
  return apiPost(`/performances/${performanceId}/participants`, participants);
}
