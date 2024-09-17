import {
  ScrollControls,
  useScroll,
  useVideoTexture,
  useTexture,
} from "@react-three/drei";
import React, { useRef, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { DoubleSide } from "three";

export default function Scene() {
  return (
    <>
      <ScrollControls infinite pages={6}>
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
    easing.damp3(
      state.camera.position,
      [-state.pointer.x * 0.5, state.pointer.y * 0.25, 4],
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

function Carousel({ radius = 3, count = 13 }) {
  return (
    <group rotation={[0, 0, -0.1]}>
      {Array.from({ length: count }, (_, i) => {
        return (
          <mesh
            key={i}
            position={[
              Math.sin((i / count) * Math.PI * 2) * radius,
              0,
              Math.cos((i / count) * Math.PI * 2) * radius,
            ]}
            rotation={[0, (i / count) * Math.PI * 2, 0]}
          >
            <planeGeometry />
            <Suspense fallback={<FallbackMaterial url="/test.jpg" />}>
              <VideoMaterial url={`/temp${i % 5}.mp4`} />
            </Suspense>
          </mesh>
        );
      })}
    </group>
  );
}

function VideoMaterial({ url }) {
  const texture = useVideoTexture(url, {
    start: true,
    muted: true,
    loop: true,
    preload: "auto",
  });
  return (
    <meshBasicMaterial side={DoubleSide} map={texture} toneMapped={false} />
  );
}

function FallbackMaterial({ url }) {
  const texture = useTexture(url);
  return <meshBasicMaterial map={texture} toneMapped={false} />;
}
