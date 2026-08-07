"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import { BrandMark } from "./BrandMark";
import { ThemeToggle } from "./ThemeToggle";

type NavItem = {
  readonly label: string;
  readonly href: string;
};

const navItems: readonly NavItem[] = [
  { label: "首页", href: "/" },
  { label: "导航", href: "/go" },
];

const projectItems: readonly NavItem[] = [
  { label: "易学", href: "/projects/yijing/bazi-align" },
];

function ChevronIcon({
  className = "",
}: {
  readonly className?: string;
}): ReactElement {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m6 8 4 4 4-4" />
    </svg>
  );
}

export function Navbar(): ReactElement {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(
    pathname.startsWith("/projects")
  );
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
        aria-label="主导航"
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
              aria-current={pathname === item.href ? "page" : undefined}
              className={`text-sm font-medium transition-colors hover:text-foreground ${
                pathname === item.href ? "text-foreground" : "text-muted"
              }`}
            >
              {item.label}
            </Link>
          ))}

          <details className="group relative">
            <summary
              className={`flex cursor-pointer list-none items-center gap-1 text-sm font-medium transition-colors hover:text-foreground [&::-webkit-details-marker]:hidden ${
                pathname.startsWith("/projects")
                  ? "text-foreground"
                  : "text-muted"
              }`}
            >
              项目
              <ChevronIcon className="h-4 w-4 transition-transform group-open:rotate-180" />
            </summary>
            <div className="absolute right-0 top-full pt-3">
              <div className="w-40 rounded-2xl border border-white/10 bg-background/95 p-2 shadow-[0_18px_60px_rgba(0,0,0,0.3)] backdrop-blur-xl">
                {projectItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className={`block rounded-xl px-3 py-2.5 text-sm font-medium transition hover:bg-white/[0.06] hover:text-foreground ${
                      pathname === item.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </details>
          <ThemeToggle />
        </div>

        <button
          type="button"
          className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-foreground transition hover:border-white/20 hover:bg-white/[0.06] md:hidden"
          aria-label={isOpen ? "关闭导航菜单" : "打开导航菜单"}
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
                aria-current={pathname === item.href ? "page" : undefined}
                className={`rounded-xl px-3 py-3 text-sm font-medium transition hover:bg-white/[0.05] hover:text-foreground ${
                  pathname === item.href
                    ? "bg-white/[0.05] text-foreground"
                    : "text-muted"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            <div>
              <button
                type="button"
                aria-expanded={isProjectsOpen}
                onClick={() => setIsProjectsOpen((current) => !current)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm font-medium transition hover:bg-white/[0.05] hover:text-foreground ${
                  pathname.startsWith("/projects")
                    ? "text-foreground"
                    : "text-muted"
                }`}
              >
                项目
                <ChevronIcon
                  className={`h-4 w-4 transition-transform ${isProjectsOpen ? "rotate-180" : ""}`}
                />
              </button>
              <div
                aria-hidden={!isProjectsOpen}
                className={`grid transition-[grid-template-rows] duration-200 ${
                  isProjectsOpen
                    ? "visible grid-rows-[1fr]"
                    : "invisible grid-rows-[0fr]"
                }`}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="ml-3 border-l border-white/10 py-1 pl-3">
                    {projectItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        aria-current={
                          pathname === item.href ? "page" : undefined
                        }
                        className={`block rounded-xl px-3 py-2.5 text-sm font-medium transition hover:bg-white/[0.05] hover:text-foreground ${
                          pathname === item.href
                            ? "bg-primary/10 text-primary"
                            : "text-muted"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
