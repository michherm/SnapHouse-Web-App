/**
 * Synchroner Nachbau der PlayCanvas-Logik aus `WHKonf.prototype._rebuildInner`
 * (snaphouse_konfigurator.js, ab Zeile ~1277).
 *
 * **Gleiche Regeln wie dort:**
 * - FLOOR_Y / END_W je System (250 vs 200)
 * - PLATFORMS_* + WALL_DATA für Dateinamen
 * - Bodenfliesen: `_spawnAt(fa,-90,0, xOff-fm.minX+i*fW, -fm.minY, -fm.minZ)`
 * - Enden, Ecken (cDefs), Wände (Süd/Nord, West/Ost), `syncBuildRefs`-Werte für wPX/wPX2
 * - G42: `nextG42` + `spawnG42b` mit exakt denselben Euler-Formeln
 * - Satteldach: Doppelreihe `setEulerAngles(270,270+dry,0)` / `(270,90+dry,0)` mit `_off`
 *
 * **Abweichung zu PlayCanvas:** PlayCanvas misst GLB-Bounding-Boxes zur Laufzeit (`_meas`).
 * Hier nutzen wir **fest codierte AABB** (`SYNTH_BOUNDS`), die zu den 600-mm-Rastern und
 * typischen Skylark-GLBs passen — bitte bei Abweichungen anpassen (oder später GLB-Messung).
 */

import type { ModuleInstance } from "./types";
import type { HouseSettings } from "./houseSettings";
import { wallHeightBandToMm, type WallHeightBand } from "./houseSettings";
import { newInstanceId, normalizeModule } from "./importProject";
import { glb200, glb250 } from "./modulePaths";
import { PLATFORMS_200, PLATFORMS_250, WALL_DATA } from "./playcanvasPlatformsCatalog";
import { G42_SEQ_200, G42_SEQ_250, type WallChainEntry } from "./playcanvasSequences";

/** Bounding-Box in Metern (PlayCanvas: min/max aus Mesh). */
type BBox = { minX: number; maxX: number; minY: number; maxY: number; minZ: number; maxZ: number };

/**
 * Synthetische Bounds — gleiche Nutzung wie `fm`, `wm`, `wcm` in `_rebuildInner`.
 * Wandhöhe wird über `wallH_m` für die vertikale Ausdehnung der Wand-/Ecken-GLBs gesetzt.
 */
function synthBounds(wallH_m: number): { fm: BBox; wm: BBox; wcm: BBox; cm: BBox; em: BBox } {
  const w = 0.6;
  const d = 0.6;
  const fm: BBox = { minX: 0, maxX: w, minY: -0.02, maxY: 0, minZ: 0, maxZ: 0 };
  const wm: BBox = { minX: -w, maxX: 0, minY: -wallH_m, maxY: 0, minZ: -d / 2, maxZ: d / 2 };
  const wcm: BBox = { minX: 0, maxX: w, minY: -wallH_m, maxY: 0, minZ: -d / 2, maxZ: d / 2 };
  const cm: BBox = { minX: -w, maxX: 0, minY: -wallH_m, maxY: 0, minZ: -d / 2, maxZ: d / 2 };
  const em: BBox = { minX: -w, maxX: 0, minY: -0.12, maxY: 0, minZ: -d / 2, maxZ: d / 2 };
  return { fm, wm, wcm, cm, em };
}

function urlFor(sys: "250" | "200", file: string): string {
  return file.includes("SKYLARK200") ? glb200(file) : glb250(file);
}

/** Wie `_spawnAt`: `setEulerAngles(rx, ry, 0)` in Grad. */
function spawnAt(
  sys: "250" | "200",
  file: string,
  rx: number,
  ry: number,
  px: number,
  py: number,
  pz: number,
  suffix: string,
  heightMm: number,
): ModuleInstance {
  const url = urlFor(sys, file);
  return normalizeModule({
    instanceId: newInstanceId(),
    moduleId: `pc_spawn_${suffix}`,
    assetUrl: url,
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: rx, y: ry, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    floor: 0,
    gridPosition: { x: 0, y: 0, z: 0 },
    parameters: {
      width: 600,
      height: heightMm,
      depth: 600,
      playcanvasPose: {
        positionM: { x: px, y: py, z: pz },
        rotationDeg: { x: rx, y: ry, z: 0 },
      },
    },
    moduleVersion: "1.0.0",
  });
}

/** Wie `nextG42` / `spawnG42b`: volle Euler in Grad. */
function spawnG42Piece(
  sys: "250" | "200",
  file: string,
  rx: number,
  ry: number,
  rz: number,
  px: number,
  py: number,
  pz: number,
  suffix: string,
  heightMm: number,
): ModuleInstance {
  const url = urlFor(sys, file);
  return normalizeModule({
    instanceId: newInstanceId(),
    moduleId: `pc_g42_${suffix}`,
    assetUrl: url,
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: rx, y: ry, z: rz },
    scale: { x: 1, y: 1, z: 1 },
    floor: 0,
    gridPosition: { x: 0, y: 0, z: 0 },
    parameters: {
      width: 600,
      height: heightMm,
      depth: 600,
      playcanvasPose: {
        positionM: { x: px, y: py, z: pz },
        rotationDeg: { x: rx, y: ry, z: rz },
      },
    },
    moduleVersion: "1.0.0",
  });
}

