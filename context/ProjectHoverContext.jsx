// ProjectHoverContext.tsx
import { createContext, useContext, useState } from "react";

const ProjectHoverContext = createContext();

export function ProjectHoverProvider({ children }) {
   const [hoveredProject, setHoveredProject] = useState(null);
   const [isHovered, setIsHovered] = useState(false);
   return (
      <ProjectHoverContext.Provider
         value={{ hoveredProject, setHoveredProject, isHovered, setIsHovered }}
      >
         {children}
      </ProjectHoverContext.Provider>
   );
}

export function useProjectHover() {
   return useContext(ProjectHoverContext);
}
