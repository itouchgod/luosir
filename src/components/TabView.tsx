"use client";

import { useState } from "react";
import type { ReactElement } from "react";
import { WorldClock } from "./WorldClock";
import { GlobalHolidays } from "./GlobalHolidays";
import { RmbConverter } from "./RmbConverter";

type Tab = "clock" | "holidays" | "rmb";

const TABS: { key: Tab; icon: string; label: string }[] = [
  { key: "clock",    icon: "🕐", label: "世界时钟" },
  { key: "holidays", icon: "🌍", label: "全球假日" },
  { key: "rmb",      icon: "💴", label: "大写转换" },
];

export function TabView(): ReactElement {
  const [activeTab, setActiveTab] = useState<Tab>("clock");

  return (
    <div className="flex flex-col h-full">
      {/* 小屏：顶部水平选项卡 */}
      <div className="flex lg:hidden justify-center py-4 shrink-0">
        <div className="flex items-center gap-1 bg-white/[0.05] border border-white/10 rounded-full p-1">
          {TABS.map(({ key, icon, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === key
                  ? "bg-primary text-background shadow-md"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 大屏：左侧浮动菜单 */}
      <div className="hidden lg:flex fixed left-6 top-24 z-40 flex-col gap-0.5 p-1.5 bg-white/[0.06] border border-white/10 rounded-2xl shadow-lg backdrop-blur-md">
        {TABS.map(({ key, icon, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              activeTab === key
                ? "bg-primary text-background shadow-md"
                : "text-muted hover:text-foreground hover:bg-white/[0.06]"
            }`}
          >
            <span className="text-base leading-none">{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* 内容区 */}
      <div className="flex-1 overflow-y-auto bg-background">
        {activeTab === "clock"    && <WorldClock />}
        {activeTab === "holidays" && <GlobalHolidays />}
        {activeTab === "rmb"      && <RmbConverter />}
      </div>
    </div>
  );
}
