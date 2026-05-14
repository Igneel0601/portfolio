"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { NAV_LINKS } from "@/lib/content";
import { useLenis } from "@/lib/lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { motionMM, MOTION_BREAKPOINTS } from "@/lib/match-media";
import { D, E } from "@/lib/motion-tokens";

export function Nav() {
  const navRef = useRef<HTMLElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lenis = useLenis();
  const openRef = useRef(open);
  const enteredRef = useRef(false);
  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useEffect(() => {
    if (!navRef.current) return;
    const mm = motionMM();

    mm.add(MOTION_BREAKPOINTS, (ctx) => {
      const { isMotion, isMobile, isReduce } = ctx.conditions as {
        isMotion: boolean;
        isMobile: boolean;
        isReduce: boolean;
      };
      const nav = navRef.current!;
      const links = gsap.utils.toArray<HTMLElement>("[data-nav-link]", nav);

      if (isReduce) {
        gsap.set(nav, { autoAlpha: 1, y: 0 });
        gsap.set(links, { autoAlpha: 1, y: 0 });
        return;
      }

      // Initial state — hidden, drops in after boot finishes
      gsap.set(nav, { autoAlpha: 0, y: -12 });
      gsap.set(links, { autoAlpha: 0, y: -8 });

      const tl = gsap.timeline({
        delay: 1.8,
        defaults: { ease: E.precise },
        onComplete: () => {
          enteredRef.current = true;
        },
      });
      tl.to(nav, { autoAlpha: 1, y: 0, duration: D.md })
        .to(links, { autoAlpha: 1, y: 0, duration: D.sm, stagger: 0.04 }, "-=0.30");

      // Sticky chrome toggle — set [data-stuck] when tabbar leaves viewport
      const tabbar = document.querySelector<HTMLElement>("[data-tabbar]");
      const stickyST = tabbar
        ? ScrollTrigger.create({
            trigger: tabbar,
            start: "bottom top",
            onEnter: () => nav.setAttribute("data-stuck", "true"),
            onLeaveBack: () => nav.removeAttribute("data-stuck"),
          })
        : null;

      // Active-section highlight (scroll-kind only)
      const sectionTriggers: ScrollTrigger[] = [];
      if (!isMobile) {
        NAV_LINKS.filter((l) => l.kind === "scroll").forEach((link) => {
          const target = document.querySelector(link.href);
          if (!target) return;
          const linkEl = nav.querySelector<HTMLElement>(`[data-nav-link][href="${link.href}"]`);
          if (!linkEl) return;
          sectionTriggers.push(
            ScrollTrigger.create({
              trigger: target as Element,
              start: "top center",
              end: "bottom center",
              onToggle: (self) => {
                if (self.isActive) linkEl.setAttribute("data-active", "true");
                else linkEl.removeAttribute("data-active");
              },
            }),
          );
        });
      }

      return () => {
        tl.kill();
        stickyST?.kill();
        sectionTriggers.forEach((t) => t.kill());
      };
    });

    return () => mm.revert();
  }, []);

  // hide on scroll-down, show on scroll-up — mirrors mr-main's Navbar behavior
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let lastY = window.scrollY ?? 0;
    let rafId = 0;

    const evaluate = (y: number) => {
      if (openRef.current || !enteredRef.current) {
        lastY = y;
        return;
      }
      const delta = y - lastY;
      if (delta > 5 && y > 10) setHidden(true);
      else if (delta < -5) setHidden(false);
      lastY = y;
    };

    const onLenisScroll = (e: { scroll: number }) => evaluate(e.scroll);

    if (lenis && (lenis as unknown as { on?: typeof lenis.scrollTo }).on) {
      (lenis as unknown as { on: (ev: string, cb: (e: { scroll: number }) => void) => void })
        .on("scroll", onLenisScroll);
    }

    // Always-on rAF poll catches non-Lenis scroll (anchor jumps, programmatic scroll)
    const poll = () => {
      const y = window.scrollY ?? 0;
      if (y !== lastY) evaluate(y);
      rafId = requestAnimationFrame(poll);
    };
    rafId = requestAnimationFrame(poll);

    return () => {
      cancelAnimationFrame(rafId);
      if (lenis && (lenis as unknown as { off?: unknown }).off) {
        (lenis as unknown as { off: (ev: string, cb: (e: { scroll: number }) => void) => void })
          .off("scroll", onLenisScroll);
      }
    };
  }, [lenis]);

  // animate the nav in/out when hidden state flips
  useEffect(() => {
    if (!navRef.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      gsap.set(navRef.current, { yPercent: 0, autoAlpha: 1 });
      return;
    }
    gsap.to(navRef.current, {
      yPercent: hidden ? -110 : 0,
      autoAlpha: hidden ? 0 : 1,
      duration: hidden ? 0.32 : 0.4,
      ease: hidden ? "power2.in" : "power3.out",
    });
  }, [hidden]);

  // mobile menu open → force nav visible
  useEffect(() => {
    if (open) setHidden(false);
  }, [open]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (!overlayRef.current) return;
    if (open) {
      const links = overlayRef.current.querySelectorAll<HTMLElement>("[data-nav-link]");
      gsap.fromTo(
        overlayRef.current,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.25, ease: "power2.out" },
      );
      gsap.fromTo(
        links,
        { y: 16, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.4, ease: E.precise, stagger: 0.05, delay: 0.1 },
      );
    }
  }, [open]);

  const handleScrollLink = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (!target) {
      setOpen(false);
      return;
    }
    if (lenis) {
      lenis.scrollTo(target as HTMLElement, { offset: -56 });
    } else {
      (target as HTMLElement).scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setOpen(false);
  };

  return (
    <>
      <nav
        ref={navRef}
        data-nav
        className="sticky top-0 z-50 px-6 md:px-10 transition-colors duration-200"
      >
        <div className="hidden md:flex items-center gap-5 py-3 mono text-[13px]">
          <Link
            data-nav-link
            data-nav-kind="route"
            href="/"
            className="font-semibold nav-link"
          >
            igneel.dev
          </Link>
          <ul className="flex items-center gap-5 ml-6">
            {NAV_LINKS.slice(0, -1).map((l) => (
              <li key={l.href}>
                {l.kind === "scroll" ? (
                  <a
                    data-nav-link
                    data-nav-kind="scroll"
                    href={l.href}
                    onClick={(e) => handleScrollLink(e, l.href)}
                    className="nav-link"
                  >
                    {l.label}
                  </a>
                ) : (
                  <Link
                    data-nav-link
                    data-nav-kind={l.kind}
                    href={l.href}
                    className="nav-link"
                  >
                    {l.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <a
            data-nav-link
            data-nav-kind="mailto"
            href={NAV_LINKS[NAV_LINKS.length - 1].href}
            className="nav-link ml-auto font-semibold"
          >
            {NAV_LINKS[NAV_LINKS.length - 1].label}
          </a>
        </div>

        <div className="md:hidden flex items-center justify-between py-3 mono text-[13px]">
          <Link
            data-nav-link
            data-nav-kind="route"
            href="/"
            className="font-semibold nav-link"
          >
            igneel.dev
          </Link>
          <button
            data-nav-toggle
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="text-lg leading-none px-2 py-1 border rounded"
            style={{ borderColor: "var(--ink)" }}
          >
            ☰
          </button>
        </div>
      </nav>

      {open && (
        <div
          ref={overlayRef}
          data-nav-overlay
          className="fixed inset-0 z-[100] md:hidden flex flex-col items-center justify-center gap-5"
          style={{ background: "var(--paper)" }}
        >
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute top-4 right-5 text-2xl leading-none"
          >
            ×
          </button>
          {NAV_LINKS.map((l) =>
            l.kind === "scroll" ? (
              <a
                key={l.href}
                data-nav-link
                data-nav-kind="scroll"
                href={l.href}
                onClick={(e) => handleScrollLink(e, l.href)}
                className="serif text-3xl font-bold"
              >
                {l.label}
              </a>
            ) : (
              <Link
                key={l.href}
                data-nav-link
                data-nav-kind={l.kind}
                href={l.href}
                onClick={() => setOpen(false)}
                className="serif text-3xl font-bold"
              >
                {l.label}
              </Link>
            ),
          )}
        </div>
      )}
    </>
  );
}
