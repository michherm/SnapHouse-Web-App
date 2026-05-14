import * as THREE from "three";

/**
 * Gleiche Quaternion-Bildung wie `pc.Quat.prototype.setFromEulerAngles` (PlayCanvas engine),
 * siehe playcanvas/engine `src/core/math/quat.js` — Kommentar dort: erst X, dann Y′, dann Z″.
 * Winkel in **Grad** (wie `entity.setEulerAngles` im Konfigurator).
 */
export function quaternionFromPlaycanvasEulerDegrees(
  exDeg: number,
  eyDeg: number,
  ezDeg: number,
): THREE.Quaternion {
  const halfToRad = 0.5 * (Math.PI / 180);
  const ex = exDeg * halfToRad;
  const ey = eyDeg * halfToRad;
  const ez = ezDeg * halfToRad;

  const sx = Math.sin(ex);
  const cx = Math.cos(ex);
  const sy = Math.sin(ey);
  const cy = Math.cos(ey);
  const sz = Math.sin(ez);
  const cz = Math.cos(ez);

  const x = sx * cy * cz - cx * sy * sz;
  const y = cx * sy * cz + sx * cy * sz;
  const z = cx * cy * sz - sx * sy * cz;
  const w = cx * cy * cz + sx * sy * sz;

  return new THREE.Quaternion(x, y, z, w);
}
