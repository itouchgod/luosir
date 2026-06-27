"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import type { ReactElement, PointerEvent } from "react";

// ── 内联图标 ──────────────────────────────────────────────────────────────────

function ClockIcon(): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function PlusIcon(): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className ?? "w-3 h-3"}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// ── 城市定义 ──────────────────────────────────────────────────────────────────

interface CityDef {
  id: string;
  name: string;
  country: string;
  flag: string;
  timezone: string;
}

const ALL_CITIES: CityDef[] = [
  { id: "shenzhen",     name: "深圳",      country: "中国",     flag: "🇨🇳", timezone: "Asia/Shanghai" },
  { id: "shanghai",     name: "上海",      country: "中国",     flag: "🇨🇳", timezone: "Asia/Shanghai" },
  { id: "beijing",      name: "北京",      country: "中国",     flag: "🇨🇳", timezone: "Asia/Shanghai" },
  { id: "hongkong",     name: "香港",      country: "中国",     flag: "🇭🇰", timezone: "Asia/Hong_Kong" },
  { id: "losangeles",   name: "洛杉矶",    country: "美国",     flag: "🇺🇸", timezone: "America/Los_Angeles" },
  { id: "newyork",      name: "纽约",      country: "美国",     flag: "🇺🇸", timezone: "America/New_York" },
  { id: "chicago",      name: "芝加哥",    country: "美国",     flag: "🇺🇸", timezone: "America/Chicago" },
  { id: "toronto",      name: "多伦多",    country: "加拿大",   flag: "🇨🇦", timezone: "America/Toronto" },
  { id: "saopaulo",     name: "圣保罗",    country: "巴西",     flag: "🇧🇷", timezone: "America/Sao_Paulo" },
  { id: "mexicocity",   name: "墨西哥城",  country: "墨西哥",   flag: "🇲🇽", timezone: "America/Mexico_City" },
  { id: "london",       name: "伦敦",      country: "英国",     flag: "🇬🇧", timezone: "Europe/London" },
  { id: "manchester",   name: "曼彻斯特",  country: "英国",     flag: "🇬🇧", timezone: "Europe/London" },
  { id: "paris",        name: "巴黎",      country: "法国",     flag: "🇫🇷", timezone: "Europe/Paris" },
  { id: "berlin",       name: "柏林",      country: "德国",     flag: "🇩🇪", timezone: "Europe/Berlin" },
  { id: "amsterdam",    name: "阿姆斯特丹",country: "荷兰",     flag: "🇳🇱", timezone: "Europe/Amsterdam" },
  { id: "rome",         name: "罗马",      country: "意大利",   flag: "🇮🇹", timezone: "Europe/Rome" },
  { id: "madrid",       name: "马德里",    country: "西班牙",   flag: "🇪🇸", timezone: "Europe/Madrid" },
  { id: "moscow",       name: "莫斯科",    country: "俄罗斯",   flag: "🇷🇺", timezone: "Europe/Moscow" },
  { id: "istanbul",     name: "伊斯坦布尔",country: "土耳其",   flag: "🇹🇷", timezone: "Europe/Istanbul" },
  { id: "dubai",        name: "迪拜",      country: "阿联酋",   flag: "🇦🇪", timezone: "Asia/Dubai" },
  { id: "riyadh",       name: "利雅得",    country: "沙特",     flag: "🇸🇦", timezone: "Asia/Riyadh" },
  { id: "cairo",        name: "开罗",      country: "埃及",     flag: "🇪🇬", timezone: "Africa/Cairo" },
  { id: "johannesburg", name: "约翰内斯堡",country: "南非",     flag: "🇿🇦", timezone: "Africa/Johannesburg" },
  { id: "newdelhi",     name: "新德里",    country: "印度",     flag: "🇮🇳", timezone: "Asia/Kolkata" },
  { id: "mumbai",       name: "孟买",      country: "印度",     flag: "🇮🇳", timezone: "Asia/Kolkata" },
  { id: "bangkok",      name: "曼谷",      country: "泰国",     flag: "🇹🇭", timezone: "Asia/Bangkok" },
  { id: "singapore",    name: "新加坡",    country: "新加坡",   flag: "🇸🇬", timezone: "Asia/Singapore" },
  { id: "jakarta",      name: "雅加达",    country: "印尼",     flag: "🇮🇩", timezone: "Asia/Jakarta" },
  { id: "kualalumpur",  name: "吉隆坡",    country: "马来西亚", flag: "🇲🇾", timezone: "Asia/Kuala_Lumpur" },
  { id: "tokyo",        name: "东京",      country: "日本",     flag: "🇯🇵", timezone: "Asia/Tokyo" },
  { id: "seoul",        name: "首尔",      country: "韩国",     flag: "🇰🇷", timezone: "Asia/Seoul" },
  { id: "sydney",       name: "悉尼",      country: "澳大利亚", flag: "🇦🇺", timezone: "Australia/Sydney" },
  { id: "melbourne",    name: "墨尔本",    country: "澳大利亚", flag: "🇦🇺", timezone: "Australia/Melbourne" },
  { id: "auckland",     name: "奥克兰",    country: "新西兰",   flag: "🇳🇿", timezone: "Pacific/Auckland" },
];

