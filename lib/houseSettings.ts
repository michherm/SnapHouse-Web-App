/**
 * Zentraler Hauszustand — angelehnt an `snaphouse_houseState.js` (DEFAULTS + SH_get/SH_set-Idee).
 * Wird im Projekt-JSON mitgeführt und in der UI bearbeitet.
 */

export type WallHeightBand = "S" | "M" | "L" | "XL";

export type HouseSettings = {
  system: "250" | "200";
  /** Spannweite laut PlayCanvas: XXS | XS | S | M | L bzw. 200: XXXS … */
  span: string;
  floors: number;
  wallHeights: WallHeightBand[];
  roofType: "saddle" | "flat" | "flat10" | "flat1";
  slopeDirection: "vorne" | "hinten";
  wallHPult: number;
  /** Anzahl 600-mm-Module in Längsrichtung (_nFloor) */
  lengthModules: number;
  includeBaseFloor: boolean;
  materialMode: string;
  language: string;
};

export const SPANS_BY_SYSTEM: Record<HouseSettings["system"], string[]> = {
  "250": ["XXS", "XS", "S", "M", "L"],
  "200": ["XXXS", "XXS", "XS", "S"],
};

export function maxFloorsForSystem(system: HouseSettings["system"]): number {
  return system === "200" ? 1 : 2;
}

/** Wandhöhe in mm — gleiche Tabelle wie `shg_floorFromPy` / Konfigurator (S/M/L/XL). */
export function wallHeightBandToMm(band: WallHeightBand | string): number {
  const m: Record<string, number> = { S: 2100, M: 2400, L: 2700, XL: 3000 };
  return m[band] ?? 2400;
}

export function defaultHouseSettings(): HouseSettings {
  return {
    system: "250",
    span: "M",
    floors: 1,
    wallHeights: ["XL", "XL", "XL"],
    roofType: "saddle",
    slopeDirection: "vorne",
    wallHPult: 0,
    lengthModules: 8,
    includeBaseFloor: true,
    materialMode: "osb",
    language: "de",
  };
}

function isWallHeightBand(v: unknown): v is WallHeightBand {
  return v === "S" || v === "M" || v === "L" || v === "XL";
}

/** JSON-Import: fehlende oder alte Projekte mit PlayCanvas-kompatiblen Defaults füllen. */
export function mergeHouseFromUnknown(raw: unknown): HouseSettings {
  const d = defaultHouseSettings();
  if (!raw || typeof raw !== "object") return d;
  const o = raw as Record<string, unknown>;

  if (o.system === "250" || o.system === "200") d.system = o.system;
  if (typeof o.span === "string" && o.span.length > 0) d.span = o.span;

  if (typeof o.floors === "number" && Number.isFinite(o.floors)) {
    d.floors = Math.max(1, Math.min(maxFloorsForSystem(d.system), Math.floor(o.floors)));
  }

  if (Array.isArray(o.wallHeights)) {
    const wh = o.wallHeights.filter(isWallHeightBand);
    if (wh.length > 0) {
      d.wallHeights = wh;
      while (d.wallHeights.length < 3) d.wallHeights.push(d.wallHeights[d.wallHeights.length - 1] ?? "XL");
    }
  }

  if (o.roofType === "saddle" || o.roofType === "flat" || o.roofType === "flat10" || o.roofType === "flat1") {
    d.roofType = o.roofType;
  }
  if (o.slopeDirection === "vorne" || o.slopeDirection === "hinten") d.slopeDirection = o.slopeDirection;
  if (typeof o.wallHPult === "number" && Number.isFinite(o.wallHPult)) d.wallHPult = Math.max(0, Math.min(1, o.wallHPult));
  if (typeof o.lengthModules === "number" && Number.isFinite(o.lengthModules)) {
    d.lengthModules = Math.max(1, Math.min(32, Math.floor(o.lengthModules)));
  }
  if (typeof o.includeBaseFloor === "boolean") d.includeBaseFloor = o.includeBaseFloor;
  if (typeof o.materialMode === "string") d.materialMode = o.materialMode;
  if (typeof o.language === "string") d.language = o.language;

  const allowed = SPANS_BY_SYSTEM[d.system];
  if (!allowed.includes(d.span)) d.span = allowed.includes("M") ? "M" : allowed[0] ?? "M";

  return d;
}

export function clampHouseToRules(h: HouseSettings): HouseSettings {
  const next = { ...h };
  next.floors = Math.max(1, Math.min(maxFloorsForSystem(next.system), next.floors));
  const allowed = SPANS_BY_SYSTEM[next.system];
  if (!allowed.includes(next.span)) next.span = allowed[0] ?? "M";
  return next;
}
