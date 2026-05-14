import { GRID_MM } from "./types";

const MM_PER_M = 1000;

/** Vertical spacing per storey (mm) until slab thickness is modelled. */
export const FLOOR_HEIGHT_MM = 3000;

/** Snap millimetre coordinate to nearest grid multiple. */
export function snapMmToGrid(mm: number): number {
  if (GRID_MM <= 0) return mm;
  return Math.round(mm / GRID_MM) * GRID_MM;
}

export function snapVec3Mm(v: { x: number; y: number; z: number }) {
  return {
    x: snapMmToGrid(v.x),
    y: snapMmToGrid(v.y),
    z: snapMmToGrid(v.z),
  };
}

/** JSON grid cell index from mm position (origin = 0). */
export function gridIndexFromMm(mm: number): number {
  return Math.round(mm / GRID_MM);
}

export function mmToMetres(mm: number): number {
  return mm / MM_PER_M;
}

export function metresToMm(m: number): number {
  return m * MM_PER_M;
}

/**
 * World centre (metres) from grid cell indices + mm offset + floor.
 * Horizontal: cell corner at (ix * cell, iz * cell), centre + half module + position offset.
 */
export function worldCentreFromInstance(instance: {
  floor: number;
  gridPosition: { x: number; y: number; z: number };
  position: { x: number; y: number; z: number };
  parameters: { width?: number; height?: number; depth?: number };
}): [number, number, number] {
  const cellM = mmToMetres(GRID_MM);
  const w = instance.parameters.width ?? GRID_MM;
  const h = instance.parameters.height ?? 2400;
  const d = instance.parameters.depth ?? 300;
  const ix = instance.gridPosition.x;
  const iz = instance.gridPosition.z;
  const baseX = ix * cellM + mmToMetres(w) / 2;
  const baseZ = iz * cellM + mmToMetres(d) / 2;
  const baseY = instance.floor * mmToMetres(FLOOR_HEIGHT_MM) + mmToMetres(h) / 2;
  return [
    baseX + mmToMetres(instance.position.x),
    baseY + mmToMetres(instance.position.y),
    baseZ + mmToMetres(instance.position.z),
  ];
}

/** Pick horizontal grid indices from world hit (metres) for a module of given width/depth (mm). */
export function gridIndicesFromWorldHit(
  worldX: number,
  worldZ: number,
  widthMm: number,
  depthMm: number,
): { ix: number; iz: number } {
  const ix = Math.round((metresToMm(worldX) - widthMm / 2) / GRID_MM);
  const iz = Math.round((metresToMm(worldZ) - depthMm / 2) / GRID_MM);
  return { ix, iz };
}

/** Raster-Indizes aus Modulmittelpunkt (Metre), passend zu `worldCentreFromInstance` bei position=(0,0,0). */
export function gridIndicesFromModuleCentreMetres(
  centreXM: number,
  centreZM: number,
  widthMm: number,
  depthMm: number,
): { ix: number; iz: number } {
  const cellM = mmToMetres(GRID_MM);
  if (cellM <= 0) return { ix: 0, iz: 0 };
  const ix = Math.round((centreXM - mmToMetres(widthMm) / 2) / cellM);
  const iz = Math.round((centreZM - mmToMetres(depthMm) / 2) / cellM);
  return { ix, iz };
}

export function degToRad(d: number): number {
  return (d * Math.PI) / 180;
}

export function radToDeg(r: number): number {
  return (r * 180) / Math.PI;
}

/** Snap world X or Z (metres) to nearest 600-mm grid line. */
export function snapMetresXZToGrid(coord: number): number {
  const cellM = mmToMetres(GRID_MM);
  if (cellM <= 0) return coord;
  return Math.round(coord / cellM) * cellM;
}