const HOME_CITY_ID = "shanghai";
const HOME_TIMEZONE = "Asia/Shanghai";

const DEFAULT_CITY_IDS = [
  "shanghai", "newyork", "losangeles", "london",
  "berlin", "sydney", "dubai", "newdelhi",
];

// ── 色带渐变 ──────────────────────────────────────────────────────────────────


// ── 时区工具 ──────────────────────────────────────────────────────────────────

function getTimeParts(utcMs: number, timezone: string) {
  const date = new Date(utcMs);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const p: Record<string, string> = {};
  parts.forEach((x) => { p[x.type] = x.value; });
  if (p.hour === "24") p.hour = "00";
  return {
    year: parseInt(p.year), month: parseInt(p.month), day: parseInt(p.day),
    hour: parseInt(p.hour), minute: parseInt(p.minute), second: parseInt(p.second || "0"),
  };
}

function getTimezoneOffsetMin(utcMs: number, timezone: string): number {
  const tp = getTimeParts(utcMs, timezone);
  const localMs = Date.UTC(tp.year, tp.month - 1, tp.day, tp.hour, tp.minute, tp.second);
  return (localMs - utcMs) / 60000;
}

function isDSTActive(utcMs: number, timezone: string): boolean {
  const year = new Date(utcMs).getUTCFullYear();
  const janOff = getTimezoneOffsetMin(Date.UTC(year, 0, 15, 12), timezone);
  const julOff = getTimezoneOffsetMin(Date.UTC(year, 6, 15, 12), timezone);
  if (janOff === julOff) return false;
  return getTimezoneOffsetMin(utcMs, timezone) === Math.max(janOff, julOff);
}

function getWeekdayCN(utcMs: number, timezone: string): string {
  const map: Record<string, string> = {
    Sunday: "日", Monday: "一", Tuesday: "二", Wednesday: "三",
    Thursday: "四", Friday: "五", Saturday: "六",
  };
  const day = new Intl.DateTimeFormat("en-US", { timeZone: timezone, weekday: "long" })
    .format(new Date(utcMs));
  return `周${map[day] ?? "?"}`;
}

// ── 工作状态 ──────────────────────────────────────────────────────────────────

type WorkStatus = { label: string; dot: string; badge: string };

function getWorkStatus(hour: number, minute: number): WorkStatus {
  const h = hour + minute / 60;
  if (h >= 9 && h < 17) return {
    label: "工作中",
    dot: "bg-emerald-400",
    badge: "text-emerald-300 bg-emerald-500/20 border border-emerald-500/25",
  };
  if ((h >= 8 && h < 9) || (h >= 17 && h < 19)) return {
    label: "边缘时段",
    dot: "bg-amber-400",
    badge: "text-amber-200 bg-amber-500/20 border border-amber-500/25",
  };
  return {
    label: "休息",
    dot: "bg-white/15",
    badge: "text-white/35 bg-white/5 border border-white/8",
  };
}

