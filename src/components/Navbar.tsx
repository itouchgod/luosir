"use client";

import Link from "next/link";
import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import { BrandMark } from "./BrandMark";
import { ThemeToggle } from "./ThemeToggle";

type NavItem = {
  readonly label: string;
  readonly href: string;
};

const navItems: readonly NavItem[] = [
  { label: "导航", href: "/go" },
  { label: "关于", href: "#about" },
  { label: "项目", href: "#work" },
  { label: "联系", href: "#contact" },
];

export function Navbar(): ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 16);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        hasScrolled
          ? "border-b border-white/10 bg-background/75 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl"
          : "bg-background/35 backdrop-blur-md"
      }`}
    >
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10"
      >
        <Link
          href="/"
          className="flex items-center gap-3 font-heading text-lg font-bold tracking-[0.18em] text-foreground uppercase"
          onClick={() => setIsOpen(false)}
        >
          <BrandMark size={38} priority />
          <span>Luo Sir</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
        </div>

        <button
          type="button"
          className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-foreground transition hover:border-white/20 hover:bg-white/[0.06] md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
        >
          <span className="relative h-4 w-5">
            <span
              className={`absolute left-0 top-0 h-0.5 w-5 rounded-full bg-current transition ${
                isOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[7px] h-0.5 w-5 rounded-full bg-current transition ${
                isOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[14px] h-0.5 w-5 rounded-full bg-current transition ${
                isOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </nav>

      <div
        className={`grid overflow-hidden border-white/10 transition-all duration-300 md:hidden ${
          isOpen
            ? "grid-rows-[1fr] border-t bg-background/95"
            : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-3 text-sm font-medium text-muted transition hover:bg-white/[0.05] hover:text-foreground"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
