import { StarIcon } from './Icons'

// One-time "Power User" welcome — reassures Ivy her stars carried over.
// Gated by the caller (store.shouldShowWelcome); calls onClose which marks it seen.
export default function WelcomePopup({ stars, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'color-mix(in srgb, var(--brand-iris-950) 55%, transparent)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 440,
          background: '#fff',
          borderRadius: '28px 28px 0 0',
          padding: '30px 26px 34px',
          textAlign: 'center',
          animation: 'ivy-sheet-up 0.32s cubic-bezier(0.22, 1, 0.36, 1) both',
        }}
      >
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'var(--brand-iris-600)', color: '#fff',
          fontSize: 12, fontWeight: 800, letterSpacing: '0.06em',
          padding: '7px 14px', borderRadius: 999, marginBottom: 20,
        }}>
          ⚡ POWER USER
        </span>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 14 }}>
          <StarIcon size={40} />
          <span style={{ fontSize: 52, fontWeight: 800, color: 'var(--brand-iris-950)', lineHeight: 1 }}>
            {stars}
          </span>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--brand-iris-950)', marginBottom: 8 }}>
          Your stars are all here, Ivy!
        </h2>
        <p style={{ fontSize: 15, color: 'var(--brand-lilac-600)', marginBottom: 26 }}>
          We kept every single one safe ✦
        </p>

        <button
          onClick={onClose}
          style={{
            width: '100%', padding: '17px', border: 'none', cursor: 'pointer',
            background: 'var(--brand-iris-600)', color: '#fff',
            fontSize: 17, fontWeight: 800, borderRadius: 16,
            boxShadow: '0 6px 16px color-mix(in srgb, var(--brand-iris-700) 45%, transparent)',
          }}
        >
          Let's go! ⚡
        </button>
      </div>
    </div>
  )
}
