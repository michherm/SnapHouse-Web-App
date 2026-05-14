"use client";

import { useMemo } from "react";
import * as THREE from "three";
import type { ModuleInstance, PlaycanvasPose } from "@/lib/types";
import { degToRad, mmToMetres, worldCentreFromInstance } from "@/lib/snap";
import { useGltfScene } from "@/lib/useGltfScene";

type Props = {
  instance: ModuleInstance;
  selected: boolean;
  onSelect: (id: string) => void;
};

export function ModuleInstance({ instance, selected, onSelect }: Props) {
  const w = instance.parameters.width ?? 600;
  const h = instance.parameters.height ?? 2400;
  const d = instance.parameters.depth ?? 300;
  const pose = instance.parameters.playcanvasPose as PlaycanvasPose | undefined;

  const pos = useMemo(() => {
    if (pose?.positionM) {
      const p = pose.positionM;
      return [p.x, p.y, p.z] as [number, number, number];
    }
    return worldCentreFromInstance(instance);
  }, [instance, pose]);

  const rot = useMemo(() => {
    if (pose?.rotationDeg) {
      const r = pose.rotationDeg;
      return new THREE.Euler(degToRad(r.x), degToRad(r.y), degToRad(r.z), "XYZ");
    }
    return new THREE.Euler(
      degToRad(instance.rotation.x),
      degToRad(instance.rotation.y),
      degToRad(instance.rotation.z),
      "XYZ",
    );
  }, [instance, pose]);

  const url = instance.assetUrl?.match(/\.glb$/i) ? instance.assetUrl : null;
  const { scene: gltfScene, failed, loading } = useGltfScene(url);

  const boxScale = useMemo(
    () =>
      new THREE.Vector3(
        instance.scale.x * mmToMetres(w),
        instance.scale.y * mmToMetres(h),
        instance.scale.z * mmToMetres(d),
      ),
    [instance.scale.x, instance.scale.y, instance.scale.z, w, h, d],
  );

  const gltfScale = useMemo(
    () => new THREE.Vector3(instance.scale.x, instance.scale.y, instance.scale.z),
    [instance.scale.x, instance.scale.y, instance.scale.z],
  );

  const useGltf = url && gltfScene && !failed && !loading;

  return (
    <group
      position={pos}
      rotation={rot}
      scale={useGltf ? gltfScale : boxScale}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(instance.instanceId);
      }}
    >
      {useGltf ? (
        <primitive object={gltfScene} />
      ) : (
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={
              failed ? "#f97316" : loading ? "#3b82f6" : selected ? "#6ee7b7" : "#9ca3af"
            }
            metalness={0.05}
            roughness={0.75}
            emissive={loading ? "#1e3a8a" : "#000000"}
            emissiveIntensity={loading ? 0.35 : 0}
          />
        </mesh>
      )}
    </group>
  );
}
