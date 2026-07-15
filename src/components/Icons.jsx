// Line icons ported verbatim from Oscar's V1.1 prototype (paths unchanged).
// Colors come through `stroke`/`fill` via currentColor or explicit token props.

export function StarIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="var(--star-gold)"
      stroke="var(--star-gold-deep)" strokeWidth="1.2" strokeLinejoin="round">
      <path d="M12 2.6l2.7 5.9 6.3.7-4.7 4.3 1.3 6.3L12 20.6l-5.9 3.5 1.3-6.3L2.7 9.2l6.3-.7z" />
    </svg>
  )
}

// Daily recurrence (repeat)
export function RepeatIcon({ size = 11, color = 'var(--brand-lilac-600)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 2l4 4-4 4" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <path d="M7 22l-4-4 4-4" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  )
}

// Weekly recurrence (calendar)
export function CalendarIcon({ size = 11, color = 'var(--brand-iris-600)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  )
}

export function PencilIcon({ size = 15, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  )
}

export function PlusIcon({ size = 18, color = 'var(--brand-iris-600)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="2.8" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function MinusIcon({ size = 18, color = 'var(--brand-iris-600)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="2.8" strokeLinecap="round">
      <path d="M5 12h14" />
    </svg>
  )
}

export function XIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="2.6" strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}

export function ChevronLeftIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 5l-7 7 7 7" />
    </svg>
  )
}

export function DragIcon({ size = 14, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {[7, 12, 17].map(cy => (
        <g key={cy}>
          <circle cx="9" cy={cy} r="1.5" fill={color} />
          <circle cx="15" cy={cy} r="1.5" fill={color} />
        </g>
      ))}
    </svg>
  )
}

// Plain clock (used on History rows)
export function ClockIcon({ size = 14, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 8v5l3 2" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  )
}

export function CheckIcon({ size = 15, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

// ── Bottom-nav icons ──
export function NavHomeIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5L12 3l9 7.5" />
      <path d="M5.5 9.5V20h13V9.5" />
    </svg>
  )
}

export function NavGiftIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 12v9H4v-9" />
      <path d="M2 7h20v5H2z" />
      <path d="M12 22V7" />
      <path d="M12 7S9 2.5 6.5 4.5 8 7 12 7zM12 7s3-4.5 5.5-2.5S16 7 12 7z" />
    </svg>
  )
}

export function NavClockIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 8v5l3 2" />
      <path d="M3.05 11a9 9 0 1 1 .5 4" />
      <path d="M3 5v5h5" />
    </svg>
  )
}

export function NavBarsIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 20V11" />
      <path d="M12 20V4" />
      <path d="M19 20v-6" />
    </svg>
  )
}
