"use client";

import { useEffect, useState } from "react";
import type { ReactElement } from "react";

export function BackToTop(): ReactElement {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button
      onClick={scrollToTop}
      aria-label="回到顶部"
      className={`fixed top-1/2 right-6 z-50 -translate-y-1/2 flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-primary text-background text-xs font-semibold shadow-[0_8px_32px_rgba(0,0,0,0.28)] transition-all duration-300 hover:opacity-90 hover:scale-105 active:scale-95 ${
        visible ? "opacity-100 translate-x-0 pointer-events-auto" : "opacity-0 translate-x-16 pointer-events-none"
      }`}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <polyline points="18 15 12 9 6 15" />
      </svg>
      顶部
    </button>
  );
}
