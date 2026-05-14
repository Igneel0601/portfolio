// Motion-spec global tokens. Import durations and eases from here.
// motion-spec.md §Global tokens

export const D = {
  xs: 0.18,
  sm: 0.32,
  md: 0.55,
  lg: 0.85,
  xl: 1.20,
} as const;

export const E = {
  precise: "power3.out",
  weighty: "expo.out",
  deliberate: "power2.inOut",
  release: "power4.out",
  mech: "steps(1)",
} as const;
