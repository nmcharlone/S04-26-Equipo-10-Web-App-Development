import { apiClient } from "./api";

export interface Usuario {
  id: number;
  name: string;
  lastname: string;
  role_id: number;
  area_id: number;
}

export interface CreateUsuarioPayload {
  name: string;
  lastname: string;
  password: string;
  role_id: number;
  area_id: number;
}

export async function getUsuarios(): Promise<{ users: Usuario[] }> {
  return apiClient<{ users: Usuario[] }>("/users");
}

export async function createUsuario(
  data: CreateUsuarioPayload
): Promise<Usuario> {
  return apiClient<Usuario>("/users", {
    method: "POST",
    body: data,
  });
}

export async function toggleUsuarioActivo(
  id: number,
  active: boolean
): Promise<void> {
  await apiClient(`/users/${id}`, {
    method: "PATCH",
    body: { active },
  });
}