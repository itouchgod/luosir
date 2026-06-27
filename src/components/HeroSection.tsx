import Link from "next/link";
import type { ReactElement } from "react";
import { ArrowDownIcon } from "./icons";

export function HeroSection(): ReactElement {
  return (
    <section
      id="hero"
      className="relative isolate flex min-h-screen items-center justify-center overflow-hidden px-5 py-28 sm:px-8 lg:px-10"
    >
      <div className="absolute inset-0 -z-10">
        <div className="animate-float absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.42),transparent_66%)] blur-2xl sm:h-[34rem] sm:w-[34rem]" />
        <div className="animate-float absolute -left-24 bottom-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.28),transparent_68%)] blur-3xl [animation-delay:-2s]" />
        <div className="animate-float absolute -right-24 top-1/3 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.34),transparent_68%)] blur-3xl [animation-delay:-4s]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(10,10,15,0.82)_86%,#0A0A0F)]" />
      </div>

      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-muted shadow-[0_16px_60px_rgba(0,0,0,0.22)] backdrop-blur">
          <span className="animate-pulse-glow h-2.5 w-2.5 rounded-full bg-emerald-400" />
          正在接洽新项目
        </div>

        <h1 className="font-heading max-w-5xl bg-gradient-to-r from-primary via-accent to-primary-end bg-clip-text text-5xl font-extrabold leading-[1.02] tracking-normal text-transparent sm:text-7xl lg:text-8xl">
          从创意到上线，打造令人印象深刻的数字产品。
        </h1>

        <p className="mt-7 max-w-2xl text-base leading-8 text-muted sm:text-lg">
          专注响应式界面设计与全栈系统开发，为创始人和产品团队打造高质量的数字体验。
        </p>

        <div className="mt-10 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row">
          <Link
            href="#work"
            className="animate-gradient-shift flex h-13 w-full items-center justify-center rounded-full bg-gradient-to-r from-primary via-accent to-primary-end px-7 text-sm font-bold text-white shadow-[0_18px_60px_rgba(124,58,237,0.42)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_72px_rgba(37,99,235,0.5)] sm:w-auto"
          >
            查看项目案例
          </Link>
          <Link
            href="#contact"
            className="flex h-13 w-full items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-7 text-sm font-bold text-foreground transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.07] sm:w-auto"
          >
            开始合作
          </Link>
        </div>
      </div>

      <Link
        href="#about"
        aria-label="滚动到关于部分"
        className="animate-bounce-slow absolute bottom-8 left-1/2 hidden h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-muted backdrop-blur transition hover:border-white/20 hover:text-foreground sm:flex"
      >
        <ArrowDownIcon className="h-5 w-5" />
      </Link>
    </section>
  );
}
