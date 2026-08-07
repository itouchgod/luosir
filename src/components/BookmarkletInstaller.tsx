"use client";

import type { MouseEvent, ReactElement } from "react";
import { useEffect, useRef, useState } from "react";

const BOOKMARKLET = String.raw`javascript:(function(){var w=document.createTreeWalker(document.body,4,null,!1);var n;while(n=w.nextNode()){if(!n.parentElement||!n.parentElement.closest('script,style,noscript,textarea')){n.nodeValue=n.nodeValue.replace(/\u00A0/g,' ');}}var old=document.getElementById('luosir-bazi-align');if(old)old.remove();var s=document.createElement('style');s.id='luosir-bazi-align';s.textContent='*, font, span, td, div { font-family: "LXGW WenKai Mono", "霞鹜文楷等宽", monospace !important; font-size: 16px !important; white-space: pre !important; letter-spacing: 0 !important; word-spacing: 0 !important; }';document.head.appendChild(s);})();`;

function CopyIcon(): ReactElement {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </svg>
  );
}

async function copyText(value: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return;
    } catch {
      // Some browsers expose Clipboard API but reject it outside a secure context.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

export function BookmarkletInstaller(): ReactElement {
  const bookmarkRef = useRef<HTMLAnchorElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    bookmarkRef.current?.setAttribute("href", BOOKMARKLET);
  }, []);

  const handleBookmarkClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
  };

  const handleCopy = async () => {
    await copyText(BOOKMARKLET);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-surface/80 shadow-[0_24px_80px_rgba(0,0,0,0.2)]">
      <div className="flex flex-col gap-5 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div>
          <h3 className="font-heading text-xl font-bold text-foreground">
            把按钮拖到书签栏
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted">
            按住按钮并拖到浏览器书签栏，名称会自动保存为“一键对齐排盘”。
          </p>
        </div>
        <a
          ref={bookmarkRef}
          href="#bookmark-code"
          draggable
          onClick={handleBookmarkClick}
          className="inline-flex min-h-12 shrink-0 cursor-grab items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-sm font-bold text-background shadow-[0_12px_34px_rgba(88,166,255,0.22)] transition hover:-translate-y-0.5 active:cursor-grabbing active:translate-y-0"
          title="拖动此按钮到浏览器书签栏"
        >
          <span aria-hidden="true">✦</span>
          一键对齐排盘
        </a>
      </div>

      <div id="bookmark-code" className="p-5 sm:p-7">
        <div className="mb-3 flex items-center justify-between gap-4">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            Bookmarklet JavaScript
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-xs font-semibold text-foreground transition hover:border-primary/40 hover:bg-white/[0.07]"
          >
            <CopyIcon />
            {copied ? "已复制" : "复制代码"}
          </button>
        </div>
        <pre className="max-h-52 overflow-auto whitespace-pre-wrap break-all rounded-2xl border border-white/10 bg-background/80 p-4 font-mono text-xs leading-6 text-muted sm:text-[13px]">
          <code>{BOOKMARKLET}</code>
        </pre>
        <p aria-live="polite" className="mt-3 min-h-5 text-xs text-primary">
          {copied ? "代码已复制。新建书签后，将它粘贴到“网址”栏即可。" : "按钮点不动是正常的：它需要拖入书签栏，或复制代码后手动创建书签。"}
        </p>
      </div>
    </div>
  );
}
