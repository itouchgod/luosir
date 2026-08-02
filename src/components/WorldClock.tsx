"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import type { ReactElement } from "react";

interface CityDef {
  id: string;
  nameCN: string;
  nameEN: string;
  country: string;
  flag: string;
  timezone: string;
  keywords: string;
}

type WorkStatus = "work" | "edge" | "off";

const ALL_CITIES: CityDef[] = [
  {
    id: "shenzhen",
    nameCN: "深圳",
    nameEN: "Shenzhen",
    country: "中国",
    flag: "🇨🇳",
    timezone: "Asia/Shanghai",
    keywords: "shenzhen sz china zhongguo",
  },
  {
    id: "shanghai",
    nameCN: "上海",
    nameEN: "Shanghai",
    country: "中国",
    flag: "🇨🇳",
    timezone: "Asia/Shanghai",
    keywords: "shanghai china zhongguo",
  },
  {
    id: "beijing",
    nameCN: "北京",
    nameEN: "Beijing",
    country: "中国",
    flag: "🇨🇳",
    timezone: "Asia/Shanghai",
    keywords: "beijing bj china zhongguo",
  },
  {
    id: "hongkong",
    nameCN: "香港",
    nameEN: "Hong Kong",
    country: "中国",
    flag: "🇭🇰",
    timezone: "Asia/Hong_Kong",
    keywords: "hongkong hong kong hk xianggang",
  },
  {
    id: "losangeles",
    nameCN: "洛杉矶",
    nameEN: "Los Angeles",
    country: "美国",
    flag: "🇺🇸",
    timezone: "America/Los_Angeles",
    keywords: "los angeles la us usa meiguo",
  },
  {
    id: "newyork",
    nameCN: "纽约",
    nameEN: "New York",
    country: "美国",
    flag: "🇺🇸",
    timezone: "America/New_York",
    keywords: "new york ny us usa meiguo",
  },
  {
    id: "chicago",
    nameCN: "芝加哥",
    nameEN: "Chicago",
    country: "美国",
    flag: "🇺🇸",
    timezone: "America/Chicago",
    keywords: "chicago us usa meiguo",
  },
  {
    id: "toronto",
    nameCN: "多伦多",
    nameEN: "Toronto",
    country: "加拿大",
    flag: "🇨🇦",
    timezone: "America/Toronto",
    keywords: "toronto canada jianada",
  },
  {
    id: "saopaulo",
    nameCN: "圣保罗",
    nameEN: "Sao Paulo",
    country: "巴西",
    flag: "🇧🇷",
    timezone: "America/Sao_Paulo",
    keywords: "sao paulo brazil baxi",
  },
  {
    id: "mexicocity",
    nameCN: "墨西哥城",
    nameEN: "Mexico City",
    country: "墨西哥",
    flag: "🇲🇽",
    timezone: "America/Mexico_City",
    keywords: "mexico city moxige",
  },
  {
    id: "london",
    nameCN: "伦敦",
    nameEN: "London",
    country: "英国",
    flag: "🇬🇧",
    timezone: "Europe/London",
    keywords: "london uk gb england yingguo",
  },
  {
    id: "manchester",
    nameCN: "曼彻斯特",
    nameEN: "Manchester",
    country: "英国",
    flag: "🇬🇧",
    timezone: "Europe/London",
    keywords: "manchester uk gb england yingguo",
  },
  {
    id: "paris",
    nameCN: "巴黎",
    nameEN: "Paris",
    country: "法国",
    flag: "🇫🇷",
    timezone: "Europe/Paris",
    keywords: "paris france faguo",
  },
  {
    id: "berlin",
    nameCN: "柏林",
    nameEN: "Berlin",
    country: "德国",
    flag: "🇩🇪",
    timezone: "Europe/Berlin",
    keywords: "berlin germany deguo",
  },
  {
    id: "amsterdam",
    nameCN: "阿姆斯特丹",
    nameEN: "Amsterdam",
    country: "荷兰",
    flag: "🇳🇱",
    timezone: "Europe/Amsterdam",
    keywords: "amsterdam netherlands helan",
  },
  {
    id: "rome",
    nameCN: "罗马",
    nameEN: "Rome",
    country: "意大利",
    flag: "🇮🇹",
    timezone: "Europe/Rome",
    keywords: "rome italy yidali",
  },
  {
    id: "madrid",
    nameCN: "马德里",
    nameEN: "Madrid",
    country: "西班牙",
    flag: "🇪🇸",
    timezone: "Europe/Madrid",
    keywords: "madrid spain xibanya",
  },
  {
    id: "moscow",
    nameCN: "莫斯科",
    nameEN: "Moscow",
    country: "俄罗斯",
    flag: "🇷🇺",
    timezone: "Europe/Moscow",
    keywords: "moscow russia eluosi",
  },
  {
    id: "istanbul",
    nameCN: "伊斯坦布尔",
    nameEN: "Istanbul",
    country: "土耳其",
    flag: "🇹🇷",
    timezone: "Europe/Istanbul",
    keywords: "istanbul turkey tuerqi",
  },
  {
    id: "dubai",
    nameCN: "迪拜",
    nameEN: "Dubai",
    country: "阿联酋",
    flag: "🇦🇪",
    timezone: "Asia/Dubai",
    keywords: "dubai uae alianqiu",
  },
  {
    id: "riyadh",
    nameCN: "利雅得",
    nameEN: "Riyadh",
    country: "沙特",
    flag: "🇸🇦",
    timezone: "Asia/Riyadh",
    keywords: "riyadh saudi shate",
  },
  {
    id: "cairo",
    nameCN: "开罗",
    nameEN: "Cairo",
    country: "埃及",
    flag: "🇪🇬",
    timezone: "Africa/Cairo",
    keywords: "cairo egypt aiji",
  },
  {
    id: "johannesburg",
    nameCN: "约翰内斯堡",
    nameEN: "Johannesburg",
    country: "南非",
    flag: "🇿🇦",
    timezone: "Africa/Johannesburg",
    keywords: "johannesburg south africa nanfei",
  },
  {
    id: "newdelhi",
    nameCN: "新德里",
    nameEN: "New Delhi",
    country: "印度",
    flag: "🇮🇳",
    timezone: "Asia/Kolkata",
    keywords: "new delhi india yindu",
  },
  {
    id: "mumbai",
    nameCN: "孟买",
    nameEN: "Mumbai",
    country: "印度",
    flag: "🇮🇳",
    timezone: "Asia/Kolkata",
    keywords: "mumbai india yindu",
  },
  {
    id: "bangkok",
    nameCN: "曼谷",
    nameEN: "Bangkok",
    country: "泰国",
    flag: "🇹🇭",
    timezone: "Asia/Bangkok",
    keywords: "bangkok thailand taiguo",
  },
  {
    id: "singapore",
    nameCN: "新加坡",
    nameEN: "Singapore",
    country: "新加坡",
    flag: "🇸🇬",
    timezone: "Asia/Singapore",
    keywords: "singapore xinjiapo",
  },
  {
    id: "jakarta",
    nameCN: "雅加达",
    nameEN: "Jakarta",
    country: "印尼",
    flag: "🇮🇩",
    timezone: "Asia/Jakarta",
    keywords: "jakarta indonesia yinni",
  },
  {
    id: "kualalumpur",
    nameCN: "吉隆坡",
    nameEN: "Kuala Lumpur",
    country: "马来西亚",
    flag: "🇲🇾",
    timezone: "Asia/Kuala_Lumpur",
    keywords: "kuala lumpur malaysia malaixiya",
  },
  {
    id: "tokyo",
    nameCN: "东京",
    nameEN: "Tokyo",
    country: "日本",
    flag: "🇯🇵",
    timezone: "Asia/Tokyo",
    keywords: "tokyo japan riben",
  },
  {
    id: "seoul",
    nameCN: "首尔",
    nameEN: "Seoul",
    country: "韩国",
    flag: "🇰🇷",
    timezone: "Asia/Seoul",
    keywords: "seoul korea hanguo",
  },
  {
    id: "sydney",
    nameCN: "悉尼",
    nameEN: "Sydney",
    country: "澳大利亚",
    flag: "🇦🇺",
    timezone: "Australia/Sydney",
    keywords: "sydney australia aodaliya",
  },
  {
    id: "melbourne",
    nameCN: "墨尔本",
    nameEN: "Melbourne",
    country: "澳大利亚",
    flag: "🇦🇺",
    timezone: "Australia/Melbourne",
    keywords: "melbourne australia aodaliya",
  },
  {
    id: "auckland",
    nameCN: "奥克兰",
    nameEN: "Auckland",
    country: "新西兰",
    flag: "🇳🇿",
    timezone: "Pacific/Auckland",
    keywords: "auckland new zealand xinxilan",
  },
];

