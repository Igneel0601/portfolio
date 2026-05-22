"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/content";

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Lock page scroll while overlay is open.
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
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
        className="sticky top-0 z-50 px-6"
        style={{
          background: "color-mix(in oklab, var(--paper) 15%, transparent)",
          backdropFilter: "blur(24px) saturate(140%)",
          WebkitBackdropFilter: "blur(24px) saturate(140%)",
        }}
      >
        <div className="flex items-center justify-between py-3 c-md">
          <Link href="/" className="font-semibold">
            igneel.dev
          </Link>
          <button
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="c-md leading-none px-2 py-1"
          >
            ☰
          </button>
        </div>
      </nav>

      {open && (
        <div
          data-mobile-nav-overlay
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-5"
          style={{ background: "var(--paper)" }}
        >
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute top-4 right-5 t-h4 leading-none"
          >
            ×
          </button>
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
