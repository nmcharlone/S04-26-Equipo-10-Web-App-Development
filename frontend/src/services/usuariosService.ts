import { apiClient } from "./api";

export interface Usuario {
  id: number;
  name: string;
  lastname: string;
  role_id: number;
  area_id: number;
  active: boolean;
}

export async function getUsuarios(): Promise<{ users: Usuario[] }> {
  return apiClient<{ users: Usuario[] }>("/users");
}

export async function toggleUsuarioActivo(id: number, active: boolean): Promise<void> {
  await apiClient(`/users/${id}`, { method: "PATCH", body: { active } });
}