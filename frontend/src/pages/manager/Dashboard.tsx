import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/manager/Header";
import BarChart from "../../components/charts/BarChart";
import KpiGrid from "../../components/charts/KpiGrid";
import EstadoBadge from "../../components/ui/EstadoBadge";
import AreaModal from "../../components/manager/AreaModal";
import { getIncidentes} from "../../services/reportesService";
import type { Incidente } from "../../services/reportesService";
import { getSummary } from "../../services/metricasService";
import type { Summary } from "../../services/metricasService";
import { getAreas, createArea, updateArea, deleteArea } from "../../services/areaService";
import { Plus, Pencil } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const statusMap: Record<number, string> = {
  1: "Abierto",
  2: "Asignado",
  3: "En proceso",
  4: "Solucionado",
  5: "Cerrado",
};

export default function ManagerPage() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState<"dashboard" | "users">("dashboard");
  const [incidentes, setIncidentes] = useState<Incidente[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [areas, setAreas] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  // Modal de área
  const [areaModalOpen, setAreaModalOpen] = useState(false);
  const [areaModalMode, setAreaModalMode] = useState<"add" | "edit">("add");
  const [areaModalInitial, setAreaModalInitial] = useState("");
  const [editingAreaId, setEditingAreaId] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      getIncidentes(),
      getSummary(),
      getAreas(),
    ])
      .then(([inc, sum, a]) => {
        setIncidentes(inc);
        setSummary(sum.summary);
        setAreas(a.areas);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // KPIs desde métricas
  const kpis = summary ? [
    { label: "Incidentes creados",   value: summary.incidents.created,   icon: "📋" },
    { label: "Incidentes resueltos",  value: summary.incidents.resolved,  icon: "✅" },
    { label: "Tasa de resolución",   value: `${summary.resolution_rate}%`, icon: "📊" },
    { label: "Tiempo promedio (h)",  value: summary.average_resolution_hours, icon: "⏱️" },
  ] : [];

  const barData = summary ? [
    { label: "Creados",   value: summary.incidents.created, max: summary.incidents.created || 1 },
    { label: "Resueltos", value: summary.incidents.resolved, max: summary.incidents.created || 1 },
  ] : [];

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
    setEditingAreaId(null);
    setAreaModalOpen(true);
  };

  const openEditArea = (area: { id: number; name: string }) => {
    setAreaModalMode("edit");
    setAreaModalInitial(area.name);
    setEditingAreaId(area.id);
    setAreaModalOpen(true);
  };

  const handleAreaSubmit = async (nombre: string) => {
    try {
      if (areaModalMode === "add") {
        await createArea(nombre);
      } else if (editingAreaId !== null) {
        await updateArea(editingAreaId, nombre);
      }
      // Refrescar áreas
      const res = await getAreas();
      setAreas(res.areas);
    } catch (err) {
      console.error("Error al gestionar área:", err);
    }
  };

  const handleDeleteArea = async (id: number) => {
    try {
      await deleteArea(id);
      const res = await getAreas();
      setAreas(res.areas);
    } catch (err) {
      console.error("Error al eliminar área:", err);
    }
  };

  if (loading) return <div style={{ padding: 32 }}>Cargando...</div>;

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", fontFamily: "Inter, sans-serif" }}>
      <Header userName="Alex Sterling" userRole="Gerente" navLinks={navLinks} onLogout={logout} />

      <div style={{ padding: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#111827" }}>Métricas de reportes</h2>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={openAddArea} style={{ padding: "8px 16px", background: "#111827", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
              <Plus size={16} /> Añadir área
            </button>
          </div>
        </div>

        {kpis.length > 0 && <KpiGrid items={kpis} />}
        {barData.length > 0 && <BarChart title="Gráfico de incidentes" data={barData} />}

        {/* Tabla de incidentes */}
        <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginTop: 24 }}>
          <div style={{ background: "#10b981", padding: "14px 20px" }}>
            <span style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>Incidentes</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#7BC6B1" }}>
                  {["ID", "TIPO", "ÁREA", "DESCRIPCIÓN", "ESTADO", "FECHA"].map(col => (
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
                      {areas.find(a => a.id === inc.area_id)?.name || inc.area_id}
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

        {/* Gestión de áreas (mini tabla) */}
        <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginTop: 24 }}>
          <div style={{ background: "#10b981", padding: "14px 20px" }}>
            <span style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>Áreas</span>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#7BC6B1" }}>
                <th style={{ padding: "10px 16px", textAlign: "left" }}>ID</th>
                <th style={{ padding: "10px 16px", textAlign: "left" }}>Nombre</th>
                <th style={{ padding: "10px 16px", textAlign: "left" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {areas.map(area => (
                <tr key={area.id}>
                  <td style={{ padding: "10px 16px" }}>{area.id}</td>
                  <td style={{ padding: "10px 16px" }}>{area.name}</td>
                  <td style={{ padding: "10px 16px" }}>
                    <button onClick={() => openEditArea(area)} style={{ marginRight: 8 }}><Pencil size={14} /></button>
                    <button onClick={() => handleDeleteArea(area.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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