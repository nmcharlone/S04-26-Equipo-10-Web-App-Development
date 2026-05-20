import { apiClient } from "./api";

export type Rol = "Operador" | "Operadora" | "Supervisor" | "Técnico" | "Técnica" | "Gerente";

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: Rol;
  area: string;
  activo: boolean;
}

// --- MOCK ---
let MOCK_USUARIOS: Usuario[] = [
  { id: 1, nombre: "Sara", apellido: "Martínez", email: "saramartinez@email.com", rol: "Operadora", area: "Producción", activo: true },
  { id: 2, nombre: "María", apellido: "García", email: "mariagarcia@email.com", rol: "Operadora", area: "Calderas", activo: false },
  { id: 3, nombre: "Marcos", apellido: "Nodal", email: "marcosnodal@email.com", rol: "Operador", area: "Producción", activo: false },
  { id: 4, nombre: "Elena", apellido: "Rodríguez", email: "elenarodriguez@email.com", rol: "Operadora", area: "Producción", activo: false },
  { id: 5, nombre: "Ana", apellido: "López", email: "analopez@email.com", rol: "Técnica", area: "Mantenimiento", activo: false },
  { id: 6, nombre: "Miguel", apellido: "Torres", email: "migueltorres@email.com", rol: "Técnico", area: "Mantenimiento", activo: false },
];

export async function getUsuarios(): Promise<Usuario[]> {
  // MOCK
  return [...MOCK_USUARIOS];

  // REAL: return apiClient<Usuario[]>("/usuarios");
}

export async function deleteUsuario(id: number): Promise<void> {
  // MOCK
  MOCK_USUARIOS = MOCK_USUARIOS.filter(u => u.id !== id);

  // REAL: await apiClient(`/usuarios/${id}`, { method: "DELETE" });
}

export async function updateUsuario(
  id: number,
  data: Partial<Usuario>
): Promise<Usuario> {
  // MOCK
  const idx = MOCK_USUARIOS.findIndex(u => u.id === id);
  if (idx === -1) throw new Error("Usuario no encontrado");
  MOCK_USUARIOS[idx] = { ...MOCK_USUARIOS[idx], ...data };
  return MOCK_USUARIOS[idx];

  // REAL: return apiClient<Usuario>(`/usuarios/${id}`, { method: "PUT", body: data });
}