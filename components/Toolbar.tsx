"use client";

import type { CSSProperties } from "react";
import { MODULE_CATALOG } from "@/lib/modules";
import { useProjectStore } from "@/lib/projectStore";

export function Toolbar() {
  const addModule = useProjectStore((s) => s.addModule);
  const rotate = useProjectStore((s) => s.rotateSelectedY90);
  const duplicate = useProjectStore((s) => s.duplicateSelected);
  const remove = useProjectStore((s) => s.removeSelected);
  const selectInstance = useProjectStore((s) => s.selectInstance);
  const selected = useProjectStore((s) => s.selectedInstanceId);
  const transformMode = useProjectStore((s) => s.transformMode);
  const setTransformMode = useProjectStore((s) => s.setTransformMode);
  const mirrorZ = useProjectStore((s) => s.mirrorFlipScaleZSelected);

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
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <button
          type="button"
          style={{
            ...btnStyle,
            flex: 1,
            minWidth: 0,
            borderColor: transformMode === "translate" ? "#22c55e" : "#475569",
          }}
          disabled={!selected}
          onClick={() => setTransformMode("translate")}
        >
          Gizmo: Verschieben
        </button>
        <button
          type="button"
          style={{
            ...btnStyle,
            flex: 1,
            minWidth: 0,
            borderColor: transformMode === "rotate" ? "#22c55e" : "#475569",
          }}
          disabled={!selected}
          onClick={() => setTransformMode("rotate")}
        >
          Gizmo: Drehen
        </button>
      </div>
      <button type="button" style={btnStyle} disabled={!selected} onClick={() => selectInstance(null)}>
        Auswahl aufheben
      </button>
      <button type="button" style={btnStyle} disabled={!selected} onClick={() => duplicate()}>
        Modul duplizieren (+1 Raster X)
      </button>
      <button type="button" style={btnStyle} disabled={!selected} onClick={() => rotate()}>
        Drehen +90° (Y) — auch mit playcanvasPose
      </button>
      <button type="button" style={btnStyle} disabled={!selected} onClick={() => mirrorZ()}>
        Spiegeln (scale Z)
      </button>
      <button type="button" style={{ ...btnStyle, borderColor: "#7f1d1d" }} disabled={!selected} onClick={() => remove()}>
        Modul löschen
      </button>
      <p style={{ fontSize: 11, lineHeight: 1.45, opacity: 0.65, margin: "12px 0 0" }}>
        <strong>Gizmo:</strong> Auswahl treffen — farbige Achsen an der Gruppe: ziehen, loslassen → Position
        rastet auf <strong>60&nbsp;cm</strong> in X/Z ein, Y bleibt frei. <strong>Boden klicken:</strong> Modul
        auf Rasterzelle setzen (aktualisiert auch <code style={{ fontSize: 10 }}>playcanvasPose</code>).
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
