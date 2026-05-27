import { useState } from "react";

interface Tecnico {
  id: number;
  name: string;
  lastname: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { technician_id: number }) => void;
  tecnicos: Tecnico[];
  incidentAreaId: number;
}

export default function AssignTechnicianModal({ open, onClose, onSubmit, tecnicos, incidentAreaId }: Props) {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  if (!open) return null;

  // Filtramos técnicos que pertenezcan a la misma área si tuviéramos esa información.
  // Por ahora, mostramos todos los técnicos. El backend se encarga de validar.
  const tecnicosDisponibles = tecnicos;

  const handleSubmit = () => {
    if (selectedId === null) return;
    onSubmit({ technician_id: selectedId });
    onClose();
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200 }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "#fff", borderRadius: 12, padding: "24px", width: 360, zIndex: 201 }}>
        <h3>Asignar técnico</h3>
        <select value={selectedId ?? ""} onChange={e => setSelectedId(Number(e.target.value))} style={{ width: "100%", padding: "8px", marginTop: 8 }}>
          <option value="">Seleccionar técnico</option>
          {tecnicosDisponibles.map(t => (
            <option key={t.id} value={t.id}>{t.name} {t.lastname}</option>
          ))}
        </select>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
          <button onClick={onClose} style={{ background: "#e5e7eb", border: "none", borderRadius: 6, padding: "8px 16px" }}>Cancelar</button>
          <button onClick={handleSubmit} style={{ background: "#10b981", color: "#fff", border: "none", borderRadius: 6, padding: "8px 16px" }}>Asignar</button>
        </div>
      </div>
    </>
  );
}