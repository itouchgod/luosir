import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactElement } from "react";
import { BookmarkletInstaller } from "@/components/BookmarkletInstaller";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "四柱八字排盘一键对齐｜Luo Sir",
  description:
    "解决元亨利贞网四柱八字在线排盘页面错位：安装霞鹜文楷等宽字体，并用书签脚本一键清理特殊空格、恢复等宽排版。",
};

const reasons = [
  {
    number: "01",
    title: "页面依靠空格排版",
    description:
      "老页面没有用现代网格或表格锁定列宽，而是依靠连续空格把天干、地支与数字推到指定位置。",
  },
  {
    number: "02",
    title: "不换行空格参与计算",
    description:
      "HTML 中的特殊不换行空格（&nbsp;）与普通空格并不完全相同，浏览器替换字体后更容易产生累计偏差。",
  },
  {
    number: "03",
    title: "系统字体不是严格等宽",
    description:
      "苹方等阅读字体中，汉字、数字与空格的占位比例不固定；数字越多，整行偏移通常越明显。",
  },
] as const;

const usageSteps = [
  "打开元亨利贞网四柱八字在线排盘，并完成排盘。",
  "点击书签栏里的“一键对齐排盘”。",
  "页面会立即清理特殊空格并切换为等宽字体；刷新页面即可恢复原样。",
] as const;

function DownloadIcon(): ReactElement {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}

function ArrowIcon(): ReactElement {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m14 7 5 5-5 5" />
    </svg>
  );
}

