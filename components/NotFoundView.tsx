"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MoveRight } from "lucide-react";
import { CONTACT } from "@/lib/content";
import { PROFILE } from "@/lib/profile";

const ROUTES = [
  { href: "/", path: "/", meta: "home" },
  { href: "/work", path: "/work", meta: "all projects" },
  { href: "/experiments", path: "/experiments", meta: "demos" },
  { href: `mailto:${CONTACT.email}`, path: "/contact", meta: CONTACT.email },
];

export function NotFoundView() {
  const pathname = usePathname() || "/?";
  return (
    <main className="nf-main">
      <section className="nf-content">
        <div className="nf-left">
          <div className="nf-eyebrow l-eyebrow">error · route not found</div>
          <div className="nf-big">
            4<span className="nf-slash">0</span>4
          </div>
          <h1 className="nf-h1 t-h2">
            The path <span className="nf-acc">{pathname}</span>
            <br />
            doesn&apos;t resolve.
          </h1>
          <p className="nf-sub t-lead">
            Could be a typo, a stale bookmark, or a page I haven&apos;t built yet.
          </p>
        </div>

        <nav className="nf-right nf-routes c-md" aria-label="suggested routes">
          <div className="nf-routes-lbl c-md">$ ls</div>
          {ROUTES.map((r) => (
            <Link key={r.path} href={r.href} className="nf-route no-pop">
              <MoveRight className="i-sm nf-arr" aria-hidden />
              <span className="nf-path">{r.path}</span>
              <span className="nf-meta c-sm">{r.meta}</span>
            </Link>
          ))}
        </nav>
      </section>

      <footer className="nf-footer c-xs">
        <div className="nf-footer-inner">
          <span>$ exit 1 · page not found</span>
          <span className="nf-footer-right">© {PROFILE.name} · 2026</span>
        </div>
      </footer>
    </main>
  );
}
