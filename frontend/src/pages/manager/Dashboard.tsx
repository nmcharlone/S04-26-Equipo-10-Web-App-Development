import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/manager/Header";
import KpiGrid from "../../components/charts/KpiGrid";
import UserModal from "../../components/manager/UserModal";
import { getUsuarios, toggleUsuarioActivo } from "../../services/usuariosService";
import type { Usuario } from "../../services/usuariosService";
import { Users, UserCheck, UserX, Pencil, UserPlus } from "lucide-react";

const roleMap: Record<number, string> = {
  1: "Operador",
  2: "Técnico",
  3: "Supervisor",
  4: "Gerente",
};

export default function UserManagement() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState<"dashboard" | "users">("users");
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [userModalMode, setUserModalMode] = useState<"create" | "edit" | "delete">("create");
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);

  const fetchUsuarios = () => {
    getUsuarios()
      .then((res) => setUsuarios(res.users))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const totalUsuarios = usuarios.length;

  const handleNav = (tab: "dashboard" | "users") => {
    setActiveNav(tab);
    if (tab === "dashboard") navigate("/manager");
  };

  const openAddUser = () => {
    setUserModalMode("create");
    setSelectedUser(null);
    setUserModalOpen(true);
  };

  const openEditUser = (id: number) => {
    const user = usuarios.find((u) => u.id === id);
    if (!user) return;
    setSelectedUser(user);
    setUserModalMode("edit");
    setUserModalOpen(true);
  };

  const handleUserSubmit = async (formData: any) => {
    // La lógica de creación/edición se manejará con los endpoints reales
    setUserModalOpen(false);
    fetchUsuarios();
  };

  const initialData = selectedUser
    ? {
        nombre: selectedUser.name,
        email: "",
        contrasena: "",
        rol: roleMap[selectedUser.role_id] || "Operador",
        area: "",
      }
    : ({} as any);

  const navLinks = [
    { label: "Dashboard", path: "/manager", active: activeNav === "dashboard" },
    { label: "Gestión de usuarios", path: "/manager/users", active: activeNav === "users" },
  ];

  const kpiItems = [
    { label: "Total de usuarios", value: totalUsuarios, icon: <Users size={28} color="#111827" />, iconBg: "#e0f2fe" },
    { label: "Usuarios activos", value: totalUsuarios, icon: <UserCheck size={28} color="#10b981" />, iconBg: "#d1fae5" },
    { label: "Usuarios inactivos", value: 0, icon: <UserX size={28} color="#ef4444" />, iconBg: "#fee2e2" },
  ];

  if (loading) return <div style={{ padding: 32 }}>Cargando usuarios...</div>;

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", fontFamily: "Inter, sans-serif" }}>
      <Header userName="Laura Díaz" userRole="Gerente" navLinks={navLinks} />

      <div style={{ padding: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#111827" }}>Gestión de usuarios</h2>
          <button
            onClick={openAddUser}
            style={{ padding: "8px 16px", background: "#111827", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
          >
            <UserPlus size={16} /> Añadir usuario
          </button>
        </div>

        <KpiGrid items={kpiItems} columns={3} />

        <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
          <div style={{ background: "#10b981", padding: "14px 20px" }}>
            <span style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>Usuarios</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#7BC6B1" }}>
                  {["NOMBRE", "APELLIDO", "ROL", "ÁREA", "ESTADO", "ACCIONES"].map((col) => (
                    <th key={col} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#374151", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u, i) => (
                  <tr key={u.id} style={{ borderBottom: "1px solid #f3f4f6", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#111827" }}>{u.name}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#111827" }}>{u.lastname}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#374151" }}>{roleMap[u.role_id] || u.role_id}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#374151" }}>{u.area_id}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#10b981", fontWeight: 600 }}>
                      Activo
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <button onClick={() => openEditUser(u.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }} title="Editar">
                        <Pencil size={16} color="#6b7280" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <UserModal
        open={userModalOpen}
        mode={userModalMode}
        initialData={initialData}
        areas={[]} // temporal, luego se obtienen de la API
        onClose={() => setUserModalOpen(false)}
        onSubmit={handleUserSubmit}
      />
    </div>
  );
}