import { useState, useRef, useEffect } from "react";
import Input from "../../components/ui/Input";
const TIPOS = [
  "Falla Eléctrica",
  "Falla Mecánica",
  "Fuga",
  "Sobrecalentamiento",
  "Ruido Anormal",
  "Vibración Excesiva",
];

interface ModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { tipo: string; area: string; descripcion: string }) => void;
}

export default function Modal({ open, onClose, onSubmit }: ModalProps) {
  const [tipo, setTipo] = useState("");
  const [area, setArea] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al clickear afuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!open) return null;

  const handleSubmit = () => {
    if (!tipo || !area || !descripcion.trim()) return;
    onSubmit({ tipo, area, descripcion });
    handleClose();
  };

  const handleClose = () => {
    setTipo("");
    setArea("");
    setDescripcion("");
    setDropdownOpen(false);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={handleClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.4)",
          zIndex: 100,
        }}
      />

      {/* Modal */}
      <div style={{
        position: "fixed",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        background: "#fff",
        borderRadius: 12,
        padding: "28px 28px 24px",
        width: 420,
        maxWidth: "calc(100vw - 32px)",
        zIndex: 101,
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        fontFamily: "Inter, sans-serif",
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#111827" }}>
              Nuevo reporte de incidente
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>
              Complete los campos para registrar el incidente
            </p>
          </div>
          <button
            onClick={handleClose}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 20, color: "#9ca3af", lineHeight: 1, padding: 0,
            }}
          >×</button>
        </div>

        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Tipo de incidente */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
              Tipo de incidente
            </label>
            <div ref={dropdownRef} style={{ position: "relative" }}>
              <button
                onClick={() => setDropdownOpen(p => !p)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: `1.5px solid ${dropdownOpen ? "#10b981" : "#d1d5db"}`,
                  borderRadius: 8,
                  background: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: 14,
                  color: tipo ? "#111827" : "#9ca3af",
                  textAlign: "left",
                  outline: "none",
                }}
              >
                {tipo || "Seleccionar tipo"}
                <span style={{
                  fontSize: 12,
                  color: "#6b7280",
                  transform: dropdownOpen ? "rotate(180deg)" : "none",
                  transition: "transform 0.2s",
                  display: "inline-block",
                }}>▼</span>
              </button>

              {dropdownOpen && (
                <div style={{
                  position: "absolute",
                  top: "calc(100% + 4px)",
                  left: 0, right: 0,
                  background: "#fff",
                  border: "1.5px solid #e5e7eb",
                  borderRadius: 8,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
                  zIndex: 200,
                  overflow: "hidden",
                }}>
                  {TIPOS.map(t => (
                    <button
                      key={t}
                      onClick={() => { setTipo(t); setDropdownOpen(false); }}
                      style={{
                        width: "100%",
                        padding: "11px 14px",
                        border: "none",
                        background: tipo === t ? "#10b981" : "#fff",
                        color: tipo === t ? "#fff" : "#111827",
                        fontSize: 14,
                        textAlign: "left",
                        cursor: "pointer",
                        display: "block",
                      }}
                      onMouseEnter={e => {
                        if (tipo !== t) (e.currentTarget as HTMLButtonElement).style.background = "#f3f4f6";
                      }}
                      onMouseLeave={e => {
                        if (tipo !== t) (e.currentTarget as HTMLButtonElement).style.background = "#fff";
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Área */}
          <div>
          <Input
            label="Área"
            placeholder="Producción"
            value={area}
            onChange={setArea}
            required
          />
          </div>

          {/* Descripción */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
              Descripción
              <span style={{ float: "right", fontWeight: 400, color: "#9ca3af" }}>
                {descripcion.length}/300
              </span>
            </label>
            <textarea
              placeholder="Describa el incidente con el mayor detalle posible.."
              value={descripcion}
              maxLength={300}
              onChange={e => setDescripcion(e.target.value)}
              rows={4}
              style={{
                width: "100%",
                padding: "10px 14px",
                border: "1.5px solid #d1d5db",
                borderRadius: 8,
                fontSize: 14,
                color: "#111827",
                resize: "vertical",
                outline: "none",
                boxSizing: "border-box",
                fontFamily: "inherit",
              }}
              onFocus={e => (e.currentTarget.style.borderColor = "#10b981")}
              onBlur={e => (e.currentTarget.style.borderColor = "#d1d5db")}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
          <button
            onClick={handleClose}
            style={{
              padding: "10px 20px",
              border: "1.5px solid #d1d5db",
              borderRadius: 8,
              background: "#fff",
              color: "#374151",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!tipo || !area || !descripcion.trim()}
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: 8,
              background: (!tipo || !area || !descripcion.trim()) ? "#9ca3af" : "#111827",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              cursor: (!tipo || !area || !descripcion.trim()) ? "not-allowed" : "pointer",
              transition: "background 0.2s",
            }}
          >
            Guardar reporte
          </button>
        </div>
      </div>
    </>
  );
}