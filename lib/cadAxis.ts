/**
 * Architektur/CAD ↔ PlayCanvas / Three.js (beide Y hoch, gleiche lineare Abbildung).
 *
 * CAD: X = Breite, Y = Tiefe (Plan), Z = Höhe
 * PlayCanvas / Three: X = Breite, Y = Höhe, Z = Tiefe
 *
 * Keine Euler-90°-Korrektur — nur Komponenten-Tausch Y↔Z wie vereinbart.
 * Interne SnapHouse-Bau-JSONs und GLB-Messungen liegen bereits in „PlayCanvas“-Raum;
 * diese Funktionen nur für echte CAD-Importe verwenden.
 */

export type Vec3Like = { x: number; y: number; z: number };

export function cadMetresToPlayCanvas(cad: Vec3Like): Vec3Like {
  return { x: cad.x, y: cad.z, z: cad.y };
}

export function playCanvasMetresToCad(pc: Vec3Like): Vec3Like {
  return { x: pc.x, y: pc.z, z: pc.y };
}

/** Richtung / Versatz — gleiche lineare Abbildung wie Position. */
export const cadDirectionToPlayCanvas = cadMetresToPlayCanvas;

/** Ausdehnungen entlang CAD-Achsen → (Breite, Höhe, Tiefe) in Engine-Komponenten. */
export function cadExtentsMetresToPlayCanvas(
  extAlongCadX: number,
  extAlongCadY: number,
  extAlongCadZ: number,
): Vec3Like {
  return { x: extAlongCadX, y: extAlongCadZ, z: extAlongCadY };
}
