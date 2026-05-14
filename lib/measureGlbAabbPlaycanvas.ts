"use client";

/**
 * Bounding-Box wie `WHKonf.prototype._meas` in snaphouse_konfigurator.js:
 * Entity bei (0,0,0), `setEulerAngles(rx, ry, rz)` (hier: gleiche Quaternion wie PlayCanvas),
 * dann pro **Render-Mesh** die AABB in Weltkoordinaten und min/max vereinigen —
 * entspricht dem Durchlauf über `meshInstances` / `aabb` in PlayCanvas besser als
 * ein einzelnes `setFromObject(root)` (bei tief verschachtelten GLBs kann das abweichen).
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

/** Cache-Version erhöhen, wenn Mess-Geometrie geändert wird. */
const MEASURE_CACHE_VER = "pc-mesh-union-v1";

function cacheKey(url: string, rx: number, ry: number, rz: number): string {
  return `${MEASURE_CACHE_VER}|${url}|${rx}|${ry}|${rz}`;
}

export function clearGlbMeasureCache(): void {
  cache.clear();
}

function unionMeshWorldBounds(root: THREE.Object3D): THREE.Box3 {
  const box = new THREE.Box3();
  let any = false;
  root.updateMatrixWorld(true);
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh || !mesh.geometry) return;
    const geom = mesh.geometry;
    if (!geom.getAttribute("position") || geom.getAttribute("position")!.count === 0) return;
    if (!geom.boundingBox) geom.computeBoundingBox();
    const local = geom.boundingBox;
    if (!local || local.isEmpty()) return;
    const tmp = local.clone();
    tmp.applyMatrix4(mesh.matrixWorld);
    if (!any) {
      box.copy(tmp);
      any = true;
    } else {
      box.union(tmp);
    }
  });
  if (!any) {
    box.setFromObject(root);
  }
  return box;
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
        const box = unionMeshWorldBounds(root);
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
