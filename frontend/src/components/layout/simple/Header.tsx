import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { Activity, LogOut } from "lucide-react";

// Mapeo de roles del contexto (string) a etiqueta en español
const roleMap: Record<string, string> = {
  operator: "Operador",
  technician: "Técnico",
  supervisor: "Supervisor",
  manager: "Gerente",
};

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const fullName = user ? `${user.name} ${user.lastname}` : "Usuario";
  const role = user ? roleMap[user.role] || user.role : "";

  return (
    <nav style={{
      background: "#111827",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px",
      height: 64,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: "#10b981",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Activity size={22} color="#fff" />
        </div>
        <span style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>OpsCore</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>{fullName}</div>
          <div style={{ color: "#9ca3af", fontSize: 12 }}>{role}</div>
        </div>
        <button onClick={handleLogout} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <LogOut size={20} color="#9ca3af" />
        </button>
      </div>
    </nav>
  );
}