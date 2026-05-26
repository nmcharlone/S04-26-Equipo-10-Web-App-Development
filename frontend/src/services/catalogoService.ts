import { apiClient } from "./api";

export interface RootCause {
  id: number;
  name: string;
}

export interface IncidentType {
  id: number;
  name: string;
}

export async function getRootCauses(): Promise<RootCause[]> {
  try {
    const res = await apiClient<{ rootCauses?: RootCause[] }>("/catalogs/root-causes");
    return res.rootCauses || [];
  } catch {
    return [
      { id: 1, name: "USER_ERROR" },
      { id: 2, name: "SYSTEM_FAILURE" },
      { id: 3, name: "NETWORK_ISSUE" },
    ];
  }
}

export async function getIncidentTypes(): Promise<IncidentType[]> {
  const res = await apiClient<{ incidentTypes: IncidentType[] }>("/catalogs/incident-types");
  return res.incidentTypes;
}