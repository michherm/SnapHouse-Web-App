"use client";

import type { CSSProperties } from "react";
import { useProjectStore } from "@/lib/projectStore";
import { G42_SEQ_200, G42_SEQ_250, S10_SEQ_250 } from "@/lib/playcanvasSequences";

const btnStyle: CSSProperties = {
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #475569",
  background: "#1e293b",
  color: "#e8eaed",
  cursor: "pointer",
  fontSize: 12,
  textAlign: "left",
};

export function PlaycanvasWallChains() {
  const house = useProjectStore((s) => s.project.house);
  const spawn = useProjectStore((s) => s.spawnPlaycanvasWallChain);
  const span = house.span;

  const hasG42_250 = Boolean(G42_SEQ_250[span]?.length);
  const hasG42_200 = Boolean(G42_SEQ_200[span]?.length);
  const hasS10 = Boolean(S10_SEQ_250[span]?.length);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 2 }}>PlayCanvas-Wandketten</div>
      <div style={{ fontSize: 11, opacity: 0.6, lineHeight: 1.4 }}>
        Spannweite: <strong>{span}</strong> (oben unter „Haus“). Ketten = Daten aus{" "}
        <code style={{ fontSize: 10 }}>snaphouse_konfigurator.js</code>.
        <br />
        Vertikale Lage der G42-Segmente orientiert sich an <strong>Wandhöhe EG</strong> (wie Plattenoberkante
        in PlayCanvas).
      </div>
      <button
        type="button"
        style={btnStyle}
        disabled={!hasG42_250}
        title={!hasG42_250 ? `Keine G42-250-Kette für „${span}“` : undefined}
        onClick={() => spawn("g42_250")}
      >
        G42-Kette 250 einfügen
      </button>
      <button
        type="button"
        style={btnStyle}
        disabled={!hasS10}
        title={!hasS10 ? `Keine S10-Kette für „${span}“` : undefined}
        onClick={() => spawn("s10_250")}
      >
        S10-Kette 250 (Pult 10°) einfügen
      </button>
      <button
        type="button"
        style={btnStyle}
        disabled={!hasG42_200}
        title={!hasG42_200 ? `Keine G42-200-Kette für „${span}“` : undefined}
        onClick={() => spawn("g42_200")}
      >
        G42-Kette 200 einfügen
      </button>
    </div>
  );
}