function roofPiece(
  sys: "250" | "200",
  file: string,
  rx: number,
  ry: number,
  rz: number,
  px: number,
  py: number,
  pz: number,
  suffix: string,
): ModuleInstance {
  const url = urlFor(sys, file);
  return normalizeModule({
    instanceId: newInstanceId(),
    moduleId: `pc_roof_${suffix}`,
    assetUrl: url,
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: rx, y: ry, z: rz },
    scale: { x: 1, y: 1, z: 1 },
    floor: 0,
    gridPosition: { x: 0, y: 0, z: 0 },
    parameters: {
      width: 600,
      height: 400,
      depth: 600,
      playcanvasPose: {
        positionM: { x: px, y: py, z: pz },
        rotationDeg: { x: rx, y: ry, z: rz },
      },
    },
    moduleVersion: "1.0.0",
  });
}

export type BuildHouseResult = {
  ok: boolean;
  modules: ModuleInstance[];
  warnings: string[];
};

/**
 * EG + Satteldach + G42 wie `_rebuildInner` (eine Etage, kein `spawnUpperFloors`-OG-Loop).
 * `flat` / `flat1` / `flat10` / mehrere Geschosse: Hinweis in `warnings`.
 */
export function buildHouseFromHouseSettings(house: HouseSettings): BuildHouseResult {
  const warnings: string[] = [];
  if (house.floors > 1) {
    warnings.push(
      "Hinweis: Mehrgeschoss-Bau (spawnUpperFloors) ist in PlayCanvas umfangreich — hier aktuell nur EG wie bei _etagen===1.",
    );
  }
  if (house.roofType === "flat10") {
    warnings.push("Hinweis: Pultdach flat10 (spawnPultWalls) folgt in einem späteren Schritt — aktuell nicht gebaut.");
    return { ok: false, modules: [], warnings };
  }
  if (house.roofType === "flat" || house.roofType === "flat1") {
    warnings.push("Hinweis: Flachdach-Zweig (spawnRoof flat) noch nicht vollständig portiert.");
    return { ok: false, modules: [], warnings };
  }

  const sys = house.system;
  const FLOOR_Y = sys === "200" ? 0.282 : 0.38;
  const END_W = sys === "200" ? 0.268 : 0.3182;

  const plat = sys === "200" ? PLATFORMS_200[house.span] : PLATFORMS_250[house.span];
  if (!plat) {
    return { ok: false, modules: [], warnings: [`Unbekannte Spannweite „${house.span}“ für System ${sys}.`] };
  }

  const band = (house.wallHeights[0] ?? "XL") as WallHeightBand;
  const wallDat = WALL_DATA[sys][band] ?? WALL_DATA[sys].XL;
  const wallH_m = wallHeightBandToMm(band) / 1000;
  const wallH_mm = Math.round(wallHeightBandToMm(band));
  /** Nur für Platzhalter-Bounding — echte GLBs skalieren 1:1. */
  const floorSlabMm = 80;
  const endPieceMm = 120;
  const { fm, wm, wcm, cm, em } = synthBounds(wallH_m);

  const nFloor = Math.max(1, Math.min(32, house.lengthModules));
  const xOff = 0;
  const fW = fm.maxX - fm.minX;
  const fD = 2 * END_W + nFloor * (wm.maxZ - wm.minZ);
  fm.maxZ = fD;
  const totalW = fW * nFloor;

  const out: ModuleInstance[] = [];
  let idx = 0;
  const next = () => `b${idx++}`;

  if (house.includeBaseFloor) {
    for (let i = 0; i < nFloor; i++) {
      out.push(
        spawnAt(
          sys,
          plat.floor,
          -90,
          0,
          xOff - fm.minX + i * fW,
          -fm.minY,
          -fm.minZ,
          next(),
          floorSlabMm,
        ),
      );
    }
    out.push(
      spawnAt(sys, plat.end, -90, 0, xOff - em.maxX, -em.minY, -em.minZ, next(), endPieceMm),
    );
    out.push(
      spawnAt(
        sys,
        plat.end,
        -90,
        180,
        xOff + totalW - em.minX,
        -em.minY,
        -em.minZ,
        next(),
        endPieceMm,
      ),
    );
  }

  const cDefs: { ry: number; ox: (m: BBox) => number; oz: (m: BBox) => number }[] = [
    { ry: 90, ox: (m) => xOff - m.maxX, oz: (m) => -m.maxZ + END_W },
    { ry: 0, ox: (m) => xOff + totalW - m.minX, oz: (m) => -m.maxZ + END_W },
    { ry: 270, ox: (m) => xOff + totalW - m.minX, oz: (m) => fD - m.minZ - END_W },
    { ry: 180, ox: (m) => xOff - m.maxX, oz: (m) => fD - m.minZ - END_W },
  ];
  const cornerFile = wallDat.corner;
  for (const cd of cDefs) {
    out.push(
      spawnAt(
        sys,
        cornerFile,
        90,
        cd.ry,
        cd.ox(cm),
        FLOOR_Y - cm.minY,
        cd.oz(cm),
        next(),
        wallH_mm,
      ),
    );
  }

  const wD = wm.maxZ - wm.minZ;
  const wPY = FLOOR_Y - wm.minY;
  const nWalls = Math.round((fD - 2 * END_W) / wD);
  for (let i = 0; i < nWalls; i++) {
    out.push(
      spawnAt(
        sys,
        wallDat.wall,
        90,
        90,
        xOff - wm.maxX,
        wPY,
        END_W - wm.minZ + i * wD,
        next(),
        wallH_mm,
      ),
    );
  }
  for (let i = 0; i < nWalls; i++) {
    out.push(
      spawnAt(
        sys,
        wallDat.wall,
        90,
        270,
        xOff + totalW - wm.minX,
        wPY,
        END_W - wm.minZ + i * wD,
        next(),
        wallH_mm,
      ),
    );
  }

  const wDx = wcm.maxX - wcm.minX;
  const wPYc = FLOOR_Y - wcm.minY;
  const nWallsX = Math.round(totalW / wDx);
  const zFront = -wcm.maxZ + END_W;
  const zBack = fD - wcm.minZ - END_W;
  for (let i = 0; i < nWallsX; i++) {
    out.push(
      spawnAt(sys, wallDat.wall, 90, 0, xOff - wcm.minX + i * wDx, wPYc, zFront, next(), wallH_mm),
    );
    out.push(
      spawnAt(
        sys,
        wallDat.wall,
        90,
        180,
        xOff + totalW - wcm.minX - i * wDx,
        wPYc,
        zBack + END_W,
        next(),
        wallH_mm,
      ),
    );
  }

  const wallTop = (FLOOR_Y - wm.minY) + wm.maxY;
  const finalTop = wallTop;
  const wPX = xOff - wm.maxX;
  const wPX2 = xOff + totalW - wm.minX + END_W;

  const seq: WallChainEntry[] =
    sys === "200" ? (G42_SEQ_200[house.span] ?? []) : (G42_SEQ_250[house.span] ?? []);
  if (house.roofType === "saddle" && seq.length) {
    for (let gi = 0; gi < seq.length; gi++) {
      const d = seq[gi];
      out.push(
        spawnG42Piece(
          sys,
          d.name,
          d.rx ?? 270,
          d.ry ?? 270,
          d.rz ?? 0,
          wPX,
          finalTop - 0.016,
          d.pz,
          `g42a_${gi}_${d.ck ?? gi}`,
          wallH_mm,
        ),
      );
    }
    for (let gi2 = 0; gi2 < seq.length; gi2++) {
      const d2 = seq[gi2];
      const rx2 = d2.rx === 0 ? 0 : (d2.rx ?? 270);
      const ry2 = (d2.ry ?? 270) + 180;
      const rz2 = d2.rx === 0 ? (d2.rz ?? 0) + 180 : (d2.rz ?? 0);
      out.push(
        spawnG42Piece(
          sys,
          d2.name,
          rx2,
          ry2,
          rz2,
          wPX2,
          finalTop - 0.016,
          fD - d2.pz,
          `g42b_${gi2}_${d2.ck ?? gi2}`,
          wallH_mm,
        ),
      );
    }
  }

  const roofName = plat.roof;
  const o0 = { dpx: 0.6, dpy: -0.018, dpz: 0, dry: 270 };
  const o1 = { dpx: -0.6, dpy: -0.018, dpz: 0, dry: 270 };
  for (let ri = 0; ri < nWallsX; ri++) {
    out.push(
      roofPiece(
        sys,
        roofName,
        270,
        270 + o0.dry,
        0,
        xOff - wcm.minX + ri * wDx + o0.dpx,
        finalTop + o0.dpy,
        zFront + o0.dpz,
        `roofL_${ri}`,
      ),
    );
    out.push(
      roofPiece(
        sys,
        roofName,
        270,
        90 + o1.dry,
        0,
        xOff + totalW - wcm.minX - ri * wDx + o1.dpx,
        finalTop + o1.dpy,
        zBack + END_W + o1.dpz,
        `roofR_${ri}`,
      ),
    );
  }

  warnings.push(
    `Gebaut: System ${sys}, Span ${house.span}, ${nFloor}×600 mm, Satteldach, Wandhöhe ${band} (~${wallH_m.toFixed(2)} m). GLB-Bounds sind synthetisch — bei Abweichung zu PlayCanvas Messpunkte nachziehen.`,
  );
  return { ok: true, modules: out, warnings };
}
