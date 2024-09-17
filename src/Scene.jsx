import { ScrollControls, useScroll, Image } from "@react-three/drei";
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";

export default function Scene() {
  return (
    <>
      <ScrollControls infinite pages={4}>
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
      [-state.pointer.x * 0.5, state.pointer.y * 0.5, 3],
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

function Carousel({ radius = 2, count = 8 }) {
  return (
    <group rotation={[0, 0, -0.1]}>
      {Array.from({ length: count }, (_, i) => (
        <Image
          position={[
            Math.sin((i / count) * Math.PI * 2) * radius,
            0,
            Math.cos((i / count) * Math.PI * 2) * radius,
          ]}
          rotation={[0, Math.PI + (i / count) * Math.PI * 2, 0]}
          side={2}
          url="/test.jpg"
        />
      ))}
    </group>
  );
}
