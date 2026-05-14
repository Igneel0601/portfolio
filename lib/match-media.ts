"use client";

import { gsap } from "gsap";

// motion-spec.md §Locked decisions item 2 — three breakpoint contract.
export const MOTION_BREAKPOINTS = {
  isMotion: "(prefers-reduced-motion: no-preference) and (min-width: 768px)",
  isMobile: "(prefers-reduced-motion: no-preference) and (max-width: 767.98px)",
  isReduce: "(prefers-reduced-motion: reduce)",
} as const;

export type MotionConditions = {
  isMotion: boolean;
  isMobile: boolean;
  isReduce: boolean;
};

export function motionMM() {
  return gsap.matchMedia();
}
