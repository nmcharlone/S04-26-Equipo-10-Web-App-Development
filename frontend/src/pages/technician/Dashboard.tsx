import { useState, useEffect } from "react";
import Header from "../../components/layout/simple/Header";
import EstadoBadge from "../../components/ui/EstadoBadge";
import PrioridadBadge from "../../components/ui/PrioridadBadge";
import EditReportModal from "../../components/technician/EditReportModal";
import { getReportes } from "../../services/reportesService";
import type { Reporte } from "../../services/reportesService";
import { Pencil } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Reporte | null>(null);
  const { logout } = useAuth();

  useEffect(() => {
    getReportes()
      .then(data => {
        // Filtramos los asignados al técnico actual (mock: Miguel Torres)
        const tecnicos = data.filter(r => r.tecnico === "Miguel Torres");
        setReportes(tecnicos);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const openEditModal = (reporte: Reporte) => {
    setSelectedReport(reporte);
    setModalOpen(true);
  };

  const handleEditSubmit = (data: { estado: string }) => {
    if (!selectedReport) return;
    setReportes(prev =>
      prev.map(r =>
        r.id === selectedReport.id
          ? { ...r, estado: data.estado }
          : r
      )
    );
    setModalOpen(false);
  };

  if (loading) return <div style={{ padding: 32 }}>Cargando incidentes...</div>;

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", fontFamily: "Inter, sans-serif" }}>
      <Header name="Miguel Torres" role="Técnico" onLogout={logout} />

      <div style={{ padding: "32px 32px 0" }}>
        <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
          <div style={{ background: "#10b981", padding: "14px 20px" }}>
            <span style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>Incidentes asignados</span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#7BC6B1" }}>
                  {["OPERADOR", "ESTADO", "PRIORIDAD", "TIPO", "DESCRIPCIÓN", "ÁREA", "FECHA", "HORA", "TÉCNICO ASIGNADO", "ACCIONES"].map(col => (
                    <th key={col} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#374151", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reportes.map((r, i) => (
                  <tr key={r.id} style={{ borderBottom: "1px solid #f3f4f6", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                    <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 500, color: "#111827", whiteSpace: "nowrap" }}>{r.operator}</td>
                    <td style={{ padding: "14px 16px" }}><EstadoBadge estado={r.estado} /></td>
                    <td style={{ padding: "14px 16px" }}><PrioridadBadge prioridad={r.prioridad} /></td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#374151" }}>{r.tipo}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#6b7280", maxWidth: 240 }}>{r.descripcion}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#374151" }}>{r.area}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#374151", whiteSpace: "nowrap" }}>{r.fecha}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#374151" }}>{r.hora}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#374151" }}>{r.tecnico}</td>
                    <td style={{ padding: "14px 16px", minWidth: 110 }}>
                      <button
                        onClick={() => openEditModal(r)}
                        style={{
                          padding: "6px 12px",
                          background: "#10b981",
                          color: "#fff",
                          border: "none",
                          borderRadius: 6,
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                      >
                      <Pencil size={14} style={{ marginRight: 4 }} /> Editar estado
                    </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <EditReportModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleEditSubmit}
        initialEstado={selectedReport?.estado ?? ""}
      />
    </div>
  );
}