import Link from "next/link";
import type { ReactElement } from "react";
import type { Project } from "@/types/project";
import { ExternalLinkIcon, GithubIcon } from "./icons";

const projects: readonly Project[] = [
  {
    id: "aurora",
    name: "Aurora Studio",
    description:
      "面向产品团队的协作工作台，支持发布计划管理、创意资产追踪与上线就绪评审。",
    technologies: ["Next.js", "TypeScript", "PostgreSQL"],
    gradient: "from-violet-500 via-fuchsia-500 to-blue-500",
    links: {
      github: "https://github.com/",
      live: "https://vercel.com/",
    },
  },
  {
    id: "pulse",
    name: "Pulse Metrics",
    description:
      "实时数据分析仪表盘，具备清晰的数据层级、响应式图表与管理报告视图。",
    technologies: ["React", "Tailwind CSS", "Charts"],
    gradient: "from-cyan-400 via-blue-500 to-violet-600",
    links: {
      github: "https://github.com/",
      live: "https://vercel.com/",
    },
  },
  {
    id: "northstar",
    name: "Northstar CRM",
    description:
      "专为精品工作室打造的客户关系管理工具，涵盖线索跟进、合同管理与项目时间线。",
    technologies: ["Next.js", "Prisma", "Vercel"],
    gradient: "from-pink-500 via-rose-500 to-orange-400",
    links: {
      github: "https://github.com/",
      live: "https://vercel.com/",
    },
  },
];

export function ProjectsSection(): ReactElement {
  return (
    <section id="work" className="px-5 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">
            精选项目
          </p>
          <h2 className="mt-3 font-heading text-4xl font-bold text-foreground sm:text-6xl">
            近期作品，兼顾视觉与技术深度。
          </h2>
          <p className="mt-5 text-base leading-8 text-muted sm:text-lg">
            展示设计方向与技术选型的代表性项目集合。
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.id}
              className="group overflow-hidden rounded-[1.5rem] border border-white/10 bg-surface/75 shadow-[0_22px_80px_rgba(0,0,0,0.24)] transition duration-300 hover:-translate-y-2 hover:border-primary/50 hover:shadow-[0_26px_90px_rgba(124,58,237,0.32)]"
            >
              <div
                className={`h-36 bg-gradient-to-br ${project.gradient} opacity-95`}
              />
              <div className="p-6">
                <div className="flex items-start justify-between gap-5">
                  <h3 className="font-heading text-2xl font-bold text-foreground">
                    {project.name}
                  </h3>
                  <div className="flex gap-2">
                    <Link
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.name} GitHub repository`}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-muted transition hover:border-white/25 hover:text-foreground"
                    >
                      <GithubIcon className="h-4.5 w-4.5" />
                    </Link>
                    <Link
                      href={project.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.name} live site`}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-muted transition hover:border-white/25 hover:text-foreground"
                    >
                      <ExternalLinkIcon className="h-4.5 w-4.5" />
                    </Link>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-muted">
                  {project.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {project.technologies.map((technology) => (
                    <span
                      key={technology}
                      className="rounded-full bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-foreground"
                    >
                      {technology}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
