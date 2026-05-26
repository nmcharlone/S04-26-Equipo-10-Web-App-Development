import { apiClient } from "./api";

export interface Incidente {
  id: number;
  type_id: number;
  area_id: number;
  description: string;
  status_id: number;
  created_by?: number;
  assigned_to?: number | null;
  created_at?: string;
  updated_at?: string;
}

export async function getIncidentes(): Promise<Incidente[]> {
  const res = await apiClient<{ incidents: Incidente[] }>("/incidents");
  return res.incidents;
}

export async function createIncidente(data: {
  type_id: number;
  area_id: number;
  description: string;
}): Promise<Incidente> {
  return apiClient<Incidente>("/incidents", { method: "POST", body: data });
}

export async function assignIncidente(id: number, technician_id: number) {
  return apiClient(`/incidents/${id}/assign`, {
    method: "PATCH",
    body: { technician_id },
  });
}

export async function startIncidente(id: number) {
  return apiClient(`/incidents/${id}/start`, { method: "PATCH" });
}

export async function resolveIncidente(id: number, solution: string, root_cause_id: number) {
  return apiClient(`/incidents/${id}/resolve`, {
    method: "PATCH",
    body: { solution, root_cause_id },
  });
}