/**
 * Wandketten aus `snaphouse_konfigurator.js` (Inline-Fallbacks G42 / S10).
 * `pz` in Metern entlang der Kette → wird als mm-Offset in `position.z` übernommen.
 */

export type WallChainEntry = {
  name: string;
  pz: number;
  rx?: number;
  ry?: number;
  rz?: number;
  ck?: string;
};

/** Skylark 250, G42-Dach / 42°-Kette — alle Spannen wie PlayCanvas. */
export const G42_SEQ_250: Record<string, WallChainEntry[]> = {
  XXS: [
    { name: "SKYLARK250_WALL_G42_1.glb", pz: 0, rx: 270, ry: 270, rz: 0, ck: "G42_1" },
    { name: "SKYLARK250_WALL_G42_2.glb", pz: 0.908, rx: 270, ry: 270, rz: 0, ck: "G42_2" },
    { name: "SKYLARK250_WALL_G42_3R.glb", pz: 1.508, rx: 270, ry: 270, rz: 0, ck: "G42_3R" },
    { name: "SKYLARK250_WALL_G42_8.glb", pz: 2.108, rx: 0, ry: 270, rz: 270, ck: "G42_8" },
    { name: "SKYLARK250_WALL_G42_9.glb", pz: 2.708, rx: 0, ry: 270, rz: 270, ck: "G42_9" },
  ],
  XS: [
    { name: "SKYLARK250_WALL_G42_1.glb", pz: 0, rx: 270, ry: 270, rz: 0, ck: "G42_1" },
    { name: "SKYLARK250_WALL_G42_2.glb", pz: 0.908, rx: 270, ry: 270, rz: 0, ck: "G42_2" },
    { name: "SKYLARK250_WALL_G42_3R2.glb", pz: 1.508, rx: 270, ry: 270, rz: 0, ck: "G42_3R2" },
    { name: "SKYLARK250_WALL_G42_7R2.glb", pz: 2.108, rx: 270, ry: 270, rz: 0, ck: "G42_7R2" },
    { name: "SKYLARK250_WALL_G42_8.glb", pz: 2.708, rx: 0, ry: 270, rz: 270, ck: "G42_8" },
    { name: "SKYLARK250_WALL_G42_9.glb", pz: 3.308, rx: 0, ry: 270, rz: 270, ck: "G42_9" },
  ],
  S: [
    { name: "SKYLARK250_WALL_G42_1.glb", pz: 0, rx: 270, ry: 270, rz: 0, ck: "G42_1" },
    { name: "SKYLARK250_WALL_G42_2.glb", pz: 0.908, rx: 270, ry: 270, rz: 0, ck: "G42_2" },
    { name: "SKYLARK250_WALL_G42_3.glb", pz: 1.508, rx: 90, ry: 270, rz: 180, ck: "G42_3" },
    { name: "SKYLARK250_WALL_G42_4R.glb", pz: 2.098, rx: 270, ry: 270, rz: 0, ck: "G42_4R" },
    { name: "SKYLARK250_WALL_G42_7.glb", pz: 2.718, rx: 270, ry: 270, rz: 0, ck: "G42_7" },
    { name: "SKYLARK250_WALL_G42_8.glb", pz: 3.318, rx: 0, ry: 270, rz: 270, ck: "G42_8" },
    { name: "SKYLARK250_WALL_G42_9.glb", pz: 3.918, rx: 0, ry: 270, rz: 270, ck: "G42_9" },
  ],
  M: [
    { name: "SKYLARK250_WALL_G42_1.glb", pz: 0, rx: 270, ry: 270, rz: 0, ck: "G42_1" },
    { name: "SKYLARK250_WALL_G42_2.glb", pz: 0.908, rx: 270, ry: 270, rz: 0, ck: "G42_2" },
    { name: "SKYLARK250_WALL_G42_3.glb", pz: 1.508, rx: 90, ry: 270, rz: 180, ck: "G42_3" },
    { name: "SKYLARK250_WALL_G42_4R2.glb", pz: 2.098, rx: 270, ry: 270, rz: 0, ck: "G42_4R2" },
    { name: "SKYLARK250_WALL_G42_6R2.glb", pz: 2.718, rx: 270, ry: 270, rz: 0, ck: "G42_6R2" },
    { name: "SKYLARK250_WALL_G42_7.glb", pz: 3.318, rx: 270, ry: 270, rz: 0, ck: "G42_7" },
    { name: "SKYLARK250_WALL_G42_8.glb", pz: 3.918, rx: 0, ry: 270, rz: 270, ck: "G42_8" },
    { name: "SKYLARK250_WALL_G42_9.glb", pz: 4.518, rx: 0, ry: 270, rz: 270, ck: "G42_9" },
  ],
  L: [
    { name: "SKYLARK250_WALL_G42_1.glb", pz: 0, rx: 270, ry: 270, rz: 0, ck: "G42_1" },
    { name: "SKYLARK250_WALL_G42_2.glb", pz: 0.918, rx: 270, ry: 270, rz: 0, ck: "G42_2" },
    { name: "SKYLARK250_WALL_G42_3.glb", pz: 1.508, rx: 90, ry: 270, rz: 180, ck: "G42_3" },
    { name: "SKYLARK250_WALL_G42_4.glb", pz: 2.118, rx: 270, ry: 270, rz: 0, ck: "G42_4" },
    { name: "SKYLARK250_WALL_G42_5R.glb", pz: 2.718, rx: 270, ry: 270, rz: 0, ck: "G42_5R" },
    { name: "SKYLARK250_WALL_G42_6.glb", pz: 3.318, rx: 270, ry: 270, rz: 0, ck: "G42_6" },
    { name: "SKYLARK250_WALL_G42_7.glb", pz: 3.918, rx: 270, ry: 270, rz: 0, ck: "G42_7" },
    { name: "SKYLARK250_WALL_G42_8.glb", pz: 4.518, rx: 0, ry: 270, rz: 270, ck: "G42_8" },
    { name: "SKYLARK250_WALL_G42_9.glb", pz: 5.118, rx: 0, ry: 270, rz: 270, ck: "G42_9" },
  ],
};

