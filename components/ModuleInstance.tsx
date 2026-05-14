"use client";

import { useMemo } from "react";
import * as THREE from "three";
import type { ModuleInstance } from "@/lib/types";
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
  const pos = useMemo(() => worldCentreFromInstance(instance), [instance]);
  const rot = useMemo(
    () =>
      new THREE.Euler(
        degToRad(instance.rotation.x),
        degToRad(instance.rotation.y),
        degToRad(instance.rotation.z),
        "YXZ",
      ),
    [instance.rotation.x, instance.rotation.y, instance.rotation.z],
  );

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
