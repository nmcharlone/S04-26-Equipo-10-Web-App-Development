import { useNavigate } from "react-router-dom";
import { Activity, LogOut } from "lucide-react";

interface HeaderProps {
  name: string;
  role: string;
  onLogout?: () => void;
}

export default function Header({ name, role, onLogout }: HeaderProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) onLogout(); // limpia el estado global
    navigate("/login");       // redirige al login
  };

  return (
    <nav style={{
      background: "#111827",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px",
      height: 64,
    }}>
      {/* Logo + nombre */}
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

      {/* Usuario + logout */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>{name}</div>
          <div style={{ color: "#9ca3af", fontSize: 12 }}>{role}</div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", padding: 0,
          }}
        >
          <LogOut size={20} color="#9ca3af" />
        </button>
      </div>
    </nav>
  );
}