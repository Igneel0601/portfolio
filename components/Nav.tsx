"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/content";
import { PROFILE } from "@/lib/profile";
import { useLenis } from "@/lib/lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { motionMM, MOTION_BREAKPOINTS } from "@/lib/match-media";
import { D, E } from "@/lib/motion-tokens";

export function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
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
      const { isMobile, isReduce } = ctx.conditions as {
        isMobile: boolean;
        isReduce: boolean;
      };
      const nav = navRef.current!;

      // Delay applies regardless of reduced-motion preference.
      // Reduced-motion only skips the slide easing, not the delay.
      const skipSlide = isReduce;


      // Mobile: no intro animation — show immediately. Scroll hide/show still applies.
      let tl: gsap.core.Timeline | null = null;
      if (isMobile) {
        gsap.set(nav, { autoAlpha: 1, y: 0 });
        // Disengage the FOUC guard CSS rule (desktop.css). Set via DOM
        // (not JSX) so subsequent React rerenders from useState don't
        // remove it and reintroduce the flicker.
        nav.setAttribute("data-nav-revealed", "");
        enteredRef.current = true;
      } else {
        // Initial state — nav hidden + slightly above. After delay, snap
        // visibility on and slide down into place.
        gsap.set(nav, { autoAlpha: 0, y: -12 });
        // Flip the FOUC guard now that GSAP's inline visibility:hidden
        // has taken over — CSS rule no longer needed and would only
        // conflict with the autoAlpha animation. See desktop.css for why
        // this is set via DOM rather than JSX.
        nav.setAttribute("data-nav-revealed", "");

        tl = gsap.timeline({
          delay: isHome ? 2.8 : 0.1,
          defaults: { ease: E.precise },
          onComplete: () => {
            enteredRef.current = true;
          },
        });
        if (skipSlide) {
          tl.set(nav, { autoAlpha: 1, y: 0 });
        } else {
          tl.set(nav, { autoAlpha: 1 }).to(nav, { y: 0, duration: D.md });
        }
      }

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
        tl?.kill();
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

  // animate the nav in/out when hidden state flips.
  // Skip until boot animation has completed (enteredRef.current === true),
  // otherwise this fires on mount and overrides the boot delay.
  useEffect(() => {
    if (!navRef.current) return;
    if (!enteredRef.current) return;
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
        style={{
          background: 'color-mix(in oklab, var(--paper) 15%, transparent)',
          backdropFilter: 'blur(24px) saturate(140%)',
          WebkitBackdropFilter: 'blur(24px) saturate(140%)',
        }}
        className="sticky top-0 z-50"
      >
        <div className="page-shell hidden md:flex items-center gap-5 py-3 c-md">
          <Link
            data-nav-link
            data-nav-kind="route"
            href="/"
            className="font-semibold nav-link no-pop"
            style={{ color: "var(--accent)" }}
          >
            {PROFILE.brand}
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
                    className="nav-link relative inline-block hover:text-accent after:content-[''] after:absolute after:left-0 after:bottom-[-3px] after:w-0 after:h-[1.5px] after:bg-accent after:transition-all after:duration-300 hover:after:w-full"
                  >
                    {l.label}
                  </a>
                ) : (
                  (() => {
                    const isActive =
                      l.href === "/" ? pathname === "/" : pathname === l.href || pathname.startsWith(`${l.href}/`)
                    return (
                      <Link
                        data-nav-link
                        data-nav-kind={l.kind}
                        data-active={isActive ? "true" : undefined}
                        href={l.href}
                        aria-current={isActive ? "page" : undefined}
                        className="nav-link relative inline-block hover:text-accent after:content-[''] after:absolute after:left-0 after:bottom-[-3px] after:w-0 after:h-[1.5px] after:bg-accent after:transition-all after:duration-300 hover:after:w-full"
                      >
                        {l.label}
                      </Link>
                    )
                  })()
                )}
              </li>
            ))}
          </ul>
          <a
            data-nav-link
            data-nav-kind="mailto"
            href={NAV_LINKS[NAV_LINKS.length - 1].href}
            className="nav-link ml-auto font-semibold relative inline-block hover:text-accent after:content-[''] after:absolute after:left-0 after:bottom-[-3px] after:w-0 after:h-[1.5px] after:bg-accent after:transition-all after:duration-300 hover:after:w-full"
          >
            {NAV_LINKS[NAV_LINKS.length - 1].label}
          </a>
        </div>

        <div className="page-shell md:hidden flex items-center justify-between py-3 c-md">
          <Link
            data-nav-link
            data-nav-kind="route"
            href="/"
            className="font-semibold nav-link no-pop"
            style={{ color: "var(--accent)" }}
          >
            {PROFILE.brand}
          </Link>
          <button
            data-nav-toggle
            aria-label="Open menu"
            onClick={() => {
              setOpen(true);
              setHidden(false); // opening the menu forces the nav visible
            }}
            className="c-md leading-none px-2 py-1 border rounded"
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
            className="absolute top-4 right-5 t-h4 leading-none"
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
                className="t-h2"
              >
                {l.label}
              </a>
            ) : (
              (() => {
                const isActive =
                  l.href === "/" ? pathname === "/" : pathname === l.href || pathname.startsWith(`${l.href}/`)
                return (
                  <Link
                    key={l.href}
                    data-nav-link
                    data-nav-kind={l.kind}
                    data-active={isActive ? "true" : undefined}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className="t-h2"
                  >
                    {l.label}
                  </Link>
                )
              })()
            ),
          )}
        </div>
      )}
    </>
  );
}
