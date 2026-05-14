import type { ModuleDefinition } from "./types";
import { glb200, glb250 } from "./modulePaths";

/**
 * Katalog — Pfade passend zu:
 * `public/modules/SKYLARK250_Export_GLB/GLB/*.glb`
 * `public/modules/SKYLARK200_Export_GLB/GLB/*.glb`
 *
 * Namensliste: `docs/migration-sicherung-2026-05-09.md`
 */
export const MODULE_CATALOG: ModuleDefinition[] = [
  {
    moduleId: "wall_060_standard",
    label: "Wand 600 (→ 250 M)",
    assetUrl: glb250("SKYLARK250_WALL_M.glb"),
    defaultSizeMm: { x: 600, y: 2400, z: 300 },
    moduleVersion: "1.0.0",
  },
  { moduleId: "SKYLARK250_WALL_S", label: "250 Wand S", assetUrl: glb250("SKYLARK250_WALL_S.glb"), defaultSizeMm: { x: 600, y: 2400, z: 300 }, moduleVersion: "1.0.0" },
  { moduleId: "SKYLARK250_WALL_M", label: "250 Wand M", assetUrl: glb250("SKYLARK250_WALL_M.glb"), defaultSizeMm: { x: 600, y: 2400, z: 300 }, moduleVersion: "1.0.0" },
  { moduleId: "SKYLARK250_WALL_L", label: "250 Wand L", assetUrl: glb250("SKYLARK250_WALL_L.glb"), defaultSizeMm: { x: 600, y: 2700, z: 300 }, moduleVersion: "1.0.0" },
  { moduleId: "SKYLARK250_WALL_XL", label: "250 Wand XL", assetUrl: glb250("SKYLARK250_WALL_XL.glb"), defaultSizeMm: { x: 600, y: 3000, z: 300 }, moduleVersion: "1.0.0" },
  { moduleId: "SKYLARK250_CORNER_M", label: "250 Ecke M", assetUrl: glb250("SKYLARK250_CORNER_M.glb"), defaultSizeMm: { x: 600, y: 2400, z: 600 }, moduleVersion: "1.0.0" },
  { moduleId: "SKYLARK250_CORNER_L", label: "250 Ecke L", assetUrl: glb250("SKYLARK250_CORNER_L.glb"), defaultSizeMm: { x: 600, y: 2700, z: 600 }, moduleVersion: "1.0.0" },
  { moduleId: "SKYLARK250_CORNER_XL", label: "250 Ecke XL", assetUrl: glb250("SKYLARK250_CORNER_XL.glb"), defaultSizeMm: { x: 600, y: 3000, z: 600 }, moduleVersion: "1.0.0" },
  { moduleId: "SKYLARK200_WALL_S", label: "200 Wand S", assetUrl: glb200("SKYLARK200_WALL_S.glb"), defaultSizeMm: { x: 600, y: 2400, z: 300 }, moduleVersion: "1.0.0" },
  { moduleId: "SKYLARK200_WALL_M", label: "200 Wand M", assetUrl: glb200("SKYLARK200_WALL_M.glb"), defaultSizeMm: { x: 600, y: 2400, z: 300 }, moduleVersion: "1.0.0" },
];

export function getModuleDefinition(moduleId: string): ModuleDefinition | undefined {
  return MODULE_CATALOG.find((m) => m.moduleId === moduleId);
}
