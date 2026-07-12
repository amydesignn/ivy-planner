import { getWeeklyStarTotals, getStars } from '../lib/store'

const WEEK_LABELS = ['3 weeks ago', '2 weeks ago', 'Last week', 'This week']

export default function Stats() {
  const weekTotals = getWeeklyStarTotals()
  const totalStars = getStars()
  const maxWeek    = Math.max(...weekTotals, 1)
  const bestWeek   = weekTotals.indexOf(Math.max(...weekTotals))

  return (
    <div className="flex flex-col min-h-full pb-24 pt-10 px-5">
      <p className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-widest mb-1">
        Progress
      </p>
      <h1 className="text-3xl font-[550] text-[var(--text-primary)] mb-8">My Stats</h1>

      {/* Current stars */}
      <div className="bg-[var(--surface-sunken)] border border-[var(--border-brand)] rounded-2xl px-5 py-5 mb-8 flex items-center gap-4">
        <span className="text-4xl">⭐</span>
        <div>
          <p className="text-4xl font-[550] text-[var(--star-gold-text)]">{totalStars}</p>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">stars in your wallet</p>
        </div>
      </div>

      {/* 4-week bar chart */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4">
          Stars earned — last 4 weeks
        </p>

        <div className="flex items-end gap-3 h-40">
          {weekTotals.map((val, i) => {
            const heightPct = maxWeek > 0 ? (val / maxWeek) * 100 : 0
            const isBest    = i === bestWeek && val > 0
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-bold text-[var(--text-secondary)]">
                  {val > 0 ? val : ''}
                </span>
                <div className="w-full flex items-end" style={{ height: '100px' }}>
                  <div
                    className="w-full rounded-t-lg transition-all duration-700"
                    style={{
                      height: `${Math.max(heightPct, val > 0 ? 6 : 0)}%`,
                      background: isBest
                        ? 'var(--star-gold)'
                        : val === 0
                          ? 'var(--border-default)'
                          : 'var(--brand-primary)',
                    }}
                  />
                </div>
                <p className="text-[10px] text-[var(--text-muted)] text-center leading-tight">
                  {WEEK_LABELS[i]}
                </p>
              </div>
            )
          })}
        </div>

        {weekTotals.every(v => v === 0) && (
          <p className="text-center text-[var(--text-muted)] text-sm mt-6">
            No stars earned yet — check off your tasks to get started!
          </p>
        )}

        {weekTotals.some(v => v > 0) && bestWeek === 3 && (
          <p className="text-center text-[var(--success)] text-sm font-semibold mt-4">
            This is your best week yet! 🌟
          </p>
        )}
      </div>
    </div>
  )
}
