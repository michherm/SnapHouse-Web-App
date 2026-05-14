"use client";

/** 60 cm cells: 48 m span → 80 divisions → 0.6 m per cell. */
export function FloorGrid() {
  return (
    <gridHelper
      args={[48, 80, "#475569", "#1e293b"]}
      position={[0, 0.02, 0]}
      rotation={[0, 0, 0]}
    />
  );
}
