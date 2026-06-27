"use client";

import { useState, useCallback } from "react";
import type { ReactElement } from "react";

// ── 中文大写核心算法 ──────────────────────────────────────────────────────────

const CN_DIGITS = "零壹贰叁肆伍陆柒捌玖";

function convertSection(numStr: string): string {
  const n = numStr.padStart(4, "0");
  const units = ["仟", "佰", "拾", ""];
  let result = "";
  for (let i = 0; i < 4; i++) {
    const d = parseInt(n[i]);
    if (d !== 0) {
      result += CN_DIGITS[d] + units[i];
    } else if (result && !result.endsWith("零")) {
      result += "零";
    }
  }
  return result.replace(/零$/, "");
}

function rmbToUppercase(input: string): string {
  const cleaned = input.replace(/,/g, "").replace(/\s/g, "");
  if (!cleaned) return "";
  const normalized = cleaned.startsWith(".") ? "0" + cleaned : cleaned;
  if (!/^\d+(\.\d{0,2})?$/.test(normalized)) return "";

  const [intStr, decStr = ""] = normalized.split(".");
  const jiao = parseInt(decStr[0] || "0");
  const fen  = parseInt(decStr[1] || "0");
  const intNum = Number(intStr);

  if (intNum > 999_999_999_999) return "金额超出范围（最大9999亿）";
  if (intNum === 0 && jiao === 0 && fen === 0) return "人民币零元整";

  let intResult = "";
  if (intNum > 0) {
    const yi  = Math.floor(intNum / 1e8);
    const wan = Math.floor((intNum % 1e8) / 1e4);
    const ge  = intNum % 1e4;
    if (yi  > 0) intResult += convertSection(String(yi)) + "亿";
    if (wan > 0) {
      if (yi > 0 && wan < 1000) intResult += "零";
      intResult += convertSection(String(wan)) + "万";
    }
    if (ge > 0) {
      const prevNonZero = yi > 0 || wan > 0;
      if (prevNonZero && (ge < 1000 || (yi > 0 && wan === 0))) intResult += "零";
      intResult += convertSection(String(ge));
    }
  }

  let result = "人民币";
  if (intResult) result += intResult + "元";

  if (jiao === 0 && fen === 0) {
    result += "整";
  } else if (jiao === 0) {
    result += (intResult ? "零" : "") + CN_DIGITS[fen] + "分";
  } else {
    result += CN_DIGITS[jiao] + "角" + (fen > 0 ? CN_DIGITS[fen] + "分" : "整");
  }
  return result;
}

// ── 英文金额算法 ──────────────────────────────────────────────────────────────

const EN_ONES = [
  "", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE",
  "TEN", "ELEVEN", "TWELVE", "THIRTEEN", "FOURTEEN", "FIFTEEN", "SIXTEEN",
  "SEVENTEEN", "EIGHTEEN", "NINETEEN",
];
const EN_TENS = ["", "", "TWENTY", "THIRTY", "FORTY", "FIFTY", "SIXTY", "SEVENTY", "EIGHTY", "NINETY"];

function convertHundreds(n: number): string {
  if (n === 0) return "";
  let result = "";
  if (n >= 100) {
    result += EN_ONES[Math.floor(n / 100)] + " HUNDRED";
    n %= 100;
    if (n > 0) result += " ";
  }
  if (n >= 20) {
    result += EN_TENS[Math.floor(n / 10)];
    if (n % 10 > 0) result += "-" + EN_ONES[n % 10];
  } else if (n > 0) {
    result += EN_ONES[n];
  }
  return result;
}

function convertToEnglishWords(n: number): string {
  if (n === 0) return "ZERO";
  const parts: string[] = [];
  const billions  = Math.floor(n / 1_000_000_000);
  const millions  = Math.floor((n % 1_000_000_000) / 1_000_000);
  const thousands = Math.floor((n % 1_000_000) / 1_000);
  const remainder = n % 1_000;
  if (billions  > 0) parts.push(convertHundreds(billions)  + " BILLION");
  if (millions  > 0) parts.push(convertHundreds(millions)  + " MILLION");
  if (thousands > 0) parts.push(convertHundreds(thousands) + " THOUSAND");
  if (remainder > 0) parts.push(convertHundreds(remainder));
  return parts.join(" ");
}

