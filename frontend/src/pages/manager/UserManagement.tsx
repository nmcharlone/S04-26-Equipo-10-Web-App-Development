import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/manager/Header";
import KpiGrid from "../../components/charts/KpiGrid";
import UserModal from "../../components/manager/UserModal";
import { getUsuarios, deleteUsuario, updateUsuario } from "../../services/usuariosService";
import type { Usuario } from "../../services/usuariosService";
import { Users, UserCheck, UserX, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";


const AREAS = ["Producción", "Mantenimiento", "Calderas"]; // podrías obtenerlas del servicio más adelante

export default function UserManagement() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState<"dashboard" | "users">("users");
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  // Modal
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [userModalMode, setUserModalMode] = useState<"create" | "edit" | "delete">("create");
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);

  // Cargar usuarios
  const fetchUsuarios = () => {
    getUsuarios()
      .then(setUsuarios)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const totalUsuarios = usuarios.length;
  const usuariosActivos = usuarios.filter(u => u.activo).length;
  const usuariosInactivos = usuarios.filter(u => !u.activo).length;

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
    const user = usuarios.find(u => u.id === id);
    if (!user) return;
    setSelectedUser(user);
    setUserModalMode("edit");
    setUserModalOpen(true);
  };

  const openDeleteUser = (id: number) => {
    const user = usuarios.find(u => u.id === id);
    if (!user) return;
    setSelectedUser(user);
    setUserModalMode("delete");
    setUserModalOpen(true);
  };

  const handleUserSubmit = async (formData: { nombre: string; email: string; contrasena: string; rol: string; area: string }) => {
    try {
      if (userModalMode === "delete" && selectedUser) {
        await deleteUsuario(selectedUser.id);
      } else if (userModalMode === "edit" && selectedUser) {
        await updateUsuario(selectedUser.id, {
          nombre: formData.nombre,
          email: formData.email,
          rol: formData.rol as any,
          area: formData.area,
        });
      } else if (userModalMode === "create") {
        // El servicio de crear usuario no está mockeado aún; podríamos agregarlo.
        // Por ahora hacemos un push manual al estado local para la demo.
        const newUser: Usuario = {
          id: Math.max(0, ...usuarios.map(u => u.id)) + 1,
          nombre: formData.nombre,
          apellido: "", // si el modal no pide apellido
          email: formData.email,
          rol: formData.rol as any,
          area: formData.area,
          activo: true,
        };
        setUsuarios(prev => [...prev, newUser]);
      }
      setUserModalOpen(false);
      // Refrescamos la lista después de una operación exitosa
      fetchUsuarios();
    } catch (err) {
      console.error("Error en operación de usuario:", err);
    }
  };

  const initialData = selectedUser
    ? { nombre: selectedUser.nombre, email: selectedUser.email, rol: selectedUser.rol, area: selectedUser.area }
    : {};

  const navLinks = [
    { label: "Dashboard", path: "/manager", active: activeNav === "dashboard" },
    { label: "Gestión de usuarios", path: "/manager/users", active: activeNav === "users" },
  ];

const kpiItems = [
  { label: "Total de usuarios",    value: totalUsuarios,    icon: <Users size={28} color="#111827" />,    iconBg: "#e0f2fe" },
  { label: "Usuarios activos",     value: usuariosActivos,  icon: <UserCheck size={28} color="#10b981" />, iconBg: "#d1fae5" },
  { label: "Usuarios inactivos",   value: usuariosInactivos,icon: <UserX size={28} color="#ef4444" />,    iconBg: "#fee2e2" },
];

  if (loading) return <div style={{ padding: 32 }}>Cargando usuarios...</div>;

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", fontFamily: "Inter, sans-serif" }}>
      <Header
        userName="Alex Sterling"
        userRole="Gerente"
        navLinks={navLinks}
        onLogout={logout}
      />

      <div style={{ padding: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#111827" }}>Gestión de usuarios</h2>
          <button
            onClick={openAddUser}
            style={{ padding: "8px 16px", background: "#111827", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            + Añadir usuario
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
                  {["NOMBRE", "APELLIDO", "EMAIL", "ROL", "ÁREA", "ACCIONES"].map(col => (
                    <th key={col} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#374151", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u, i) => (
                  <tr key={u.id} style={{ borderBottom: "1px solid #f3f4f6", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#111827" }}>{u.nombre}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#111827" }}>{u.apellido}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#6b7280" }}>{u.email}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#374151" }}>{u.rol}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#374151" }}>{u.area}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <button onClick={() => openEditUser(u.id)} title="Editar">
                      <Pencil size={16} color="#6b7280" />
                    </button>
                    <button onClick={() => openDeleteUser(u.id)} title="Eliminar">
                      <Trash2 size={16} color="#ef4444" />
                    </button>
                      </div>
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
        areas={AREAS}
        onClose={() => setUserModalOpen(false)}
        onSubmit={handleUserSubmit}
      />
    </div>
  );
}