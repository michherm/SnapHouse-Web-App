/**
 * Katalogdaten 1:1 aus `snaphouse_konfigurator.js` (Inline-Fallbacks PLATFORMS_*, WALL_DATA).
 */

export type PlatformSet = {
  floor: string;
  floor1: string;
  end: string;
  end1: string;
  corner: string;
  wall: string;
  roof: string;
  roofFlat: string;
  verge?: string;
  verge1?: string;
  roof1?: string;
};

export const PLATFORMS_250: Record<string, PlatformSet> = {
  XXS: {
    floor: "SKYLARK250_FLOOR_XXS_0.glb",
    floor1: "SKYLARK250_FLOOR_XXS.glb",
    end: "SKYLARK250_END_XXS_0.glb",
    end1: "SKYLARK250_END_XXS_1.glb",
    corner: "SKYLARK250_CORNER_S.glb",
    wall: "SKYLARK250_WALL_S.glb",
    roof: "SKYLARK250_ROOF_XXS42.glb",
    roofFlat: "SKYLARK250_ROOF_XXS10.glb",
  },
  XS: {
    floor: "SKYLARK250_FLOOR_XS_0.glb",
    floor1: "SKYLARK250_FLOOR_XS.glb",
    end: "SKYLARK250_END_XS_0.glb",
    end1: "SKYLARK250_END_XS_1.glb",
    corner: "SKYLARK250_CORNER_M.glb",
    wall: "SKYLARK250_WALL_M.glb",
    roof: "SKYLARK250_ROOF_XS42.glb",
    roofFlat: "SKYLARK250_ROOF_XS10.glb",
  },
  S: {
    floor: "SKYLARK250_FLOOR_S_0.glb",
    floor1: "SKYLARK250_FLOOR_S.glb",
    end: "SKYLARK250_END_S_0.glb",
    end1: "SKYLARK250_END_S_1.glb",
    corner: "SKYLARK250_CORNER_L.glb",
    wall: "SKYLARK250_WALL_L.glb",
    roof: "SKYLARK250_ROOF_S42.glb",
    roofFlat: "SKYLARK250_ROOF_S10.glb",
  },
  M: {
    floor: "SKYLARK250_FLOOR_M_0.glb",
    floor1: "SKYLARK250_FLOOR_M.glb",
    end: "SKYLARK250_END_M_0.glb",
    end1: "SKYLARK250_END_M_1.glb",
    corner: "SKYLARK250_CORNER_XL.glb",
    wall: "SKYLARK250_WALL_XL.glb",
    roof: "SKYLARK250_ROOF_M42.glb",
    roofFlat: "SKYLARK250_ROOF_M10.glb",
  },
  L: {
    floor: "SKYLARK250_FLOOR_L_0.glb",
    floor1: "SKYLARK250_FLOOR_L.glb",
    end: "SKYLARK250_END_L_0.glb",
    end1: "SKYLARK250_END_L_1.glb",
    corner: "SKYLARK250_CORNER_S.glb",
    wall: "SKYLARK250_WALL_S.glb",
    roof: "SKYLARK250_ROOF_L42.glb",
    roofFlat: "SKYLARK250_ROOF_L10.glb",
  },
};

export const PLATFORMS_200: Record<string, PlatformSet> = {
  XXXS: {
    floor: "SKYLARK200_FLOOR_XXXS_0.glb",
    floor1: "SKYLARK200_FLOOR_XXXS_1.glb",
    end: "SKYLARK200_END_XXXS_0.glb",
    end1: "SKYLARK200_END_XXXS_1.glb",
    corner: "SKYLARK200_CORNER_S.glb",
    wall: "SKYLARK200_WALL_S.glb",
    roof: "SKYLARK200_ROOF_42_XXXS.glb",
    roofFlat: "SKYLARK200_ROOF_XXXS.glb",
    verge: "SKYLARK200_VERGE_XXXS.glb",
    verge1: "SKYLARK200_VERGE_XXXS_1.glb",
    roof1: "SKYLARK200_ROOF_XXXS.glb",
  },
  XXS: {
    floor: "SKYLARK200_FLOOR_XXS_0.glb",
    floor1: "SKYLARK200_FLOOR_XXS_1.glb",
    end: "SKYLARK200_END_XXS_0.glb",
    end1: "SKYLARK200_END_XXS_1.glb",
    corner: "SKYLARK200_CORNER_M.glb",
    wall: "SKYLARK200_WALL_M.glb",
    roof: "SKYLARK200_ROOF_42_XXS.glb",
    roofFlat: "SKYLARK200_ROOF_XXS.glb",
    verge: "SKYLARK200_VERGE_XXS.glb",
    verge1: "SKYLARK200_VERGE_XXS_1.glb",
    roof1: "SKYLARK200_ROOF_XXS.glb",
  },
  XS: {
    floor: "SKYLARK200_FLOOR_XS_0.glb",
    floor1: "SKYLARK200_FLOOR_XS_1.glb",
    end: "SKYLARK200_END_XS_0.glb",
    end1: "SKYLARK200_END_XS_1.glb",
    corner: "SKYLARK200_CORNER_L.glb",
    wall: "SKYLARK200_WALL_L.glb",
    roof: "SKYLARK200_ROOF_42_XS.glb",
    roofFlat: "SKYLARK200_ROOF_XS.glb",
    verge: "SKYLARK200_VERGE_XS.glb",
    verge1: "SKYLARK200_VERGE_XS_1.glb",
    roof1: "SKYLARK200_ROOF_XS.glb",
  },
  S: {
    floor: "SKYLARK200_FLOOR_S_0.glb",
    floor1: "SKYLARK200_FLOOR_S_1.glb",
    end: "SKYLARK200_END_S_0.glb",
    end1: "SKYLARK200_END_S_1.glb",
    corner: "SKYLARK200_CORNER_XL.glb",
    wall: "SKYLARK200_WALL_XL.glb",
    roof: "SKYLARK200_ROOF_42_S.glb",
    roofFlat: "SKYLARK200_ROOF_S.glb",
    verge: "SKYLARK200_VERGE_S.glb",
    verge1: "SKYLARK200_VERGE_S_1.glb",
    roof1: "SKYLARK200_ROOF_S.glb",
  },
};

export type WallCornerPair = { wall: string; corner: string };

export const WALL_DATA: Record<"250" | "200", Record<string, WallCornerPair>> = {
  "250": {
    S: { wall: "SKYLARK250_WALL_S.glb", corner: "SKYLARK250_CORNER_S.glb" },
    M: { wall: "SKYLARK250_WALL_M.glb", corner: "SKYLARK250_CORNER_M.glb" },
    L: { wall: "SKYLARK250_WALL_L.glb", corner: "SKYLARK250_CORNER_L.glb" },
    XL: { wall: "SKYLARK250_WALL_XL.glb", corner: "SKYLARK250_CORNER_XL.glb" },
  },
  "200": {
    S: { wall: "SKYLARK200_WALL_S.glb", corner: "SKYLARK200_CORNER_S.glb" },
    M: { wall: "SKYLARK200_WALL_M.glb", corner: "SKYLARK200_CORNER_M.glb" },
    L: { wall: "SKYLARK200_WALL_L.glb", corner: "SKYLARK200_CORNER_L.glb" },
    XL: { wall: "SKYLARK200_WALL_XL.glb", corner: "SKYLARK200_CORNER_XL.glb" },
  },
};