function rmbToEnglish(input: string): string {
  const cleaned = input.replace(/,/g, "").replace(/\s/g, "");
  if (!cleaned) return "";
  const normalized = cleaned.startsWith(".") ? "0" + cleaned : cleaned;
  if (!/^\d+(\.\d{0,2})?$/.test(normalized)) return "";

  const [intStr, decStr = ""] = normalized.split(".");
  const cents   = parseInt((decStr + "00").slice(0, 2));
  const dollars = parseInt(intStr) || 0;

  if (dollars === 0 && cents === 0) return "SAY USD ZERO DOLLARS ONLY";

  let result = "SAY USD " + convertToEnglishWords(dollars) + (dollars === 1 ? " DOLLAR" : " DOLLARS");
  if (cents > 0) result += " AND " + convertToEnglishWords(cents) + (cents === 1 ? " CENT" : " CENTS");
  return result + " ONLY";
}

// ── 示例数据 ──────────────────────────────────────────────────────────────────

const PRESETS = ["100", "1000", "10000", "100000", "1000000"];

const EXAMPLES = [
  { num: "1688.99",   desc: "壹仟陆佰捌拾捌元玖角玖分" },
  { num: "16409.02",  desc: "壹万陆仟肆佰零玖元零贰分" },
  { num: "107000.53", desc: "壹拾万柒仟元伍角叁分" },
  { num: "1000000",   desc: "壹佰万元整" },
];

// ── 图标 ──────────────────────────────────────────────────────────────────────

function CopyIcon(): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon(): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 text-emerald-400">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ChevronDownIcon({ open }: { open: boolean }): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

// ── 主组件 ────────────────────────────────────────────────────────────────────