// ── 可拖动时间条 ──────────────────────────────────────────────────────────────

interface MiniTimelineProps {
  hour: number;
  minute: number;
  flag: string;
  timeStr: string;
  onDrag: (fraction: number) => void;
}

function CityMiniTimeline({ hour, minute, flag, timeStr, onDrag }: MiniTimelineProps): ReactElement {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const markerPct = `${((hour + minute / 60) / 24 * 100).toFixed(3)}%`;

  const getFrac = (e: PointerEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  };

  const ticks = [
    { h: 0,  align: "left" as const },
    { h: 6,  align: "center" as const },
    { h: 12, align: "center" as const },
    { h: 18, align: "center" as const },
    { h: 24, align: "right" as const },
  ];

  return (
    <div className="mt-2.5 select-none">
      <div
        ref={trackRef}
        className="relative h-2 rounded-full cursor-pointer touch-none"
        style={{ background: "var(--timeline-gradient)" }}
        onPointerDown={(e) => {
          dragging.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          const f = getFrac(e);
          if (f !== null) onDrag(f);
        }}
        onPointerMove={(e) => {
          if (!dragging.current) return;
          const f = getFrac(e);
          if (f !== null) onDrag(f);
        }}
        onPointerUp={() => { dragging.current = false; }}
        onPointerCancel={() => { dragging.current = false; }}
      >
        <div
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center"
          style={{ left: markerPct }}
        >
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
            <div className="bg-foreground text-background text-xs font-mono font-bold px-2.5 py-1 rounded-lg shadow-2xl whitespace-nowrap">
              {timeStr}
            </div>
            <div className="w-0 h-0" style={{
              borderLeft: "5px solid transparent",
              borderRight: "5px solid transparent",
              borderTop: "5px solid var(--color-foreground)",
            }} />
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 w-0.5 h-5 bg-foreground/80 rounded-full shadow-sm" />
          <span className="text-base leading-none drop-shadow-md">{flag}</span>
        </div>
      </div>
      <div className="relative h-3 mt-0.5">
        {ticks.map(({ h, align }) => (
          <span
            key={h}
            className="absolute text-[9px] text-white/20 leading-none top-0"
            style={{
              left: align === "left" ? "0" : align === "right" ? "auto" : `${h / 24 * 100}%`,
              right: align === "right" ? "0" : "auto",
              transform: align === "center" ? "translateX(-50%)" : "none",
            }}
          >
            {h}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── 城市行 ────────────────────────────────────────────────────────────────────

interface CityRowData extends CityDef {
  timeStr: string;
  dateStr: string;
  hour: number;
  minute: number;
  dayDiff: number;
  isDST: boolean;
  isHome: boolean;
}

function CityRow({
  city,
  onRemove,
  onSliderDrag,
}: {
  city: CityRowData;
  onRemove: (id: string) => void;
  onSliderDrag: (fraction: number) => void;
}): ReactElement {
  const status = getWorkStatus(city.hour, city.minute);

  return (
    <div className="px-4 pt-3 pb-2.5 rounded-xl border border-white/10 bg-white/[0.05] hover:bg-white/[0.07] transition-colors shadow-sm">
      <div className="flex items-center gap-3">
        {/* 国旗 + 城市名 */}
        <div className="flex items-center gap-2 w-28 sm:w-36 shrink-0">
          <span className="text-xl leading-none shrink-0">{city.flag}</span>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-sm text-foreground truncate leading-snug">
                {city.name}
              </span>
              {city.isHome && (
                <span className="text-[9px] text-primary bg-primary/15 border border-primary/25 px-1 py-px rounded-full shrink-0 font-medium leading-none">
                  本地
                </span>
              )}
            </div>
            <div className="text-[10px] text-muted leading-none mt-0.5">{city.country}</div>
          </div>
        </div>

        {/* 日期（桌面） */}
        <div className="hidden sm:flex flex-col flex-1 gap-0.5 min-w-0">
          <span className="text-xs text-muted truncate leading-snug">{city.dateStr}</span>
          <div className="flex items-center gap-1">
            {city.dayDiff !== 0 && (
              <span className={`text-[10px] px-1.5 py-px rounded-full font-medium shrink-0 leading-tight border ${
                city.dayDiff > 0
                  ? "text-emerald-300 bg-emerald-500/15 border-emerald-500/20"
                  : "text-orange-300 bg-orange-500/15 border-orange-500/20"
              }`}>
                {city.dayDiff > 0 ? `+${city.dayDiff}天` : `${city.dayDiff}天`}
              </span>
            )}
            {city.isDST && (
              <span className="text-[10px] px-1.5 py-px rounded-full font-medium text-violet-300 bg-violet-500/15 border border-violet-500/20 shrink-0 leading-tight">
                夏令
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 sm:hidden" />

        {/* 工作状态 */}
        <span className={`flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0 ${status.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${status.dot}`} />
          {status.label}
        </span>

        {/* 时间 */}
        <div className="shrink-0 text-right min-w-[60px]">
          <span className="text-lg font-semibold font-mono tabular-nums tracking-tight text-foreground leading-none">
            {city.timeStr}
          </span>
        </div>

        {/* 删除 */}
        {city.isHome ? (
          <div className="w-6 shrink-0" />
        ) : (
          <button
            onClick={() => onRemove(city.id)}
            className="w-6 h-6 shrink-0 flex items-center justify-center rounded-full text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
            aria-label={`删除 ${city.name}`}
          >
            <XIcon />
          </button>
        )}
      </div>

      <CityMiniTimeline
        hour={city.hour}
        minute={city.minute}
        flag={city.flag}
        timeStr={city.timeStr}
        onDrag={onSliderDrag}
      />
    </div>
  );
}

// ── 主组件 ────────────────────────────────────────────────────────────────────

export function WorldClock(): ReactElement {
  const [mounted, setMounted] = useState(false);
  const [cityIds, setCityIds] = useState<string[]>(DEFAULT_CITY_IDS);
  const [showAddCity, setShowAddCity] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRealtime, setIsRealtime] = useState(true);
  const [currentUtcMs, setCurrentUtcMs] = useState<number>(0);
  const nowRefMs = useRef<number>(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setMounted(true);
    const now = Date.now();
    nowRefMs.current = now;
    setCurrentUtcMs(now);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    timerRef.current = setInterval(() => {
      const now = Date.now();
      nowRefMs.current = now;
      if (isRealtime) setCurrentUtcMs(now);
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [mounted, isRealtime]);

  const handleCitySliderDrag = useCallback((fraction: number, cityHour: number, cityMinute: number) => {
    setIsRealtime(false);
    const desiredHour = fraction * 24;
    const currentHour = cityHour + cityMinute / 60;
    const deltaMs = (desiredHour - currentHour) * 3_600_000;
    setCurrentUtcMs((prev) => prev + deltaMs);
  }, []);

  const handleResetRealtime = useCallback(() => {
    setIsRealtime(true);
    setCurrentUtcMs(nowRefMs.current);
  }, []);

  const removeCity = useCallback((id: string) => {
    if (id === HOME_CITY_ID) return;
    setCityIds((prev) => prev.filter((c) => c !== id));
  }, []);

  const addCity = useCallback((id: string) => {
    if (cityIds.includes(id)) return;
    setCityIds((prev) => [...prev, id]);
    setShowAddCity(false);
    setSearchQuery("");
  }, [cityIds]);

  const cityData = useMemo((): CityRowData[] => {
    if (!currentUtcMs) return [];
    const homeTp = getTimeParts(currentUtcMs, HOME_TIMEZONE);
    const homeDayMs = Date.UTC(homeTp.year, homeTp.month - 1, homeTp.day);

    return cityIds.flatMap((id) => {
      const def = ALL_CITIES.find((c) => c.id === id);
      if (!def) return [];
      const tp = getTimeParts(currentUtcMs, def.timezone);
      const localDayMs = Date.UTC(tp.year, tp.month - 1, tp.day);
      const dayDiff = Math.round((localDayMs - homeDayMs) / 86_400_000);
      const weekday = getWeekdayCN(currentUtcMs, def.timezone);
      const dateStr = `${String(tp.month).padStart(2, "0")}月${String(tp.day).padStart(2, "0")}日 ${weekday}`;
      const timeStr = `${String(tp.hour).padStart(2, "0")}:${String(tp.minute).padStart(2, "0")}`;
      return [{
        ...def, timeStr, dateStr,
        hour: tp.hour, minute: tp.minute,
        dayDiff,
        isDST: isDSTActive(currentUtcMs, def.timezone),
        isHome: id === HOME_CITY_ID,
      }];
    });
  }, [cityIds, currentUtcMs]);

  const availableCities = useMemo(() => {
    const q = searchQuery.trim();
    return ALL_CITIES.filter((c) => {
      if (cityIds.includes(c.id)) return false;
      if (!q) return true;
      return c.name.includes(q) || c.country.includes(q);
    });
  }, [cityIds, searchQuery]);

  if (!mounted) return <div className="min-h-[60vh]" />;

  return (
    <section className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* 页头 */}
      <div className="flex items-start justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-primary"><ClockIcon /></span>
            <h1 className="text-lg font-semibold text-foreground">世界时钟</h1>
          </div>
          <p className="text-sm text-muted">拖动任意城市时间条，全局同步联动</p>
        </div>
        <button
          onClick={handleResetRealtime}
          className={`shrink-0 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-colors ${
            isRealtime
              ? "bg-primary/15 border-primary/30 text-primary"
              : "bg-primary border-primary text-background font-semibold shadow-md hover:opacity-90"
          }`}
        >
          {isRealtime
            ? <><span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />实时</>
            : <>↺ 回到实时</>
          }
        </button>
      </div>

      {/* 城市列表 */}
      <div className="space-y-2">
        {cityData.map((city) => (
          <CityRow
            key={city.id}
            city={city}
            onRemove={removeCity}
            onSliderDrag={(fraction) => handleCitySliderDrag(fraction, city.hour, city.minute)}
          />
        ))}

        <button
          onClick={() => setShowAddCity(true)}
          className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border-2 border-dashed border-white/10 text-muted hover:border-primary/40 hover:text-primary transition-colors"
        >
          <PlusIcon />
          <span className="text-sm">添加城市</span>
        </button>
      </div>

      {/* 添加城市弹窗 */}
      {showAddCity && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => { setShowAddCity(false); setSearchQuery(""); }}
        >
          <div
            className="bg-background border border-white/10 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-sm max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-white/8 shrink-0">
              <h3 className="font-semibold text-foreground">添加城市</h3>
              <button
                onClick={() => { setShowAddCity(false); setSearchQuery(""); }}
                className="w-7 h-7 flex items-center justify-center rounded-full text-muted hover:bg-white/10 transition-colors"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="px-4 py-3 shrink-0">
              <input
                type="text"
                placeholder="搜索城市或国家…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-white/10 rounded-lg bg-white/5 text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                autoFocus
              />
            </div>
            <div className="overflow-y-auto flex-1 px-4 pb-4">
              {availableCities.length === 0 ? (
                <p className="text-sm text-muted text-center py-6">未找到匹配城市</p>
              ) : (
                <div className="space-y-0.5">
                  {availableCities.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => addCity(city.id)}
                      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-left hover:bg-white/5 transition-colors"
                    >
                      <span className="text-lg leading-none">{city.flag}</span>
                      <div>
                        <div className="text-sm font-medium text-foreground">{city.name}</div>
                        <div className="text-xs text-muted">{city.country}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
