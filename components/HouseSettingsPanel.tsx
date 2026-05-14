"use client";

import type { CSSProperties } from "react";
import { useProjectStore } from "@/lib/projectStore";
import { maxFloorsForSystem, SPANS_BY_SYSTEM, type WallHeightBand } from "@/lib/houseSettings";

const labelStyle: CSSProperties = { display: "flex", flexDirection: "column", gap: 6, fontSize: 12 };
const inputStyle: CSSProperties = {
  padding: "8px 10px",
  borderRadius: 8,
  border: "1px solid #475569",
  background: "#0f172a",
  color: "#e8eaed",
  fontSize: 13,
};
const selectStyle = { ...inputStyle, cursor: "pointer" } as const;

const bands: WallHeightBand[] = ["S", "M", "L", "XL"];

export function HouseSettingsPanel() {
  const house = useProjectStore((s) => s.project.house);
  const setHouse = useProjectStore((s) => s.setHouse);
  const buildPlaycanvasHouse = useProjectStore((s) => s.buildPlaycanvasHouse);
  const houseBuildMessages = useProjectStore((s) => s.houseBuildMessages);
  const houseBuilding = useProjectStore((s) => s.houseBuilding);
  const maxF = maxFloorsForSystem(house.system);
  const spans = SPANS_BY_SYSTEM[house.system];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
      <div style={{ fontSize: 12, opacity: 0.75, fontWeight: 600 }}>Haus (PlayCanvas houseState)</div>

      <label style={labelStyle}>
        System
        <select
          style={selectStyle}
          value={house.system}
          onChange={(e) => setHouse({ system: e.target.value as "250" | "200" })}
        >
          <option value="250">Skylark 250</option>
          <option value="200">Skylark 200</option>
        </select>
      </label>

      <label style={labelStyle}>
        Spannweite
        <select style={selectStyle} value={house.span} onChange={(e) => setHouse({ span: e.target.value })}>
          {spans.map((sp) => (
            <option key={sp} value={sp}>
              {sp}
            </option>
          ))}
        </select>
      </label>

      <label style={labelStyle}>
        Geschosse (max. {maxF})
        <select
          style={selectStyle}
          value={String(house.floors)}
          onChange={(e) => setHouse({ floors: Number(e.target.value) })}
        >
          {Array.from({ length: maxF }, (_, i) => i + 1).map((n) => (
            <option key={n} value={String(n)}>
              {n}
            </option>
          ))}
        </select>
      </label>

      <label style={labelStyle}>
        Wandhöhe EG
        <select
          style={selectStyle}
          value={house.wallHeights[0] ?? "XL"}
          onChange={(e) => {
            const v = e.target.value as WallHeightBand;
            const next = [...house.wallHeights];
            next[0] = v;
            setHouse({ wallHeights: next });
          }}
        >
          {bands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </label>

      {house.floors > 1 ? (
        <label style={labelStyle}>
          Wandhöhe 1. OG
          <select
            style={selectStyle}
            value={house.wallHeights[1] ?? "XL"}
            onChange={(e) => {
              const v = e.target.value as WallHeightBand;
              const next = [...house.wallHeights];
              next[1] = v;
              setHouse({ wallHeights: next });
            }}
          >
            {bands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <label style={labelStyle}>
        Dach
        <select
          style={selectStyle}
          value={house.roofType}
          onChange={(e) =>
            setHouse({
              roofType: e.target.value as typeof house.roofType,
            })
          }
        >
          <option value="saddle">Satteldach (42°)</option>
          <option value="flat10">Pult / 10°</option>
          <option value="flat">Flach</option>
          <option value="flat1">Flach (Variante 1)</option>
        </select>
      </label>

      <label style={labelStyle}>
        Länge (600-mm-Module)
        <input
          type="number"
          min={1}
          max={32}
          style={inputStyle}
          value={house.lengthModules}
          onChange={(e) => setHouse({ lengthModules: Number(e.target.value) || 1 })}
        />
      </label>

      <label style={{ ...labelStyle, flexDirection: "row", alignItems: "center", gap: 8 }}>
        <input
          type="checkbox"
          checked={house.includeBaseFloor}
          onChange={(e) => setHouse({ includeBaseFloor: e.target.checked })}
        />
        <span>EG-Boden / END (wie PlayCanvas)</span>
      </label>

      <button
        type="button"
        disabled={houseBuilding}
        onClick={() => void buildPlaycanvasHouse()}
        style={{
          ...inputStyle,
          cursor: houseBuilding ? "wait" : "pointer",
          fontWeight: 600,
          border: "1px solid #22c55e",
          background: houseBuilding ? "#1e3a2f" : "#14532d",
          color: "#ecfdf5",
          opacity: houseBuilding ? 0.75 : 1,
        }}
      >
        {houseBuilding ? "Messe GLBs & baue…" : "Haus bauen"}
      </button>

      {houseBuildMessages.length > 0 ? (
        <div
          role="status"
          style={{
            fontSize: 11,
            lineHeight: 1.45,
            padding: "8px 10px",
            borderRadius: 8,
            background: "#1e293b",
            border: "1px solid #334155",
            color: "#cbd5e1",
            whiteSpace: "pre-wrap",
          }}
        >
          {houseBuildMessages.join("\n")}
        </div>
      ) : null}

      <p style={{ fontSize: 10, lineHeight: 1.4, opacity: 0.55, margin: 0 }}>
        „Haus bauen“ lädt die GLBs, misst Bounding-Boxen wie PlayCanvas `_meas`, und setzt Boden, Enden, Wände, G42
        und Satteldach wie `_rebuildInner` (u. a. fD aus dem Boden-GLB, nicht aus der Länge in X). Beim ersten Klick
        kann es kurz dauern (Downloads). Flachdach/Pult: noch nicht portiert.
      </p>
    </div>
  );
}
