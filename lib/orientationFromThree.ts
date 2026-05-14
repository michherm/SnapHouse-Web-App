import * as THREE from "three";
import { radToDeg } from "./snap";

/** Euler in Grad, Reihenfolge XYZ (Three.js), für Rücklesen aus dem Gizmo — nicht 1:1 PlayCanvas-Winkel, aber gleiche Orientierung. */
export function eulerDegXYZFromQuaternion(q: THREE.Quaternion): { x: number; y: number; z: number } {
  const e = new THREE.Euler().setFromQuaternion(q, "XYZ");
  return { x: radToDeg(e.x), y: radToDeg(e.y), z: radToDeg(e.z) };
}
