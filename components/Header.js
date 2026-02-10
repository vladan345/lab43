"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { getProjects } from "@/data/projects";
export default function Header() {
   const [isMenuActive, setIsMenuActive] = useState(false);

   const projects = getProjects(true);
   return (
      <>
         <header className="fixed top-0 left-0 z-50 w-full py-10 mix-blend-difference transition-transform">
            <div className="wrapper flex items-center justify-center">
               <a href="https://square43.com">
                  <img
                     src="/logo.svg"
                     alt="Square43 Logo"
                     className="w-80 max-w-none cursor-pointer invert max-sm:w-40"
                  />
               </a>

               <div
                  className="group absolute right-8 top-1/2 -translate-y-1/2 h-10 w-10 cursor-pointer max-sm:h-6 max-sm:w-6"
                  onClick={() => {
                     setIsMenuActive(!isMenuActive);
                  }}
               >
                  <div className="absolute top-0 left-0 h-0.5 w-full bg-white max-sm:h-px"></div>
                  <div
                     className={cn(
                        "absolute top-1/3 left-1/2 h-0.5 w-full -translate-1/2 bg-white transition-all duration-300 max-sm:h-px md:group-hover:top-1/2 md:group-hover:left-0 md:group-hover:-rotate-90",
                        isMenuActive && "top-1/2 left-1/2! -rotate-45!",
                     )}
                  ></div>
                  <div
                     className={cn(
                        "absolute top-2/3 left-1/2 h-0.5 w-full -translate-1/2 bg-white transition-all duration-300 max-sm:h-px md:group-hover:top-1/2 md:group-hover:left-full md:group-hover:rotate-90",
                        isMenuActive && "top-1/2 left-1/2! rotate-45!",
                     )}
                  ></div>
                  <div className="absolute bottom-0 left-0 h-0.5 w-full bg-white max-sm:h-px"></div>


               </div>
            </div>

         </header>
         <div className={cn("fixed top-30 right-8 z-1000 w-100 max-sm:top-25 max-sm:w-full max-sm:right-0 overflow-hidden transition-all duration-700 bg-white text-black", isMenuActive ? "max-h-200 p-6" : "max-h-0 p-0")}>
            <ul className="flex flex-col items-end gap-2 max-sm:items-center">
               {projects.map((project, idx) => (
                  <li key={idx} className="text-2xl max-sm:text-lg font-medium uppercase">
                     <a href={project.url} target="_blank" rel="noopener noreferrer">
                        {project.name}
                     </a>
                  </li>
               ))}
            </ul>
         </div>
      </>
   );
}
