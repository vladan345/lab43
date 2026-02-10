import { editable as e } from "@theatre/r3f";

export default function Scene() {
  return (
    <group>
      <e.mesh theatreKey="Box">
        <boxGeometry />
        <meshStandardMaterial color="red" />
      </e.mesh>

      <e.pointLight theatreKey="Light" position={[10, 10, 10]} intensity={10} />
    </group>
  );
}
