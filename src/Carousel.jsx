import React, { useRef, useMemo } from "react";
import { useTexture } from "@react-three/drei";
import { DoubleSide, UniformsLib, Vector3 } from "three";
import gsap from "gsap";
import fragment from "./shaders/fragment.frag";
import vertex from "./shaders/vertex.vert";
import { getProjects } from "./data/projects";
import { useThree } from "@react-three/fiber";
import { useProjectHover } from "../context/ProjectHoverContext";

export function Carousel() {
   const { setIsHovered, setHoveredProject } = useProjectHover();
   const { camera } = useThree();
   const cards = getProjects();

   const handleClick = (url) => {
      window.open(url, "_blank");
   };

   const handleHover = (e, card) => {
      const isTopMost = e.intersections[0].object === e.object;

      const mesh = e.object;

      const distance = mesh
         .getWorldPosition(new Vector3())
         .distanceTo(camera.position);

      if (distance < 5 && isTopMost) {
         gsap.to(e.object.material.uniforms.uIntensity, {
            value: 0.5,
            duration: 1,
         });
         setHoveredProject(card.name);
         setIsHovered(true);
      }
   };

   const handleLeave = (e) => {
      const mesh = e.object;

      const distance = mesh
         .getWorldPosition(new Vector3())
         .distanceTo(camera.position);
      if (distance < 5) {
         gsap.to(e.object.material.uniforms.uIntensity, {
            value: 0,
            duration: 1,
         });
         setHoveredProject(null);
         setIsHovered(false);
      }
   };

   return (
      <group rotation={[0, 0, -0.1]}>
         {cards.map((card, i) => {
            const totalCards = cards.length;
            const radius =
               window.innerWidth < 900
                  ? cards.length * 0.25
                  : cards.length * 0.5;
            return (
               <mesh
                  onPointerEnter={(e) => handleHover(e, card)}
                  onPointerLeave={handleLeave}
                  onClick={() => handleClick(card.url)}
                  key={i}
                  position={[
                     Math.sin((i / totalCards) * Math.PI * 2) * radius,
                     0,
                     Math.cos((i / totalCards) * Math.PI * 2) * radius,
                  ]}
                  rotation={[0, (i / totalCards) * Math.PI * 2, 0]}
               >
                  <planeGeometry />
                  <FallbackMaterial url={card.image} />
               </mesh>
            );
         })}
      </group>
   );
}

function FallbackMaterial({ url }) {
   const texture = useTexture(url);

   const uniforms = useMemo(
      () => ({
         ...UniformsLib["fog"],
         uTexture: { value: texture },
         uIntensity: { value: 0 },
      }),
      [texture]
   );

   return (
      <shaderMaterial
         side={DoubleSide}
         fragmentShader={fragment}
         vertexShader={vertex}
         uniforms={uniforms}
         fog={true}
         attach="material"
      />
   );
}
