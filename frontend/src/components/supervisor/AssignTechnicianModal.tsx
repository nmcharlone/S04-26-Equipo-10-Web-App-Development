import { useState, useRef, useEffect } from "react";

// --- datos mock (reemplazar con los reales cuando haya backend) ---
const AREAS = ["Producción", "Mantenimiento", "Almacén", "Calderas", "Compresores"];

const REPORTES_POR_AREA: Record<string, { id: string; tipo: string }[]> = {
  Producción:    [{ id: "INC-0003", tipo: "Falla Eléctrica" }, { id: "INC-0004", tipo: "Sobrecalentamiento" }],
  Mantenimiento: [{ id: "INC-0005", tipo: "Vibración Excesiva" }],
  Almacén:       [{ id: "INC-0006", tipo: "Fuga" }],
  Calderas:      [{ id: "INC-0007", tipo: "Ruido Anormal" }],
  Compresores:   [{ id: "INC-0008", tipo: "Falla Mecánica" }],
};

const TECNICOS = ["Ana López", "Miguel Torres", "Carlos Ruiz"];

// --- tipos ---
interface AssignTechnicianModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { area: string; reporteId: string; tecnico: string }) => void;
}

// --- dropdown genérico reutilizable ---
function Dropdown<T extends string>({
  value, placeholder, options, disabled, onChange, renderOption,
}: {
  value: T | "";
  placeholder: string;
  options: T[];
  disabled?: boolean;
  onChange: (val: T) => void;
  renderOption?: (val: T) => React.ReactNode;
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
        disabled={disabled}
        onClick={() => !disabled && setOpen(p => !p)}
        style={{
          width: "100%", padding: "10px 14px",
          border: `1.5px solid ${open ? "#10b981" : "#d1d5db"}`,
          borderRadius: 8, background: disabled ? "#f9fafb" : "#fff",
          cursor: disabled ? "not-allowed" : "pointer",
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
              {renderOption ? renderOption(opt) : opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// --- modal ---
export default function AssignTechnicianModal({ open, onClose, onSubmit }: AssignTechnicianModalProps) {
  const [area, setArea]       = useState("");
  const [reporteId, setReporteId] = useState("");
  const [tecnico, setTecnico] = useState("");

  const reportesDisponibles = area ? REPORTES_POR_AREA[area] ?? [] : [];
  const reporteOpts = reportesDisponibles.map(r => r.id);

  const canSubmit = !!area && !!reporteId && !!tecnico;

  const handleClose = () => {
    setArea(""); setReporteId(""); setTecnico("");
    onClose();
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({ area, reporteId, tecnico });
    handleClose();
  };

  const handleAreaChange = (val: string) => {
    setArea(val);
    setReporteId(""); // resetear reporte al cambiar área
  };

  if (!open) return null;

  return (
    <>
      <div onClick={handleClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200 }} />
      <div style={{
        position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        background: "#fff", borderRadius: 12, padding: "28px 28px 24px",
        width: 420, maxWidth: "calc(100vw - 32px)", zIndex: 201,
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)", fontFamily: "Inter, sans-serif",
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#111827" }}>Asignar técnico</h2>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>Seleccione el área, reporte y técnico para la asignación</p>
          </div>
          <button onClick={handleClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#9ca3af", padding: 0 }}>×</button>
        </div>

        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Área */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Área</label>
            <Dropdown value={area} placeholder="Seleccionar área" options={AREAS} onChange={handleAreaChange} />
          </div>

          {/* Reporte */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Reporte</label>
            <Dropdown
              value={reporteId}
              placeholder={area ? "Seleccionar reporte" : "Primero seleccione un área"}
              options={reporteOpts}
              disabled={!area}
              onChange={setReporteId}
              renderOption={(id) => {
                const r = reportesDisponibles.find(r => r.id === id);
                return <span>{id} — {r?.tipo}</span>;
              }}
            />
          </div>

          {/* Técnico */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Técnico</label>
            <Dropdown value={tecnico} placeholder="Seleccionar técnico" options={TECNICOS} onChange={setTecnico} />
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
          <button onClick={handleClose} style={{ padding: "10px 20px", border: "1.5px solid #d1d5db", borderRadius: 8, background: "#fff", color: "#374151", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            style={{ padding: "10px 20px", border: "none", borderRadius: 8, background: canSubmit ? "#111827" : "#9ca3af", color: "#fff", fontSize: 14, fontWeight: 600, cursor: canSubmit ? "pointer" : "not-allowed" }}
          >
            Guardar asignación
          </button>
        </div>
      </div>
    </>
  );
}