const HOME_CITY_ID = "shanghai";
const DEFAULT_CITY_IDS = [
  "shanghai",
  "newyork",
  "losangeles",
  "london",
  "berlin",
  "dubai",
  "newdelhi",
  "sydney",
];

const CITY_BY_ID = new Map(ALL_CITIES.map((city) => [city.id, city]));
const TIME_PARTS_FORMATTERS = new Map<string, Intl.DateTimeFormat>();
const WEEKDAY_FORMATTERS = new Map<string, Intl.DateTimeFormat>();

const STATUS_COLOR: Record<WorkStatus, string> = {
  work: "var(--timeline-work)",
  edge: "var(--timeline-edge)",
  off: "var(--timeline-off)",
};

const STATUS_LABEL: Record<WorkStatus, string> = {
  work: "工作时间（09:00–17:00）",
  edge: "边缘时间（08:00–09:00 / 17:00–19:00）",
  off: "休息时间",
};

function ClockIcon(): ReactElement {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function PlusIcon(): ReactElement {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function XIcon({
  className = "h-4 w-4",
}: {
  className?: string;
}): ReactElement {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ChevronDownIcon(): ReactElement {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3 w-3"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function SearchIcon(): ReactElement {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function getCity(id: string): CityDef | null {
  return CITY_BY_ID.get(id) ?? null;
}

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

function getTimeParts(utcMs: number, timezone: string) {
  let formatter = TIME_PARTS_FORMATTERS.get(timezone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    TIME_PARTS_FORMATTERS.set(timezone, formatter);
  }

  const parts = formatter.formatToParts(new Date(utcMs));

  const map: Record<string, string> = {};
  parts.forEach((part) => {
    map[part.type] = part.value;
  });
  if (map.hour === "24") map.hour = "00";

  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour: Number(map.hour),
    minute: Number(map.minute),
    second: Number(map.second ?? "0"),
  };
}

function getWeekday(utcMs: number, timezone: string): string {
  let formatter = WEEKDAY_FORMATTERS.get(timezone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat("zh-CN", {
      timeZone: timezone,
      weekday: "short",
    });
    WEEKDAY_FORMATTERS.set(timezone, formatter);
  }
  const value = formatter.format(new Date(utcMs));
  return value.replace("星期", "周");
}

function getDateLabel(utcMs: number, timezone: string): string {
  const parts = getTimeParts(utcMs, timezone);
  return (
    pad2(parts.month) +
    "月" +
    pad2(parts.day) +
    "日 " +
    getWeekday(utcMs, timezone)
  );
}

function getIsoDate(utcMs: number, timezone: string): string {
  const parts = getTimeParts(utcMs, timezone);
  return parts.year + "-" + pad2(parts.month) + "-" + pad2(parts.day);
}

function getTimezoneOffsetMin(utcMs: number, timezone: string): number {
  const wholeSecondUtcMs = Math.floor(utcMs / 1_000) * 1_000;
  const parts = getTimeParts(wholeSecondUtcMs, timezone);
  const localMs = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second
  );
  return (localMs - wholeSecondUtcMs) / 60_000;
}

function isDSTActive(utcMs: number, timezone: string): boolean {
  const year = new Date(utcMs).getUTCFullYear();
  const janOffset = getTimezoneOffsetMin(Date.UTC(year, 0, 15, 12), timezone);
  const julOffset = getTimezoneOffsetMin(Date.UTC(year, 6, 15, 12), timezone);
  if (janOffset === julOffset) return false;
  return (
    getTimezoneOffsetMin(utcMs, timezone) === Math.max(janOffset, julOffset)
  );
}

function getWorkStatus(hour: number): WorkStatus {
  if (hour >= 9 && hour < 17) return "work";
  if ((hour >= 8 && hour < 9) || (hour >= 17 && hour < 19)) return "edge";
  return "off";
}

function getDayDiff(
  utcMs: number,
  timezone: string,
  homeTimezone: string
): number {
  const cityDate = getIsoDate(utcMs, timezone);
  const homeDate = getIsoDate(utcMs, homeTimezone);
  if (cityDate === homeDate) return 0;
  return cityDate > homeDate ? 1 : -1;
}

function StatusSwatch({ status }: { status: WorkStatus }): ReactElement {
  return (
    <span
      className="inline-block h-2.5 w-6 rounded-sm"
      style={{ backgroundColor: STATUS_COLOR[status] }}
    />
  );
}

function AddCityModal({
  cityIds,
  onAdd,
  onClose,
}: {
  cityIds: string[];
  onAdd: (id: string) => void;
  onClose: () => void;
}): ReactElement {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const filteredCities = useMemo(() => {
    const value = query.trim().toLowerCase();
    return ALL_CITIES.filter((city) => {
      if (!value) return true;
      return (
        city.nameCN.includes(value) ||
        city.nameEN.toLowerCase().includes(value) ||
        city.country.includes(value) ||
        city.keywords.includes(value)
      );
    }).slice(0, 24);
  }, [query]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/60 px-4 pt-24 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="添加城市"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-background shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-white/8 p-4">
          <div className="flex items-center gap-3">
            <span className="shrink-0 text-muted">
              <SearchIcon />
            </span>
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索城市或国家（中文 / 英文 / 拼音）"
              className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
            />
            <button
              type="button"
              onClick={onClose}
              aria-label="关闭添加城市"
              className="text-muted transition-colors hover:text-foreground"
            >
              <XIcon />
            </button>
          </div>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {filteredCities.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted">
              未找到城市
            </div>
          ) : (
            filteredCities.map((city) => {
              const selected = cityIds.includes(city.id);
              return (
                <button
                  key={city.id}
                  type="button"
                  disabled={selected}
                  onClick={() => {
                    onAdd(city.id);
                    onClose();
                  }}
                  className={
                    "flex w-full items-center justify-between border-b border-white/5 px-4 py-3 text-left text-sm transition-colors last:border-0 " +
                    (selected
                      ? "cursor-not-allowed opacity-40"
                      : "hover:bg-white/[0.05]")
                  }
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="text-lg">{city.flag}</span>
                    <span className="min-w-0">
                      <span className="font-medium text-foreground">
                        {city.country !== "中国" && city.country !== city.nameCN
                          ? city.country + " · " + city.nameCN
                          : city.nameCN}
                      </span>
                      <span className="ml-1.5 text-muted">{city.nameEN}</span>
                    </span>
                  </span>
                  {selected ? (
                    <span className="text-xs text-primary">已添加</span>
                  ) : null}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function TimeGrid({
  cityIds,
  homeCityId,
  currentUtcMs,
  realtime,
  onHomeCityChange,
  onCurrentUtcMsChange,
  onRealtimeChange,
  onRemoveCity,
  onAddCityClick,
}: {
  cityIds: string[];
  homeCityId: string;
  currentUtcMs: number;
  realtime: boolean;
  onHomeCityChange: (id: string) => void;
  onCurrentUtcMsChange: (value: number | ((current: number) => number)) => void;
  onRealtimeChange: (value: boolean) => void;
  onRemoveCity: (id: string) => void;
  onAddCityClick: () => void;
}): ReactElement {
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia("(max-width: 767px)").matches
  );
  const [showHomeSelect, setShowHomeSelect] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const update = (event: MediaQueryListEvent) => setIsMobile(event.matches);
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  const homeCity =
    getCity(homeCityId) ?? getCity(HOME_CITY_ID) ?? ALL_CITIES[0];
  const homeTime = getTimeParts(currentUtcMs, homeCity.timezone);
  const currentMinuteOfDay = homeTime.hour * 60 + homeTime.minute;
  const homeHourStartUtc =
    currentUtcMs -
    homeTime.minute * 60_000 -
    homeTime.second * 1_000 -
    (currentUtcMs % 1_000);
  const span = isMobile ? 1 : 6;
  const columns = useMemo(
    () =>
      Array.from(
        { length: span * 2 + 1 },
        (_, index) => homeHourStartUtc + (index - span) * 3_600_000
      ),
    [homeHourStartUtc, span]
  );
  const cityColumnWidth = isMobile ? 104 : 150;
  const hourMinWidth = isMobile ? 58 : 52;
  const gridMinWidth = isMobile ? "100%" : "760px";
  const gridTemplateColumns =
    cityColumnWidth +
    "px repeat(" +
    columns.length +
    ", minmax(" +
    hourMinWidth +
    "px, 1fr))";

  const orderedCityIds = useMemo(
    () => [homeCityId, ...cityIds.filter((id) => id !== homeCityId)],
    [cityIds, homeCityId]
  );

  const setHomeMinute = (minuteOfDay: number) => {
    onRealtimeChange(false);
    onCurrentUtcMsChange(
      (current) => current + (minuteOfDay - currentMinuteOfDay) * 60_000
    );
  };

  const shiftDay = (days: number) => {
    onRealtimeChange(false);
    onCurrentUtcMsChange((current) => current + days * 86_400_000);
  };

  const resetNow = () => {
    onRealtimeChange(true);
    onCurrentUtcMsChange(Date.now());
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex items-center justify-between gap-2 sm:hidden">
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-primary">
            <ClockIcon />
          </span>
          <h1 className="text-base font-semibold text-foreground">世界时钟</h1>
        </div>

        <div className="flex min-w-0 items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => shiftDay(-1)}
            aria-label="前一天"
            className="rounded-lg p-1 text-muted transition-colors hover:bg-white/[0.05] hover:text-foreground"
          >
            ‹
          </button>
          <span className="w-[84px] text-center text-xs font-medium text-foreground">
            {getDateLabel(currentUtcMs, homeCity.timezone)}
          </span>
          <button
            type="button"
            onClick={() => shiftDay(1)}
            aria-label="后一天"
            className="rounded-lg p-1 text-muted transition-colors hover:bg-white/[0.05] hover:text-foreground"
          >
            ›
          </button>
          <button
            type="button"
            onClick={onAddCityClick}
            className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-lg border border-primary/25 bg-primary/15 px-2 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
          >
            <PlusIcon />
            添加城市
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowHomeSelect((value) => !value)}
              aria-expanded={showHomeSelect}
              className="inline-flex max-w-[190px] items-center justify-center gap-1.5 rounded-lg border border-primary/25 bg-primary/15 px-2.5 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20 sm:max-w-none sm:px-3"
            >
              <span aria-hidden="true">📍</span>
              <span className="truncate">
                {homeCity.flag} {homeCity.nameCN}
              </span>
              <span className="hidden text-xs opacity-70 sm:inline">
                · 我的城市
              </span>
              <ChevronDownIcon />
            </button>
            {showHomeSelect ? (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowHomeSelect(false)}
                />
                <div className="absolute left-0 top-full z-20 mt-1 min-w-40 rounded-xl border border-white/10 bg-background py-1 shadow-xl">
                  {cityIds.map((id) => {
                    const city = getCity(id);
                    if (!city) return null;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => {
                          onHomeCityChange(id);
                          setShowHomeSelect(false);
                        }}
                        className={
                          "flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition-colors hover:bg-white/[0.05] " +
                          (id === homeCityId
                            ? "font-medium text-primary"
                            : "text-foreground")
                        }
                      >
                        <span>{city.flag}</span>
                        <span>{city.nameCN}</span>
                        {id === homeCityId ? (
                          <span className="ml-auto text-xs text-primary">
                            ✓
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </>
            ) : null}
          </div>

          <div className="ml-auto sm:hidden">
            {realtime ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/15 px-2 py-1 text-xs text-primary">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                实时
              </span>
            ) : (
              <button
                type="button"
                onClick={resetNow}
                className="shrink-0 whitespace-nowrap rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-background transition-opacity hover:opacity-90"
              >
                回到现在
              </button>
            )}
          </div>

          <div className="hidden shrink-0 items-center gap-1 sm:flex">
            <button
              type="button"
              onClick={() => shiftDay(-1)}
              aria-label="前一天"
              className="rounded-lg p-1.5 text-muted transition-colors hover:bg-white/[0.05] hover:text-foreground"
            >
              ‹
            </button>
            <span className="w-[108px] text-center text-sm font-medium text-foreground sm:w-32">
              {getDateLabel(currentUtcMs, homeCity.timezone)}
            </span>
            <button
              type="button"
              onClick={() => shiftDay(1)}
              aria-label="后一天"
              className="rounded-lg p-1.5 text-muted transition-colors hover:bg-white/[0.05] hover:text-foreground"
            >
              ›
            </button>
          </div>
        </div>

        <div className="hidden items-center justify-between gap-2 sm:flex sm:gap-3 lg:justify-end">
          <div className="hidden shrink-0 items-center gap-2 whitespace-nowrap rounded-xl border border-white/8 bg-white/[0.04] px-2.5 py-2 text-xs text-muted sm:flex">
            <span className="flex items-center gap-1.5">
              <StatusSwatch status="work" />
              工作时间
            </span>
            <span className="flex items-center gap-1.5">
              <StatusSwatch status="edge" />
              边缘时间
            </span>
            <span className="flex items-center gap-1.5">
              <StatusSwatch status="off" />
              休息时间
            </span>
          </div>
          {realtime ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/15 px-2 py-1 text-xs text-primary">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              实时
            </span>
          ) : (
            <button
              type="button"
              onClick={resetNow}
              className="shrink-0 whitespace-nowrap rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-background transition-opacity hover:opacity-90"
            >
              回到现在
            </button>
          )}
          <button
            type="button"
            onClick={onAddCityClick}
            className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border border-primary/25 bg-primary/15 px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
          >
            <PlusIcon />
            添加城市
          </button>
        </div>
      </div>

      <section className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 pb-3 pt-6 shadow-sm sm:px-4 sm:pb-4 sm:pt-7">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="w-9 text-right text-xs tabular-nums text-muted sm:w-10">
            00:00
          </span>
          <div className="relative flex-1">
            <input
              type="range"
              min={0}
              max={1439}
              step={1}
              value={currentMinuteOfDay}
              onChange={(event) => setHomeMinute(Number(event.target.value))}
              aria-label="调整我的城市时间"
              className="w-full cursor-pointer accent-primary"
            />
            <div className="pointer-events-none absolute -top-6 left-0 w-full">
              <span
                className="absolute -translate-x-1/2 rounded bg-foreground px-1.5 py-0.5 font-mono text-[11px] font-semibold tabular-nums text-background"
                style={{ left: (currentMinuteOfDay / 1439) * 100 + "%" }}
              >
                {pad2(homeTime.hour)}:{pad2(homeTime.minute)}
              </span>
            </div>
          </div>
          <span className="w-9 text-xs text-muted sm:w-10">23:59</span>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-sm">
        <div className="overflow-x-auto">
          <div
            className="grid border-b border-white/8"
            style={{ gridTemplateColumns, minWidth: gridMinWidth }}
          >
            <div className="border-r border-dashed border-white/10 px-2 py-2 text-center text-xs font-medium text-muted sm:px-4">
              城市
            </div>
            {columns.map((utcMs, index) => (
              <div
                key={utcMs}
                className={
                  "border-r border-dashed border-white/10 px-2 py-2 text-center font-mono text-xs transition-colors last:border-r-0 " +
                  (index === span
                    ? "bg-primary/15 font-bold text-primary"
                    : "text-muted")
                }
              >
                {pad2(getTimeParts(utcMs, homeCity.timezone).hour)}
              </div>
            ))}
          </div>

          {orderedCityIds.map((id) => {
            const city = getCity(id);
            if (!city) return null;
            const cityTime = getTimeParts(currentUtcMs, city.timezone);
            const isHome = id === homeCityId;
            const dayDiff = getDayDiff(
              currentUtcMs,
              city.timezone,
              homeCity.timezone
            );
            const dst = isDSTActive(currentUtcMs, city.timezone);

            return (
              <div
                key={id}
                className={
                  "grid border-b border-white/5 last:border-0 transition-colors hover:bg-white/[0.03] " +
                  (isHome ? "bg-primary/[0.06]" : "")
                }
                style={{ gridTemplateColumns, minWidth: gridMinWidth }}
              >
                <div className="flex items-center gap-1.5 border-r border-dashed border-white/10 px-2 py-2.5 sm:gap-2 sm:px-3 sm:py-3">
                  <span className="text-sm sm:text-base">{city.flag}</span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-foreground">
                      {city.nameCN}
                    </div>
                    <div className="mt-0.5 flex items-center gap-1">
                      {isHome ? (
                        <span className="text-[10px] text-muted">本地</span>
                      ) : null}
                      {!isHome && dayDiff !== 0 ? (
                        <span className="rounded bg-primary/15 px-1 py-0.5 text-[10px] font-semibold leading-none text-primary">
                          {dayDiff > 0 ? "+" + dayDiff + "天" : dayDiff + "天"}
                        </span>
                      ) : null}
                      {dst ? (
                        <span className="text-[10px] font-medium text-primary">
                          夏
                        </span>
                      ) : null}
                    </div>
                  </div>
                  {!isHome ? (
                    <button
                      type="button"
                      onClick={() => onRemoveCity(id)}
                      aria-label={"移除 " + city.nameCN}
                      className="shrink-0 text-muted transition-colors hover:text-primary"
                    >
                      <XIcon className="h-3.5 w-3.5" />
                    </button>
                  ) : null}
                </div>

                {columns.map((utcMs, index) => {
                  const parts = getTimeParts(utcMs, city.timezone);
                  const status = getWorkStatus(parts.hour);
                  const isReference = index === span;
                  return (
                    <div
                      key={utcMs}
                      title={
                        city.nameCN +
                        " · " +
                        pad2(parts.hour) +
                        ":" +
                        pad2(parts.minute) +
                        " · " +
                        STATUS_LABEL[status]
                      }
                      className={
                        "flex flex-col items-center justify-center border-r border-dashed border-white/10 px-1.5 py-2.5 last:border-r-0 sm:px-2 sm:py-3 " +
                        (isReference
                          ? "bg-primary/15 ring-2 ring-inset ring-primary/60"
                          : "")
                      }
                    >
                      <div
                        className={
                          "h-3 w-5/6 rounded-sm sm:h-3.5 " +
                          (isReference ? "" : "opacity-70")
                        }
                        style={{ backgroundColor: STATUS_COLOR[status] }}
                      />
                      {isReference ? (
                        <div className="mt-1 font-mono text-xs font-bold tabular-nums text-primary">
                          {pad2(cityTime.hour)}:{pad2(cityTime.minute)}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export function WorldClock(): ReactElement {
  const [mounted, setMounted] = useState(false);
  const [cityIds, setCityIds] = useState<string[]>(DEFAULT_CITY_IDS);
  const [homeCityId, setHomeCityId] = useState(HOME_CITY_ID);
  const [currentUtcMs, setCurrentUtcMs] = useState(0);
  const [realtime, setRealtime] = useState(true);
  const [showAddCity, setShowAddCity] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentUtcMs(Date.now());
  }, []);

  useEffect(() => {
    if (!mounted || !realtime) return;
    let minuteTimer: number | undefined;
    const alignTimer = window.setTimeout(
      () => {
        setCurrentUtcMs(Date.now());
        minuteTimer = window.setInterval(
          () => setCurrentUtcMs(Date.now()),
          60_000
        );
      },
      60_000 - (Date.now() % 60_000)
    );

    return () => {
      window.clearTimeout(alignTimer);
      if (minuteTimer !== undefined) window.clearInterval(minuteTimer);
    };
  }, [mounted, realtime]);

  const addCity = useCallback((id: string) => {
    setCityIds((current) =>
      current.includes(id) ? current : [...current, id]
    );
  }, []);

  const removeCity = useCallback(
    (id: string) => {
      if (id === homeCityId) return;
      setCityIds((current) => current.filter((cityId) => cityId !== id));
    },
    [homeCityId]
  );

  const closeAddCity = useCallback(() => setShowAddCity(false), []);

  if (!mounted) return <div className="min-h-[60vh]" />;

  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-5 hidden sm:block">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-primary">
            <ClockIcon />
          </span>
          <h1 className="text-lg font-semibold text-foreground">世界时钟</h1>
        </div>
        <p className="text-sm text-muted">拖动统一时间轴，各城市同步联动</p>
      </div>

      <TimeGrid
        cityIds={cityIds}
        homeCityId={homeCityId}
        currentUtcMs={currentUtcMs}
        realtime={realtime}
        onHomeCityChange={setHomeCityId}
        onCurrentUtcMsChange={setCurrentUtcMs}
        onRealtimeChange={setRealtime}
        onRemoveCity={removeCity}
        onAddCityClick={() => setShowAddCity(true)}
      />

      {showAddCity ? (
        <AddCityModal
          cityIds={cityIds}
          onAdd={addCity}
          onClose={closeAddCity}
        />
      ) : null}
    </section>
  );
}
