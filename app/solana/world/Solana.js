import React, { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { SpotLightHelper, DoubleSide } from "three";
import { useHelper } from "@react-three/drei";
import { Environment } from "@react-three/drei";
import { useControls, folder } from "leva";
import gsap from "gsap";

export function Solana(props) {
  const { nodes, materials } = useGLTF("/solana.glb");

  const {
    roughness,
    metalness,
    clearcoatRoughness,
    sheenRoughness,
    iridescenceIOR,
    transmission,
    ior,
    thickness,
  } = useControls("Material", {
    roughness: { value: 0, min: 0, max: 1 },
    metalness: { value: 0, min: 0, max: 1 },
    Glass: folder({
      transmission: { value: 1, min: 0, max: 1 },
      ior: { value: 3, min: 1, max: 2.333 },
      thickness: { value: 0.1, min: 0, max: 1 },
    }),
  });

  const spotLight = useRef(null);

  //   useHelper(spotLight, SpotLightHelper, "transparent");
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube005.geometry}
        scale={0.25}
      >
        <meshPhysicalMaterial
          // {...texture}
          roughness={roughness}
          metalness={metalness}
          transparent
          side={DoubleSide}
          displacementScale={0.1}
          // clearcoat={1}
          // clearcoatRoughness={clearcoatRoughness}
          // sheen={1}
          // sheenRoughness={sheenRoughness}
          // sheenColor={"pink"}
          // iridescence={1}
          // iridescenceIOR={iridescenceIOR}
          // iridescenceThicknessRange={[100, 800]}
          transmission={transmission}
          ior={ior}
          thickness={thickness}
          color={"#dc1fff"}
        />
      </mesh>

      <spotLight
        ref={spotLight}
        color="#fff"
        intensity={4.5}
        distance={10}
        angle={Math.PI * 0.1}
        penumbra={0.25}
        decay={1}
        position={[3, 2, 5]}
      />

      <Environment preset="night" />
    </group>
  );
}

useGLTF.preload("/solana.glb");
