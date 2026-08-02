"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import type { ReactElement } from "react";
import {
  HOLIDAYS_2026, CATEGORY_LABEL, getHolidayDetail,
  type Holiday, type HolidayCategory,
} from "@/data/holidays2026";

// ── 工具函数 ──────────────────────────────────────────────────────────────────

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function daysFromToday(dateStr: string): number {
  const today = new Date(todayStr() + "T00:00:00");
  const target = new Date(dateStr + "T00:00:00");
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

function monthKey(dateStr: string): string { return dateStr.slice(0, 7); }

function getMonthLabel(key: string): string {
  const [y, m] = key.split("-");
  const names = ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"];
  return `${names[parseInt(m) - 1]}  ·  ${y}年`;
}

function formatDateMD(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
}

function formatWeekday(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getDay()];
}

function getRegion(id: string): string {
  if (id.startsWith("us-")) return "us";
  if (id.startsWith("gb-")) return "gb";
  if (["de-","fr-","it-","es-","nl-","ru-"].some(p => id.startsWith(p))) return "europe";
  if (id.startsWith("jp-")) return "jp";
  if (id.startsWith("kr-")) return "kr";
  if (id.startsWith("in-")) return "in";
  if (["sg-","my-","th-","vn-","id-","ph-"].some(p => id.startsWith(p))) return "sea";
  if (["tr-","ae-","sa-","eg-","ir-"].some(p => id.startsWith(p))) return "mideast";
  if (["ca-","br-","mx-","ar-","cl-","uy-","pe-","co-","cr-","sv-","gt-","pa-","pr-","do-","tt-","ec-"].some(p => id.startsWith(p))) return "americas";
  return "other";
}

// ── 图标 ──────────────────────────────────────────────────────────────────────

function GlobeIcon(): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function InfoIcon(): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 shrink-0 mt-0.5">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function ChevronDownIcon({ expanded }: { expanded: boolean }): ReactElement {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`h-3.5 w-3.5 shrink-0 text-muted transition-transform ${expanded ? "rotate-180" : ""}`}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

// ── 样式常量 ──────────────────────────────────────────────────────────────────

const CAT_DOT: Record<HolidayCategory, string> = {
  china:         "bg-red-500",
  international: "bg-emerald-500",
  religious:     "bg-amber-400",
};

const CAT_BADGE: Record<HolidayCategory, string> = {
  china:         "text-red-500 bg-red-500/12 border border-red-500/20",
  international: "text-emerald-500 bg-emerald-500/12 border border-emerald-500/20",
  religious:     "text-amber-500 bg-amber-500/12 border border-amber-500/20",
};

// ── 筛选器 ────────────────────────────────────────────────────────────────────

const REGION_CHIPS = [
  { key: "all",      label: "全部",       emoji: undefined },
  { key: "us",       label: "美国",       emoji: "🇺🇸" },
  { key: "gb",       label: "英国",       emoji: "🇬🇧" },
  { key: "europe",   label: "欧洲",       emoji: "🌍" },
  { key: "jp",       label: "日本",       emoji: "🇯🇵" },
  { key: "kr",       label: "韩国",       emoji: "🇰🇷" },
  { key: "in",       label: "印度",       emoji: "🇮🇳" },
  { key: "sea",      label: "东南亚",     emoji: "🌏" },
  { key: "mideast",  label: "中东",       emoji: "🌍" },
  { key: "americas", label: "美洲",       emoji: "🌎" },
  { key: "other",    label: "其他",       emoji: "🌐" },
];

const RELIGION_CHIPS = [
  { key: "all",      label: "全部",     emoji: undefined },
  { key: "islam",    label: "伊斯兰教", emoji: "☪️" },
  { key: "jewish",   label: "犹太教",   emoji: "✡️" },
  { key: "buddhism", label: "佛教",     emoji: "☸️" },
  { key: "hinduism", label: "印度教",   emoji: "🕉️" },
];

type CategoryFilter = "all" | HolidayCategory;

const CAT_TABS: { key: CategoryFilter; label: string; dot?: string }[] = [
  { key: "all",           label: "全部" },
  { key: "china",         label: "中国假日",  dot: "bg-red-500" },
  { key: "international", label: "国际假日",  dot: "bg-emerald-500" },
  { key: "religious",     label: "宗教节日",  dot: "bg-amber-400" },
];

// ── DaysBadge ─────────────────────────────────────────────────────────────────

function DaysBadge({ diff, days }: { diff: number; days: number }): ReactElement | null {
  const isOngoing = diff <= 0 && diff > -days;
  if (diff === 0)       return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-orange-500 text-white">今天</span>;
  if (isOngoing)        return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500 text-white">进行中</span>;
  if (diff > 0 && diff <= 7)  return <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full text-amber-500 bg-amber-500/15 border border-amber-500/20">{diff}天后</span>;
  if (diff > 7 && diff <= 30) return <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full text-primary bg-primary/15 border border-primary/20">{diff}天后</span>;
  if (diff > 30)        return <span className="text-[10px] px-1 text-muted/60">{diff}天</span>;
  return null;
}

