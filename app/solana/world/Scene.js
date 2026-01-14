import { useMemo, useState, useRef, useEffect } from "react";
import { useControls } from "leva";
import { AdditiveBlending, Color } from "three";
import { Solana } from "./Solana";
import gsap from "gsap";
import { useTexture } from "@react-three/drei";

export default function Scene() {
  const [committedCount, setCommittedCount] = useState(100000);
  const [committedRadius, setCommittedRadius] = useState(5);
  const [committedBranches, setCommittedBranches] = useState(3);
  const [committedSpin, setCommittedSpin] = useState(1);
  const [committedRandomness, setCommittedRandomness] = useState(0.2);
  const [committedRandomnessPower, setCommittedRandomnessPower] = useState(3);
  const [committedInsideColor, setCommittedInsideColor] = useState("#00FFA3");
  const [committedOutsideColor, setCommittedOutsideColor] = useState("#DC1FFF");

  const particleTexture = useTexture("/stars/3.png");

  // Leva controls
  const {
    count,
    size,
    radius,
    branches,
    spin,
    randomness,
    randomnessPower,
    insideColor,
    outsideColor,
  } = useControls("Stars", {
    count: {
      value: committedCount,
      min: 100,
      max: 100000,
      step: 100,
      onEditEnd: (v) => setCommittedCount(v), // only update when released
    },
    size: { value: 0.05, min: 0.001, max: 0.1, step: 0.001 },
    radius: {
      value: committedRadius,
      min: 0.01,
      max: 20,
      step: 0.01,
      onEditEnd: (v) => setCommittedRadius(v),
    },
    branches: {
      value: committedBranches,
      min: 3,
      max: 20,
      step: 1,
      onEditEnd: (v) => setCommittedBranches(v),
    },
    spin: {
      value: committedSpin,
      min: -5,
      max: 5,
      step: 0.001,
      onEditEnd: (v) => setCommittedSpin(v),
    },
    randomness: {
      value: committedRandomness,
      min: 0,
      max: 2,
      step: 0.001,
      onEditEnd: (v) => setCommittedRandomness(v),
    },
    randomnessPower: {
      value: committedRandomnessPower,
      min: 1,
      max: 10,
      step: 0.001,
      onEditEnd: (v) => setCommittedRandomnessPower(v),
    },
    insideColor: {
      value: committedInsideColor,
      onEditEnd: (v) => setCommittedInsideColor(v),
    },
    outsideColor: {
      value: committedOutsideColor,
      onEditEnd: (v) => setCommittedOutsideColor(v),
    },
  });

  const galaxy = useRef();
  useEffect(() => {
    if (galaxy.current) {
      galaxy.current.scale.set(0, 0, 0);
      gsap.to(galaxy.current.scale, {
        x: 2,
        y: 2,
        z: 2,
        duration: 2,
        ease: "power2.inOut",
      });

      gsap.to(galaxy.current?.rotation, {
        y: Math.PI * 2,
        duration: 200,
        repeat: -1,
        ease: "linear",
      });
    }
  }, []);

  // Only regenerate when committed values change
  const attributes = useMemo(() => {
    const arr = new Float32Array(committedCount * 3);
    const arrColor = new Float32Array(committedCount * 3);

    const insideColor = new Color(committedInsideColor);
    const outsideColor = new Color(committedOutsideColor);

    for (let i = 0; i < committedCount; i++) {
      const i3 = i * 3;

      // Positions
      const r = Math.random() * committedRadius;
      const spinAngle = r * committedSpin;
      const branchAngle =
        ((i % committedBranches) / committedBranches) * Math.PI * 2;

      const randomX =
        Math.pow(Math.random(), committedRandomnessPower) *
        (Math.random() < 0.5 ? -1 : 1);
      const randomY =
        Math.pow(Math.random(), committedRandomnessPower) *
        (Math.random() < 0.5 ? -1 : 1);
      const randomZ =
        Math.pow(Math.random(), committedRandomnessPower) *
        (Math.random() < 0.5 ? -1 : 1);
      arr[i3 + 0] = Math.cos(branchAngle + spinAngle) * r + randomX;
      arr[i3 + 1] = randomY;
      arr[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + randomZ;

      // Colors
      const mixedColor = insideColor.clone();
      mixedColor.lerp(outsideColor, r / committedRadius);

      arrColor[i3 + 0] = mixedColor.r;
      arrColor[i3 + 1] = mixedColor.g;
      arrColor[i3 + 2] = mixedColor.b;
    }
    return { positions: arr, colors: arrColor };
  }, [
    committedCount,
    committedRadius,
    committedBranches,
    committedSpin,
    committedRandomness,
    committedRandomnessPower,
    committedInsideColor,
    committedOutsideColor,
  ]);

  return (
    <group>
      <Solana />
      <points
        rotation-z={3}
        ref={galaxy}
        key={`${committedCount}-${committedRadius}-${committedBranches}-${committedSpin}-${committedRandomness}-${committedRandomnessPower}-${committedInsideColor}-${committedOutsideColor}`}
      >
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={attributes.positions}
            count={committedCount}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            array={attributes.colors}
            count={committedCount}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="white"
          size={size}
          depthWrite={false}
          blending={AdditiveBlending}
          vertexColors={true}
          alphaMap={particleTexture}
        />
      </points>
    </group>
  );
}
