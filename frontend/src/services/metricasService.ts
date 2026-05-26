import { apiClient } from "./api";

export interface Summary {
  from: string;
  to: string;
  incidents: { created: number; resolved: number };
  average_resolution_hours: number;
  resolution_rate: number;
  top_areas: { area: string; count: number }[];
  top_root_causes: { root_cause: string; count: number }[];
}

export async function getSummary(params?: { from?: string; to?: string }) {
  const query = params ? "?" + new URLSearchParams(params as any).toString() : "";
  return apiClient<{ summary: Summary }>(`/metrics/summary${query}`);
}