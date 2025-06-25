import React, { useRef, useMemo, useEffect } from "react";
import gsap from "gsap";
import { useTexture } from "@react-three/drei";

export function BlackParticles({
   count = 1000,
   width = 1, // Size of the width for the bounding box
   height = 1, // Size of the height for the bounding box
   depth = 1, // Size of the depth for the bounding box
   positionZ = -1,
   size = 0.06, // Particle size
   speed = 200,
}) {
   const mesh = useRef();
   const texture = useTexture("/square.png");
   // GSAP animations for rotation and position
   useEffect(() => {
      if (mesh.current) {
         gsap.from(mesh.current?.scale, {
            x: 0,
            y: 0,
            z: 0,
            duration: 2,
            ease: "power2.inOut",
         });

         gsap.to(mesh.current?.rotation, {
            y: -Math.PI * 2,
            x: -Math.PI * 2,
            duration: speed,
            repeat: -1,
            ease: "linear",
         });
      }
   }, [speed]);

   // Generate particles' positions within a bounding box
   const particles = useMemo(() => {
      const positions = [];

      for (let i = 0; i < count; i++) {
         // Generate random positions within the specified bounding box
         const x = Math.random() * width - width / 2;
         const y = Math.random() * height - height / 2;
         const z = Math.random() * depth - depth / 2;

         positions.push(x, y, z);
      }

      return new Float32Array(positions);
   }, [count, width, height, depth]);

   return (
      <group ref={mesh} position={[0, 0, positionZ]}>
         <points>
            <bufferGeometry>
               <bufferAttribute
                  attach="attributes-position"
                  array={particles}
                  count={count}
                  itemSize={3}
               />
            </bufferGeometry>
            <pointsMaterial
               size={size}
               map={texture}
               color={"#2a2a2a"}
               transparent
               depthWrite={true}
               alphaTest={0.1}
               opacity={0.7}
            />
         </points>
      </group>
   );
}
