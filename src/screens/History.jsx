import { getHistory, getResetInfo } from '../lib/store'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-CA', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

export default function History() {
  const history   = getHistory()
  const resetInfo = getResetInfo()

  return (
    <div className="flex flex-col min-h-full pb-24 pt-10">
      <div className="px-5 mb-6">
        <p className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-widest mb-1">
          Record
        </p>
        <h1 className="text-3xl font-[550] text-[var(--text-primary)]">Redemption History</h1>
      </div>

      {/* Reset warning */}
      {resetInfo.shouldWarn && (
        <div className="mx-5 mb-4 px-4 py-3 bg-[var(--warning-subtle)] border border-[var(--warning)] rounded-xl flex items-center gap-2">
          <span>⚠️</span>
          <p className="text-xs text-[var(--text-primary)]">
            History resets in <strong>{resetInfo.daysLeft} day{resetInfo.daysLeft !== 1 ? 's' : ''}</strong>.
          </p>
        </div>
      )}

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 text-center px-5 py-16">
          <p className="text-4xl mb-3">🎁</p>
          <p className="text-[var(--text-muted)] text-sm">No redemptions yet.</p>
          <p className="text-[var(--text-muted)] text-sm">Earn stars and redeem them for rewards!</p>
        </div>
      ) : (
        <div className="mx-5 flex flex-col gap-2">
          {history.map(entry => (
            <div
              key={entry.id}
              className="bg-[var(--surface-card)] border border-[var(--border-default)] rounded-xl px-4 py-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-[500] text-[var(--text-primary)] truncate">
                    {entry.item}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    {formatDate(entry.date)}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-[var(--star-gold-text)]">
                    −{entry.starsSpent} ⭐
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    {entry.starsRemaining} left
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
