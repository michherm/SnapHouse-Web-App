"use client";

import type { CSSProperties } from "react";
import { useRef } from "react";
import { useProjectStore } from "@/lib/projectStore";
import { downloadProjectJson } from "@/lib/exportProject";

export function ProjectControls() {
  const project = useProjectStore((s) => s.project);
  const setProjectName = useProjectStore((s) => s.setProjectName);
  const importFromJsonText = useProjectStore((s) => s.importFromJsonText);
  const clearAll = useProjectStore((s) => s.clearAll);
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <label style={labelStyle}>
        Projektname
        <input
          style={inputStyle}
          value={project.projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
      </label>
      <div style={{ fontSize: 12, opacity: 0.75 }}>
        Module: <strong>{project.modules.length}</strong>
        <br />
        Schema: {project.version} · {project.units}
        <br />
        Haus: {project.house.system} / Spannweite {project.house.span} · {project.house.floors} Geschoss
        <br />
        Dach: {project.house.roofType}
      </div>
      <button type="button" style={btnPrimary} onClick={() => downloadProjectJson(project)}>
        JSON herunterladen
      </button>
      <button
        type="button"
        style={btnStyle}
        onClick={() => fileRef.current?.click()}
      >
        JSON importieren…
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          const reader = new FileReader();
          reader.onload = () => {
            try {
              importFromJsonText(String(reader.result));
            } catch (err) {
              console.error(err);
              alert(err instanceof Error ? err.message : "Import fehlgeschlagen");
            }
          };
          reader.readAsText(f);
          e.target.value = "";
        }}
      />
      <button type="button" style={{ ...btnStyle, borderColor: "#854d0e" }} onClick={() => clearAll()}>
        Szene leeren
      </button>
    </div>
  );
}

const labelStyle: CSSProperties = { display: "flex", flexDirection: "column", gap: 6, fontSize: 12 };
const inputStyle: CSSProperties = {
  padding: "8px 10px",
  borderRadius: 8,
  border: "1px solid #475569",
  background: "#0f172a",
  color: "#e8eaed",
  fontSize: 14,
};
const btnStyle: CSSProperties = {
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #475569",
  background: "#1e293b",
  color: "#e8eaed",
  cursor: "pointer",
  fontSize: 13,
};
const btnPrimary: CSSProperties = {
  ...btnStyle,
  borderColor: "#166534",
  background: "#14532d",
};
