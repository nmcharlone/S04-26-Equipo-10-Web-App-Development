import { useState, useRef, useEffect } from "react";

const ESTADOS   = ["Abierto", "Asignado", "En proceso", "Cerrado"];

interface EditReportModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { estado: string }) => void;
  initialEstado?: string;

}

function Dropdown({ value, placeholder, options, onChange }: {
  value: string; placeholder: string; options: string[];
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
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
          fontSize: 14, color: value ? "#111827" : "#9ca3af",
          textAlign: "left", outline: "none",
        }}
      >
        {value || placeholder}
        <span style={{ fontSize: 11, color: "#6b7280", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s", display: "inline-block" }}>▼</span>
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
          background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 8,
          boxShadow: "0 4px 16px rgba(0,0,0,0.10)", zIndex: 300, overflow: "hidden",
        }}>
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              style={{
                width: "100%", padding: "11px 14px", border: "none",
                background: value === opt ? "#10b981" : "#fff",
                color: value === opt ? "#fff" : "#111827",
                fontSize: 14, textAlign: "left", cursor: "pointer", display: "block",
              }}
              onMouseEnter={e => { if (value !== opt) (e.currentTarget as HTMLButtonElement).style.background = "#f3f4f6"; }}
              onMouseLeave={e => { if (value !== opt) (e.currentTarget as HTMLButtonElement).style.background = "#fff"; }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function EditReportModal({ open, onClose, onSubmit, initialEstado = ""}: EditReportModalProps) {
  const [estado, setEstado]       = useState(initialEstado);

  // sincronizar si cambian los valores iniciales (al abrir con distinto reporte)
  useEffect(() => { setEstado(initialEstado); },    [initialEstado]);

  const canSubmit = !!estado;

  const handleClose = () => { onClose(); };

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({ estado });
    handleClose();
  };

  if (!open) return null;

  return (
    <>
      <div onClick={handleClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200 }} />
      <div style={{
        position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        background: "#fff", borderRadius: 12, padding: "28px 28px 24px",
        width: 380, maxWidth: "calc(100vw - 32px)", zIndex: 201,
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)", fontFamily: "Inter, sans-serif",
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#111827" }}>Editar reporte</h2>
          <button onClick={handleClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#9ca3af", padding: 0 }}>×</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Estado</label>
            <Dropdown value={estado} placeholder="Seleccionar estado" options={ESTADOS} onChange={setEstado} />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
          <button onClick={handleClose} style={{ padding: "10px 20px", border: "1.5px solid #d1d5db", borderRadius: 8, background: "#fff", color: "#374151", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            style={{ padding: "10px 20px", border: "none", borderRadius: 8, background: canSubmit ? "#111827" : "#9ca3af", color: "#fff", fontSize: 14, fontWeight: 600, cursor: canSubmit ? "pointer" : "not-allowed" }}
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </>
  );
}