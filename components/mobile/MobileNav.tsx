"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/content";
import { PROFILE } from "@/lib/profile";

export function MobileNav({ className }: { className?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const openRef = useRef(open);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  // Lock page scroll while overlay is open.
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  // Auto-hide on scroll-down, re-show on scroll-up. Mirrors the desktop Nav
  // behavior. Disabled while the overlay menu is open so the nav can't slide
  // away mid-tap.
  useEffect(() => {
    if (typeof window === "undefined") return;
    // On the paged home the nav stays put — each swipe is a scroll-down, which
    // would otherwise auto-hide it. Keep it pinned there.
    const clean = (pathname ?? "").replace(/^\/[dm](?=\/|$)/, "");
    if (clean === "" || clean === "/") {
      // Pin visible on the paged home — derived from the route, set once on mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHidden(false);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let lastY = window.scrollY ?? 0;
    let rafId = 0;
    const tick = () => {
      const y = window.scrollY ?? 0;
      if (!openRef.current) {
        const delta = y - lastY;
        if (delta > 5 && y > 10) setHidden(true);
        else if (delta < -5) setHidden(false);
      }
      lastY = y;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [pathname]);

  const handleScrollLink = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      (target as HTMLElement).scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setOpen(false);
  };

  return (
    <>
      <nav
        data-mobile-nav
        data-hidden={hidden ? "true" : undefined}
        className={`sticky top-0 z-[110] px-6${className ? ` ${className}` : ""}`}
        style={{
          background: "color-mix(in oklab, var(--paper) 15%, transparent)",
          backdropFilter: "blur(24px) saturate(140%)",
          WebkitBackdropFilter: "blur(24px) saturate(140%)",
          transform: hidden ? "translateY(-110%)" : "translateY(0)",
          transition: "transform 0.28s ease",
          willChange: "transform",
        }}
      >
        <div className="flex items-center justify-between py-3 c-md">
          <Link
            href="/"
            className="font-semibold no-pop"
            style={{ color: "var(--accent)" }}
          >
            {PROFILE.brand}
          </Link>
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav-menu"
            onClick={() => {
              if (!open) setHidden(false); // opening forces the nav visible
              setOpen((v) => !v);
            }}
            style={{
              display: "inline-flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 4,
              width: 18,
              height: 18,
              padding: 0,
              background: "transparent",
              border: 0,
              cursor: "pointer",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <span
              aria-hidden
              style={{
                display: "block",
                width: 14,
                height: 1.5,
                background: "var(--ink)",
                borderRadius: 1,
                transition: "transform 0.25s ease, opacity 0.2s ease",
                transformOrigin: "center",
                transform: open ? "translateY(3px) rotate(45deg)" : "none",
              }}
            />
            <span
              aria-hidden
              style={{
                display: "block",
                width: 14,
                height: 1.5,
                background: "var(--ink)",
                borderRadius: 1,
                transition: "transform 0.25s ease, opacity 0.2s ease",
                transformOrigin: "center",
                transform: open ? "translateY(-3px) rotate(-45deg)" : "none",
              }}
            />
          </button>
        </div>
      </nav>

      {/* Always rendered (not `{open && …}`) so the nav links sit in the
          initial DOM and stay crawlable for mobile-first indexing — Googlebot
          never taps the hamburger. Hidden via `display:none` when closed, which
          also drops it from the tab order / a11y tree. */}
      <div
        id="mobile-nav-menu"
        data-mobile-nav-overlay
        aria-hidden={!open}
        className="fixed inset-0 z-[100] flex-col items-center justify-center gap-5"
        style={{
          display: open ? "flex" : "none",
          background: "color-mix(in oklab, var(--paper) 60%, transparent)",
          backdropFilter: "blur(20px) saturate(140%)",
          WebkitBackdropFilter: "blur(20px) saturate(140%)",
        }}
      >
        {NAV_LINKS.map((l) => {
            if (l.kind === "scroll") {
              return (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => handleScrollLink(e, l.href)}
                  className="t-h2 no-pop"
                >
                  {l.label}
                </a>
              );
            }
            const isActive =
              l.href === "/"
                ? pathname === "/"
                : pathname === l.href || pathname.startsWith(`${l.href}/`);
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                aria-current={isActive ? "page" : undefined}
                className="t-h2 no-pop"
                style={isActive ? { color: "var(--accent)" } : undefined}
              >
                {l.label}
              </Link>
            );
          })}
      </div>
    </>
  );
}
