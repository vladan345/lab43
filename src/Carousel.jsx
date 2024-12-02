import React, { useRef } from "react";
import { useTexture } from "@react-three/drei";
import { DoubleSide, UniformsLib } from "three";
import gsap from "gsap";
import fragment from "./shaders/fragment.frag";
import vertex from "./shaders/vertex.vert";
import { getProjects } from "./data/projects";

export function Carousel() {
   const cards = getProjects();

   const handleClick = (url) => {
      window.open(url, "_blank");
   };

   const handleHover = (e) => {
      gsap.to(e.object.material.uniforms.uIntensity, {
         value: 0.5,
         duration: 1,
      });
   };

   const handleLeave = (e) => {
      gsap.to(e.object.material.uniforms.uIntensity, {
         value: 0,
         duration: 1,
      });
   };

   return (
      <group rotation={[0, 0, -0.1]}>
         {cards.map((card, i) => {
            const totalCards = cards.length;
            const radius = cards.length * 0.5;
            return (
               <mesh
                  onPointerEnter={handleHover}
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
   const material = useRef(null);
   const texture = useTexture(url);

   return (
      <shaderMaterial
         ref={material}
         side={DoubleSide}
         fragmentShader={fragment}
         vertexShader={vertex}
         uniforms={{
            ...UniformsLib["fog"],
            uTexture: { value: texture },
            uIntensity: { value: 0 },
         }}
         fog={true}
      />
   );
}
