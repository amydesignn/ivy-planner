import { useState } from 'react'
import { getStars, redeemStars } from '../lib/store'

export default function Redeem() {
  const [stars, setStars]   = useState(getStars)
  const [count, setCount]   = useState('')
  const [item, setItem]     = useState('')
  const [error, setError]   = useState('')
  const [success, setSuccess] = useState(null)

  function handleRedeem() {
    const n = parseInt(count, 10)
    if (!item.trim()) { setError('Give your reward a name.'); return }
    if (!n || n <= 0) { setError('Enter how many stars to spend.'); return }
    if (n > stars)    { setError(`You only have ${stars} star${stars !== 1 ? 's' : ''}. Not enough!`); return }

    const ok = redeemStars(n, item)
    if (ok) {
      const remaining = stars - n
      setStars(remaining)
      setSuccess({ item: item.trim(), spent: n, remaining })
      setCount('')
      setItem('')
      setError('')
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full pb-24 px-5 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-[550] text-[var(--text-primary)] mb-2">Redeemed!</h2>
        <p className="text-[var(--text-secondary)] text-sm mb-1">
          You spent <strong>{success.spent} ⭐</strong> on <strong>{success.item}</strong>.
        </p>
        <p className="text-[var(--text-muted)] text-sm mb-8">
          Stars remaining: <strong className="text-[var(--star-gold-text)]">{success.remaining} ⭐</strong>
        </p>
        <button
          onClick={() => setSuccess(null)}
          className="px-6 py-3 bg-[var(--brand-primary)] text-white text-sm font-bold rounded-xl"
        >
          Redeem another
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-full pb-24 px-5 pt-10">
      <p className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-widest mb-1">Rewards</p>
      <h1 className="text-3xl font-[550] text-[var(--text-primary)] mb-2">Redeem Stars</h1>

      {/* Star balance */}
      <div className="flex items-center gap-2 mb-8">
        <span className="text-2xl">⭐</span>
        <span className="text-4xl font-[550] text-[var(--star-gold-text)]">{stars}</span>
        <span className="text-[var(--text-muted)] text-sm mt-1">stars available</span>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-[var(--text-muted)] mb-2">
            What are you redeeming for?
          </label>
          <input
            type="text"
            placeholder="e.g. extra screen time, a book…"
            value={item}
            onChange={e => { setItem(e.target.value); setError('') }}
            className="w-full px-4 py-3.5 rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] text-[var(--text-primary)] text-sm outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--border-brand)] transition"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-[var(--text-muted)] mb-2">
            Stars to spend
          </label>
          <input
            type="number"
            inputMode="numeric"
            placeholder="0"
            min="1"
            max={stars}
            value={count}
            onChange={e => { setCount(e.target.value); setError('') }}
            className="w-full px-4 py-3.5 rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] text-[var(--text-primary)] text-sm outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--border-brand)] transition"
          />
        </div>

        {error && (
          <div className="px-4 py-3 bg-[var(--error-subtle)] border border-[var(--error)] rounded-xl text-sm text-[var(--error)]">
            {error}
          </div>
        )}

        <button
          onClick={handleRedeem}
          disabled={stars === 0}
          className="w-full py-4 bg-[var(--brand-primary)] text-white text-sm font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
        >
          Redeem ⭐
        </button>

        {stars === 0 && (
          <p className="text-center text-[var(--text-muted)] text-sm">
            Earn some stars first — go check off your tasks!
          </p>
        )}
      </div>
    </div>
  )
}
