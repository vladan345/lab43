import { useGLTF, useTexture } from "@react-three/drei";
import { useControls } from "leva";
import { Color, MeshPhysicalMaterial, SRGBColorSpace, DoubleSide } from "three";
import { useFrame, useThree } from "@react-three/fiber";

/**
 * Renders a plane with the gradient texture,
 * always facing the camera (billboarding),
 * and uses a MeshBasicMaterial to ignore lights.
 */

export default function Scene(props) {
  const { nodes, materials } = useGLTF("/3d/solana-new.glb");
  const gradient = useTexture("/3d/gradient.png", (texture) => {
    texture.colorSpace = SRGBColorSpace;
  });
  const alpha = useTexture("/3d/alpha.png");

  const {
    opacity,
    roughness,
    metalness,
    clearcoatRoughness,
    sheenRoughness,
    iridescenceIOR,
    ior,
    thickness,
    transmission,
  } = useControls({
    opacity: {
      value: 1,
      min: 0,
      max: 1,
      step: 0.01,
    },
    roughness: {
      value: 0,
      min: 0,
      max: 1,
      step: 0.01,
    },
    metalness: {
      value: 0.95,
      min: 0,
      max: 1,
      step: 0.01,
    },
    clearcoatRoughness: { value: 1, min: 0, max: 1 },
    sheenRoughness: { value: 1, min: 0, max: 1 },
    iridescenceIOR: { value: 1.5, min: 1, max: 2.333 },
    transmission: { value: 1, min: 0, max: 1 },
    ior: { value: 1.5, min: 1, max: 2.333 },
    thickness: { value: 0.5, min: 0, max: 3 },
  });

  const glassMaterial = new MeshPhysicalMaterial({
    color: new Color("#AE35CC"),
    transparent: true,
    clearcoatRoughness: clearcoatRoughness,
    sheenRoughness: sheenRoughness,
    iridescenceIOR: iridescenceIOR,
    transmission: transmission,
    ior: ior,
    thickness: thickness,
    opacity: opacity,
  });

  useFrame(() => {
    glassMaterial.opacity = opacity;
    glassMaterial.roughness = roughness;
    glassMaterial.metalness = metalness;
    glassMaterial.clearcoatRoughness = clearcoatRoughness;
    glassMaterial.sheenRoughness = sheenRoughness;
    glassMaterial.iridescenceIOR = iridescenceIOR;
    glassMaterial.transmission = transmission;
    glassMaterial.ior = ior;
    glassMaterial.thickness = thickness;
  });

  return (
    <group {...props} dispose={null} position={[0, -1, 0]}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["1_3"].geometry}
        material={glassMaterial}
        position={[0, 2.146, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.77}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["2_remesh_2"].geometry}
        material={glassMaterial}
        position={[0, 0.954, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.382}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["3_remesh_2"].geometry}
        material={glassMaterial}
        position={[0, -0.229, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.382}
      />

      <mesh position={[-2, 1, -2]} rotation-y={Math.PI * 0.25} scale={10}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={gradient}
          transparent={true}
          opacity={1}
          depthWrite={false} // Important for proper transparency
          side={DoubleSide}
        />
      </mesh>
    </group>
  );
}

useGLTF.preload("/3d/solana-new.glb");
