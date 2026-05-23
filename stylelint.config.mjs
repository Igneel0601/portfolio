/**
 * Enforces the rem-first rule from AGENTS.md.
 *
 * Allowed px usage:
 *   - hairline borders (1px / 1.5px / 2px) via border-* properties
 *   - border-radius 999px for full pills (px allowed for border-radius)
 *   - sub-pixel optical offsets for top/right/bottom/left/inset (px allowed)
 *   - viewport units, %, fr, ch always pass where listed
 *
 * font-size, padding, margin, gap, width, height, min/max-*, letter-spacing
 * must use rem/em (and viewport/% where it makes sense) — never px.
 *
 * Goal of this config is *unit hygiene only*. Formatting rules from
 * stylelint-config-standard are intentionally not pulled in so existing
 * hand-tuned CSS doesn't get reformatted under us.
 */
export default {
  rules: {
    "declaration-property-unit-allowed-list": {
      "font-size":     ["rem", "em", "vw"],
      "/^padding/":    ["rem", "em", "%", "vw", "ch"],
      "/^margin/":     ["rem", "em", "%", "vw", "ch"],
      "gap":           ["rem", "em", "%"],
      "row-gap":       ["rem", "em", "%"],
      "column-gap":    ["rem", "em", "%", "vw"],
      "letter-spacing":["em", "rem"],
      "/^(width|height)$/":               ["rem", "em", "%", "vw", "vh", "dvh", "svh", "lvh", "fr", "ch"],
      "/^(min|max)-(width|height)$/":     ["rem", "em", "%", "vw", "vh", "dvh", "svh", "lvh", "ch"],
      "border-radius":                    ["rem", "em", "%", "px"],
    },
    // Border widths: only 1, 1.5, 2 px allowed (hairlines). Falls back to none/var().
    "declaration-property-value-allowed-list": {
      "/^border(-(top|right|bottom|left))?-width$/": ["/^(1|1\\.5|2)px$/"],
    },
  },
  ignoreFiles: [
    "node_modules/**",
    ".next/**",
    "**/*.module.css",
  ],
};
