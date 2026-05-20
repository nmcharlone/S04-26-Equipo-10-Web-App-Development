// src/services/authService.ts

import { apiClient } from "./api";

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    role: "operator" | "supervisor" | "technician" | "manager";
  };
}

// --- MOCK mientras no haya backend ---
const MOCK_USERS: Record<string, { password: string; name: string; role: string }> = {
  "operator@example.com":   { password: "123", name: "Operador Demo", role: "operator" },
  "supervisor@example.com": { password: "123", name: "Supervisor Demo", role: "supervisor" },
  "technician@example.com": { password: "123", name: "Técnico Demo", role: "technician" },
  "manager@example.com":    { password: "123", name: "Manager Demo", role: "manager" },
};

export async function login(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  // --- Versión MOCK ---
  const normalizedEmail = credentials.email.trim().toLowerCase();
  const user = MOCK_USERS[normalizedEmail];
  if (!user || user.password !== credentials.password) {
    throw new Error("Credenciales inválidas");
  }
  return {
    token: "mock-jwt-token",
    user: { id: "123", name: user.name, role: user.role as any },
  };

  // --- Versión REAL (cuando el backend esté listo) ---
  // return apiClient<LoginResponse>("/auth/login", {
  //   method: "POST",
  //   body: credentials,
  // });
}

export async function logout(): Promise<void> {
  localStorage.removeItem("token");
}