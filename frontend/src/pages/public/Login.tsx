import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Input from "../../components/ui/Input";
import { login as loginService, me } from "../../services/authService";
import { Activity, LogIn } from "lucide-react";

const roleMap: Record<number, string> = {
  1: "operator",
  2: "technician",
  3: "supervisor",
  4: "manager",
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // 🔒 Evita doble envío
    setError("");
    setLoading(true);

    try {
      // 1. Obtener token
      const { token } = await loginService({ name, lastname, password });
      localStorage.setItem("token", token);

      // 2. Obtener datos del usuario
      const { user } = await me();

      // 3. Guardar en contexto
      login(
        {
          id: user.id,
          name: user.name,
          lastname: user.lastname,
          role: roleMap[user.role_id] as any,
          area_id: user.area_id,
        },
        token
      );

      // 4. Redirigir según rol
      const roleToPath: Record<string, string> = {
        operator: "/operator",
        technician: "/technician",
        supervisor: "/supervisor",
        manager: "/manager",
      };
      navigate(roleToPath[roleMap[user.role_id]] || "/operator");
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "Inter, sans-serif", background: "#f3f4f6" }}>
      <form onSubmit={handleSubmit} style={{ background: "#fff", padding: "32px", borderRadius: 12, boxShadow: "0 4px 16px rgba(0,0,0,0.10)", width: 340, display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center", marginBottom: 8 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "#10b981", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Activity size={28} color="#fff" />
          </div>
          <span style={{ color: "#111827", fontSize: 22, fontWeight: 700 }}>OpsCore</span>
        </div>

        <h2 style={{ margin: 0, textAlign: "center", fontSize: 20, fontWeight: 700, color: "#111827" }}>
          Iniciar sesión
        </h2>
        <p style={{ margin: 0, textAlign: "center", fontSize: 13, color: "#6b7280" }}>
          Ingresá tus credenciales
        </p>

        <Input label="Nombre" placeholder="Juan" value={name} onChange={setName} required />
        <Input label="Apellido" placeholder="Perez" value={lastname} onChange={setLastname} required />
        <Input label="Contraseña" type="password" placeholder="Contraseña" value={password} onChange={setPassword} required />

        {error && (
          <div style={{ color: "#ef4444", fontSize: 13, textAlign: "center", fontWeight: 500 }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 0",
            border: "none",
            borderRadius: 8,
            background: loading ? "#9ca3af" : "#111827",
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            marginTop: 4,
          }}
        >
          {loading ? "Ingresando..." : (
            <>
              <LogIn size={18} />
              Ingresar
            </>
          )}
        </button>

        <details style={{ fontSize: 12, color: "#6b7280", textAlign: "center", marginTop: 8 }}>
          <summary style={{ cursor: "pointer", fontWeight: 500 }}>
            Credenciales de prueba
          </summary>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
            <span><strong>Operador:</strong> Juan / Perez / 123456</span>
            <span><strong>Técnico:</strong> Ana / Lopez / 123456</span>
            <span><strong>Supervisor:</strong> Carlos / Ruiz / 123456</span>
            <span><strong>Manager:</strong> Maria / Garcia / 123456</span>
          </div>
        </details>
      </form>
    </div>
  );
}