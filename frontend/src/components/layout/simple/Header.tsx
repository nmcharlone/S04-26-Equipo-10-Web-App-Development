import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { LogOut } from "lucide-react";

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
      background: "#1a1a2e",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px",
      height: 64,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <img
          src="/assets/header.png"
          alt="Resolva Logo"
          style={{ width: 42, height: 42, borderRadius: 8 }}
        />
        <span style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>Resolva</span>
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