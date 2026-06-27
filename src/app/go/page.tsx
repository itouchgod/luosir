"use client";

import Image from "next/image";
import Link from "next/link";
import type { ChangeEvent, ReactElement } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { NAV_CATEGORIES, type NavCategory, type NavLink } from "@/data/go-links";

type VisibleCategory = NavCategory & { links: NavLink[] };

function getHostname(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

function getFaviconUrl(url: string): string {
  return `https://www.google.com/s2/favicons?domain=${getHostname(url)}&sz=32`;
}

export default function GoPage(): ReactElement {
  const [query, setQuery] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState(NAV_CATEGORIES[0]?.id ?? "");
  const mainRef = useRef<HTMLDivElement>(null);

  const normalizedQuery = query.trim().toLowerCase();

  const visibleCategories = useMemo<VisibleCategory[]>(() => {
    return NAV_CATEGORIES.map((cat) => ({
      ...cat,
      links: normalizedQuery
        ? cat.links.filter((l) => l.name.toLowerCase().includes(normalizedQuery))
        : cat.links,
    })).filter((cat) => cat.links.length > 0);
  }, [normalizedQuery]);

  // Reset active when search changes
  useEffect(() => {
    if (visibleCategories.length > 0 && !visibleCategories.some((c) => c.id === activeCategoryId)) {
      setActiveCategoryId(visibleCategories[0].id);
    }
  }, [activeCategoryId, visibleCategories]);

  // IntersectionObserver for sidebar highlight
  useEffect(() => {
    if (visibleCategories.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
          .at(0);
        if (hit?.target.id) setActiveCategoryId(hit.target.id);
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: [0.05, 0.2, 0.5] }
    );
    visibleCategories.forEach((cat) => {
      const el = document.getElementById(cat.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [visibleCategories]);

  const onSearch = (e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* ── 固定左侧边栏（桌面） ── */}
      <aside className="hidden lg:flex w-52 shrink-0 flex-col border-r border-white/8 bg-background fixed top-0 left-0 h-screen z-30">
        {/* 顶部 Logo */}
        <div className="px-4 py-4 border-b border-white/8">
          <div className="flex items-center justify-between mb-3">
            <span className="font-heading font-bold text-base text-foreground">🧭 外贸导航</span>
            <Link
              href="/"
              className="text-[11px] text-muted hover:text-foreground transition px-2 py-1 rounded-md hover:bg-white/5"
            >
              ← 主页
            </Link>
          </div>
          <input
            type="search"
            value={query}
            onChange={onSearch}
            placeholder="搜索链接..."
            className="w-full h-8 rounded-lg border border-white/10 bg-white/5 px-3 text-xs text-foreground outline-none placeholder:text-muted/60 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition"
          />
        </div>

        {/* 分类列表 */}
        <nav className="flex-1 overflow-y-auto py-2 px-2">
          {visibleCategories.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all mb-0.5 ${
                activeCategoryId === cat.id
                  ? "bg-primary/15 text-foreground border border-primary/25"
                  : "text-muted hover:bg-white/5 hover:text-foreground border border-transparent"
              }`}
            >
              <span>{cat.emoji}</span>
              <span className="truncate">{cat.title}</span>
              <span className="ml-auto shrink-0 text-[10px] text-muted/60">{cat.links.length}</span>
            </a>
          ))}
        </nav>
      </aside>

      {/* ── 移动端顶栏 ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 border-b border-white/8 bg-background/95 backdrop-blur-xl px-4 py-3">
        <div className="flex items-center gap-3 mb-2">
          <span className="font-heading font-bold text-sm text-foreground">🧭 外贸导航</span>
          <input
            type="search"
            value={query}
            onChange={onSearch}
            placeholder="搜索..."
            className="flex-1 h-8 rounded-lg border border-white/10 bg-white/5 px-3 text-xs text-foreground outline-none placeholder:text-muted/60 focus:border-primary/50 transition"
          />
          <Link href="/" className="text-[11px] text-muted hover:text-foreground transition shrink-0">← 主页</Link>
        </div>
        {/* 移动端分类横向滚动 */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {visibleCategories.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className={`shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-full border transition ${
                activeCategoryId === cat.id
                  ? "border-primary/40 bg-primary/15 text-foreground"
                  : "border-white/10 text-muted"
              }`}
            >
              {cat.emoji} {cat.title}
            </a>
          ))}
        </div>
      </div>

      {/* ── 主内容区 ── */}
      <div ref={mainRef} className="flex-1 lg:ml-52 pt-28 lg:pt-0">
        <div className="max-w-6xl mx-auto px-4 py-6 lg:px-8 lg:py-8">

          {visibleCategories.length > 0 ? (
            <div className="space-y-8">
              {visibleCategories.map((cat) => (
                <section key={cat.id} id={cat.id} className="scroll-mt-28 lg:scroll-mt-8">
                  {/* 分类标题 */}
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/8">
                    <span className="text-base">{cat.emoji}</span>
                    <h2 className="font-heading font-bold text-sm text-foreground tracking-wide">
                      {cat.title}
                    </h2>
                    <span className="text-[10px] text-muted/60 ml-1">({cat.links.length})</span>
                  </div>

                  {/* 链接网格 */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-2 gap-y-1">
                    {cat.links.map((link) => (
                      <LinkItem key={`${cat.id}-${link.name}`} link={link} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-muted text-sm">
              没有找到 &ldquo;{query}&rdquo; 相关链接
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LinkItem({ link }: { link: NavLink }): ReactElement {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      title={link.description ?? link.name}
      className="group flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-muted hover:bg-white/6 hover:text-foreground transition-all duration-150 border border-transparent hover:border-white/8"
    >
      <span className="shrink-0 w-4 h-4 flex items-center justify-center">
        <Image
          src={getFaviconUrl(link.url)}
          alt=""
          width={16}
          height={16}
          className="w-4 h-4 rounded-sm opacity-80 group-hover:opacity-100 transition-opacity"
          unoptimized
        />
      </span>
      <span className="truncate font-medium">{link.name}</span>
    </a>
  );
}
