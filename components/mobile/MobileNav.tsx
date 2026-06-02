"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/content";

export function MobileNav() {
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

  // Force visible whenever the overlay is opened.
  useEffect(() => {
    if (open) setHidden(false);
  }, [open]);

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
        className="sticky top-0 z-[110] px-6"
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
          <Link href="/" className="font-semibold">
            vergnyx.dev
          </Link>
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
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

      {open && (
        <div
          data-mobile-nav-overlay
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-5"
          style={{
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
                  className="t-h2"
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
                className="t-h2"
                style={isActive ? { color: "var(--accent)" } : undefined}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
