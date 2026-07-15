import { useState, useCallback, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getState, getDueTasks, toggleTask, getResetInfo,
  shouldShowWelcome, markWelcomeSeen,
} from '../lib/store'
import StarBurst from '../components/StarBurst'
import StarToast, { pickCheer } from '../components/StarToast'
import WelcomePopup from '../components/WelcomePopup'
import { StarIcon, RepeatIcon, CalendarIcon, PencilIcon, CheckIcon } from '../components/Icons'

function greeting(h = new Date().getHours()) {
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}
function dateLabel(d = new Date()) {
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

export default function Home() {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState(getDueTasks)
  const [balance, setBalance] = useState(() => getState().balance)
  const [burstId, setBurstId] = useState(null)
  const [toast, setToast] = useState(null) // { msg, id }
  const toastTimer = useRef(null)
  const [showWelcome, setShowWelcome] = useState(shouldShowWelcome)
  const resetInfo = getResetInfo()

  useEffect(() => () => clearTimeout(toastTimer.current), [])

  const doneCount = tasks.filter(t => t.done).length
  const total = tasks.length
  const pct = total ? Math.round((doneCount / total) * 100) : 0

  const toggle = useCallback((task) => {
    const next = toggleTask(task.id)
    setTasks(getDueTasks())
    setBalance(next.balance)
    if (!task.done) {
      setBurstId(task.id)
      setToast({ msg: pickCheer(), id: Date.now() })
      clearTimeout(toastTimer.current)
      toastTimer.current = setTimeout(() => setToast(null), 1500)
    }
  }, [])

  const closeWelcome = () => { markWelcomeSeen(); setShowWelcome(false) }

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', background: 'var(--brand-lilac-50)' }}>
      {/* ── Header (greeting + star pill) ── */}
      <div style={{ flex: '0 0 auto', padding: '20px 22px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--brand-lilac-600)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {greeting()} · {dateLabel()}
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--brand-iris-950)', whiteSpace: 'nowrap' }}>
            Hi, Ivy
          </div>
        </div>
        <div key={balance} style={{
          flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 7,
          padding: '8px 14px 8px 11px', background: 'var(--star-gold-subtle)',
          borderRadius: 22, boxShadow: 'inset 0 0 0 1.5px var(--star-gold-border)',
          animation: 'ivypop 440ms ease',
        }}>
          <StarIcon size={20} />
          <span style={{ fontSize: 19, fontWeight: 700, color: 'var(--star-gold-text)', minWidth: 16, textAlign: 'center' }}>{balance}</span>
        </div>
      </div>

      {/* ── Scroll area: Today's tasks header + progress + list ── */}
      <div style={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto', padding: '4px 22px 118px' }}>
        <div style={{ animation: 'ivyfade 240ms ease both' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '6px 2px 12px' }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--brand-iris-950)', whiteSpace: 'nowrap', flexShrink: 0 }}>Today's tasks</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--brand-lilac-600)' }}>{doneCount}/{total}</span>
              <button onClick={() => navigate('/manage')} style={{
                display: 'flex', alignItems: 'center', gap: 5, padding: '6px 11px',
                background: 'var(--brand-iris-50)', borderRadius: 14, cursor: 'pointer',
                color: 'var(--brand-iris-600)', border: 'none',
              }}>
                <PencilIcon size={14} color="var(--brand-iris-600)" />
                <span style={{ fontSize: 13, fontWeight: 600 }}>Edit</span>
              </button>
            </div>
          </div>
          {/* progress track */}
          <div style={{ height: 8, borderRadius: 8, background: 'var(--brand-lilac-100)', overflow: 'hidden', margin: '0 2px 18px' }}>
            <div style={{
              height: '100%', width: `${pct}%`, borderRadius: 8,
              background: 'linear-gradient(90deg, var(--brand-iris-500), var(--brand-iris-600))',
              transition: 'width 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
            }} />
          </div>

          {resetInfo.shouldWarn && (
            <div style={{
              padding: '10px 14px', borderRadius: 14, margin: '0 0 14px',
              background: 'var(--amber-100)', color: 'var(--amber-700)',
              fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8,
            }}>
              ⏳ Your data starts fresh in {resetInfo.daysLeft} day{resetInfo.daysLeft !== 1 ? 's' : ''}.
            </div>
          )}

          {/* task list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {tasks.map((task) => {
              const daily = (task.type || 'daily') !== 'weekly'
              const done = task.done
              return (
                <div
                  key={task.id}
                  role="button"
                  onClick={() => toggle(task)}
                  style={{
                    position: 'relative', display: 'flex', alignItems: 'center', gap: 10,
                    minHeight: 62, padding: '12px 14px', borderRadius: 18, cursor: 'pointer',
                    background: done ? 'var(--green-50)' : '#fff',
                    border: `2px solid ${done ? 'var(--green-200)' : 'var(--brand-lilac-100)'}`,
                    transition: 'background 200ms, border-color 200ms',
                  }}
                >
                  {/* number */}
                  <div style={{ flex: '0 0 auto', width: 16, fontSize: 11, fontWeight: 700, color: 'var(--brand-lilac-300)', textAlign: 'center', lineHeight: 1 }}>
                    {task.order}
                  </div>
                  {/* checkbox */}
                  <div style={{
                    flex: '0 0 auto', width: 28, height: 28, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: done ? 'var(--green-600)' : '#fff',
                    border: `2.5px solid ${done ? 'var(--green-600)' : 'var(--brand-lilac-300)'}`,
                    transition: 'background 200ms, border-color 200ms',
                  }}>
                    {done && <CheckIcon size={15} />}
                  </div>
                  {/* name */}
                  <div style={{
                    flex: '1 1 0%', fontSize: 15.5, fontWeight: 600, lineHeight: 1.3,
                    color: done ? 'var(--brand-lilac-900)' : 'var(--brand-iris-950)',
                    textDecoration: done ? 'line-through' : 'none',
                  }}>
                    {task.name}
                  </div>
                  {/* recurrence icon */}
                  <div title={daily ? 'Repeats daily' : 'Repeats weekly'} style={{
                    flex: '0 0 auto', width: 24, height: 24, borderRadius: 7,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: daily ? 'var(--brand-lilac-100)' : 'var(--brand-iris-100)',
                  }}>
                    {daily
                      ? <RepeatIcon size={13} color="var(--brand-lilac-600)" />
                      : <CalendarIcon size={13} color="var(--brand-iris-600)" />}
                  </div>
                  {/* +1 reward — stays in layout, fades on done (no icon shift) */}
                  <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 3, opacity: done ? 0 : 1, transition: 'opacity 200ms' }}>
                    <StarIcon size={15} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--star-gold-text)' }}>+1</span>
                  </div>
                  {burstId === task.id && <StarBurst onDone={() => setBurstId(null)} />}
                </div>
              )
            })}

            {total === 0 && (
              <div style={{ textAlign: 'center', padding: '48px 12px', color: 'var(--mauve-400)' }}>
                <p style={{ fontSize: 34, marginBottom: 10 }}>🎉</p>
                <p style={{ fontSize: 14 }}>Nothing due today — you're all caught up!</p>
              </div>
            )}
          </div>

          {total > 0 && (
            <p style={{ textAlign: 'center', fontSize: 13.5, color: 'var(--mauve-400)', margin: '18px 20px 0', lineHeight: 1.5 }}>
              Check off what you finish — each one earns a star. ✦
            </p>
          )}
        </div>
      </div>

      {toast && <StarToast key={toast.id} message={toast.msg} />}
      {showWelcome && <WelcomePopup stars={balance} onClose={closeWelcome} />}
    </div>
  )
}
