import { create } from "zustand";
import type { ModuleInstance, SnapHouseProject } from "./types";
import { getModuleDefinition } from "./modules";
import { emptyProject, newInstanceId, normalizeModule, parseProjectJson } from "./importProject";
import { snapVec3Mm } from "./snap";
import type { HouseSettings } from "./houseSettings";
import { clampHouseToRules } from "./houseSettings";
import { G42_SEQ_200, G42_SEQ_250, S10_SEQ_250 } from "./playcanvasSequences";
import { moduleInstancesFromWallChain } from "./spawnWallChainFromPlaycanvas";
import { wallHeightBandToMm } from "./houseSettings";
import { buildHouseFromHouseSettingsAsync } from "./buildHousePlaycanvas";

type Store = {
  project: SnapHouseProject;
  selectedInstanceId: string | null;
  /** Während GLB-Messung + Montage (async). */
  houseBuilding: boolean;
  /** Nach „Haus bauen“: Meldungen / Hinweise. */
  houseBuildMessages: string[];
  setProjectName: (name: string) => void;
  setHouse: (patch: Partial<HouseSettings>) => void;
  selectInstance: (id: string | null) => void;
  addModule: (moduleId: string) => void;
  duplicateSelected: () => void;
  removeSelected: () => void;
  rotateSelectedY90: () => void;
  moveSelectedToGrid: (ix: number, iz: number) => void;
  /** Wandkette aus PlayCanvas-Katalog (`snaphouse_konfigurator.js`), Spannenweite = aktuelles `house.span`. */
  spawnPlaycanvasWallChain: (kind: "g42_250" | "s10_250" | "g42_200") => void;
  /** Ersetzt alle Module: GLBs messen wie `_meas`, dann `_rebuildInner` (Satteldach, EG). */
  buildPlaycanvasHouse: () => Promise<void>;
  importFromJsonText: (text: string) => void;
  clearAll: () => void;
};
function defaultInstance(moduleId: string): ModuleInstance | null {
  const def = getModuleDefinition(moduleId);
  if (!def) return null;
  const { width, height, depth } = {
    width: def.defaultSizeMm.x,
    height: def.defaultSizeMm.y,
    depth: def.defaultSizeMm.z,
  };
  return normalizeModule({
    instanceId: newInstanceId(),
    moduleId: def.moduleId,
    assetUrl: def.assetUrl,
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    floor: 0,
    gridPosition: { x: 0, y: 0, z: 0 },
    parameters: { width, height, depth },
    moduleVersion: def.moduleVersion,
  });
}

export const useProjectStore = create<Store>((set, get) => ({
  project: emptyProject("SnapHouse Neuprojekt"),
  selectedInstanceId: null,
  houseBuilding: false,
  houseBuildMessages: [],

  setProjectName: (name) =>
    set((s) => ({
      project: { ...s.project, projectName: name },
    })),

  setHouse: (patch) =>
    set((s) => ({
      project: {
        ...s.project,
        house: clampHouseToRules({ ...s.project.house, ...patch }),
      },
    })),

  selectInstance: (id) => set({ selectedInstanceId: id }),
  addModule: (moduleId) => {
    const inst = defaultInstance(moduleId);
    if (!inst) return;
    set((s) => ({
      project: { ...s.project, modules: [...s.project.modules, inst] },
      selectedInstanceId: inst.instanceId,
    }));
  },

  duplicateSelected: () => {
    const id = get().selectedInstanceId;
    if (!id) return;
    const { project } = get();
    const original = project.modules.find((m) => m.instanceId === id);
    if (!original) return;
    const copy = normalizeModule({
      ...original,
      instanceId: newInstanceId(),
      gridPosition: {
        ...original.gridPosition,
        x: original.gridPosition.x + 1,
      },
    });
    set({
      project: { ...project, modules: [...project.modules, copy] },
      selectedInstanceId: copy.instanceId,
    });
  },

  removeSelected: () => {
    const id = get().selectedInstanceId;
    if (!id) return;
    set((s) => ({
      project: {
        ...s.project,
        modules: s.project.modules.filter((m) => m.instanceId !== id),
      },
      selectedInstanceId: null,
    }));
  },

  rotateSelectedY90: () => {
    const id = get().selectedInstanceId;
    if (!id) return;
    set((s) => ({
      project: {
        ...s.project,
        modules: s.project.modules.map((m) => {
          if (m.instanceId !== id) return m;
          const ny = ((m.rotation.y + 90) % 360 + 360) % 360;
          return { ...m, rotation: { ...m.rotation, y: ny } };
        }),
      },
    }));
  },

  moveSelectedToGrid: (ix, iz) => {
    const id = get().selectedInstanceId;
    if (!id) return;
    set((s) => ({
      project: {
        ...s.project,
        modules: s.project.modules.map((m) => {
          if (m.instanceId !== id) return m;
          const snapped = snapVec3Mm({
            x: m.position.x,
            y: m.position.y,
            z: m.position.z,
          });
          return {
            ...m,
            gridPosition: { x: ix, y: 0, z: iz },
            position: snapped,
          };
        }),
      },
    }));
  },

  spawnPlaycanvasWallChain: (kind) => {
    const { project } = get();
    const span = project.house.span;
    const seq =
      kind === "g42_250"
        ? G42_SEQ_250[span]
        : kind === "g42_200"
          ? G42_SEQ_200[span]
          : S10_SEQ_250[span];
    if (!seq?.length) return;
    const wallMm = wallHeightBandToMm(get().project.house.wallHeights[0] ?? "XL");
    const newMods = moduleInstancesFromWallChain(seq, {
      floor: 0,
      gridPosition: { x: 0, y: 0, z: 0 },
      wallHeightMm: wallMm,
    });
    set((s) => ({
      project: {
        ...s.project,
        modules: [...s.project.modules, ...newMods],
      },
      selectedInstanceId: newMods[newMods.length - 1]?.instanceId ?? null,
    }));
  },

  buildPlaycanvasHouse: async () => {
    const { project } = get();
    set({ houseBuilding: true, houseBuildMessages: [] });
    try {
      const { ok, modules, warnings } = await buildHouseFromHouseSettingsAsync(project.house);
      if (!ok) {
        set({ houseBuildMessages: warnings });
        return;
      }
      set({
        project: { ...project, modules },
        selectedInstanceId: null,
        houseBuildMessages: warnings,
      });
    } finally {
      set({ houseBuilding: false });
    }
  },

  importFromJsonText: (text) => {
    const parsed = parseProjectJson(text);
    set({
      project: {
        ...parsed,
        modules: parsed.modules.map((m) => normalizeModule(m)),
      },
      selectedInstanceId: null,
      houseBuildMessages: [],
      houseBuilding: false,
    });
  },
  clearAll: () =>
    set({
      project: emptyProject(get().project.projectName || "SnapHouse Neuprojekt"),
      selectedInstanceId: null,
      houseBuildMessages: [],
      houseBuilding: false,
    }),
}));
