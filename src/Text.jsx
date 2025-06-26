import { useEffect, useRef } from "react";
import { useProjectHover } from "../context/ProjectHoverContext";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { getProjects } from "./data/projects";

gsap.registerPlugin(SplitText);

export function Text() {
   const { hoveredProject, isHovered } = useProjectHover();
   const main = useRef(null);

   const projects = getProjects();
   return (
      <div
         ref={main}
         className="fixed w-full h-3/5 max-sm:h-2/5 flex items-center justify-center pointer-events-none mix-blend-difference"
      >
         {projects.map((project, index) => (
            <h1
               key={index}
               className={`text-white project-name text-[200px] max-sm:text-[12vw] max-2xl:text-[10vw] font-bold uppercase w-full leading-none absolute transition duration-500 top-1/2 left-1/2 -translate-1/2 text-center ${
                  hoveredProject === project.name && isHovered
                     ? "opacity-100"
                     : "opacity-0"
               }`}
            >
               {project.name}
            </h1>
         ))}
      </div>
   );
}
