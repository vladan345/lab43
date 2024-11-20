import { Canvas } from "@react-three/fiber";
import { Color } from "three";
import Scene from "./Scene";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
function App() {
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
      <>
         <div
            id="canvas-container"
            className="fixed top-0 left-0 w-full h-full"
         >
            <Canvas
               camera={{ position: [0, 0, 20] }}
               scene={{ background: new Color(background) }}
            >
               <fog attach="fog" color={background} near={2} far={4.5} />
               <Scene />
            </Canvas>
         </div>
         <div
            ref={wrap}
            className="fixed bottom-[40px] left-1/2 -translate-x-1/2 flex flex-col items-center"
         >
            <p className="uppercase text-[14px] mb-[5px]">scroll</p>
            <div className="w-[30px] h-[50px] border border-black rounded-full p-[5px]">
               <div className="h-1/2 flex justify-center w-full">
                  <div className="w-[8px] bg-red-500 rounded-full scrollbar origin-bottom self-start"></div>
               </div>
            </div>
         </div>
      </>
   );
}

export default App;
