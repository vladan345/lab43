"use client";
import World from "./ui/World";
import { ReactLenis } from "lenis/react";

export default function page() {
  return (
    <ReactLenis root>
      <World />
    </ReactLenis>
  );
}
