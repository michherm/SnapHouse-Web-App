/**
 * Öffentliche URLs zu GLB-Exporten (Ordner wie im Explorer unter `public/modules/`).
 * Next.js serviert alles unter `public/` ab Webroot `/`.
 */
export const GLB_EXPORT_250 = "/modules/SKYLARK250_Export_GLB/GLB/";
export const GLB_EXPORT_200 = "/modules/SKYLARK200_Export_GLB/GLB/";

export function glb250(filename: string): string {
  return GLB_EXPORT_250 + filename.replace(/^\/+/, "");
}

export function glb200(filename: string): string {
  return GLB_EXPORT_200 + filename.replace(/^\/+/, "");
}
