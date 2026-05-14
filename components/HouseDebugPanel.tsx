"use client";

import type { CSSProperties } from "react";
import { useCallback, useMemo, useState } from "react";
import { useProjectStore } from "@/lib/projectStore";
import type { ModuleInstance, PlaycanvasPose } from "@/lib/types";
import { quaternionFromPlaycanvasEulerDegrees } from "@/lib/playcanvasRotation";

const labelStyle: CSSProperties = { display: "flex", flexDirection: "column", gap: 6, fontSize: 12 };
const btnStyle: CSSProperties = {
  padding: "8px 10px",
  borderRadius: 8,
  border: "1px solid #475569",
  background: "#0f172a",
  color: "#e8eaed",
  fontSize: 12,
  cursor: "pointer",
  fontWeight: 600,
};

function fileFromUrl(url: string): string {
  const i = url.lastIndexOf("/");
  return i >= 0 ? url.slice(i + 1) : url;
}

function poseSummary(p: PlaycanvasPose | undefined): string {
  if (!p?.positionM || !p?.rotationDeg) return "—";
  const { x, y, z } = p.positionM;
  const r = p.rotationDeg;
  return `P(${x.toFixed(2)},${y.toFixed(2)},${z.toFixed(2)}) R(${r.x},${r.y},${r.z})`;
}

function enrichForDebug(m: ModuleInstance) {
  const pose = m.parameters.playcanvasPose as PlaycanvasPose | undefined;
  let quaternionXyzw: { x: number; y: number; z: number; w: number } | null = null;
  if (
    pose?.rotationDeg &&
    typeof pose.rotationDeg.x === "number" &&
    typeof pose.rotationDeg.y === "number" &&
    typeof pose.rotationDeg.z === "number"
  ) {
    const q = quaternionFromPlaycanvasEulerDegrees(
      pose.rotationDeg.x,
      pose.rotationDeg.y,
      pose.rotationDeg.z,
    );
    quaternionXyzw = { x: q.x, y: q.y, z: q.z, w: q.w };
  }
  return { ...m, _debug: { quaternionXyzw } };
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function HouseDebugPanel() {
  const modules = useProjectStore((s) => s.project.modules);
  const selectedId = useProjectStore((s) => s.selectedInstanceId);
  const selectInstance = useProjectStore((s) => s.selectInstance);
  const [hint, setHint] = useState<string | null>(null);

  const selected = useMemo(
    () => modules.find((m) => m.instanceId === selectedId) ?? null,
    [modules, selectedId],
  );

  const selectedJson = useMemo(
    () => (selected ? JSON.stringify(enrichForDebug(selected), null, 2) : ""),
    [selected],
  );

  const allJson = useMemo(
    () => JSON.stringify(modules.map(enrichForDebug), null, 2),
    [modules],
  );

  const flash = useCallback((msg: string) => {
    setHint(msg);
    window.setTimeout(() => setHint(null), 2200);
  }, []);

  const onCopySelected = useCallback(async () => {
    if (!selectedJson) {
      flash("Nichts ausgewählt");
      return;
    }
    const ok = await copyText(selectedJson);
    flash(ok ? "Auswahl kopiert" : "Kopieren fehlgeschlagen");
  }, [selectedJson, flash]);

  const onCopyAll = useCallback(async () => {
    const ok = await copyText(allJson);
    flash(ok ? "Alle Module kopiert" : "Kopieren fehlgeschlagen");
  }, [allJson, flash]);

  const onDownloadModules = useCallback(() => {
    const blob = new Blob([allJson], { type: "application/json;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `snaphouse-modules-debug-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    flash("Download gestartet");
  }, [allJson, flash]);

  return (
    <details style={{ marginTop: 12 }}>
      <summary
        style={{
          cursor: "pointer",
          fontSize: 12,
          fontWeight: 600,
          color: "#94a3b8",
          userSelect: "none",
        }}
      >
        Montage-Debug (Posen / JSON)
      </summary>
      <div style={{ ...labelStyle, marginTop: 10, gap: 10 }}>
        <p style={{ fontSize: 11, lineHeight: 1.45, opacity: 0.75, margin: 0 }}>
          Klicke ein Modul in der Liste → Auswahl in der Szene. JSON enthält{" "}
          <code style={{ fontSize: 10 }}>playcanvasPose</code> und berechnetes{" "}
          <code style={{ fontSize: 10 }}>_debug.quaternionXyzw</code> (wie PlayCanvas{" "}
          <code style={{ fontSize: 10 }}>Quat.setFromEulerAngles</code>).
        </p>

        {hint ? (
          <div style={{ fontSize: 11, color: "#86efac" }} role="status">
            {hint}
          </div>
        ) : null}

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <button type="button" style={btnStyle} onClick={() => void onCopySelected()}>
            Auswahl kopieren
          </button>
          <button type="button" style={btnStyle} onClick={() => void onCopyAll()}>
            Alle Module kopieren
          </button>
          <button type="button" style={btnStyle} onClick={onDownloadModules}>
            modules-debug.json
          </button>
        </div>

        <div
          style={{
            maxHeight: 160,
            overflowY: "auto",
            border: "1px solid #334155",
            borderRadius: 8,
            fontSize: 10,
            fontFamily: "ui-monospace, monospace",
          }}
        >
          {modules.map((m) => {
            const active = m.instanceId === selectedId;
            const pose = m.parameters.playcanvasPose as PlaycanvasPose | undefined;
            return (
              <button
                key={m.instanceId}
                type="button"
                onClick={() => selectInstance(m.instanceId)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "6px 8px",
                  border: "none",
                  borderBottom: "1px solid #1e293b",
                  background: active ? "#1e3a5f" : "#0f172a",
                  color: "#e2e8f0",
                  cursor: "pointer",
                  fontSize: 10,
                  fontFamily: "inherit",
                }}
              >
                <span style={{ opacity: 0.65 }}>{m.moduleId}</span>
                <br />
                <span style={{ color: "#94a3b8" }}>{fileFromUrl(m.assetUrl)}</span>
                <br />
                <span style={{ color: "#64748b" }}>{poseSummary(pose)}</span>
              </button>
            );
          })}
        </div>

        {selected ? (
          <pre
            style={{
              margin: 0,
              maxHeight: 220,
              overflow: "auto",
              padding: 8,
              borderRadius: 8,
              background: "#020617",
              border: "1px solid #334155",
              fontSize: 10,
              lineHeight: 1.35,
              color: "#cbd5e1",
            }}
          >
            {selectedJson}
          </pre>
        ) : (
          <p style={{ fontSize: 11, opacity: 0.6, margin: 0 }}>Kein Modul ausgewählt.</p>
        )}
      </div>
    </details>
  );
}
