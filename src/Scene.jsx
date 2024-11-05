import {
   ScrollControls,
   useScroll,
   useVideoTexture,
   useTexture,
} from "@react-three/drei";
import React, { useRef, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { DoubleSide, Vector2 } from "three";

import fragment from "./shaders/fragment.frag";
import vertex from "./shaders/vertex.vert";

export default function Scene() {
   return (
      <>
         <ScrollControls infinite pages={10} damping={0.5}>
            <Rig scale={window.innerWidth < 900 ? 0.6 : 1} />
            <ambientLight args={["#fff", 3]} />
            <directionalLight args={["#fff", 3]} />
         </ScrollControls>
      </>
   );
}
function Rig(props) {
   const rig = useRef();
   const scroll = useScroll();

   useFrame((state, delta) => {
      rig.current.rotation.y = -scroll.offset * (Math.PI * 2); // Rotate contents
      state.events.update(); // Raycasts every frame rather than on pointer-move
      easing.damp3(rig.current.position, [state.pointer.x * 0.25, 0, 0]);
      easing.damp3(
         state.camera.position,
         [0, -state.pointer.y * 0.25, 2],
         0.3,
         delta
      ); // Move camera

      state.camera.lookAt(0, 0, 0); // Look at center
   });
   return (
      <group ref={rig} {...props}>
         <Carousel />
      </group>
   );
}

function Carousel({ radius = 0.5, count = 3 }) {
   const handleClick = () => {
      window.open("https://cofecofe.vercel.app/", "_blank");
   };
   return (
      <group rotation={[0, 0, -0.1]}>
         {Array.from({ length: count }, (_, i) => {
            return (
               <mesh
                  onClick={handleClick}
                  key={i}
                  position={[
                     Math.sin((i / count) * Math.PI * 2) * radius,
                     0,
                     Math.cos((i / count) * Math.PI * 2) * radius,
                  ]}
                  rotation={[0, (i / count) * Math.PI * 2, 0]}
               >
                  <planeGeometry />
                  <Suspense fallback={<FallbackMaterial url="/cofe.png" />}>
                     <VideoMaterial url={`/temp${i + 1}.mp4`} />
                  </Suspense>
               </mesh>
            );
         })}
      </group>
   );
}

function VideoMaterial({ url }) {
   const ref = useRef(null);
   useFrame(({ pointer, clock }) => {
      ref.current.uniforms.u_time.value = clock.getElapsedTime();
      ref.current.uniforms.u_mouse.value = [pointer.x, pointer.y];
   });
   const texture = useVideoTexture(url, {
      start: false,
      muted: true,
      loop: true,
      preload: "auto",
   });
   const uniforms = {
      u_time: { value: 1 },
      u_resolution: { value: [window.innerWidth, window.innerHeight] },
      u_mouse: { value: [0, 0] },
   };
   return (
      <shaderMaterial
         side={DoubleSide}
         uniforms={uniforms}
         vertexShader={vertex}
         fragmentShader={fragment}
         ref={ref}
      />
   );
}

function FallbackMaterial({ url }) {
   const texture = useTexture(url);
   return (
      <meshBasicMaterial side={DoubleSide} map={texture} toneMapped={false} />
   );
}