export default function BaziAlignGuidePage(): ReactElement {
  return (
    <>
      <Navbar />
      <main id="hero" className="px-5 pb-24 pt-28 sm:px-8 lg:px-10 lg:pt-36">
        <div className="mx-auto max-w-5xl">
          <nav aria-label="面包屑" className="mb-8 flex items-center gap-2 text-sm text-muted">
            <Link href="/" className="transition hover:text-foreground">
              首页
            </Link>
            <span aria-hidden="true">/</span>
            <span>项目</span>
            <span aria-hidden="true">/</span>
            <span className="text-foreground">易学</span>
          </nav>

          <section className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
            <div>
              <h1 className="max-w-3xl font-heading text-4xl font-bold leading-[1.12] tracking-[-0.035em] text-foreground sm:text-6xl">
                让四柱排盘
                <span className="block text-primary">重新整齐对齐</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-muted sm:text-lg">
                针对元亨利贞网四柱八字在线排盘的错位问题，用一款严格等宽的中文字体，加上一枚浏览器书签脚本即可修复。
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="/downloads/LXGWWenKaiMono-Regular.ttf"
                  download
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-sm font-bold text-background transition hover:-translate-y-0.5"
                >
                  <DownloadIcon />
                  下载霞鹜文楷等宽字体
                </a>
                <a
                  href="https://paipan.china95.net/BaZi.htm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:bg-white/[0.07]"
                >
                  打开排盘网站
                  <ArrowIcon />
                </a>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-surface/75 p-6 shadow-[0_28px_90px_rgba(0,0,0,0.24)] sm:p-8">
              <div className="absolute right-6 top-6 h-20 w-20 rounded-full bg-primary/10 blur-2xl" />
              <p className="relative text-sm font-semibold text-muted">修复逻辑</p>
              <div className="relative mt-6 space-y-4 font-mono text-sm sm:text-base">
                <div className="rounded-2xl border border-white/10 bg-background/70 p-4 text-muted">
                  特殊空格&nbsp;&nbsp;→&nbsp;&nbsp;标准空格
                </div>
                <div className="flex justify-center text-primary" aria-hidden="true">
                  ↓
                </div>
                <div className="rounded-2xl border border-primary/25 bg-primary/10 p-4 text-foreground">
                  中文字符&nbsp;=&nbsp;2 × 数字 / 空格
                </div>
              </div>
              <p className="relative mt-6 text-sm leading-7 text-muted">
                两步缺一不可：只换字体会保留特殊空格，只清空格又无法保证字符占位一致。
              </p>
            </div>
          </section>

          <section className="mt-24 border-t border-white/10 pt-16">
            <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
              <div>
                <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
                  为什么会错位？
                </h2>
                <p className="mt-4 text-base leading-8 text-muted">
                  不是排盘数据出了问题，而是旧式排版方式遇上了现代浏览器的字体渲染。
                </p>
              </div>
              <ol className="divide-y divide-white/10 border-y border-white/10">
                {reasons.map((reason) => (
                  <li key={reason.number} className="grid gap-3 py-6 sm:grid-cols-[3.5rem_1fr] sm:gap-5">
                    <span className="font-mono text-sm text-primary">{reason.number}</span>
                    <div>
                      <h3 className="font-heading text-lg font-bold text-foreground">
                        {reason.title}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-muted">
                        {reason.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section className="mt-24">
            <div className="mb-9 max-w-3xl">
              <span className="font-mono text-sm text-primary">步骤 1</span>
              <h2 className="mt-3 font-heading text-3xl font-bold text-foreground sm:text-4xl">
                安装等宽字体
              </h2>
              <p className="mt-4 text-base leading-8 text-muted">
                下载字体文件后双击打开，选择“安装字体”。安装一次即可，浏览器会自动识别它。
              </p>
            </div>
            <div className="flex flex-col gap-5 rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                  <span className="font-heading text-lg font-bold">文</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">LXGWWenKaiMono-Regular.ttf</p>
                  <p className="mt-1 text-sm text-muted">霞鹜文楷等宽 · TrueType 字体</p>
                </div>
              </div>
              <a
                href="/downloads/LXGWWenKaiMono-Regular.ttf"
                download
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-primary/30 px-4 text-sm font-semibold text-primary transition hover:bg-primary/10"
              >
                <DownloadIcon />
                下载字体
              </a>
            </div>
          </section>

          <section className="mt-24">
            <div className="mb-9 max-w-3xl">
              <span className="font-mono text-sm text-primary">步骤 2</span>
              <h2 className="mt-3 font-heading text-3xl font-bold text-foreground sm:text-4xl">
                添加“一键对齐排盘”书签
              </h2>
              <p className="mt-4 text-base leading-8 text-muted">
                先显示浏览器书签栏，再把下面按钮直接拖进去。也可以复制代码，手动粘贴到书签的“网址”栏。
              </p>
            </div>
            <BookmarkletInstaller />
          </section>

          <section className="mt-14 grid gap-8 rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 sm:p-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:p-10">
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
                Chrome 手动添加示意
              </h2>
              <ol className="mt-6 space-y-5">
                <li className="flex gap-4 text-sm leading-7 text-muted">
                  <span className="font-mono text-primary">1</span>
                  将书签名称改为“一键对齐排盘”。
                </li>
                <li className="flex gap-4 text-sm leading-7 text-muted">
                  <span className="font-mono text-primary">2</span>
                  清空“网址”栏，完整粘贴以 <code className="font-mono text-foreground">javascript:</code> 开头的代码。
                </li>
                <li className="flex gap-4 text-sm leading-7 text-muted">
                  <span className="font-mono text-primary">3</span>
                  保存到书签栏，之后在排盘页面点击它。
                </li>
              </ol>
            </div>
            <figure className="overflow-hidden rounded-2xl border border-white/10 bg-background">
              <Image
                src="/images/yijing/bazi-bookmark-guide.png"
                alt="Chrome 修改书签窗口：名称填写一键对齐排盘，网址粘贴 JavaScript 代码"
                width={1056}
                height={1080}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="h-auto w-full"
              />
              <figcaption className="border-t border-white/10 px-4 py-3 text-xs text-muted">
                Chrome“修改书签”窗口填写位置
              </figcaption>
            </figure>
          </section>

          <section className="mt-24 border-t border-white/10 pt-16">
            <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
              <div>
                <span className="font-mono text-sm text-primary">步骤 3</span>
                <h2 className="mt-3 font-heading text-3xl font-bold text-foreground sm:text-4xl">
                  每次排盘后点一下
                </h2>
              </div>
              <ol className="space-y-4">
                {usageSteps.map((step, index) => (
                  <li
                    key={step}
                    className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-sm leading-7 text-muted"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-background">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <aside className="mt-16 border-l-2 border-primary pl-5 sm:pl-7">
            <h2 className="font-heading text-lg font-bold text-foreground">使用说明</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              脚本只修改当前页面在本次浏览中的显示效果，不上传、读取或保存排盘内容。页面刷新后样式会恢复，如需再次对齐，重新点击书签即可。
            </p>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
