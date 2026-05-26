import { useState } from "react";

interface RootCause {
  id: number;
  name: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { solution: string; root_cause_id: number }) => void;
  rootCauses: RootCause[];
}

export default function ResolveModal({ open, onClose, onSubmit, rootCauses }: Props) {
  const [solution, setSolution] = useState("");
  const [rootCauseId, setRootCauseId] = useState<number | null>(null);

  if (!open) return null;

  const handleSubmit = () => {
    if (!solution.trim() || rootCauseId === null) return;
    onSubmit({ solution: solution.trim(), root_cause_id: rootCauseId });
    onClose();
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200 }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "#fff", borderRadius: 12, padding: "24px", width: 360, zIndex: 201 }}>
        <h3>Resolver incidente</h3>
        <textarea
          placeholder="Solución aplicada..."
          value={solution}
          onChange={e => setSolution(e.target.value)}
          rows={3}
          style={{ width: "100%", padding: "8px", marginTop: 8, borderRadius: 6, border: "1px solid #d1d5db" }}
        />
        <select value={rootCauseId ?? ""} onChange={e => setRootCauseId(Number(e.target.value))} style={{ width: "100%", padding: "8px", marginTop: 12 }}>
          <option value="">Causa raíz</option>
          {rootCauses.map(rc => (
            <option key={rc.id} value={rc.id}>{rc.name}</option>
          ))}
        </select>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
          <button onClick={onClose} style={{ background: "#e5e7eb", border: "none", borderRadius: 6, padding: "8px 16px" }}>Cancelar</button>
          <button onClick={handleSubmit} style={{ background: "#8b5cf6", color: "#fff", border: "none", borderRadius: 6, padding: "8px 16px" }}>Resolver</button>
        </div>
      </div>
    </>
  );
}