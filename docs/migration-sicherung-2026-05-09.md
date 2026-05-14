# Inventar: `SnapHouse Arbeitsordner Sicherung 09.05.2026`

Quellpfad (dein Rechner):

`G:\Meine Ablage\wikihouseproject\SnapHouse\WIKI House Export playvanvas\SnapHouse 2026\SnapHouse Arbeitsordner Sicherung 09.05.2026`

## PlayCanvas-Skripte (45 × `.js`)

| Datei | Rolle (Kurz) |
|-------|----------------|
| `config.js` | Globale Konfiguration, ggf. Watchdogs, UI-Helfer |
| `snaphouse_konfigurator.js` | **SHK** — Modul-Spawn, `_meas`, GLB-Namen, Spannweiten G42/S10, System 200/250 |
| `snaphouse_konfigurator_ui.js` | Haupt-UI, Dock, Umgebung, GLB-Hilfen (`SHO_glbToKey`, …) |
| `snaphouse_konfigurator_ui.PLAYCANVAS_FULL.js` | Referenz/Stub — nicht mit Live-UI verwechseln |
| `snaphouse_grid.js` | **SHG** — Zellen `face_floor_slot`, Raster **0,6 m** |
| `snaphouse_houseState.js` | Zentraler Hauszustand |
| `snaphouse_events.js` | Event-Bus |
| `snaphouse_preloader.js` | **GLB-Preload-Liste** für Skylark 250/200 |
| `snaphouse_materials.js` | Materialien / OSB / PBR |
| `snaphouse_visual_system.js` | *(falls vorhanden im Ordner — in dieser Index-Liste nicht separat)* |
| `snaphouse_openings_*.js` | Öffnungen: Katalog, Regeln, Apply, UI, Boot, Policy |
| `snaphouse_structural_*.js` | Statik-Schicht |
| `snaphouse_statik_*.js` / `.html` | Statik-UI / Export |
| `snaphouse_welcome.js` | Startkarte / Welcome |
| `snaphouse_kalkulation_ui.js` | Kalkulation |
| `snaphouse_catalog_*.js` | Wände, Sequenzen, Plattformen |
| `snaphouse_i18n.js`, `snaphouse_locale_pl.js`, `snaphouse_planner_i18n.js` | Sprachen |
| `snaphouse_ampel.js`, `snaphouse_lehrfilm.js`, `snaphouse_viewcontrol.js` | UX-Hilfen |
| `snaphouse_grundriss_editor_inline.js` | Grundriss |
| `sho_blocks_update.js` | Block-Metadaten |
| `herrmann-legal-system.js` | Legal |
| `__loading__.js`, `__loading_minimal_disclaimer.js`, `_check_loading.js`, `guide_done_snippet.js` | Lade-/Disclaimer-Helfer |

## GLB-Namenskonvention (aus den Skripten)

- **System:** `SKYLARK250_…` bzw. `SKYLARK200_…`
- **Wände:** `SKYLARK{250|200}_WALL_{S|M|L|XL}.glb`
- **Ecken:** `…_CORNER_{M|L|XL}.glb`
- **Boden / Enden:** `…_FLOOR_…`, `…_END_…`
- **Dach:** `…_ROOF_…42…` (Sattel), `…_ROOF_…10…` (Pult), Varianten pro Spannweite
- **G42-Wandketten:** `SKYLARK250_WALL_G42_1.glb` … (siehe `snaphouse_konfigurator.js`, Objekt `WALL_SEQ` / ähnliche Strukturen)
- **S10-Wandketten:** `SKYLARK250_WALL_S10_1.glb` …
- **Öffnungen:** `SKYLARK{sys}_WINDOW_{wallH}{variant}.glb`, `…_DOOR_…`, `…_SKYLIGHT_{span}.glb` (`snaphouse_openings_catalog.js`)

## Preload-Liste (häufigste GLBs) — `snaphouse_preloader.js`

### Skylark 250 (`_PRELOAD_250`)

- `SKYLARK250_WALL_S.glb`, `SKYLARK250_WALL_M.glb`, `SKYLARK250_WALL_L.glb`, `SKYLARK250_WALL_XL.glb`
- `SKYLARK250_CORNER_M.glb`, `SKYLARK250_CORNER_L.glb`, `SKYLARK250_CORNER_XL.glb`
- `SKYLARK250_FLOOR_M_0.glb`, `SKYLARK250_FLOOR_M_1.glb`, `SKYLARK250_FLOOR_S_0.glb`, `SKYLARK250_FLOOR_S_1.glb`
- `SKYLARK250_END_M_0.glb`, `SKYLARK250_END_M_1.glb`
- `SKYLARK250_ROOF_XXS42.glb` … `SKYLARK250_ROOF_L42.glb`
- `SKYLARK250_ROOF_M10.glb`, `SKYLARK250_ROOF_S10.glb`

### Skylark 200 (`_PRELOAD_200`)

- `SKYLARK200_WALL_S.glb` … `SKYLARK200_WALL_XL.glb`
- `SKYLARK200_CORNER_M.glb`, `SKYLARK200_CORNER_L.glb`
- `SKYLARK200_FLOOR_S_0.glb`, `SKYLARK200_FLOOR_S_1.glb`
- `SKYLARK200_END_S_0.glb`
- `SKYLARK200_ROOF_42_S.glb`, `SKYLARK200_ROOF_42_XS.glb`, `SKYLARK200_ROOF_42_XXS.glb`

## Physische GLB-Dateien (`public/modules/`)

Struktur wie in deinem Explorer:

- `public/modules/SKYLARK250_Export_GLB/GLB/*.glb`
- `public/modules/SKYLARK200_Export_GLB/GLB/*.glb`

Die Web-App nutzt diese Pfade über `lib/modulePaths.ts` (`glb250` / `glb200`). Importierte JSON-Projekte sollten **`assetUrl`** mit genau diesem Pfadprefix speichern (siehe `public/templates/vorlage_01.json`).

**Hinweis:** In der Cursor-Agent-Umgebung werden Binärdateien oft nicht indexiert — lokal sind die GLBs trotzdem nutzbar, solange `npm run dev` die Ordner unter `public/` ausliefert.

## Nächster technischer Schritt (Umzug)

1. Weitere GLB-Namen aus dem PlayCanvas-Katalog in `lib/modules.ts` ergänzen (immer `glb250('…')` bzw. `glb200('…')`).  
2. Optional: Draco-Kompression in `GLTFLoader` registrieren, falls deine Exporte Draco nutzen.  
3. Modell-Origin vs. Raster justieren (PlayCanvas nutzte teils feste `rx`/`ry` beim Spawn — kann später in `parameters` oder im Katalog abgebildet werden).

Diese Datei bei Bedarf im Git-Repo versionieren, damit der andere Rechner denselben Migrations-Stand hat.
