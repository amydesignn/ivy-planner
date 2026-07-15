import { getWeeklyStarTotals } from '../lib/store'
import { StarIcon } from '../components/Icons'

// Lifted from Oscar's V1.1 Progress screen (markup + tokens), wired to the store.
const LABELS = ['3 wks ago', '2 wks ago', 'Last week', 'This week']
const MAX_BAR = 150

export default function Stats() {
  const weeks = getWeeklyStarTotals() // [oldest … newest], length 4
  const maxVal = Math.max(...weeks, 1)
  // best week = the highest; on a tie the most recent wins
  let bestIdx = 0
  weeks.forEach((v, i) => { if (v >= weeks[bestIdx]) bestIdx = i })

  return (
    <div style={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto', padding: '4px 22px 118px', background: 'var(--brand-lilac-50)' }}>
      <div style={{ animation: 'ivyfade 240ms ease both' }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--brand-iris-950)', margin: '6px 2px 4px' }}>Your progress</div>
        <div style={{ fontSize: 13, color: 'var(--brand-lilac-600)', margin: '0 2px 20px' }}>Stars earned each week</div>

        {/* Chart */}
        <div style={{ padding: '20px 18px 16px', background: '#fff', border: '2px solid var(--brand-lilac-100)', borderRadius: 22 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, height: 190 }}>
            {weeks.map((val, i) => {
              const best = i === bestIdx
              const h = Math.round((val / maxVal) * MAX_BAR)
              return (
                <div key={i} style={{ flex: '1 1 0%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: best ? 'var(--brand-iris-600)' : 'var(--brand-lilac-600)' }}>{val}</div>
                  <div style={{
                    width: '100%', maxWidth: 46, height: h, minHeight: 6,
                    borderRadius: '10px 10px 6px 6px',
                    background: best ? 'var(--brand-iris-600)' : 'var(--brand-lilac-300)',
                    transformOrigin: 'center bottom',
                    animation: 'ivygrow 520ms cubic-bezier(0.2, 0.8, 0.2, 1)',
                  }} />
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--mauve-400)', textAlign: 'center', lineHeight: 1.2 }}>{LABELS[i]}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Best week */}
        <div style={{
          marginTop: 16, padding: '16px 18px', borderRadius: 18,
          background: 'linear-gradient(150deg, var(--brand-iris-50), var(--brand-lilac-100))',
          border: '2px solid var(--brand-lilac-200)', display: 'flex', alignItems: 'center', gap: 13,
        }}>
          <div style={{
            flex: '0 0 auto', width: 44, height: 44, borderRadius: 13, background: 'var(--brand-iris-600)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 5px 14px rgba(75, 84, 221, 0.32)',
          }}>
            <StarIcon size={24} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--brand-lilac-600)' }}>Best week</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-iris-950)' }}>{LABELS[bestIdx]} — {weeks[bestIdx]} ⭐</div>
          </div>
        </div>
      </div>
    </div>
  )
}
