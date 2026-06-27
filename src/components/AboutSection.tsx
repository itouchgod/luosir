import type { ReactElement } from "react";
import { BrandMark } from "./BrandMark";

const skills: readonly string[] = [
  "Next.js",
  "TypeScript",
  "React",
  "Tailwind CSS",
  "Node.js",
  "Design Systems",
  "Product Strategy",
  "PostgreSQL",
  "Animations",
  "Vercel",
  "API Design",
  "UX Writing",
];

export function AboutSection(): ReactElement {
  return (
    <section id="about" className="relative px-5 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="rounded-[2rem] border border-white/10 bg-surface/70 p-6 shadow-[0_24px_90px_rgba(0,0,0,0.28)] backdrop-blur">
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
            <div className="shrink-0 rounded-full bg-gradient-to-br from-primary via-accent to-primary-end p-1 shadow-[0_18px_64px_rgba(124,58,237,0.35)]">
              <BrandMark size={144} className="border-0 shadow-none" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">
                关于我
              </p>
              <h2 className="mt-3 font-heading text-3xl font-bold text-foreground sm:text-4xl">
                打造精准、快速、令人难忘的数字界面。
              </h2>
            </div>
          </div>
          <p className="mt-7 text-base leading-8 text-muted">
            专注于现代 Web 体验、设计驱动的产品思维与易于迭代的生产系统。
            项目涵盖落地页、SaaS 仪表盘、电商流程与内部工具。
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary-end">
            技术栈
          </p>
          <h3 className="mt-3 font-heading text-3xl font-bold text-foreground sm:text-5xl">
            从构想到交付，全程掌控。
          </h3>
          <div className="mt-8 flex flex-wrap gap-3">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-white/10 bg-gradient-to-r from-white/[0.1] to-white/[0.03] px-4 py-2 text-sm font-semibold text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
