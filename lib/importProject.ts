import type { SnapHouseProject, ModuleInstance } from "./types";
import { GRID_MM } from "./types";
import { defaultHouseSettings, mergeHouseFromUnknown } from "./houseSettings";

const SCHEMA_VERSION = "1.0.0";

function isVec3(v: unknown): v is { x: number; y: number; z: number } {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return typeof o.x === "number" && typeof o.y === "number" && typeof o.z === "number";
}

function isModuleInstance(m: unknown): m is ModuleInstance {
  if (!m || typeof m !== "object") return false;
  const o = m as Record<string, unknown>;
  return (
    typeof o.instanceId === "string" &&
    typeof o.moduleId === "string" &&
    typeof o.assetUrl === "string" &&
    isVec3(o.position) &&
    isVec3(o.rotation) &&
    isVec3(o.scale) &&
    typeof o.floor === "number" &&
    isVec3(o.gridPosition) &&
    typeof o.parameters === "object" &&
    o.parameters != null &&
    typeof o.moduleVersion === "string"
  );
}

export function parseProjectJson(text: string): SnapHouseProject {
  const data = JSON.parse(text) as unknown;
  if (!data || typeof data !== "object") throw new Error("Invalid JSON: root must be an object");
  const root = data as Record<string, unknown>;
  if (typeof root.projectName !== "string") throw new Error("Missing projectName");
  if (typeof root.version !== "string") throw new Error("Missing version");
  if (root.units !== "mm") throw new Error('units must be "mm"');
  if (!Array.isArray(root.modules)) throw new Error("modules must be an array");
  const modules = root.modules.filter(isModuleInstance);
  if (modules.length !== root.modules.length) throw new Error("One or more module entries are invalid");
  return {
    projectName: root.projectName,
    version: root.version,
    units: "mm",
    modules,
    house: mergeHouseFromUnknown(root.house),
  };
}

export function serializeProject(project: SnapHouseProject): string {
  return JSON.stringify(
    {
      projectName: project.projectName,
      version: project.version,
      units: project.units,
      modules: project.modules,
      house: project.house,
    },
    null,
    2,
  );
}

export function emptyProject(name: string): SnapHouseProject {
  return {
    projectName: name,
    version: SCHEMA_VERSION,
    units: "mm",
    modules: [],
    house: defaultHouseSettings(),
  };
}

export function newInstanceId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return `mod_${crypto.randomUUID()}`;
  return `mod_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/** Ensure grid indices are integers after import. */
export function normalizeModule(m: ModuleInstance): ModuleInstance {
  return {
    ...m,
    gridPosition: {
      x: Math.round(m.gridPosition.x),
      y: Math.round(m.gridPosition.y),
      z: Math.round(m.gridPosition.z),
    },
    parameters: {
      ...m.parameters,
      width: m.parameters.width ?? GRID_MM,
      height: m.parameters.height ?? 2400,
      depth: m.parameters.depth ?? 300,
    },
  };
}
