import { ScrollControls, useScroll } from "@react-three/drei";
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { Carousel } from "./Carousel";
import { getProjects } from "./data/projects";
import { BlackParticles } from "./Particles";
export default function Scene() {
   return (
      <>
         <ScrollControls infinite pages={10} damping={0.5}>
            <Rig scale={window.innerWidth < 900 ? 1.2 : 1} />
            <ambientLight args={["#fff", 3]} />
            <BlackParticles count={5000} width={10} height={10} depth={10} />
         </ScrollControls>
      </>
   );
}
function Rig(props) {
   const rig = useRef();
   const scroll = useScroll();

   const cards = getProjects();

   useFrame((state, delta) => {
      rig.current.rotation.y = -scroll.offset * (Math.PI * 2); // Rotate contents
      state.events.update(); // Raycasts every frame rather than on pointer-move
      easing.damp3(rig.current.position, [state.pointer.x * 0.25, 0, 0]);
      easing.damp3(
         state.camera.position,
         [0, -state.pointer.y * 0.25, cards.length * 0.7],
         0.3,
         delta
      );

      state.camera.lookAt(0, 0, 0); // Look at center
   });
   return (
      <group ref={rig} {...props}>
         <Carousel />
      </group>
   );
}
