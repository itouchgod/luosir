import Link from "next/link";
import type { ReactElement } from "react";
import { BrandMark } from "./BrandMark";
import { ArrowUpIcon } from "./icons";

export function Footer(): ReactElement {
  return (
    <footer className="border-t border-white/10 px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center text-sm text-muted sm:flex-row sm:text-left">
        <p className="flex items-center gap-3">
          <BrandMark size={28} />
          <span>© {new Date().getFullYear()} Luo Sir. 保留所有权利。</span>
        </p>
        <Link
          href="#hero"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-semibold text-foreground transition hover:border-white/25 hover:bg-white/[0.07]"
        >
          回到顶部
          <ArrowUpIcon className="h-4 w-4" />
        </Link>
      </div>
    </footer>
  );
}
