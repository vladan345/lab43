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
        <OrbitControls autoRotate autoRotateSpeed={0.25} />
        <Scene />

        <PerspectiveCamera makeDefault position={[5, 0, 0]} fov={35} />
        <Environment preset="studio" />
        <Stars count={4000} />
      </Canvas>
    </div>
  );
}
