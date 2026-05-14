import { glb200, glb250 } from "./modulePaths";
import type { ModuleInstance } from "./types";
import { newInstanceId, normalizeModule } from "./importProject";
import type { WallChainEntry } from "./playcanvasSequences";

function assetUrlForFilename(filename: string): string {
  return filename.includes("SKYLARK200") ? glb200(filename) : glb250(filename);
}

/** S10-Ketten haben in PlayCanvas keine Euler-Felder — typische Südwand wie G42-Start. */
function rotationForEntry(e: WallChainEntry): { x: number; y: number; z: number } {
  if (e.rx != null && e.ry != null && e.rz != null) return { x: e.rx, y: e.ry, z: e.rz };
  return { x: 270, y: 270, z: 0 };
}

/**
 * Eine PlayCanvas-Wandkette als Modul-Liste (gleiche Rasterzelle, `pz` → mm in position.z).
 */
export function moduleInstancesFromWallChain(
  entries: WallChainEntry[],
  opts: {
    floor: number;
    gridPosition: { x: number; y: number; z: number };
  },
): ModuleInstance[] {
  const { floor, gridPosition } = opts;
  return entries.map((e) =>
    normalizeModule({
      instanceId: newInstanceId(),
      moduleId: `playcanvas_${(e.ck ?? e.name.replace(/\.glb$/i, "")).replace(/[^a-zA-Z0-9_]/g, "_")}`,
      assetUrl: assetUrlForFilename(e.name),
      position: { x: 0, y: 0, z: Math.round(e.pz * 1000) },
      rotation: rotationForEntry(e),
      scale: { x: 1, y: 1, z: 1 },
      floor,
      gridPosition: { ...gridPosition },
      parameters: { width: 600, height: 2400, depth: 300 },
      moduleVersion: "1.0.0",
    }),
  );
}
