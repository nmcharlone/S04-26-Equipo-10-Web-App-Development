import { useState, useEffect, useRef } from "react";
import Input from "../../components/ui/Input";
// --- tipos ---
type Rol = "Operador" | "Operadora" | "Supervisor" | "Técnico" | "Técnica" | "Gerente";
type Mode = "create" | "edit" | "delete";

interface UserForm {
  nombre:     string;
  email:      string;
  contrasena: string;
  rol:        Rol | "";
  area:       string;
}

interface UserModalProps {
  open:          boolean;
  mode:          Mode;
  initialData?:  Partial<UserForm>;
  areas:         string[];
  onClose:       () => void;
  onSubmit:      (data: UserForm) => void;
}

const ROLES: Rol[] = ["Operador", "Operadora", "Supervisor", "Técnico", "Técnica", "Gerente"];

// --- dropdown simple ---
function Dropdown({ value, placeholder, options, onChange }: {
  value: string; placeholder: string; options: string[]; onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(p => !p)}
        style={{
          width: "100%", padding: "10px 14px",
          border: `1.5px solid ${open ? "#10b981" : "#d1d5db"}`,
          borderRadius: 8, background: "#fff", cursor: "pointer",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          fontSize: 14, color: value ? "#111827" : "#9ca3af", textAlign: "left", outline: "none",
        }}
      >
        {value || placeholder}
        <span style={{ fontSize: 11, color: "#6b7280", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s", display: "inline-block" }}>▼</span>
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.10)", zIndex: 300, overflow: "hidden" }}>
          {options.map(opt => (
            <button key={opt} onClick={() => { onChange(opt); setOpen(false); }}
              style={{ width: "100%", padding: "11px 14px", border: "none", background: value === opt ? "#10b981" : "#fff", color: value === opt ? "#fff" : "#111827", fontSize: 14, textAlign: "left", cursor: "pointer", display: "block" }}
              onMouseEnter={e => { if (value !== opt) (e.currentTarget as HTMLButtonElement).style.background = "#f3f4f6"; }}
              onMouseLeave={e => { if (value !== opt) (e.currentTarget as HTMLButtonElement).style.background = "#fff"; }}
            >{opt}</button>
          ))}
        </div>
      )}
    </div>
  );
}

// --- input reutilizable ---
function Field({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #d1d5db", borderRadius: 8, fontSize: 14, color: "#111827", outline: "none", boxSizing: "border-box" }}
        onFocus={e => (e.currentTarget.style.borderColor = "#10b981")}
        onBlur={e => (e.currentTarget.style.borderColor = "#d1d5db")}
      />
    </div>
  );
}

// --- modal principal ---
export default function UserModal({ open, mode, initialData = {}, areas, onClose, onSubmit }: UserModalProps) {
  const [form, setForm] = useState<UserForm>({ nombre: "", email: "", contrasena: "", rol: "", area: "" });

  useEffect(() => {
    setForm({
      nombre:     initialData.nombre     ?? "",
      email:      initialData.email      ?? "",
      contrasena: initialData.contrasena ?? "",
      rol:        initialData.rol        ?? "",
      area:       initialData.area       ?? "",
    });
  }, [initialData, open]);

  const set = (key: keyof UserForm) => (val: string) => setForm(p => ({ ...p, [key]: val }));

  const canSubmit = form.nombre.trim() !== "" && form.email.trim() !== "" && form.rol !== "" && form.area !== "";

  const handleClose  = () => { onClose(); };
  const handleSubmit = () => { if (!canSubmit) return; onSubmit(form); handleClose(); };

  if (!open) return null;

  // --- modal eliminar ---
  if (mode === "delete") {
    return (
      <>
        <div onClick={handleClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200 }} />
        <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "#fff", borderRadius: 12, padding: "28px 28px 24px", width: 360, maxWidth: "calc(100vw - 32px)", zIndex: 201, boxShadow: "0 8px 32px rgba(0,0,0,0.18)", fontFamily: "Inter, sans-serif" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#111827" }}>¿Eliminar usuario?</h2>
            <button onClick={handleClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#9ca3af", padding: 0 }}>×</button>
          </div>
          <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6, margin: "0 0 24px" }}>
            Esta acción invalidará el acceso del usuario {initialData.nombre ? <strong>{initialData.nombre} {initialData.area}</strong> : ""} del sistema. No obstante, su información aún se mantendrá. Esta acción no se puede deshacer.
          </p>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button onClick={handleClose} style={{ padding: "10px 20px", border: "1.5px solid #d1d5db", borderRadius: 8, background: "#fff", color: "#374151", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>Cancelar</button>
            <button onClick={() => { onSubmit(form); handleClose(); }} style={{ padding: "10px 20px", border: "none", borderRadius: 8, background: "#111827", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Guardar</button>
          </div>
        </div>
      </>
    );
  }

  // --- modal crear / editar ---
  const isCreate = mode === "create";

  return (
    <>
      <div onClick={handleClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200 }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "#fff", borderRadius: 12, padding: "28px 28px 24px", width: 420, maxWidth: "calc(100vw - 32px)", zIndex: 201, boxShadow: "0 8px 32px rgba(0,0,0,0.18)", fontFamily: "Inter, sans-serif" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#111827" }}>
            {isCreate ? "Crear Usuario" : "Modificar usuario"}
          </h2>
          <button onClick={handleClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#9ca3af", padding: 0 }}>×</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
<Input
  label="Nombre"
  value={form.nombre}
  onChange={set("nombre")}
  placeholder="Nombre del usuario"
  required
/>
<Input
  label="Email"
  type="email"
  value={form.email}
  onChange={set("email")}
  placeholder="correo@ejemplo.com"
  required
/>
<Input
  label="Contraseña"
  type="password"
  value={form.contrasena}
  onChange={set("contrasena")}
  placeholder="Contraseña"
  required
/>
          {/* Rol + Área en fila */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Rol</label>
              <Dropdown value={form.rol} placeholder="Operador" options={ROLES} onChange={set("rol")} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Área</label>
              <Dropdown value={form.area} placeholder="Producción" options={areas} onChange={set("area")} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
          <button onClick={handleClose} style={{ padding: "10px 20px", border: "1.5px solid #d1d5db", borderRadius: 8, background: "#fff", color: "#374151", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>Cancelar</button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            style={{ padding: "10px 20px", border: "none", borderRadius: 8, background: canSubmit ? "#111827" : "#9ca3af", color: "#fff", fontSize: 14, fontWeight: 600, cursor: canSubmit ? "pointer" : "not-allowed" }}
          >
            Guardar
          </button>
        </div>
      </div>
    </>
  );
}