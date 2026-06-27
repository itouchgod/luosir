"use client";

import Image from "next/image";
import Link from "next/link";
import type { ChangeEvent, ReactElement } from "react";
import { useEffect, useMemo, useState } from "react";
import { BrandMark } from "@/components/BrandMark";
import { NAV_CATEGORIES, type NavCategory, type NavLink } from "@/data/go-links";

type VisibleCategory = NavCategory & {
  links: NavLink[];
};

function getHostname(url: string): string {
  return new URL(url).hostname;
}

function getFaviconUrl(url: string): string {
  const hostname = getHostname(url);
  const params = new URLSearchParams({ domain: hostname, sz: "32" });

  return `https://www.google.com/s2/favicons?${params.toString()}`;
}

export default function GoPage(): ReactElement {
  const [query, setQuery] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState(
    NAV_CATEGORIES[0]?.id ?? ""
  );

  const normalizedQuery = query.trim().toLowerCase();

  const visibleCategories = useMemo<VisibleCategory[]>(() => {
    return NAV_CATEGORIES.map((category) => ({
      ...category,
      links: normalizedQuery
        ? category.links.filter((link) =>
            link.name.toLowerCase().includes(normalizedQuery)
          )
        : category.links,
    })).filter((category) => category.links.length > 0);
  }, [normalizedQuery]);

  useEffect(() => {
    if (
      visibleCategories.length > 0 &&
      !visibleCategories.some((category) => category.id === activeCategoryId)
    ) {
      setActiveCategoryId(visibleCategories[0].id);
    }
  }, [activeCategoryId, visibleCategories]);

  useEffect(() => {
    if (visibleCategories.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)
          .at(0);

        if (visibleEntry?.target.id) {
          setActiveCategoryId(visibleEntry.target.id);
        }
      },
      {
        rootMargin: "-28% 0px -58% 0px",
        threshold: [0.08, 0.2, 0.4, 0.6],
      }
    );

    for (const category of visibleCategories) {
      const section = document.getElementById(category.id);

      if (section) {
        observer.observe(section);
      }
    }

    return () => observer.disconnect();
  }, [visibleCategories]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-[-8rem] top-[-8rem] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.22),transparent_68%)] blur-3xl" />
        <div className="absolute right-[-10rem] top-40 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.18),transparent_70%)] blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.12),transparent_70%)] blur-3xl" />
      </div>

      <MobileTopBar
        activeCategoryId={activeCategoryId}
        query={query}
        visibleCategories={visibleCategories}
        onSearchChange={handleSearchChange}
      />

      <div className="mx-auto grid w-full max-w-[96rem] gap-8 px-5 py-6 sm:px-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:px-10 lg:py-10">
        <DesktopSidebar
          activeCategoryId={activeCategoryId}
          query={query}
          visibleCategories={visibleCategories}
          onSearchChange={handleSearchChange}
        />

        <div className="min-w-0">
          <header className="mb-10 rounded-[1.75rem] border border-white/10 bg-surface/70 p-6 shadow-[0_24px_90px_rgba(0,0,0,0.22)] backdrop-blur sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">
              Curated links
            </p>
            <div className="mt-4 flex items-center gap-4">
              <BrandMark size={64} priority />
              <h1 className="font-heading text-4xl font-bold text-foreground sm:text-6xl">
                常用导航
              </h1>
            </div>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted">
              AI、开发、设计、效率、学习与社交资源的快速入口。搜索会实时过滤所有链接名称。
            </p>
          </header>

          {visibleCategories.length > 0 ? (
            <div className="space-y-14">
              {visibleCategories.map((category) => (
                <section
                  key={category.id}
                  id={category.id}
                  className="scroll-mt-28"
                >
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
                      <BrandMark
                        size={32}
                        className="mr-3 align-middle"
                        aria-hidden="true"
                      />
                      {category.title}
                    </h2>
                    <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-bold text-muted">
                      {category.links.length}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                    {category.links.map((link) => (
                      <GoLinkCard
                        key={`${category.id}-${link.name}`}
                        link={link}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="rounded-[1.5rem] border border-white/10 bg-surface/70 p-10 text-center shadow-[0_24px_90px_rgba(0,0,0,0.2)]">
              <p className="font-heading text-2xl font-bold text-foreground">
                没有找到匹配的链接
              </p>
              <p className="mt-3 text-sm text-muted">试试更短的关键词。</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

type NavigationProps = {
  activeCategoryId: string;
  query: string;
  visibleCategories: VisibleCategory[];
  onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

function DesktopSidebar({
  activeCategoryId,
  query,
  visibleCategories,
  onSearchChange,
}: NavigationProps): ReactElement {
  return (
    <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] flex-col rounded-[1.5rem] border border-white/10 bg-surface/75 p-4 shadow-[0_24px_90px_rgba(0,0,0,0.24)] backdrop-blur lg:flex">
      <div className="mb-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 font-heading text-xl font-bold text-foreground">
              <BrandMark size={32} />
              <span>导航</span>
            </p>
            <p className="mt-1 text-xs text-muted">Quick launch board</p>
          </div>
          <Link
            href="/"
            className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-muted transition hover:border-white/25 hover:text-foreground"
          >
            ← 主页
          </Link>
        </div>

        <label className="mt-5 block">
          <span className="sr-only">搜索链接</span>
          <input
            type="search"
            value={query}
            onChange={onSearchChange}
            placeholder="搜索链接..."
            className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-foreground outline-none transition placeholder:text-muted/70 focus:border-primary/70 focus:ring-4 focus:ring-primary/15"
          />
        </label>
      </div>

      <nav aria-label="导航分类" className="flex-1 space-y-1 overflow-y-auto pr-1">
        {visibleCategories.map((category) => (
          <Link
            key={category.id}
            href={`#${category.id}`}
            className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
              activeCategoryId === category.id
                ? "border border-primary/40 bg-gradient-to-r from-primary/20 to-primary-end/15 text-foreground shadow-[0_12px_42px_rgba(124,58,237,0.18)]"
                : "border border-transparent text-muted hover:bg-white/[0.05] hover:text-foreground"
            }`}
          >
            <span className="flex items-center gap-2">
              <BrandMark size={22} aria-hidden="true" />
              {category.title}
            </span>
            <span className="text-xs text-muted">{category.links.length}</span>
          </Link>
        ))}
      </nav>

      <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-5 text-muted">
        © {new Date().getFullYear()} Luo Sir. Built for fast navigation.
      </p>
    </aside>
  );
}

function MobileTopBar({
  activeCategoryId,
  query,
  visibleCategories,
  onSearchChange,
}: NavigationProps): ReactElement {
  return (
    <div className="sticky top-0 z-40 border-b border-white/10 bg-background/88 px-5 py-4 backdrop-blur-xl lg:hidden">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 font-heading text-lg font-bold text-foreground">
          <BrandMark size={30} />
          <span>导航</span>
        </p>
        <Link
          href="/"
          className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-muted transition hover:border-white/25 hover:text-foreground"
        >
          ← 主页
        </Link>
      </div>

      <label className="block">
        <span className="sr-only">搜索链接</span>
        <input
          type="search"
          value={query}
          onChange={onSearchChange}
          placeholder="搜索链接..."
          className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-foreground outline-none transition placeholder:text-muted/70 focus:border-primary/70 focus:ring-4 focus:ring-primary/15"
        />
      </label>

      <nav
        aria-label="移动端导航分类"
        className="-mx-5 mt-3 flex gap-2 overflow-x-auto px-5 pb-1"
      >
        {visibleCategories.map((category) => (
          <Link
            key={category.id}
            href={`#${category.id}`}
            className={`shrink-0 rounded-full border px-3 py-2 text-sm font-semibold transition ${
              activeCategoryId === category.id
                ? "border-primary/50 bg-primary/20 text-foreground"
                : "border-white/10 bg-white/[0.04] text-muted"
            }`}
          >
            <BrandMark
              size={18}
              className="mr-1.5 align-middle"
              aria-hidden="true"
            />
            {category.title}
          </Link>
        ))}
      </nav>
    </div>
  );
}

function GoLinkCard({ link }: { link: NavLink }): ReactElement {
  const hostname = getHostname(link.url);

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block min-h-30 overflow-hidden rounded-[1.25rem] border border-white/10 bg-surface/75 p-px transition duration-300 hover:-translate-y-1 hover:border-primary/70 hover:shadow-[0_20px_70px_rgba(124,58,237,0.22)]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-accent/0 to-primary-end/0 opacity-0 transition duration-300 group-hover:from-primary/24 group-hover:via-accent/10 group-hover:to-primary-end/22 group-hover:opacity-100" />
      <div className="relative h-full rounded-[calc(1.25rem-1px)] bg-surface/90 p-4">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]">
            <Image
              src={getFaviconUrl(link.url)}
              alt={`${link.name} favicon`}
              width={32}
              height={32}
              className="h-8 w-8 rounded-md"
              unoptimized
            />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-base font-bold text-foreground">
              {link.name}
            </span>
            <span className="mt-1 block truncate text-xs font-medium text-muted">
              {hostname}
            </span>
          </span>
        </div>
        {link.description ? (
          <p className="mt-4 line-clamp-2 text-sm leading-6 text-muted">
            {link.description}
          </p>
        ) : null}
      </div>
    </a>
  );
}
