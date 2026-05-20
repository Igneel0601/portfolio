"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";

const ROUTES = [
  { href: "/", path: "/", meta: "home" },
  { href: "/work", path: "/work", meta: "all projects" },
  { href: "/experiments", path: "/experiments", meta: "demos" },
  { href: "mailto:hi@igneel.dev", path: "/contact", meta: "hi@igneel.dev" },
];

export function NotFoundView() {
  const pathname = usePathname() || "/?";
  return (
    <main className="nf-main">
      <section className="nf-content">
        <div className="nf-left">
          <div className="nf-eyebrow">error · route not found</div>
          <div className="nf-big">
            4<span className="nf-slash">0</span>4
          </div>
          <h1 className="nf-h1">
            The path <span className="nf-acc">{pathname}</span>
            <br />
            doesn&apos;t resolve.
          </h1>
          <p className="nf-sub">
            Could be a typo, a stale bookmark, or a page I haven&apos;t built yet.
          </p>
        </div>

        <nav className="nf-right nf-routes" aria-label="suggested routes">
          <div className="nf-routes-lbl">$ ls</div>
          {ROUTES.map((r) => (
            <Link key={r.path} href={r.href} className="nf-route no-pop">
              <ArrowRight size={14} className="nf-arr" aria-hidden />
              <span className="nf-path">{r.path}</span>
              <span className="nf-meta">{r.meta}</span>
            </Link>
          ))}
        </nav>
      </section>

      <footer className="nf-footer">
        <span>$ exit 1 · page not found</span>
        <span className="nf-footer-right">© Vaibhav Verma · 2026</span>
      </footer>
    </main>
  );
}
