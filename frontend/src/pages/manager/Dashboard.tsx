import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/manager/Header";
import BarChart from "../../components/charts/BarChart";
import KpiGrid from "../../components/charts/KpiGrid";
import EstadoBadge from "../../components/ui/EstadoBadge";
import PrioridadBadge from "../../components/ui/PrioridadBadge";
import AreaModal from "../../components/manager/AreaModal";
import { getReportes } from "../../services/reportesService";
import type { Reporte } from "../../services/reportesService";
import { Plus, Pencil } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState<"dashboard" | "users">("dashboard");
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  // Estados para el modal de área
  const [areaModalOpen, setAreaModalOpen] = useState(false);
  const [areaModalMode, setAreaModalMode] = useState<"add" | "edit">("add");
  const [areaModalInitial, setAreaModalInitial] = useState("");

  useEffect(() => {
    getReportes()
      .then(setReportes)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Calcular KPIs y datos de gráfico a partir de los reportes
  const totalReportes = reportes.length;
  const abiertos = reportes.filter(r => r.estado === "Abierto").length;
  const enProceso = reportes.filter(r => r.estado === "En proceso").length;
  const cerrados = reportes.filter(r => r.estado === "Cerrado").length;

  const kpis = [
    { label: "Total de reportes",            value: totalReportes, icon: "📋" },
    { label: "Total de reportes abiertos",   value: abiertos,     icon: "📋" },
    { label: "Total de reportes en proceso", value: enProceso,    icon: "📋" },
    { label: "Total de incidentes cerrados", value: cerrados,     icon: "📋" },
  ];

  const barData = [
    { label: "Total en reportes",            value: totalReportes, max: totalReportes || 1 },
    { label: "Total de incidentes abiertos", value: abiertos,     max: totalReportes || 1 },
    { label: "Total de incidentes en proceso", value: enProceso,  max: totalReportes || 1 },
    { label: "Total de incidentes cerrados", value: cerrados,     max: totalReportes || 1 },
  ];

  // Resto de la lógica (nav, modal, etc.) se mantiene igual...
  const handleNav = (tab: "dashboard" | "users") => {
    setActiveNav(tab);
    if (tab === "users") navigate("/manager/users");
    else navigate("/manager");
  };

  const navLinks = [
    { label: "Dashboard", path: "/manager", active: activeNav === "dashboard" },
    { label: "Gestión de usuarios", path: "/manager/users", active: activeNav === "users" },
  ];

  const openAddArea = () => {
    setAreaModalMode("add");
    setAreaModalInitial("");
    setAreaModalOpen(true);
  };

  const openEditArea = () => {
    setAreaModalMode("edit");
    setAreaModalInitial("");
    setAreaModalOpen(true);
  };

  const handleAreaSubmit = (nombre: string) => {
    if (areaModalMode === "add") console.log("Área añadida:", nombre);
    else console.log("Área modificada:", nombre);
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", fontFamily: "Inter, sans-serif" }}>
      <Header
        userName="Alex Sterling"
        userRole="Gerente"
        navLinks={navLinks}
        onLogout={logout}
      />


      <div style={{ padding: "32px" }}>
        {/* Top row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#111827" }}>Métricas de reportes</h2>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={openAddArea} style={{ padding: "8px 16px", background: "#111827", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            <Plus size={16} style={{ marginRight: 4 }} /> Añadir área
          </button>
            <button onClick={openEditArea} style={{ padding: "8px 16px", background: "#10b981", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            <Pencil size={16} style={{ marginRight: 4 }} /> Modificar área
          </button>
          </div>
        </div>

        {/* KPI cards */}
        <KpiGrid items={kpis} />

        {/* Bar chart */}
        <BarChart title="Gráfico de reportes" data={barData} />

        {/* Tabla */}
        <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
          <div style={{ background: "#10b981", padding: "14px 20px" }}>
            <span style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>Reportes</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#7BC6B1" }}>
                  {["OPERADOR", "ESTADO", "PRIORIDAD", "TIPO", "DESCRIPCIÓN", "ÁREA", "FECHA", "HORA", "TÉCNICO ASIGNADO"].map(col => (
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
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#374151" }}>{r.tecnico ?? "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de área */}
      <AreaModal
        open={areaModalOpen}
        mode={areaModalMode}
        initialValue={areaModalInitial}
        onClose={() => setAreaModalOpen(false)}
        onSubmit={handleAreaSubmit}
      />
    </div>
  );
}