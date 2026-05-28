import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { Activity, LogOut } from "lucide-react";

interface NavLink {
  label: string;
  path: string;
  active: boolean;
}

interface HeaderProps {
  navLinks?: NavLink[];
}

const roleMap: Record<string, string> = {
  operator: "Operador",
  technician: "Técnico",
  supervisor: "Supervisor",
  manager: "Gerente",
};

export default function Header({ navLinks }: HeaderProps) {
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
      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 12, padding: 0,
          }}
        >
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: "#10b981",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Activity size={22} color="#fff" />
          </div>
          <span style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>Resolva</span>
        </button>

        {/* Navegación interna */}
        {navLinks && navLinks.length > 0 && (
          <div style={{ display: "flex", gap: 8 }}>
            {navLinks.map(link => (
              <button
                key={link.label}
                onClick={() => navigate(link.path)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: link.active ? "#fff" : "#9ca3af",
                  fontSize: 14, fontWeight: link.active ? 600 : 400,
                  padding: "4px 8px",
                  borderBottom: link.active ? "2px solid #10b981" : "2px solid transparent",
                  transition: "all 0.2s",
                }}
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Usuario + logout */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>{fullName}</div>
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