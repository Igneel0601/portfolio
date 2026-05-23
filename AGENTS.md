<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Styling units

All spacing, sizing, and font-size values use **rem**. Px is reserved for:
- 1px / 1.5px hairline borders
- `999px` (full pill radius)
- sub-pixel optical offsets (e.g. `bottom: -1px`, `vertical-align: -0.125rem`)
- viewport units / `%` / `dvh` etc. where appropriate

Same rule applies to JSX `style={{ }}` — write `padding: '0.625rem'`, not `padding: 10` or `padding: '10px'`. Stylelint enforces this for `.css` files (`pnpm lint:css`).

# Mobile shell

Files under `components/mobile/*` must not contain inline `style={{ }}` blocks. Use classes from `app/mobile.css` (`.m-*` prefix), token classes from `app/tokens.css` (`t-*`, `c-*`, `l-*`, `i-*`), or Tailwind utilities. Dynamic state flows through `data-*` attributes that CSS selectors target.
