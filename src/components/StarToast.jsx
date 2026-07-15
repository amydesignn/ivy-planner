// Oscar's V1.1 "star earned" toast — a pill near the top with a random cheer.
// Rendered with a changing key so the entrance animation restarts on each earn;
// the caller clears it after 1500ms (matching the animation length).

const CHEERS = [
  'You got it! +1 ⭐',
  'Boom — +1 ⭐',
  'Keep it up! +1 ⭐',
  'Star earned! +1 ⭐',
]

export function pickCheer() {
  return CHEERS[Math.floor(Math.random() * CHEERS.length)]
}

export default function StarToast({ message }) {
  return (
    <div style={{
      position: 'fixed', top: 78, left: 0, right: 0, zIndex: 60,
      display: 'flex', justifyContent: 'center', pointerEvents: 'none',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 9,
        padding: '11px 18px', borderRadius: 22,
        background: 'var(--brand-iris-950)',
        boxShadow: '0 10px 26px rgba(29, 32, 80, 0.34)',
        animation: 'ivytoast 1500ms ease forwards', whiteSpace: 'nowrap',
      }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{message}</span>
      </div>
    </div>
  )
}
