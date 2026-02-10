import { useTexture } from "@react-three/drei";
import vertexShader from "./shaders/vertex.vert";
import fragmentShader from "./shaders/fragment.frag";
import atmosphereVertexShader from "./shaders/atmosphereVertex.vert";
import atmosphereFragmentShader from "./shaders/atmosphereFragment.frag";
import { useRef } from "react";
import { AdditiveBlending, Color, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";

export default function Scene() {
   const pointsRef = useRef(null);
   const groupRef = useRef(null);

   const { particleSize, particleColor, atmosphereColor } = useControls({
      particleSize: {
         value: 150.0,
         min: 1,
         max: 300,
         step: 1,
      },
      particleColor: {
         value: "#9945ff",
      },
      atmosphereColor: {
         value: "#14f195",
      },
   });

   const earthTexture = useTexture("/3d/earth.jpg");

   const uniforms = useRef({
      uTexture: { value: earthTexture },
      uParticleSize: { value: particleSize },
      uParticleColor: { value: new Color(particleColor) },
      uTime: { value: 0 },
   }).current;

   const atmosphereUniforms = useRef({
      uAtmosphereColor: { value: new Color(atmosphereColor) },
   }).current;

   useFrame(({ clock }) => {
      uniforms.uTime.value = clock.getElapsedTime();
      uniforms.uParticleSize.value = particleSize;
      uniforms.uParticleColor.value.set(particleColor);
      atmosphereUniforms.uAtmosphereColor.value.set(atmosphereColor);

      if (groupRef.current) {
         groupRef.current.rotation.y += 0.003;
      }
   });

   return (
      <group ref={groupRef}>
         <points ref={pointsRef}>
            {/* <icosahedronGeometry args={[1, 30]} /> */}
            <sphereGeometry args={[1, 120, 120]} />
            <shaderMaterial
               vertexShader={vertexShader}
               fragmentShader={fragmentShader}
               uniforms={uniforms}
               depthWrite={false}
               transparent={true}
               blending={AdditiveBlending}
            />
         </points>
         {/* Atmospheric ring glow - 1.04 scale, gradient from color to transparent */}
         <mesh scale={0.95}>
            <sphereGeometry args={[1, 64, 64]} />
            <shaderMaterial
               vertexShader={atmosphereVertexShader}
               fragmentShader={atmosphereFragmentShader}
               uniforms={atmosphereUniforms}
               transparent={true}
               depthWrite={false}
               blending={AdditiveBlending}
            />
         </mesh>
      </group>
   );
}
