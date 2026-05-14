import type { SnapHouseProject } from "./types";
import { serializeProject } from "./importProject";

export function downloadProjectJson(project: SnapHouseProject, filename?: string): void {
  const blob = new Blob([serializeProject(project)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || `${project.projectName.replace(/\s+/g, "_")}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
