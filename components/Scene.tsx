"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sky } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { FloorGrid } from "@/components/Grid";
import { ModuleInstance } from "@/components/ModuleInstance";
import type { ModuleInstance as Mod } from "@/lib/types";
import { gridIndicesFromWorldHit } from "@/lib/snap";
import { useProjectStore } from "@/lib/projectStore";
import { useCallback } from "react";

type SceneInnerProps = {
  modules: Mod[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onGroundClick: (x: number, z: number) => void;
};

function SceneContent({ modules, selectedId, onSelect, onGroundClick }: SceneInnerProps) {
  const handlePlaneClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onGroundClick(e.point.x, e.point.z);
  }, [onGroundClick]);

  return (
    <>
      <Sky sunPosition={[40, 20, 40]} />
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[12, 18, 8]}
        intensity={1.1}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <FloorGrid />
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
        onClick={handlePlaneClick}
      >
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#1e293b" transparent opacity={0.92} />
      </mesh>
      {modules.map((m) => (
        <ModuleInstance
          key={m.instanceId}
          instance={m}
          selected={m.instanceId === selectedId}
          onSelect={onSelect}
        />
      ))}
      <OrbitControls makeDefault minPolarAngle={0.15} maxPolarAngle={Math.PI / 2.05} />
    </>
  );
}

export function Scene() {
  const modules = useProjectStore((s) => s.project.modules);
  const selectedId = useProjectStore((s) => s.selectedInstanceId);
  const selectInstance = useProjectStore((s) => s.selectInstance);
  const moveSelectedToGrid = useProjectStore((s) => s.moveSelectedToGrid);

  const onGroundClick = useCallback(
    (x: number, z: number) => {
      if (!selectedId) return;
      const mod = modules.find((m) => m.instanceId === selectedId);
      if (!mod) return;
      const w = mod.parameters.width ?? 600;
      const d = mod.parameters.depth ?? 300;
      const { ix, iz } = gridIndicesFromWorldHit(x, z, w, d);
      moveSelectedToGrid(ix, iz);
    },
    [selectedId, modules, moveSelectedToGrid],
  );

  return (
    <Canvas
      shadows
      camera={{ position: [8, 6, 8], fov: 50, near: 0.05, far: 200 }}
      gl={{ antialias: true }}
      dpr={[1, 2]}
    >
      <SceneContent
        modules={modules}
        selectedId={selectedId}
        onSelect={selectInstance}
        onGroundClick={onGroundClick}
      />
    </Canvas>
  );
}
