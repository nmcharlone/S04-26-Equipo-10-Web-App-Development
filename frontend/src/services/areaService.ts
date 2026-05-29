import { apiClient } from "./api";

export async function getAreas(): Promise<{ areas: { id: number; name: string }[] }> {
  return apiClient<{ areas: { id: number; name: string }[] }>("/catalogs/areas");
}

export async function createArea(name: string): Promise<any> {
  return apiClient("/catalogs/areas", { method: "POST", body: { name } });
}

export async function updateArea(id: number, name: string): Promise<any> {
  return apiClient(`/catalogs/areas/${id}`, { method: "PUT", body: { name } });
}

export async function deleteArea(id: number): Promise<void> {
  await apiClient(`/catalogs/areas/${id}`, { method: "DELETE" });
}