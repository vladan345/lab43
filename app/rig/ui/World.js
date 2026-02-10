import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import {
  GlobalCanvas,
  ScrollScene,
  UseCanvas,
  SmoothScrollbar,
} from "@14islands/r3f-scroll-rig";
import { MeshDistortMaterial, GradientTexture } from "@react-three/drei";
import LiquidShader from "./LiquidShader";

export default function World() {
  const el = useRef();
  return (
    <div>
      <GlobalCanvas>
        <ambientLight intensity={0.5} />
        <LiquidShader />
      </GlobalCanvas>
      <SmoothScrollbar />
      <div className="h-[500vh]">
        <div className="h-screen w-full bg-red-500 flex items-center justify-center px-10">
          <h1 className="text-[10rem] max-w-300 leading-none font-bold text-white">
            Hello world, hello rig
          </h1>
        </div>

        <SpinningBoxSection />
      </div>
    </div>
  );
}

function SpinningBoxWebGL({ scale, scrollState }) {
  const mesh = useRef();
  useFrame(() => {
    mesh.current.rotation.y = scrollState.progress * Math.PI * 2;
  });
  return (
    <group scale={scale.xy.min() * 0.5}>
      <mesh ref={mesh}>
        <boxGeometry />
        <meshStandardMaterial color="red" />
      </mesh>
      <directionalLight position={[10, 10, 10]} intensity={2} />
    </group>
  );
}

function SpinningBoxSection() {
  const el = useRef();
  return (
    <section>
      <div
        ref={el}
        className="Placeholder ScrollScene flex items-center justify-between w-full aspect-video bg-blue-900"
      ></div>
      <UseCanvas>
        <ScrollScene track={el}>
          {(props) => <SpinningBoxWebGL {...props} />}
        </ScrollScene>
      </UseCanvas>
    </section>
  );
}
