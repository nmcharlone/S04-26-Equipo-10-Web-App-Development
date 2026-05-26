import { apiClient } from "./api";

interface LoginCredentials {
  name: string;
  lastname: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

interface UserResponse {
  user: {
    id: number;
    name: string;
    lastname: string;
    role_id: number;
    area_id: number;
  };
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  return apiClient<LoginResponse>("/auth/login", {
    method: "POST",
    body: credentials,
  });
}

export async function me(): Promise<UserResponse> {
  return apiClient<UserResponse>("/auth/me");
}