"use client";
import { Canvas } from "@react-three/fiber";
import { Environment, Grid, OrbitControls } from "@react-three/drei";
import Scene from "./Scene";

import * as core from "@theatre/core";
import studio from "@theatre/studio";
import extension from "@theatre/r3f/dist/extension";
import { SheetProvider, PerspectiveCamera } from "@theatre/r3f";

import demoState from "@/public/demoProject.json";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { EffectComposer, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

gsap.registerPlugin(ScrollTrigger);

export default function World() {
  const main = useRef();
  const demoSheet = core
    .getProject("Demo Project", { state: demoState })
    .sheet("Demo Sheet");

  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    studio.initialize();
    studio.extend(extension);
  }

  useGSAP(
    () => {
      const sequence = demoSheet.sequence;
      console.log(demoSheet);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".trigger",
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          markers: true,
          onUpdate: (self) => {
            sequence.position = self.progress * 4;
          },
        },
      });
    },
    {
      scope: main,
    },
  );

  return (
    <div ref={main}>
      <div className="h-screen w-full position fixed top-0 left-0">
        <Canvas gl={{ preserveDrawingBuffer: true }}>
          <SheetProvider sheet={demoSheet}>
            <ambientLight />
            <PerspectiveCamera
              theatreKey="Camera"
              makeDefault
              position={[5, 5, -5]}
              fov={75}
            />

            <Scene />
            <Grid position={[0, -0.5, 0]} args={[100, 100]} />
          </SheetProvider>
          <EffectComposer>
            <Noise premultiply blendFunction={BlendFunction.ADD} />
          </EffectComposer>
        </Canvas>
      </div>

      <div className="trigger">
        <div className="h-screen w-full"></div>
        <div className="h-screen w-full"></div>
        <div className="h-screen w-full"></div>
        <div className="h-screen w-full"></div>
      </div>
    </div>
  );
}
