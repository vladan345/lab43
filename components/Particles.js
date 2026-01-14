"use client";

import React, { useRef, useMemo, useEffect } from "react";
import gsap from "gsap";
import { useTexture } from "@react-three/drei";

export function BlackParticles({
  count = 1000,
  width = 1,
  height = 1,
  depth = 1,
  positionZ = -1,
  size = 0.06,
  speed = 200,
}) {
  const mesh = useRef();
  const texture = useTexture("/square.png");

  useEffect(() => {
    if (mesh.current) {
      mesh.current.scale.set(0, 0, 0);
      gsap.to(mesh.current.scale, {
        x: 1,
        y: 1,
        z: 1,
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

  const particles = useMemo(() => {
    const positions = [];
    for (let i = 0; i < count; i++) {
      const x = Math.random() * width - width / 2;
      const y = Math.random() * height - height / 2;
      const z = Math.random() * depth - depth / 2;
      positions.push(x, y, z);
    }
    return new Float32Array(positions);
  }, [count, width, height, depth]);

  return (
    <group ref={mesh} position={[0, 0, positionZ]} raycast={() => null}>
      <points raycast={() => null}>
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
