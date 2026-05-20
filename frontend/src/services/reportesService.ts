import { apiClient } from "./api"; // ← descomentada

export interface Reporte {
  id: number;
  operator: string;
  estado: string;
  prioridad: string;
  tipo: string;
  descripcion: string;
  area: string;
  fecha: string;
  hora: string;
  tecnico: string | null;
}

const MOCK_REPORTES: Reporte[] = [
  { id: 1, operator: "Sara Martínez", estado: "Abierto", prioridad: "Alta", tipo: "Falla eléctrica", descripcion: "Motor de la banda transportadora no enciende. Se escuchó un sonido de chispa antes de apagarse.", area: "Producción", fecha: "28/04/2026", hora: "08:30", tecnico: null },
  { id: 2, operator: "María García", estado: "En proceso", prioridad: "Alta", tipo: "Fuga", descripcion: "Fuga de vapor en la válvula principal de la caldera 2. Se detectó presión baja.", area: "Calderas", fecha: "27/04/2026", hora: "09:56", tecnico: "Ana López" },
  { id: 3, operator: "Marcos Nodal", estado: "Asignado", prioridad: "Media", tipo: "Sobrecalentamiento", descripcion: "Temperatura elevada en el panel de control de la línea 3.", area: "Producción", fecha: "24/04/2026", hora: "11:21", tecnico: "Miguel Torres" },
  { id: 4, operator: "Elena Rodríguez", estado: "En proceso", prioridad: "Baja", tipo: "Vibración Excesiva", descripcion: "Vibración anormal en bomba de enfriamiento. Se detectó durante la inspección matutina.", area: "Producción", fecha: "21/04/2026", hora: "07:47", tecnico: "Miguel Torres" },
];

export async function getReportes(): Promise<Reporte[]> {
  // --- Versión MOCK ---
  return [...MOCK_REPORTES];

  // --- Versión REAL (descomentar cuando el backend esté listo) ---
  // return apiClient<Reporte[]>("/reportes");
}

export async function createReporte(
  data: Omit<Reporte, "id" | "fecha" | "hora">
): Promise<Reporte> {
  // --- Versión MOCK ---
  const nuevo: Reporte = {
    ...data,
    id: Math.max(0, ...MOCK_REPORTES.map(r => r.id)) + 1,
    fecha: new Date().toLocaleDateString(),
    hora: new Date().toLocaleTimeString(),
  };
  MOCK_REPORTES.push(nuevo);
  return nuevo;

  // --- Versión REAL ---
  // return apiClient<Reporte>("/reportes", { method: "POST", body: data });
}