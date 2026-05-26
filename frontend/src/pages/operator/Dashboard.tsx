import { useState, useEffect } from "react";
import Header from "../../components/layout/simple/Header";
import EstadoBadge from "../../components/ui/EstadoBadge";
import Modal from "../../components/operator/Modal";
import { getIncidentes, createIncidente } from "../../services/reportesService";
import type { Incidente } from "../../services/reportesService";
import { getAreas } from "../../services/areaService";
import { getIncidentTypes } from "../../services/catalogoService";
import type { IncidentType } from "../../services/catalogoService";
import { Plus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const statusMap: Record<number, string> = {
  1: "Abierto",
  2: "Asignado",
  3: "En proceso",
  4: "Solucionado",
  5: "Cerrado",
};

// Mapeo fijo de tipos (hasta que el backend los devuelva)
const staticTypeMap: Record<number, string> = {
  1: "HARDWARE",
  2: "SOFTWARE",
  3: "NETWORK",
};

// Mapeo temporal de áreas (se actualizará cuando lleguen los datos reales)
let staticAreaMap: Record<number, string> = {};

export default function OperatorDashboard() {
  const [incidentes, setIncidentes] = useState<Incidente[]>([]);
  const [areas, setAreas] = useState<{ id: number; name: string }[]>([]);
  const [types, setTypes] = useState<IncidentType[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    Promise.all([
      getIncidentes(),
      getAreas().then(res => {
        setAreas(res.areas);
        res.areas.forEach(a => { staticAreaMap[a.id] = a.name; });
      }),
      getIncidentTypes().then(setTypes),
    ])
      .then(([inc]) => setIncidentes(inc))
      .catch(console.error);
  }, []);

  const handleNewIncident = async (data: { type_id: number; area_id: number; description: string }) => {
    try {
      const nuevo = await createIncidente(data);
      setIncidentes(prev => [nuevo, ...prev]);
      setModalOpen(false);
    } catch (err) {
      console.error("Error al crear incidente:", err);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", fontFamily: "Inter, sans-serif" }}>
      <Header name="Operador" role="Operador" onLogout={() => {}} />

      <div style={{ padding: "32px 32px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#111827" }}>Mis reportes</h2>
          <button onClick={() => setModalOpen(true)} style={{ background: "#1f2937", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            <Plus size={18} /> Reportar
          </button>
        </div>

        <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#7BC6B1" }}>
                  {["ID", "OPERADOR", "TIPO", "ÁREA", "DESCRIPCIÓN", "ESTADO", "FECHA"].map(col => (
                    <th key={col} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#374151", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {incidentes.map((inc, i) => (
                  <tr key={inc.id} style={{ borderBottom: "1px solid #f3f4f6", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                    <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 500 }}>{inc.id}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#111827" }}>
                      {user ? `${user.name} ${user.lastname}` : "—"}
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 13 }}>
                      {types.length > 0
                        ? types.find(t => t.id === inc.type_id)?.name || inc.type_id
                        : staticTypeMap[inc.type_id] || inc.type_id}
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 13 }}>
                      {areas.length > 0
                        ? areas.find(a => a.id === inc.area_id)?.name || inc.area_id
                        : staticAreaMap[inc.area_id] || inc.area_id}
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 13, maxWidth: 240 }}>{inc.description}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <EstadoBadge estado={statusMap[inc.status_id] || inc.status_id.toString()} />
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 13 }}>
                      {inc.created_at ? new Date(inc.created_at).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleNewIncident}
        areas={areas}
        types={types}
      />
    </div>
  );
}