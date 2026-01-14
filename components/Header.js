"use client";

import React from "react";

export default function Header() {
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
            </div>
         </header>
      </>
   );
}
