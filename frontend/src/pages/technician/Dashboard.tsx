import { useState, useEffect } from "react";
import Header from "../../components/layout/simple/Header";
import EstadoBadge from "../../components/ui/EstadoBadge";
import { getIncidentes, startIncidente } from "../../services/reportesService";
import type { Incidente } from "../../services/reportesService";
import { getAreas } from "../../services/areaService";
import { useAuth } from "../../context/AuthContext";
import { Play } from "lucide-react";

const statusMap: Record<number, string> = {
  1: "Abierto",
  2: "Asignado",
  3: "En proceso",
  4: "Solucionado",
  5: "Cerrado",
};

export default function TechnicianPage() {
  const [incidentes, setIncidentes] = useState<Incidente[]>([]);
  const [areas, setAreas] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  useEffect(() => {
    Promise.all([
      getIncidentes().then(setIncidentes),
      getAreas().then((res) => setAreas(res.areas)),
    ])
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleStart = async (id: number) => {
    try {
      await startIncidente(id);
      // Actualizamos el estado local a IN_PROGRESS (status_id 3)
      setIncidentes((prev) =>
        prev.map((inc) => (inc.id === id ? { ...inc, status_id: 3 } : inc))
      );
    } catch (err) {
      console.error("Error al iniciar incidente:", err);
    }
  };

  if (loading) return <div style={{ padding: 32 }}>Cargando incidentes...</div>;

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", fontFamily: "Inter, sans-serif" }}>
      <Header name="Técnico" role="Técnico" onLogout={logout} />

      <div style={{ padding: "32px 32px 0" }}>
        <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
          <div style={{ background: "#10b981", padding: "14px 20px" }}>
            <span style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>Incidentes asignados</span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#7BC6B1" }}>
                  {["ID", "TIPO", "ÁREA", "DESCRIPCIÓN", "ESTADO", "FECHA", "ACCIONES"].map((col) => (
                    <th key={col} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#374151", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {incidentes.map((inc, i) => (
                  <tr key={inc.id} style={{ borderBottom: "1px solid #f3f4f6", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                    <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 500 }}>{inc.id}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13 }}>{inc.type_id}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13 }}>
                      {areas.find((a) => a.id === inc.area_id)?.name || inc.area_id}
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 13, maxWidth: 240 }}>{inc.description}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <EstadoBadge estado={statusMap[inc.status_id] || inc.status_id.toString()} />
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 13 }}>
                      {inc.created_at ? new Date(inc.created_at).toLocaleDateString() : "—"}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      {inc.status_id === 2 && ( // Solo ASSIGNED puede ser iniciado
                        <button
                          onClick={() => handleStart(inc.id)}
                          style={{
                            background: "#3b82f6",
                            color: "#fff",
                            border: "none",
                            borderRadius: 6,
                            padding: "5px 10px",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <Play size={14} /> Iniciar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}