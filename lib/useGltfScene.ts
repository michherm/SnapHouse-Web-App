"use client";

import { useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/**
 * Lädt eine GLB von einer öffentlichen URL (ohne Suspense).
 * Bei Fehler (404, CORS, …): failed = true.
 */
export function useGltfScene(url: string | undefined | null): {
  scene: THREE.Object3D | null;
  failed: boolean;
  loading: boolean;
} {
  const [scene, setScene] = useState<THREE.Object3D | null>(null);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(!!url?.match(/\.glb$/i));

  useEffect(() => {
    if (!url || !url.match(/\.glb$/i)) {
      setScene(null);
      setFailed(false);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setFailed(false);
    setScene(null);
    const loader = new GLTFLoader();
    loader.load(
      url,
      (gltf) => {
        if (cancelled) return;
        const root = gltf.scene.clone();
        root.traverse((obj) => {
          const m = obj as THREE.Mesh;
          if (m.isMesh) {
            m.castShadow = true;
            m.receiveShadow = true;
          }
        });
        setScene(root);
        setLoading(false);
      },
      undefined,
      () => {
        if (cancelled) return;
        setFailed(true);
        setScene(null);
        setLoading(false);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [url]);

  return { scene, failed, loading };
}