/** Skylark 200, G42 — alle Spannen wie PlayCanvas. */
export const G42_SEQ_200: Record<string, WallChainEntry[]> = {
  XXXS: [
    { name: "SKYLARK200_WALL_G42_1.glb", pz: 0, rx: 270, ry: 270, rz: 0, ck: "G42_1" },
    { name: "SKYLARK200_WALL_G42_2R.glb", pz: 0.855, rx: 270, ry: 270, rz: 0, ck: "G42_2" },
    { name: "SKYLARK200_WALL_G42_6R.glb", pz: 1.468, rx: 270, ry: 270, rz: 0, ck: "G42_6R" },
    { name: "SKYLARK200_WALL_G42_7.glb", pz: 2.068, rx: 0, ry: 270, rz: 270, ck: "G42_7" },
  ],
  XXS: [
    { name: "SKYLARK200_WALL_G42_1.glb", pz: 0, rx: 270, ry: 270, rz: 0, ck: "G42_1" },
    { name: "SKYLARK200_WALL_G42_2.glb", pz: 0.855, rx: 270, ry: 270, rz: 0, ck: "G42_2" },
    { name: "SKYLARK200_WALL_G42_3R.glb", pz: 1.456, rx: 270, ry: 270, rz: 0, ck: "G42_3R" },
    { name: "SKYLARK200_WALL_G42_6.glb", pz: 2.068, rx: 270, ry: 270, rz: 0, ck: "G42_6" },
    { name: "SKYLARK200_WALL_G42_7.glb", pz: 2.668, rx: 0, ry: 270, rz: 270, ck: "G42_7" },
  ],
  XS: [
    { name: "SKYLARK200_WALL_G42_1.glb", pz: 0, rx: 270, ry: 270, rz: 0, ck: "G42_1" },
    { name: "SKYLARK200_WALL_G42_2.glb", pz: 0.855, rx: 270, ry: 270, rz: 0, ck: "G42_2" },
    { name: "SKYLARK200_WALL_G42_3R2.glb", pz: 1.456, rx: 270, ry: 270, rz: 0, ck: "G42_3R2" },
    { name: "SKYLARK200_WALL_G42_5R2.glb", pz: 2.068, rx: 270, ry: 270, rz: 0, ck: "G42_5R2" },
    { name: "SKYLARK200_WALL_G42_6.glb", pz: 2.668, rx: 270, ry: 270, rz: 0, ck: "G42_6" },
    { name: "SKYLARK200_WALL_G42_7.glb", pz: 3.268, rx: 0, ry: 270, rz: 270, ck: "G42_7" },
  ],
  S: [
    { name: "SKYLARK200_WALL_G42_1.glb", pz: 0, rx: 270, ry: 270, rz: 0, ck: "G42_1" },
    { name: "SKYLARK200_WALL_G42_2.glb", pz: 0.855, rx: 270, ry: 270, rz: 0, ck: "G42_2" },
    { name: "SKYLARK200_WALL_G42_3.glb", pz: 1.456, rx: 90, ry: 270, rz: 180, ck: "G42_3" },
    { name: "SKYLARK200_WALL_G42_4R.glb", pz: 2.057, rx: 270, ry: 270, rz: 0, ck: "G42_4R" },
    { name: "SKYLARK200_WALL_G42_5.glb", pz: 2.668, rx: 270, ry: 270, rz: 0, ck: "G42_5" },
    { name: "SKYLARK200_WALL_G42_6.glb", pz: 3.268, rx: 270, ry: 270, rz: 0, ck: "G42_6" },
    { name: "SKYLARK200_WALL_G42_7.glb", pz: 3.868, rx: 0, ry: 270, rz: 270, ck: "G42_7" },
  ],
};

