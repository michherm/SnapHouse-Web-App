import type { Vector3Tuple } from "three";
import type { HouseSettings } from "./houseSettings";

/** Millimetres in project JSON (WikiHouse-style 600 mm grid). */
export const GRID_MM = 600;

export type Vec3 = { x: number; y: number; z: number };

export type ModuleParameters = {
  width?: number;
  height?: number;
  depth?: number;
  [key: string]: unknown;
};

/** One placed module — matches migration target schema. */
export type ModuleInstance = {
  instanceId: string;
  moduleId: string;
  assetUrl: string;
  position: Vec3;
  rotation: Vec3;
  scale: Vec3;
  floor: number;
  gridPosition: Vec3;
  parameters: ModuleParameters;
  moduleVersion: string;
};

export type SnapHouseProject = {
  projectName: string;
  version: string;
  units: "mm";
  modules: ModuleInstance[];
  /** Hausparameter (PlayCanvas `snaphouse_houseState.js`). */
  house: HouseSettings;
};

/** Catalogue entry — lazy GLB later; placeholder uses primitive mesh. */
export type ModuleDefinition = {
  moduleId: string;
  label: string;
  assetUrl: string;
  /** Default size in mm when no parameters */
  defaultSizeMm: Vec3;
  moduleVersion: string;
};

/** Three.js world: metres. */
export type WorldModule = ModuleInstance & {
  /** Runtime: metres for R3F */
  worldPosition: Vector3Tuple;
  worldRotationRad: Vector3Tuple;
  worldScale: Vector3Tuple;
};
