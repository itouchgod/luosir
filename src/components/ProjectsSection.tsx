import Link from "next/link";
import type { ReactElement } from "react";
import type { Project } from "@/types/project";
import { ExternalLinkIcon, GithubIcon } from "./icons";

const projects: readonly Project[] = [
  {
    id: "aurora",
    name: "Aurora Studio",
    description:
      "A collaborative workspace for product teams to plan launches, track creative assets, and review release readiness.",
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
      "A real-time analytics dashboard with sharp data hierarchy, responsive charts, and executive reporting views.",
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
      "A focused relationship management tool for boutique studios handling leads, retainers, and client timelines.",
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
            Selected work
          </p>
          <h2 className="mt-3 font-heading text-4xl font-bold text-foreground sm:text-6xl">
            Recent projects with a sharp product edge.
          </h2>
          <p className="mt-5 text-base leading-8 text-muted sm:text-lg">
            A compact set of mock projects showing the visual and technical
            direction of this portfolio.
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
