import { useState } from "react";
import Input from "../../components/ui/Input";

interface IncidentType {
  id: number;
  name: string;
}

interface Area {
  id: number;
  name: string;
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { type_id: number; area_id: number; description: string }) => void;
  areas: Area[];
  types: IncidentType[];
}

export default function Modal({ open, onClose, onSubmit, areas, types }: ModalProps) {
  const [typeId, setTypeId] = useState<number | null>(null);
  const [areaId, setAreaId] = useState<number | null>(null);
  const [descripcion, setDescripcion] = useState("");

  if (!open) return null;

  const handleSubmit = () => {
    if (typeId === null || areaId === null || !descripcion.trim()) return;
    onSubmit({ type_id: typeId, area_id: areaId, description: descripcion.trim() });
    onClose();
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100 }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "#fff", borderRadius: 12, padding: "28px", width: 420, maxWidth: "90vw", zIndex: 101 }}>
        <h2 style={{ marginTop: 0 }}>Nuevo incidente</h2>

        <label>Tipo</label>
        <select value={typeId ?? ""} onChange={e => setTypeId(Number(e.target.value))} style={{ width: "100%", padding: "8px", marginBottom: 12 }}>
          <option value="">Seleccionar tipo</option>
          {types.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>

        <label>Área</label>
        <select value={areaId ?? ""} onChange={e => setAreaId(Number(e.target.value))} style={{ width: "100%", padding: "8px", marginBottom: 12 }}>
          <option value="">Seleccionar área</option>
          {areas.map(a => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>

        <Input label="Descripción" value={descripcion} onChange={setDescripcion} placeholder="Describa el incidente" />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
          <button onClick={onClose} style={{ padding: "8px 16px", background: "#e5e7eb", border: "none", borderRadius: 6 }}>Cancelar</button>
          <button onClick={handleSubmit} style={{ padding: "8px 16px", background: "#10b981", color: "#fff", border: "none", borderRadius: 6 }}>Guardar</button>
        </div>
      </div>
    </>
  );
}