"use client";

import { useEffect } from "react";

export function SmoothScroll() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement)?.closest('a[href^="#"]') as
        | HTMLAnchorElement
        | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({
        top: (target as HTMLElement).offsetTop - 60,
        behavior: "smooth",
      });
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
