# SnapHouse Web (Meilenstein 1)

Next.js-App als Zielplattform für die Migration vom PlayCanvas-Konfigurator. **3D:** React Three Fiber + drei + Zustand-Projektstore + JSON-Import/Export.

## Start

```bash
cd "G:\Meine Ablage\wikihouseproject\SnapHouse\WIKI House Export playvanvas\SnapHouse 2026\snap-house-web"
npm install
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000).

## Inventar Sicherungsordner (Skripte + GLB-Namen)

Siehe **`docs/migration-sicherung-2026-05-09.md`** — Auszug aus  
`…\SnapHouse Arbeitsordner Sicherung 09.05.2026\` (alle `.js` + Namenskonvention der GLBs aus `snaphouse_preloader.js` / Konfigurator).

**GLBs in die Web-App:** Ordner `public/modules/` befüllen (Dateinamen wie `SKYLARK250_WALL_M.glb`). Unter Linux/Vercel zählt **Groß-/Kleinschreibung**.

## Datensicherung `_restore_zip_2026_5_4-2_13_2`

Dieser Ordner war **in der Agent-Umgebung nicht lesbar**. Bitte den Pfad im Explorer prüfen oder den Ordner als Cursor-Workspace öffnen. Typischer PlayCanvas-Export enthält u. a.:

- `config.json` / `settings.json` — Projekt-IDs, Rendering
- `assets/**` — pro Asset-ID JSON + Binärdateien (Texturen, Modelle, Skripte als Text)
- Szenen-Graph mit Entities (Camera, Lights, Scripts an Entities)

**GLB / Texturen:** liegen in der Regel unter `files/assets/<id>/...` (Binär) und werden in Asset-JSON referenziert. Der Arbeitsordner mit nur `.js`-Skripten enthält oft **keine** GLBs — die kommen aus dem Editor-Export.

## Übernommene Logik aus den bestehenden Skripten (Arbeitsordner)

| Bereich | Datei / Konzept | Migration |
|--------|------------------|-----------|
| Raster | `snaphouse_grid.js` — `SHG.cells`, Keys `face_floor_slot`, `_wDx_ref` **0,6 m** | Meilenstein: einfaches **XZ-Raster 600 mm**; später `face`/`slot` wie im Original |
| Haus / Module spawn | `snaphouse_konfigurator.js` — `SHK`, `_spawnAt`, Maße in Metern | Katalog + Instanzen in **mm** im JSON, Szene in **m** |
| Öffnungen | `snaphouse_openings_*.js` | Später eigener Schritt (Regeln, Stempel) |
| UI / Dock | `snaphouse_konfigurator_ui.js` | Ersetzt durch React-Layout |

## Nächste Schritte

1. GLBs aus der Datensicherung nach `public/modules/` kopieren, Pfade in `lib/modules.ts` setzen.
2. Optional `<Suspense><useGLTF /></Suspense>` in `ModuleInstance` statt Box (Lazy pro `assetUrl`).
3. Vercel: `npm run build`, Root = Repo-Root, keine PlayCanvas-Laufzeit nötig.

## JSON-Schema

Siehe `lib/types.ts` und Beispiel `public/templates/vorlage_01.json`.
