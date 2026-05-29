import { apiClient } from "./api";

export async function getAreas(): Promise<{ areas: { id: number; name: string }[] }> {
  // FIX: antes estaba /catalogs/areas → backend real es /api/areas (o base /areas según apiClient)
  return apiClient<{ areas: { id: number; name: string }[] }>("/api/areas");
}

export async function createArea(name: string): Promise<any> {
  // FIX consistente con backend
  return apiClient("/api/areas", { method: "POST", body: { name } });
}

export async function updateArea(id: number, name: string): Promise<any> {
  return apiClient(`/api/areas/${id}`, { method: "PUT", body: { name } });
}

export async function deleteArea(id: number): Promise<void> {
  await apiClient(`/api/areas/${id}`, { method: "DELETE" });
}