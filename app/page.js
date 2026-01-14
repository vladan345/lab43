"use client";

import { Canvas } from "@react-three/fiber";
import { Color } from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import Header from "@/components/Header";
import { Text } from "@/components/Text";
import Scene from "@/components/Scene";
import { ProjectHoverProvider } from "@/context/ProjectHoverContext";

export default function Page() {
  const wrap = useRef();
  const background = "#e5e5e5";

  useGSAP(
    () => {
      const tl = gsap.timeline({
        duration: 1,
        repeat: -1,
      });
      tl.to(".scrollbar", {
        height: "100%",
        alignSelf: "start",
      }).to(".scrollbar", {
        alignSelf: "end",
        height: "0%",
      });
    },
    { scope: wrap }
  );

  return (
    <ProjectHoverProvider>
      <Header />
      <div
        id="canvas-container"
        className="fixed top-0 left-0 w-full h-full"
      >
        <Canvas
          camera={{ position: [0, 0, 20] }}
          scene={{ background: new Color(background) }}
        >
          <fog
            attach="fog"
            color={background}
            near={
              typeof window !== "undefined" && window.innerWidth < 900 ? 3 : 2
            }
            far={4.5}
          />
          <Scene />
        </Canvas>
      </div>
      <Text />
      <div
        ref={wrap}
        className="fixed bottom-[40px] left-1/2 -translate-x-1/2 flex flex-col items-center max-sm:bottom-20"
      >
        <div className="w-[42px] h-[68px] border border-[#909090] rounded-full p-[10px]">
          <div className="h-1/3 flex justify-center w-full">
            <div className="w-[8px] bg-[#000] rounded-full scrollbar origin-bottom self-start"></div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-10 right-10 max-sm:bottom-5 max-sm:right-5">
        <a
          href="https://square43.com/lab"
          className="inline-flex cursor-pointer items-center button font-semibold uppercase justify-center gap-2 whitespace-nowrap  transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none bg-[#ffff00] hover:bg-neutral-900 hover:text-neutral-50 active:bg-neutral-50 active:text-neutral-900 h-16 px-8 py-5 max-sm:px-4 max-sm:py-2 max-sm:h-auto"
        >
          Back to square43
        </a>
      </div>
    </ProjectHoverProvider>
  );
}

