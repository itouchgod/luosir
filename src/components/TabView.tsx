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
    <div className="w-full">
      {/* 选项卡 */}
      <div className="flex justify-center pt-8 pb-1">
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

      {/* 内容区 */}
      {activeTab === "clock"    && <WorldClock />}
      {activeTab === "holidays" && <GlobalHolidays />}
      {activeTab === "rmb"      && <RmbConverter />}
    </div>
  );
}
