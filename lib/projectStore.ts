import { create } from "zustand";
import type { ModuleInstance, SnapHouseProject } from "./types";
import { getModuleDefinition } from "./modules";
import { emptyProject, newInstanceId, normalizeModule, parseProjectJson } from "./importProject";
import { snapVec3Mm } from "./snap";

type Store = {
  project: SnapHouseProject;
  selectedInstanceId: string | null;
  setProjectName: (name: string) => void;
  selectInstance: (id: string | null) => void;
  addModule: (moduleId: string) => void;
  removeSelected: () => void;
  rotateSelectedY90: () => void;
  moveSelectedToGrid: (ix: number, iz: number) => void;
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

  setProjectName: (name) =>
    set((s) => ({
      project: { ...s.project, projectName: name },
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

  importFromJsonText: (text) => {
    const parsed = parseProjectJson(text);
    const normalized: SnapHouseProject = {
      ...parsed,
      modules: parsed.modules.map((m) => normalizeModule(m)),
    };
    set({ project: normalized, selectedInstanceId: null });
  },

  clearAll: () =>
    set({
      project: emptyProject(get().project.projectName || "SnapHouse Neuprojekt"),
      selectedInstanceId: null,
    }),
}));
