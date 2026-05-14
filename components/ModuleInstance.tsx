"use client";

import type { MutableRefObject } from "react";
import { TransformControls } from "@react-three/drei";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { ModuleInstance, PlaycanvasPose } from "@/lib/types";
import { degToRad, mmToMetres, worldCentreFromInstance } from "@/lib/snap";
import { quaternionFromPlaycanvasEulerDegrees } from "@/lib/playcanvasRotation";
import { eulerDegXYZFromQuaternion } from "@/lib/orientationFromThree";
import { useGltfScene } from "@/lib/useGltfScene";
import { useProjectStore } from "@/lib/projectStore";

type Props = {
  instance: ModuleInstance;
  selected: boolean;
  onSelect: (id: string) => void;
};

export function ModuleInstance({ instance, selected, onSelect }: Props) {
  const transformMode = useProjectStore((s) => s.transformMode);
  const commitModuleTransform = useProjectStore((s) => s.commitModuleTransform);
  const [tcDragging, setTcDragging] = useState(false);

  const w = instance.parameters.width ?? 600;
  const h = instance.parameters.height ?? 2400;
  const d = instance.parameters.depth ?? 300;
  const pose = instance.parameters.playcanvasPose as PlaycanvasPose | undefined;
  const pm = pose?.positionM;
  const rd = pose?.rotationDeg;

  const pos = useMemo(() => {
    if (
      pm &&
      typeof pm.x === "number" &&
      typeof pm.y === "number" &&
      typeof pm.z === "number"
    ) {
      return [pm.x, pm.y, pm.z] as [number, number, number];
    }
    return worldCentreFromInstance(instance);
  }, [
    instance,
    pm,
    pm?.x,
    pm?.y,
    pm?.z,
    instance.floor,
    instance.gridPosition.x,
    instance.gridPosition.y,
    instance.gridPosition.z,
    instance.position.x,
    instance.position.y,
    instance.position.z,
    w,
    h,
    d,
  ]);

  const quat = useMemo(() => {
    if (
      rd &&
      typeof rd.x === "number" &&
      typeof rd.y === "number" &&
      typeof rd.z === "number"
    ) {
      return quaternionFromPlaycanvasEulerDegrees(rd.x, rd.y, rd.z);
    }
    return new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        degToRad(instance.rotation.x),
        degToRad(instance.rotation.y),
        degToRad(instance.rotation.z),
        "XYZ",
      ),
    );
  }, [rd, rd?.x, rd?.y, rd?.z, instance.rotation.x, instance.rotation.y, instance.rotation.z]);

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

  const groupRef = useRef<THREE.Group>(null);

  /**
   * Transform explizit setzen: Bei `<group>` + `<primitive object={…}>` hat R3F in manchen
   * Kombinationen die Props `quaternion`/`scale` nicht zuverlässig auf die Gruppe angewendet —
   * dann bleiben GLBs in „Ruhestellung“ (z. B. Dach liegend), obwohl `playcanvasPose` stimmt.
   */
  useLayoutEffect(() => {
    if (tcDragging) return;
    const g = groupRef.current;
    if (!g) return;
    g.position.set(pos[0], pos[1], pos[2]);
    g.quaternion.copy(quat);
    const s = useGltf ? gltfScale : boxScale;
    g.scale.set(s.x, s.y, s.z);
  }, [pos, quat, useGltf, gltfScale, boxScale, tcDragging]);

  const onTcMouseDown = useCallback(() => {
    setTcDragging(true);
  }, []);

  const onTcMouseUp = useCallback(() => {
    if (groupRef.current) {
      const g = groupRef.current;
      const positionM = { x: g.position.x, y: g.position.y, z: g.position.z };
      const rotationDeg = eulerDegXYZFromQuaternion(g.quaternion);
      commitModuleTransform(instance.instanceId, { positionM, rotationDeg });
    }
    setTcDragging(false);
  }, [instance.instanceId, commitModuleTransform]);

  return (
    <>
      <group
        ref={groupRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(instance.instanceId);
        }}
      >
        {useGltf ? (
          <primitive object={gltfScene} dispose={null} />
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
      {selected ? (
        <TransformControls
          object={groupRef as MutableRefObject<THREE.Object3D>}
          mode={transformMode}
          size={0.65}
          onMouseDown={onTcMouseDown}
          onMouseUp={onTcMouseUp}
        />
      ) : null}
    </>
  );
}
