"use client";

import type { CSSProperties } from "react";
import { MODULE_CATALOG } from "@/lib/modules";
import { useProjectStore } from "@/lib/projectStore";

export function Toolbar() {
  const addModule = useProjectStore((s) => s.addModule);
  const rotate = useProjectStore((s) => s.rotateSelectedY90);
  const remove = useProjectStore((s) => s.removeSelected);
  const selected = useProjectStore((s) => s.selectedInstanceId);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>Module</div>
      {MODULE_CATALOG.map((m) => (
        <button
          key={m.moduleId}
          type="button"
          onClick={() => addModule(m.moduleId)}
          style={btnStyle}
        >
          + {m.label}
        </button>
      ))}
      <div style={{ height: 1, background: "#334155", margin: "8px 0" }} />
      <div style={{ fontSize: 12, opacity: 0.75 }}>Auswahl</div>
      <button type="button" style={btnStyle} disabled={!selected} onClick={() => rotate()}>
        Drehen +90° (Y)
      </button>
      <button type="button" style={{ ...btnStyle, borderColor: "#7f1d1d" }} disabled={!selected} onClick={() => remove()}>
        Modul löschen
      </button>
      <p style={{ fontSize: 11, lineHeight: 1.45, opacity: 0.65, margin: "12px 0 0" }}>
        Boden anklicken: gewähltes Modul auf 60-cm-Raster setzen.
      </p>
    </div>
  );
}

const btnStyle: CSSProperties = {
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #475569",
  background: "#1e293b",
  color: "#e8eaed",
  cursor: "pointer",
  fontSize: 13,
  textAlign: "left",
};
