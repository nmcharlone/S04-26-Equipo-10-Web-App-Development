import { useState, useEffect } from "react";
import Header from "../../components/layout/simple/Header";
import EstadoBadge from "../../components/ui/EstadoBadge";
import AssignTechnicianModal from "../../components/supervisor/AssignTechnicianModal";
import ResolveModal from "../../components/supervisor/ResolveModal";
import { getIncidentes, assignIncidente, resolveIncidente } from "../../services/reportesService";
import type { Incidente } from "../../services/reportesService";
import { getUsuarios } from "../../services/usuariosService";
import { getAreas } from "../../services/areaService";
import { getRootCauses } from "../../services/catalogoService";
import type { RootCause } from "../../services/catalogoService";
import { UserPlus, CheckCircle } from "lucide-react";

const statusMap: Record<number, string> = {
  1: "Abierto",
  2: "Asignado",
  3: "En proceso",
  4: "Solucionado",
  5: "Cerrado",
};

export default function Dashboard() {
  const [incidentes, setIncidentes] = useState<Incidente[]>([]);
  const [tecnicos, setTecnicos] = useState<{ id: number; name: string; lastname: string }[]>([]);
  const [areas, setAreas] = useState<{ id: number; name: string }[]>([]);
  const [rootCauses, setRootCauses] = useState<RootCause[]>([]);
  const [loading, setLoading] = useState(true);

  // Modales
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incidente | null>(null);

  useEffect(() => {
    Promise.all([
      getIncidentes().then(setIncidentes),
      getUsuarios().then(res => {
        const tecnicosFiltrados = res.users
          .filter(u => u.role_id === 2 && u.active)
          .map(u => ({ id: u.id, name: u.name, lastname: u.lastname }));
        setTecnicos(tecnicosFiltrados);
      }),
      getAreas().then(res => setAreas(res.areas)),
      getRootCauses().then(setRootCauses),
    ])
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Asignar técnico
  const handleAssignSubmit = async (data: { technician_id: number }) => {
    if (!selectedIncident) return;
    try {
      await assignIncidente(selectedIncident.id, data.technician_id);
      // Actualizamos el incidente localmente (marcamos como ASSIGNED, guardamos assigned_to)
      setIncidentes(prev =>
        prev.map(inc =>
          inc.id === selectedIncident.id
            ? { ...inc, status_id: 2, assigned_to: data.technician_id }
            : inc
        )
      );
      setAssignModalOpen(false);
    } catch (err) {
      console.error("Error al asignar técnico:", err);
    }
  };

  // Resolver incidente
  const handleResolveSubmit = async (data: { solution: string; root_cause_id: number }) => {
    if (!selectedIncident) return;
    try {
      await resolveIncidente(selectedIncident.id, data.solution, data.root_cause_id);
      setIncidentes(prev =>
        prev.map(inc =>
          inc.id === selectedIncident.id
            ? { ...inc, status_id: 4 } // SOLVED
            : inc
        )
      );
      setResolveModalOpen(false);
    } catch (err) {
      console.error("Error al resolver incidente:", err);
    }
  };

  // Abrir modales
  const openAssign = (inc: Incidente) => {
    setSelectedIncident(inc);
    setAssignModalOpen(true);
  };
  const openResolve = (inc: Incidente) => {
    setSelectedIncident(inc);
    setResolveModalOpen(true);
  };

  if (loading) return <div style={{ padding: 32 }}>Cargando incidentes...</div>;

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", fontFamily: "Inter, sans-serif" }}>
      <Header name="Supervisor" role="Supervisor" onLogout={() => {}} />

      <div style={{ padding: "32px 32px 0" }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#111827" }}>Incidentes del área</h2>
        </div>

        <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
          <div style={{ background: "#10b981", padding: "14px 20px" }}>
            <span style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>Incidentes</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#7BC6B1" }}>
                  {["ID", "TIPO", "ÁREA", "DESCRIPCIÓN", "ESTADO", "TÉCNICO", "FECHA", "ACCIONES"].map(col => (
                    <th key={col} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#374151", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {incidentes.map((inc, i) => (
                  <tr key={inc.id} style={{ borderBottom: "1px solid #f3f4f6", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                    <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 500 }}>{inc.id}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13 }}>{inc.type_id}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13 }}>{areas.find(a => a.id === inc.area_id)?.name || inc.area_id}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, maxWidth: 200 }}>{inc.description}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <EstadoBadge estado={statusMap[inc.status_id] || inc.status_id.toString()} />
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 13 }}>
                      {inc.assigned_to
                        ? tecnicos.find(t => t.id === inc.assigned_to)?.name || inc.assigned_to
                        : "—"}
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 13 }}>
                      {inc.created_at ? new Date(inc.created_at).toLocaleDateString() : "—"}
                    </td>
                    <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                      <button onClick={() => openAssign(inc)} style={{ background: "#f59e0b", color: "#fff", border: "none", borderRadius: 6, padding: "5px 10px", marginRight: 6, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <UserPlus size={14} /> Asignar
                      </button>
                      <button onClick={() => openResolve(inc)} style={{ background: "#8b5cf6", color: "#fff", border: "none", borderRadius: 6, padding: "5px 10px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <CheckCircle size={14} /> Resolver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedIncident && (
        <>
          <AssignTechnicianModal
            open={assignModalOpen}
            onClose={() => setAssignModalOpen(false)}
            onSubmit={handleAssignSubmit}
            tecnicos={tecnicos}
            incidentAreaId={selectedIncident.area_id}
          />
          <ResolveModal
            open={resolveModalOpen}
            onClose={() => setResolveModalOpen(false)}
            onSubmit={handleResolveSubmit}
            rootCauses={rootCauses}
          />
        </>
      )}
    </div>
  );
}