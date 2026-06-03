'use client'

import { useRouter } from 'next/navigation'
import { writingHref } from '@/lib/writing'

// Type-a-page number field. Navigates on Enter or blur (clamped to range,
// keeping the active tag). A plain input — unlike a native <select> it has no
// OS popup, so the custom cursor and styling stay intact. The arrow links in
// the pager still work without JS; this is enhancement.
export function PageJump({
  page,
  totalPages,
  tag,
}: {
  page: number
  totalPages: number
  tag: string | null
}) {
  const router = useRouter()

  function go(value: string) {
    const parsed = Number.parseInt(value, 10)
    if (!Number.isFinite(parsed)) return
    const n = Math.min(Math.max(1, parsed), totalPages)
    if (n === page) return
    router.push(writingHref(tag, n))
  }

  return (
    <input
      // re-seed the field with the live page after each navigation
      key={page}
      type="number"
      inputMode="numeric"
      className="pager-jump c-xs"
      aria-label="jump to page"
      min={1}
      max={totalPages}
      defaultValue={page}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          go(e.currentTarget.value)
        }
      }}
      onBlur={(e) => go(e.currentTarget.value)}
    />
  )
}
