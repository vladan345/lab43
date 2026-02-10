"use client";

import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
  Stars,
  useHelper,
} from "@react-three/drei";

import Scene from "./Scene";

export default function World() {
  return (
    <div className="h-screen w-full bg-black">
      <Canvas>
        <OrbitControls />
        <Scene />

        <PerspectiveCamera
          makeDefault
          position={[13.584, -5.409, 18.72]}
          fov={25}
        />
        <Environment files="/3d/hdri.jpg" environmentIntensity={10} />
        <Stars count={10000} />
      </Canvas>
    </div>
  );
}