/** Skylark 250, S10 / 10°-Pult — nur `name`+`pz` in PlayCanvas; Rotation wie typische Südwand. */
export const S10_SEQ_250: Record<string, WallChainEntry[]> = {
  XXS: [
    { name: "SKYLARK250_WALL_S10_1.glb", pz: 0 },
    { name: "SKYLARK250_WALL_S10_2.glb", pz: 0.918 },
    { name: "SKYLARK250_WALL_S10_3.glb", pz: 1.508 },
    { name: "SKYLARK250_WALL_S10_4.glb", pz: 2.118 },
    { name: "SKYLARK250_WALL_S10_5R.glb", pz: 2.702 },
  ],
  XS: [
    { name: "SKYLARK250_WALL_S10_1.glb", pz: 0 },
    { name: "SKYLARK250_WALL_S10_2.glb", pz: 0.918 },
    { name: "SKYLARK250_WALL_S10_3.glb", pz: 1.508 },
    { name: "SKYLARK250_WALL_S10_4.glb", pz: 2.118 },
    { name: "SKYLARK250_WALL_S10_5.glb", pz: 2.702 },
    { name: "SKYLARK250_WALL_S10_6R.glb", pz: 3.318 },
  ],
  S: [
    { name: "SKYLARK250_WALL_S10_1.glb", pz: 0 },
    { name: "SKYLARK250_WALL_S10_2.glb", pz: 0.918 },
    { name: "SKYLARK250_WALL_S10_3.glb", pz: 1.508 },
    { name: "SKYLARK250_WALL_S10_4.glb", pz: 2.118 },
    { name: "SKYLARK250_WALL_S10_5.glb", pz: 2.702 },
    { name: "SKYLARK250_WALL_S10_6.glb", pz: 3.318 },
    { name: "SKYLARK250_WALL_S10_7R.glb", pz: 3.918 },
  ],
  M: [
    { name: "SKYLARK250_WALL_S10_1.glb", pz: 0 },
    { name: "SKYLARK250_WALL_S10_2.glb", pz: 0.918 },
    { name: "SKYLARK250_WALL_S10_3.glb", pz: 1.508 },
    { name: "SKYLARK250_WALL_S10_4.glb", pz: 2.118 },
    { name: "SKYLARK250_WALL_S10_5.glb", pz: 2.702 },
    { name: "SKYLARK250_WALL_S10_6.glb", pz: 3.318 },
    { name: "SKYLARK250_WALL_S10_7.glb", pz: 3.918 },
    { name: "SKYLARK250_WALL_S10_8R.glb", pz: 4.518 },
  ],
  L: [
    { name: "SKYLARK250_WALL_S10_1.glb", pz: 0 },
    { name: "SKYLARK250_WALL_S10_2.glb", pz: 0.918 },
    { name: "SKYLARK250_WALL_S10_3.glb", pz: 1.508 },
    { name: "SKYLARK250_WALL_S10_4.glb", pz: 2.118 },
    { name: "SKYLARK250_WALL_S10_5.glb", pz: 2.702 },
    { name: "SKYLARK250_WALL_S10_6.glb", pz: 3.318 },
    { name: "SKYLARK250_WALL_S10_7.glb", pz: 3.918 },
    { name: "SKYLARK250_WALL_S10_8.glb", pz: 4.518 },
    { name: "SKYLARK250_WALL_S10_9R.glb", pz: 5.118 },
  ],
};
