"use client";

import Form from "next/form";
import Link from "next/link";
import type { ComponentType, FormEvent, ReactElement, SVGProps } from "react";
import { useState } from "react";
import { GithubIcon, MailIcon, XIcon } from "./icons";

type SocialLink = {
  readonly label: string;
  readonly href: string;
  readonly icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const socialLinks: readonly SocialLink[] = [
  { label: "GitHub", href: "https://github.com/", icon: GithubIcon },
  { label: "Twitter/X", href: "https://x.com/", icon: XIcon },
  { label: "Email", href: "mailto:hello@example.com", icon: MailIcon },
];

export function ContactSection(): ReactElement {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setIsSubmitted(true);
    form.reset();
  };

  return (
    <section
      id="contact"
      className="relative isolate overflow-hidden px-5 py-24 sm:px-8 lg:px-10"
    >
      <div className="absolute left-1/2 top-16 -z-10 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.2),transparent_68%)] blur-3xl" />
      <div className="absolute bottom-4 right-0 -z-10 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.22),transparent_70%)] blur-3xl" />

      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary-end">
          联系我
        </p>
        <h2 className="mt-3 font-heading text-4xl font-bold text-foreground sm:text-6xl">
          一起打造出众的产品。
        </h2>
        <p className="mt-5 text-base leading-8 text-muted sm:text-lg">
          告诉我你的产品想法、交付时间与目标。我会快速回复并给出清晰的推进方案。
        </p>

        <div className="mt-8 flex justify-center gap-3">
          {socialLinks.map((social) => {
            const Icon = social.icon;

            return (
              <Link
                key={social.label}
                href={social.href}
                target={social.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={
                  social.href.startsWith("mailto:")
                    ? undefined
                    : "noopener noreferrer"
                }
                aria-label={social.label}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-muted transition hover:-translate-y-0.5 hover:border-white/25 hover:text-foreground"
              >
                <Icon className="h-5 w-5" />
              </Link>
            );
          })}
        </div>

        <Form
          action=""
          onSubmit={handleSubmit}
          className="mt-10 grid gap-4 rounded-[1.5rem] border border-white/10 bg-surface/80 p-4 text-left shadow-[0_24px_90px_rgba(0,0,0,0.28)] backdrop-blur sm:p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-foreground">
              姓名
              <input
                name="name"
                required
                autoComplete="name"
                className="h-12 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-foreground outline-none transition placeholder:text-muted/70 focus:border-primary/70 focus:ring-4 focus:ring-primary/15"
                placeholder="你的姓名"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-foreground">
              邮箱
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                className="h-12 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-foreground outline-none transition placeholder:text-muted/70 focus:border-primary/70 focus:ring-4 focus:ring-primary/15"
                placeholder="you@example.com"
              />
            </label>
          </div>

          <label className="grid gap-2 text-sm font-semibold text-foreground">
            留言
            <textarea
              name="message"
              required
              rows={5}
              className="resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-foreground outline-none transition placeholder:text-muted/70 focus:border-primary/70 focus:ring-4 focus:ring-primary/15"
              placeholder="简单描述你的项目需求"
            />
          </label>

          <button
            type="submit"
            className="animate-gradient-shift h-12 rounded-full bg-gradient-to-r from-primary via-accent to-primary-end px-6 text-sm font-bold text-white shadow-[0_18px_60px_rgba(124,58,237,0.34)] transition hover:-translate-y-0.5"
          >
            发送消息
          </button>

          {isSubmitted ? (
            <p className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-200">
              已收到，感谢你的留言，我会尽快回复。
            </p>
          ) : null}
        </Form>
      </div>
    </section>
  );
}