// ── HolidayRow ────────────────────────────────────────────────────────────────

function DetailSection({ icon, title, content }: { icon: string; title: string; content: string }): ReactElement {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-foreground">
        <span aria-hidden="true">{icon}</span>
        <span>{title}</span>
      </div>
      <p className="whitespace-pre-line text-xs leading-relaxed text-muted">{content}</p>
    </div>
  );
}

function HolidayDetails({ holiday, id }: { holiday: Holiday; id: string }): ReactElement {
  const detail = getHolidayDetail(holiday);

  return (
    <div id={id} className="border-t border-white/8 bg-white/[0.03] px-4 py-4">
      <div className="space-y-4">
        <DetailSection icon="🏛️" title="假期背景" content={detail.background} />
        <DetailSection icon="📋" title="假期表现与商务影响" content={detail.businessImpact} />
        <DetailSection icon="⚠️" title="禁忌与注意事项" content={detail.notes} />
      </div>
    </div>
  );
}

function HolidayRow({
  holiday,
  diff,
  expanded,
  onToggle,
}: {
  holiday: Holiday;
  diff: number;
  expanded: boolean;
  onToggle: () => void;
}): ReactElement {
  const days = holiday.days ?? 1;
  const isOngoing = diff <= 0 && diff > -days;
  const startMD = formatDateMD(holiday.dateStart);
  const endMD = holiday.dateEnd ? formatDateMD(holiday.dateEnd) : null;
  const weekday = formatWeekday(holiday.dateStart);
  const detailId = `holiday-detail-${holiday.id}`;

  return (
    <div className="border-b border-white/5 last:border-0 transition-colors">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={detailId}
        className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-white/[0.04] ${
          isOngoing ? "bg-emerald-500/8" :
          diff >= 0 && diff <= 7 ? "bg-amber-500/6" : ""
        }`}
      >
        {/* 日期列 */}
        <div className="shrink-0 w-14 pt-0.5">
          {endMD ? (
            <>
              <div className="text-sm font-bold font-mono leading-none text-foreground">{startMD}–</div>
              <div className="text-sm font-bold font-mono leading-none mt-0.5 text-foreground">{endMD}</div>
              <div className="text-[10px] text-muted mt-1">{weekday}</div>
              <div className="text-[10px] text-muted">共 {days} 天</div>
            </>
          ) : (
            <>
              <div className="text-sm font-bold font-mono leading-none text-foreground">{startMD}</div>
              <div className="text-[10px] text-muted mt-1">{weekday}</div>
            </>
          )}
        </div>

        {/* 分类彩点 */}
        <div className={`shrink-0 w-2 h-2 rounded-full mt-2 ${CAT_DOT[holiday.category]}`} />

        {/* 名称 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            {holiday.emoji && <span className="text-base leading-none">{holiday.emoji}</span>}
            <span className="text-sm font-semibold leading-snug text-foreground">{holiday.nameCN}</span>
          </div>
          <div className="text-xs mt-0.5 text-muted">{holiday.nameEN}</div>
        </div>

        {/* 右侧 */}
        <div className="shrink-0 flex items-center gap-1.5 pt-0.5">
          <DaysBadge diff={diff} days={days} />
          <span className={`hidden sm:inline text-[10px] px-2 py-0.5 rounded-full font-medium ${CAT_BADGE[holiday.category]}`}>
            {CATEGORY_LABEL[holiday.category]}
          </span>
          <ChevronDownIcon expanded={expanded} />
        </div>
      </button>

      {expanded ? <HolidayDetails holiday={holiday} id={detailId} /> : null}
    </div>
  );
}

// ── 主组件 ────────────────────────────────────────────────────────────────────

export function GlobalHolidays(): ReactElement {
  const [mounted, setMounted] = useState(false);
  const [catFilter, setCatFilter] = useState<CategoryFilter>("all");
  const [subFilter, setSubFilter] = useState<string>("all");
  const [expandedHolidayId, setExpandedHolidayId] = useState<string | null>(null);
  const currentMonthKey = useMemo(() => todayStr().slice(0, 7), []);
  const listRef = useRef<HTMLDivElement>(null);
  const hasPositionedCurrentMonth = useRef(false);

  useEffect(() => { setMounted(true); }, []);

  const handleCatChange = useCallback((cat: CategoryFilter) => {
    setCatFilter(cat);
    setSubFilter("all");
    setExpandedHolidayId(null);
  }, []);

  const handleSubFilterChange = useCallback((filter: string) => {
    setSubFilter(filter);
    setExpandedHolidayId(null);
  }, []);

  const subChipsConfig = useMemo(() => {
    if (catFilter === "religious")    return { chips: RELIGION_CHIPS, show: true };
    if (catFilter === "international" || catFilter === "all") return { chips: REGION_CHIPS, show: true };
    return { chips: [] as typeof REGION_CHIPS, show: false };
  }, [catFilter]);

  const grouped = useMemo(() => {
    const filtered = HOLIDAYS_2026.filter(h => {
      if (catFilter !== "all" && h.category !== catFilter) return false;
      if (subFilter !== "all") {
        if (catFilter === "religious") {
          if (h.religion !== subFilter) return false;
        } else if (h.category === "international") {
          if (getRegion(h.id) !== subFilter) return false;
        }
      }
      return true;
    });
    filtered.sort((a, b) => a.dateStart.localeCompare(b.dateStart));

    const groups = new Map<string, { holiday: Holiday; diff: number }[]>();
    for (const h of filtered) {
      const key = monthKey(h.dateStart);
      const diff = daysFromToday(h.dateStart);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push({ holiday: h, diff });
    }
    return Array.from(groups.entries()).map(([key, items]) => ({ key, items }));
  }, [catFilter, subFilter]);

  const initialScrollTargetKey = useMemo(() => {
    if (grouped.length === 0) return null;
    return grouped.find(group => group.key >= currentMonthKey)?.key ?? grouped[0].key;
  }, [currentMonthKey, grouped]);

  useEffect(() => {
    if (!mounted || hasPositionedCurrentMonth.current || !initialScrollTargetKey) return;

    const frame = window.requestAnimationFrame(() => {
      const monthElement = listRef.current?.querySelector<HTMLElement>(`[data-month="${initialScrollTargetKey}"]`);
      if (!monthElement) return;

      hasPositionedCurrentMonth.current = true;
      monthElement.scrollIntoView({ behavior: "auto", block: "start" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [mounted, initialScrollTargetKey]);

  const totalHolidays = grouped.reduce((s, g) => s + g.items.length, 0);

  if (!mounted) return <div className="min-h-[60vh]" />;

  return (
    <section className="w-full max-w-4xl mx-auto px-4 sm:px-6">
      {/* ── 固定头部 ── */}
      <div className="sticky top-0 z-10 bg-background pt-6 pb-3">
        {/* 页头 */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-primary"><GlobeIcon /></span>
          <h1 className="text-lg font-semibold text-foreground">全球假日</h1>
          <span className="text-xs text-muted ml-1">2026 · 共 {totalHolidays} 个</span>
        </div>

        {/* 一级分类 Tabs */}
        <div className="flex items-center gap-0.5 bg-white/[0.04] border border-white/8 rounded-xl p-1 mb-3">
          {CAT_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => handleCatChange(tab.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                catFilter === tab.key
                  ? "bg-white/[0.10] text-foreground shadow-sm"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {tab.dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${tab.dot}`} />}
              <span className="truncate">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* 二级筛选芯片 */}
        {subChipsConfig.show && (
          <div className="-mx-4 sm:-mx-6 px-4 sm:px-6 overflow-x-auto">
            <div className="flex items-center gap-1.5 flex-nowrap pb-1 min-w-max">
              {subChipsConfig.chips.map(chip => {
                const isActive = chip.key === subFilter;
                return (
                  <button
                    key={chip.key}
                    onClick={() => handleSubFilterChange(chip.key)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors whitespace-nowrap ${
                      isActive
                        ? "bg-primary border-primary/60 text-background"
                        : "bg-white/[0.04] border-white/10 text-muted hover:text-foreground hover:border-white/20"
                    }`}
                  >
                    {chip.emoji && <span className="text-sm leading-none">{chip.emoji}</span>}
                    {chip.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 假日列表 */}
      {grouped.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <span className="text-4xl mb-3 block">🌐</span>
          <p className="text-sm">没有符合条件的假日</p>
        </div>
      ) : (
        <div ref={listRef} className="space-y-3">
          {grouped.map(({ key, items }) => (
            <div
              key={key}
              data-month={key}
              className="bg-white/[0.04] border border-white/10 rounded-xl overflow-hidden scroll-mt-44"
            >
              {/* 月份标题 */}
              <div className="flex items-center px-4 py-2.5 border-b border-white/8 bg-white/[0.03]">
                <span className="text-sm font-bold text-foreground">{getMonthLabel(key)}</span>
                <div className="ml-auto flex items-center gap-1 text-xs text-muted">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                  {items.length} 个
                </div>
              </div>
              {/* 假日行 */}
              <div>
                {items.map(({ holiday, diff }) => (
                  <HolidayRow
                    key={holiday.id}
                    holiday={holiday}
                    diff={diff}
                    expanded={expandedHolidayId === holiday.id}
                    onToggle={() => setExpandedHolidayId(current => current === holiday.id ? null : holiday.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 底部说明 */}
      <div className="mt-6 mb-8 flex items-start gap-2 p-3 rounded-lg bg-white/[0.04] border border-white/8 text-xs text-muted">
        <InfoIcon />
        <span>开斋节、犹太新年等宗教节日按伊斯兰历或希伯来历推算，实际日期可能有 ±1~2 天误差。</span>
      </div>
    </section>
  );
}
