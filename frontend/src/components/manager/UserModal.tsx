import { useEffect, useRef, useState } from "react";

type UserModalMode = "create" | "edit" | "delete";

type UserModalProps = {
  open: boolean;
  mode: UserModalMode;
  initialData?: {
    nombre?: string;
    email?: string;
    contrasena?: string;
    rol?: string;
    area?: string;
  };
  areas: string[];
  onClose: () => void;
  onSubmit: (data: {
    nombre: string;
    email: string;
    contrasena: string;
    rol: string;
    area: string;
  }) => void;
};

const DEFAULT_AREAS = ["IT", "HR", "FINANCE", "OPERATIONS", "PRODUCTION", "QUALITY", "LOGISTIC"];

function Dropdown({
  value,
  placeholder,
  options,
  onChange,
}: {
  value: string;
  placeholder: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const safeOptions = Array.isArray(options) ? options : [];

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        style={{
          width: "100%",
          padding: "10px 14px",
          border: `1.5px solid ${open ? "#10b981" : "#d1d5db"}`,
          borderRadius: 8,
          background: "#fff",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 14,
          color: value ? "#111827" : "#9ca3af",
          textAlign: "left",
          outline: "none",
        }}
      >
        {value || placeholder}
        <span
          style={{
            fontSize: 11,
            color: "#6b7280",
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
            display: "inline-block",
          }}
        >
          ▼
        </span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1.5px solid #e5e7eb",
            borderRadius: 8,
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            zIndex: 9999,
            overflow: "visible",
          }}
        >
          {safeOptions.length === 0 ? (
            <div style={{ padding: "10px 14px", fontSize: 13, color: "#9ca3af" }}>
              No hay áreas disponibles
            </div>
          ) : (
            safeOptions.map((opt) => (
              <button
                type="button"
                key={opt}
                onClick={() => {
                  onChange(opt.trim());
                  setOpen(false);
                }}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  border: "none",
                  background: value === opt ? "#10b981" : "#fff",
                  color: value === opt ? "#fff" : "#111827",
                  fontSize: 14,
                  textAlign: "left",
                  cursor: "pointer",
                  display: "block",
                }}
              >
                {opt}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function UserModal({
  open,
  mode,
  initialData = {},
  onClose,
  onSubmit,
}: UserModalProps) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [rol, setRol] = useState("");
  const [area, setArea] = useState("");

  useEffect(() => {
    if (open) {
      setNombre(initialData.nombre || "");
      setEmail(initialData.email || "");
      setContrasena(initialData.contrasena || "");
      setRol(initialData.rol || "");
      setArea(initialData.area || "");
    }
  }, [open, initialData]);

  if (!open) return null;

  const title =
    mode === "edit"
      ? "Editar usuario"
      : mode === "delete"
      ? "Eliminar usuario"
      : "Añadir usuario";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      nombre,
      email,
      contrasena,
      rol,
      area,
    });
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: 460,
          background: "#fff",
          borderRadius: 14,
          padding: 24,
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
          overflow: "visible",
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: 18, fontSize: 20, color: "#111827" }}>
          {title}
        </h3>

        <div style={{ display: "grid", gap: 14 }}>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre"
            style={{
              padding: "10px 14px",
              border: "1.5px solid #d1d5db",
              borderRadius: 8,
              fontSize: 14,
            }}
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            style={{
              padding: "10px 14px",
              border: "1.5px solid #d1d5db",
              borderRadius: 8,
              fontSize: 14,
            }}
          />

          <input
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            placeholder="Contraseña"
            type="password"
            style={{
              padding: "10px 14px",
              border: "1.5px solid #d1d5db",
              borderRadius: 8,
              fontSize: 14,
            }}
          />

          <Dropdown
            value={rol}
            placeholder="Seleccionar rol"
            options={["Operador", "Técnico", "Supervisor", "Gerente"]}
            onChange={setRol}
          />

          <Dropdown
            value={area}
            placeholder="Seleccionar área"
            options={DEFAULT_AREAS}
            onChange={setArea}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
          <button type="button" onClick={onClose}>
            Cancelar
          </button>

          <button type="submit">
            {mode === "edit" ? "Guardar cambios" : "Crear usuario"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserModal;