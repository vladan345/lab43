"use client";
import { Canvas } from "@react-three/fiber";
import Scene from "./Scene";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";

export default function World() {
  return (
    <div id="canvas-container" className="h-screen w-full">
      <Canvas dpr={[1, 1.5]}>
        <Scene />
        <ambientLight intensity={0.5} />

        <PerspectiveCamera position={[0, 1, 10]} makeDefault>
          <OrbitControls />
        </PerspectiveCamera>
      </Canvas>
    </div>
  );
}
