import { useState, useEffect } from "react";
import Header from "../../components/layout/simple/Header";
import EstadoBadge from "../../components/ui/EstadoBadge";
import PrioridadBadge from "../../components/ui/PrioridadBadge";
import Modal from "../../components/operator/Modal";
import { getReportes } from "../../services/reportesService";
import type { Reporte } from "../../services/reportesService";
import { Plus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("area");
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    getReportes().then(setReportes).catch(console.error);
  }, []);

  // Simular separación por "área" y "mis reportes" (mockeado con un campo operator)
  const areaReports = reportes; // todos los reportes como "área"
  const myReports = reportes.filter(r => r.operator === "Alex Sterling"); // suponemos que el operador actual es Alex

  const reports = activeTab === "area" ? areaReports : myReports;

  const handleNewReport = (data: { tipo: string; area: string; descripcion: string }) => {
    console.log("Nuevo reporte:", data);
    setModalOpen(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", fontFamily: "Inter, sans-serif" }}>
      <Header name="Alex Sterling" role="Operador" onLogout={logout} />

      <div style={{ padding: "32px 32px 0" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
          <button
            onClick={() => setModalOpen(true)}
            style={{
              background: "#1f2937", color: "#fff", border: "none",
              borderRadius: 8, padding: "10px 20px", fontSize: 14,
              fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
            }}
          >
              <Plus size={18} style={{ marginRight: 4 }} />
              Reportar
          </button>
        </div>

        <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
          <div style={{ display: "flex" }}>
            {[{ key: "area", label: "Reportes de área" }, { key: "mine", label: "Tus reportes" }].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  flex: 1, padding: "14px 0", border: "none", cursor: "pointer",
                  fontSize: 14, fontWeight: 600,
                  background: activeTab === tab.key ? "#10b981" : "#1f2937",
                  color: "#fff", transition: "background 0.2s",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#7BC6B1" }}>
                  {["OPERADOR", "ESTADO", "PRIORIDAD", "TIPO", "DESCRIPCIÓN", "ÁREA", "FECHA", "HORA"].map(col => (
                    <th key={col} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#374151", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reports.map((r, i) => (
                  <tr key={r.id} style={{ borderBottom: "1px solid #f3f4f6", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                    <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 500, color: "#1f2937", whiteSpace: "nowrap" }}>{r.operator}</td>
                    <td style={{ padding: "14px 16px" }}><EstadoBadge estado={r.estado} /></td>
                    <td style={{ padding: "14px 16px" }}><PrioridadBadge prioridad={r.prioridad} /></td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#374151" }}>{r.tipo}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#6b7280", maxWidth: 260 }}>{r.descripcion}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#374151" }}>{r.area}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#374151", whiteSpace: "nowrap" }}>{r.fecha}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#374151" }}>{r.hora}</td>
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
        onSubmit={handleNewReport}
      />
    </div>
  );
}