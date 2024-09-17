import { Canvas } from "@react-three/fiber";
import { Color } from "three";
import Scene from "./Scene";

function App() {
  return (
    <>
      <div id="canvas-container" className="fixed top-0 left-0 w-full h-full">
        <Canvas
          camera={{ position: [0, 0, 20] }}
          scene={{ background: new Color("#102020") }}
        >
          <Scene />
        </Canvas>
      </div>
      {/* <div className="h-screen relative z-[1] flex justify-center items-center">
        <h1 className="text-center font-bold tracking-[-0.4px] text-[64px] text-[#fff]">
          Lab43
        </h1>
      </div> */}
    </>
  );
}

export default App;
