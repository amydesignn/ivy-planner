import { getHistory, getResetInfo } from '../lib/store'
import { ClockIcon } from '../components/Icons'

// Lifted from Oscar's V1.1 History screen (markup + tokens), wired to the store.
function fmtDate(iso) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function History() {
  const history = getHistory() // newest first (store prepends)
  const reset = getResetInfo()
  const urgent = reset.shouldWarn
  const chipBg = urgent ? 'var(--amber-100)' : 'var(--brand-iris-50)'
  const chipColor = urgent ? 'var(--amber-700)' : 'var(--brand-lilac-600)'

  return (
    <div style={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto', padding: '4px 22px 118px', background: 'var(--brand-lilac-50)' }}>
      <div style={{ animation: 'ivyfade 240ms ease both' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, margin: '6px 2px 14px' }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--brand-iris-950)' }}>History</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 14, background: chipBg, color: chipColor }}>
            <ClockIcon size={14} color={chipColor} />
            <span style={{ fontSize: 12, fontWeight: 700 }}>
              Resets in {reset.daysLeft} day{reset.daysLeft !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {history.length === 0 ? (
          /* Empty state */
          <div style={{ textAlign: 'center', padding: '54px 20px', color: 'var(--mauve-400)' }}>
            <div style={{
              width: 64, height: 64, margin: '0 auto 14px', borderRadius: '50%',
              background: 'var(--brand-lilac-100)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--brand-lilac-500)',
            }}>
              <ClockIcon size={30} color="var(--brand-lilac-500)" />
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-iris-950)' }}>No redemptions yet</div>
            <div style={{ fontSize: 14, marginTop: 4 }}>Redeem your stars and they'll show up here. ✦</div>
          </div>
        ) : (
          /* List */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {history.map(h => (
              <div key={h.id} style={{
                display: 'flex', alignItems: 'center', gap: 13, padding: '14px 15px',
                background: '#fff', border: '2px solid var(--brand-lilac-100)', borderRadius: 18,
              }}>
                <div style={{
                  flex: '0 0 auto', width: 42, height: 42, borderRadius: 13,
                  background: 'var(--brand-lilac-50)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--brand-lilac-500)',
                }}>
                  <ClockIcon size={18} color="var(--brand-lilac-500)" />
                </div>
                <div style={{ flex: '1 1 0%', minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--brand-iris-950)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {h.item}
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--mauve-400)', marginTop: 1 }}>
                    {fmtDate(h.dateISO)} · {h.remaining} ⭐ left
                  </div>
                </div>
                <div style={{ flex: '0 0 auto', fontSize: 15, fontWeight: 700, color: 'var(--star-gold-text)' }}>
                  −{h.spent} ⭐
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
