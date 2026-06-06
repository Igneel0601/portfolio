"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import type { TimelineStop } from "@/lib/content";
import { CONTACT } from "@/lib/content";

/* ── shared ────────────────────────────────────────────── */
export function AccentRule() {
  return <div className="m-accent-rule" />;
}

export function DashedRule() {
  return <div className="m-dashed-rule" />;
}

export function SectionHeader({ eyebrow, title }: { eyebrow: ReactNode; title: ReactNode }) {
  return (
    <div className="pt-7 px-[1.375rem] pb-5">
      <div className="l-tag mb-3 text-[color-mix(in_oklab,var(--accent)_55%,transparent)]">{eyebrow}</div>
      <h2 className="t-h1 m-0 text-ink">{title}</h2>
    </div>
  );
}

function Btn({
  children,
  variant = "outline",
  href,
}: {
  children: ReactNode;
  variant?: "solid" | "outline";
  href?: string;
}) {
  const className = `${variant === "solid" ? "btn solid" : "btn"} w-full justify-center no-underline`;
  if (!href) {
    return <span className={className}>{children}</span>;
  }
  // mailto:, tel:, external URLs, and static-file paths (anything with a
  // dotted extension like .pdf) need a plain <a> — next/link tries to
  // client-route them and either 404s or fails to trigger a download.
  const isExternal =
    /^(mailto:|tel:|https?:)/i.test(href) || /\.[a-z0-9]+(\?|#|$)/i.test(href);
  if (isExternal) {
    const isFile = /\.[a-z0-9]+(\?|#|$)/i.test(href) && !/^https?:/i.test(href);
    return (
      <a
        href={href}
        className={className}
        {...(isFile ? { download: "" } : {})}
        {...(/^https?:/i.test(href) ? { target: "_blank", rel: "noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function TimelineSection({ stops }: { stops: TimelineStop[] }) {
  return (
    <>
      <SectionHeader eyebrow="$ git log --all" title="the long way around." />
      <div className="w-full max-w-[34rem] mx-auto px-[1.375rem] max-h-[100dvh] flex flex-col justify-center">
        {stops.map((s, i) => {
          const now = s.isNow ? "true" : "false";
          return (
            <div key={i} className="relative grid items-start [grid-template-columns:3.25rem_1.5rem_1fr]">
              <div
                className="c-xs mt-0.5 pr-[0.625rem] font-normal text-ink-dim text-right whitespace-nowrap data-[now=true]:text-accent data-[now=true]:font-semibold"
                data-now={now}
              >
                {s.when}
              </div>
              <div className="flex justify-center">
                <div
                  className="w-[0.6875rem] h-[0.6875rem] mt-[0.4375rem] rounded-full border-[1.5px] border-accent bg-accent shrink-0 relative z-[1] data-[now=true]:w-[0.8125rem] data-[now=true]:h-[0.8125rem] data-[now=true]:shadow-[0_0_0_0.25rem_color-mix(in_oklab,var(--accent)_26%,transparent),0_0_0.875rem_color-mix(in_oklab,var(--accent)_55%,transparent)]"
                  data-now={now}
                />
              </div>
              <div className="pl-3">
                <div
                  className="font-[var(--font-serif)] text-[var(--text-sm)] leading-[1.2] font-bold text-ink data-[now=true]:text-accent"
                  data-now={now}
                >
                  {s.title}
                </div>
                <div className="font-[var(--mono)] mt-0.5 text-[clamp(0.62rem,2.9vw,0.8125rem)] leading-[1.4] text-ink-dim">
                  {s.blurb}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export function CTASection() {
  return (
    <section className="box mt-12 mb-14 mx-[1.375rem] p-5 grid gap-4 bg-paper-2">
      <div>
        <div className="l-eyebrow mb-1.5 text-accent">END OF STORY · YOUR MOVE</div>
        <div className="t-h3 m-0 mb-1 text-ink">Hiring? Building? Curious?</div>
        <div className="t-body mute m-0">Drop a line — I respond fast.</div>
      </div>
      <div className="flex flex-col gap-2.5">
        <Btn variant="solid" href={`mailto:${CONTACT.email}`}>
          {CONTACT.email}
        </Btn>
        <Btn href={CONTACT.github}>github · linkedin · x</Btn>
      </div>
    </section>
  );
}

export function SiteFooter({ className }: { className?: string }) {
  const rawPathname = usePathname();
  // Strip /d or /m prefix so suppression works on deep-links/share URLs that
  // bypass proxy.ts rewrites. Mirrors components/Footer.tsx.
  const pathname = rawPathname?.replace(/^\/[dm](?=\/|$)/, "") ?? "";

  const hasOwnFooter =
    // Home is a locked scroll-snap deck (body overflow hidden) — a trailing
    // footer would be clipped, and the CTA slide already closes the deck.
    pathname === "" ||
    pathname === "/" ||
    pathname.startsWith("/writing/") ||
    /^\/work\/[^/]+/.test(pathname);

  if (hasOwnFooter) return null;

  return (
    <div className={`c-xs m-site-footer${className ? ` ${className}` : ""}`}>
      <span>$ exit 0 · too much coffee</span>
      <span>© {new Date().getFullYear()}</span>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
}: {
  eyebrow?: string;
  title: ReactNode;
}) {
  return (
    <div className="px-[1.375rem] py-[1.125rem]">
      {eyebrow && <div className="l-tag mt-6 mb-1 text-ink-dim">{eyebrow}</div>}
      <h1 className={`t-display m-0 text-ink${eyebrow ? "" : " mt-6"}`}>
        {title}
        <span className="text-accent">.</span>
      </h1>
    </div>
  );
}
