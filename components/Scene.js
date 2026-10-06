"use client";

import { ScrollControls, useScroll } from "@react-three/drei";
import React, { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { Carousel } from "@/components/Carousel";
import { getProjects } from "@/data/projects";
import { BlackParticles } from "@/components/Particles";

export default function Scene() {
  return (
    <>
      <ScrollControls infinite pages={10} damping={0.5}>
        <Rig
          scale={
            typeof window !== "undefined" && window.innerWidth < 900 ? 1.2 : 1
          }
        />
        <ambientLight args={["#fff", 3]} />
        <BlackParticles count={5000} width={10} height={10} depth={10} />
      </ScrollControls>
    </>
  );
}

function Rig(props) {
  const rig = useRef();
  const scroll = useScroll();
  const cards = getProjects();

  useEffect(() => {
    const el = scroll.el;
    const target = scroll.scroll;
    if (!el || !target) return;

    // Fiber reconnects pointer events to the canvas wrapper and drops
    // ScrollControls' listener, so offset stays at 0. Follow the scroller directly.
    let disableScroll = true;
    let firstRun = true;
    const enableTimer = setTimeout(() => {
      disableScroll = false;
    }, 40);

    const onScroll = () => {
      if (firstRun) return;
      const scrollThreshold = el.scrollHeight - el.clientHeight;
      if (scrollThreshold <= 0) return;

      const current = el.scrollTop;
      target.current = current / scrollThreshold;

      if (!disableScroll) {
        if (current >= scrollThreshold) {
          const damp = 1 - scroll.offset;
          el.scrollTop = 1;
          target.current = scroll.offset = -damp;
          disableScroll = true;
        } else if (current <= 0) {
          const damp = 1 + scroll.offset;
          el.scrollTop = el.scrollHeight;
          target.current = scroll.offset = damp;
          disableScroll = true;
        }
      }

      if (disableScroll) {
        setTimeout(() => {
          disableScroll = false;
        }, 40);
      }
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    const frame = requestAnimationFrame(() => {
      firstRun = false;
    });

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(enableTimer);
      el.removeEventListener("scroll", onScroll);
    };
  }, [scroll]);

  useFrame((state, delta) => {
    if (!rig.current) return;
    rig.current.rotation.y = -scroll.offset * (Math.PI * 2);
    state.events.update();
    easing.damp3(rig.current.position, [state.pointer.x * 0.25, 0, 0]);
    easing.damp3(
      state.camera.position,
      [0, -state.pointer.y * 0.25, cards.length * 0.7],
      0.3,
      delta,
    );

    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={rig} {...props}>
      <Carousel />
    </group>
  );
}
