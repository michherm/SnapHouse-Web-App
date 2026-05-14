"use client";

/**
 * Bounding-Box wie `WHKonf.prototype._meas` in snaphouse_konfigurator.js:
 * Modell wird bei (0,0,0) mit `setEulerAngles(rx, ry, rz)` ausgerichtet (Grad),
 * dann wird eine **axis-aligned** Box über das gesamte Mesh gebildet.
 *
 * PlayCanvas misst pro MeshInstance-AABB; `THREE.Box3.setFromObject` ist dazu
 * in der Praxis gleichwertig genug für die Bau-Geometrie.
 */

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { quaternionFromPlaycanvasEulerDegrees } from "./playcanvasRotation";

export type GlbAabb = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
};

const cache = new Map<string, GlbAabb>();

/** Cache-Version erhöhen, wenn Mess-Geometrie (Quaternion) geändert wird. */
const MEASURE_CACHE_VER = "pc-quat-v1";

function cacheKey(url: string, rx: number, ry: number, rz: number): string {
  return `${MEASURE_CACHE_VER}|${url}|${rx}|${ry}|${rz}`;
}

export function clearGlbMeasureCache(): void {
  cache.clear();
}

export async function measureGlbLikePlaycanvas(
  url: string,
  rxDeg: number,
  ryDeg: number,
  rzDeg = 0,
): Promise<GlbAabb> {
  const k = cacheKey(url, rxDeg, ryDeg, rzDeg);
  const hit = cache.get(k);
  if (hit) return hit;

  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      url,
      (gltf) => {
        const root = gltf.scene.clone();
        root.position.set(0, 0, 0);
        root.scale.set(1, 1, 1);
        root.quaternion.copy(quaternionFromPlaycanvasEulerDegrees(rxDeg, ryDeg, rzDeg));
        root.updateMatrixWorld(true);
        const box = new THREE.Box3().setFromObject(root);
        if (!Number.isFinite(box.min.x) || box.isEmpty()) {
          reject(new Error(`Leere oder ungültige Bounding-Box: ${url}`));
          return;
        }
        const r: GlbAabb = {
          minX: box.min.x,
          maxX: box.max.x,
          minY: box.min.y,
          maxY: box.max.y,
          minZ: box.min.z,
          maxZ: box.max.z,
        };
        cache.set(k, r);
        resolve(r);
      },
      undefined,
      (err) => {
        reject(err instanceof Error ? err : new Error(String(err)));
      },
    );
  });
}