export function RmbConverter(): ReactElement {
  const [input, setInput]       = useState("");
  const [copiedCN, setCopiedCN] = useState(false);
  const [copiedEN, setCopiedEN] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);

  const cnResult = rmbToUppercase(input);
  const enResult = rmbToEnglish(input);
  const isError  = (input !== "" && cnResult === "") || cnResult.startsWith("金额超出");
  const isValid  = input !== "" && cnResult !== "" && !isError;

  const copyText = useCallback(async (text: string, setCopied: (v: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  }, []);

  return (
    <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8">

      {/* 页头 */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-2xl">💴</span>
        <div>
          <h1 className="text-lg font-semibold text-foreground">人民币大写转换</h1>
          <p className="text-xs text-muted mt-0.5">小写金额转规范中文大写，适用于票据、合同、发票</p>
        </div>
      </div>

      {/* 输入卡片 */}
      <div className="mb-4 rounded-xl border border-white/10 bg-white/[0.05] p-4">
        <label className="mb-1.5 block text-xs font-medium text-muted">
          小写金额（支持小数，如 1,688.99）
        </label>
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold text-primary select-none">¥</span>
          <input
            type="text"
            inputMode="decimal"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="请输入金额，例如 1688.99"
            className={`h-12 min-w-0 flex-1 rounded-lg border bg-white/[0.05] px-3 text-lg text-foreground outline-none transition-colors placeholder:text-muted/40 ${
              isError
                ? "border-red-500/40 focus:border-red-500/60 focus:ring-1 focus:ring-red-500/20"
                : "border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/15"
            }`}
            autoComplete="off"
          />
          {input && (
            <button
              type="button"
              onClick={() => setInput("")}
              className="shrink-0 rounded-lg border border-white/10 px-3 py-2 text-xs text-muted hover:bg-white/5 hover:text-foreground transition-colors"
            >
              清除
            </button>
          )}
        </div>

        {/* 快速预设 */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-muted/60">快速输入：</span>
          {PRESETS.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setInput(v)}
              className={`rounded-full border px-2.5 py-0.5 text-xs transition-colors ${
                input === v
                  ? "border-primary/40 bg-primary/15 text-primary"
                  : "border-white/10 text-muted hover:bg-white/5 hover:text-foreground"
              }`}
            >
              {Number(v).toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      {/* 中文大写结果 */}
      <div className={`mb-3 rounded-xl border p-4 transition-all ${
        isValid
          ? "border-emerald-500/25 bg-emerald-500/8"
          : "border-white/10 bg-white/[0.04]"
      }`}>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-muted">中文大写</span>
          {isValid && (
            <button
              type="button"
              onClick={() => copyText(cnResult, setCopiedCN)}
              className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-muted transition-colors hover:bg-white/10 hover:text-foreground"
            >
              {copiedCN ? <CheckIcon /> : <CopyIcon />}
              {copiedCN ? "已复制" : "复制"}
            </button>
          )}
        </div>
        <p className={`min-h-8 select-all break-all text-base font-medium leading-relaxed tracking-wide ${
          isValid   ? "text-foreground" :
          isError   ? "text-red-400" :
                      "text-muted/40"
        }`}>
          {cnResult || "人民币（金额大写将在此显示）"}
        </p>
      </div>

      {/* 英文金额结果 */}
      <div className={`mb-4 rounded-xl border p-4 transition-all ${
        isValid && enResult
          ? "border-primary/20 bg-primary/8"
          : "border-white/10 bg-white/[0.04]"
      }`}>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-muted">英文金额（发票用）</span>
          {isValid && enResult && (
            <button
              type="button"
              onClick={() => copyText(enResult, setCopiedEN)}
              className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-muted transition-colors hover:bg-white/10 hover:text-foreground"
            >
              {copiedEN ? <CheckIcon /> : <CopyIcon />}
              {copiedEN ? "已复制" : "复制"}
            </button>
          )}
        </div>
        <p className={`min-h-8 select-all break-all font-mono text-sm leading-relaxed ${
          isValid && enResult ? "text-foreground" : "text-muted/40"
        }`}>
          {(isValid && enResult) ? enResult : "SAY USD（英文金额将在此显示）"}
        </p>
      </div>

      {/* 典型示例 */}
      <div className="mb-4 rounded-xl border border-white/10 bg-white/[0.04] overflow-hidden">
        <div className="px-4 py-3 text-xs font-medium text-muted border-b border-white/8 bg-white/[0.03]">
          典型示例（点击填入）
        </div>
        <div className="divide-y divide-white/5">
          {EXAMPLES.map(({ num, desc }) => (
            <button
              key={num}
              type="button"
              onClick={() => setInput(num)}
              className="flex w-full items-center justify-between px-4 py-2.5 text-left transition-colors hover:bg-white/5"
            >
              <span className="text-sm font-mono text-primary shrink-0">
                ¥{Number(num).toLocaleString()}
              </span>
              <span className="ml-3 min-w-0 truncate text-right text-xs text-muted">
                {desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 规范说明（可折叠） */}
      <div className="rounded-xl border border-white/10 bg-white/[0.04] overflow-hidden">
        <button
          type="button"
          onClick={() => setRulesOpen((o) => !o)}
          className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors"
        >
          <span className="text-sm font-medium text-foreground">人民币大写规范说明</span>
          <ChevronDownIcon open={rulesOpen} />
        </button>
        {rulesOpen && (
          <div className="border-t border-white/8 px-4 py-3">
            <p className="mb-2.5 text-xs font-medium text-foreground">
              常用大写数字：零、壹、贰、叁、肆、伍、陆、柒、捌、玖、拾、佰、仟、万、亿
            </p>
            <div className="space-y-2 text-xs leading-relaxed text-muted">
              <p><span className="font-medium text-foreground">一、</span>金额到「元」为止的，元后写「整」字；有角或分时，角分后不写整。</p>
              <p><span className="font-medium text-foreground">二、</span>中文大写前应标明「人民币」字样，大写金额应紧接「人民币」填写，不得留有空白。</p>
              <p><span className="font-medium text-foreground">三、</span>数字中间有「0」时大写写「零」字；连续多个「0」，中文大写中间只写一个「零」。</p>
              <p><span className="font-medium text-foreground">四、</span>角位是「0」而分位不是「0」时，元后面要写「零」字。例如：￥325.04 → 人民币叁佰贰拾伍元零肆分。</p>
            </div>
          </div>
        )}
      </div>

    </section>
  );
}
