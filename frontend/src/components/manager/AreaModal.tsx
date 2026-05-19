import { useState, useEffect } from "react";
import Input from "../../components/ui/Input";
interface AreaModalProps {
  open: boolean;
  mode: "add" | "edit";
  initialValue?: string;
  onClose: () => void;
  onSubmit: (nombre: string) => void;
}

export default function AreaModal({ open, mode, initialValue = "", onClose, onSubmit }: AreaModalProps) {
  const [nombre, setNombre] = useState(initialValue);

  useEffect(() => { setNombre(initialValue); }, [initialValue]);

  const isAdd = mode === "add";
  const canSubmit = nombre.trim().length > 0;

  const handleClose = () => { setNombre(""); onClose(); };
  const handleSubmit = () => { if (!canSubmit) return; onSubmit(nombre.trim()); handleClose(); };

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
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#111827" }}>
            {isAdd ? "Añadir área" : "Modificar área"}
          </h2>
          <button onClick={handleClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#9ca3af", padding: 0 }}>×</button>
        </div>

        {/* Campo */}
        <div>
        <Input
          label="Nombre del área"
          placeholder="Ej: Producción, Mantenimiento..."
          value={nombre}
          onChange={setNombre}
          required
        />
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
            {isAdd ? "Guardar área" : "Modificar área"}
          </button>
        </div>
      </div>
    </>
  );
}