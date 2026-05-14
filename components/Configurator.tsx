"use client";

import dynamic from "next/dynamic";
import { Toolbar } from "@/components/Toolbar";
import { ProjectControls } from "@/components/ProjectControls";
import { HouseSettingsPanel } from "@/components/HouseSettingsPanel";
import { PlaycanvasWallChains } from "@/components/PlaycanvasWallChains";
import { HouseDebugPanel } from "@/components/HouseDebugPanel";

const Scene = dynamic(() => import("@/components/Scene").then((m) => m.Scene), { ssr: false });

export function Configurator() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "240px 1fr 280px",
        height: "100vh",
        gap: 0,
      }}
    >
      <aside
        style={{
          borderRight: "1px solid #334155",
          padding: 16,
          background: "#111827",
          overflowY: "auto",
        }}
      >
        <h1 style={{ fontSize: 16, margin: "0 0 12px", fontWeight: 700 }}>SnapHouse</h1>
        <HouseSettingsPanel />
        <div style={{ height: 1, background: "#334155", margin: "12px 0" }} />
        <Toolbar />
        <div style={{ height: 1, background: "#334155", margin: "12px 0" }} />
        <PlaycanvasWallChains />
        <HouseDebugPanel />
      </aside>
      <main style={{ position: "relative", minHeight: 0 }}>
        <Scene />
      </main>
      <aside
        style={{
          borderLeft: "1px solid #334155",
          padding: 16,
          background: "#111827",
          overflowY: "auto",
        }}
      >
        <h2 style={{ fontSize: 14, margin: "0 0 12px", fontWeight: 600 }}>Projekt</h2>
        <ProjectControls />
      </aside>
    </div>
  );
}
