import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getState, getTasks, addTask, removeTask, resetAll, TASK_CAP } from '../lib/store'
import {
  StarIcon, DragIcon, RepeatIcon, CalendarIcon, XIcon, ChevronLeftIcon, PlusIcon,
} from '../components/Icons'

function greeting(h = new Date().getHours()) {
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}
function dateLabel(d = new Date()) {
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
const DAY_LABELS = { MON: 'Mo', TUE: 'Tu', WED: 'We', THU: 'Th', FRI: 'Fr', SAT: 'Sa', SUN: 'Su' }
const TYPES = [
  { key: 'daily', emoji: '🔄', label: 'Daily', desc: 'Appears every day, resets each morning' },
  { key: 'weekly', emoji: '📅', label: 'Weekly', desc: 'Pick which days of the week' },
  { key: 'one-time', emoji: '1️⃣', label: 'One-time', desc: 'Appears once — done when completed' },
]

export default function ManageTasks() {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState(getTasks)
  const [balance] = useState(() => getState().balance)

  // add flow
  const [step, setStep] = useState(0) // 0 idle · 1 name · 2 type · 3 days
  const [name, setName] = useState('')
  const [type, setType] = useState('daily')
  const [days, setDays] = useState([])

  const full = tasks.length >= TASK_CAP
  const resetAdd = () => { setStep(0); setName(''); setType('daily'); setDays([]) }

  const chooseType = (t) => {
    setType(t)
    if (t === 'weekly') setDays(d => (d.length ? d : ['MON', 'TUE', 'WED', 'THU', 'FRI']))
  }
  const toggleDay = (d) => setDays(cur => cur.includes(d) ? cur.filter(x => x !== d) : [...cur, d])

  const confirmAdd = () => {
    const next = addTask({ name, type, scheduledDays: type === 'weekly' ? days : [] })
    if (next) setTasks(next.tasks)
    resetAdd()
  }
  const step2Action = () => { if (type === 'weekly') setStep(3); else confirmAdd() }

  const del = (id) => setTasks(removeTask(id).tasks)
  const startFresh = () => {
    if (window.confirm('Clear all tasks, stars and history and start fresh?')) {
      setTasks(resetAll().tasks)
      resetAdd()
    }
  }

  const canConfirmDays = days.length >= 1
  const daysHint = canConfirmDays ? `${days.length} day${days.length > 1 ? 's' : ''} selected` : 'Tap days to select'
  const typeDesc = TYPES.find(t => t.key === type)?.desc || ''

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', background: 'var(--brand-lilac-50)' }}>
      {/* Greeting header */}
      <div style={{ flex: '0 0 auto', padding: '20px 22px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--brand-lilac-600)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {greeting()} · {dateLabel()}
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--brand-iris-950)', whiteSpace: 'nowrap' }}>Hi, Ivy</div>
        </div>
        <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 7, padding: '8px 14px 8px 11px', background: 'var(--star-gold-subtle)', borderRadius: 22, boxShadow: 'inset 0 0 0 1.5px var(--star-gold-border)' }}>
          <StarIcon size={20} />
          <span style={{ fontSize: 19, fontWeight: 700, color: 'var(--star-gold-text)', minWidth: 16, textAlign: 'center' }}>{balance}</span>
        </div>
      </div>

      {/* Fixed sub-area: title + Add button / add-flow card (pinned; list scrolls beneath) */}
      <div style={{ flex: '0 0 auto', padding: '4px 22px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '4px 0 14px' }}>
          <button onClick={() => navigate('/')} aria-label="Back" style={iconBtn}>
            <ChevronLeftIcon size={20} color="var(--brand-iris-600)" />
          </button>
          <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--brand-iris-950)' }}>Manage tasks</div>
          <div style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 700, color: 'var(--brand-lilac-600)' }}>{tasks.length}/{TASK_CAP}</div>
        </div>

        {step === 0 ? (
          full ? (
            <div style={{ padding: '13px 14px', borderRadius: 16, background: 'var(--red-50)', border: '2px solid var(--pink-200)', color: 'var(--red-500)', fontSize: 13, fontWeight: 700, textAlign: 'center' }}>
              Max {TASK_CAP} tasks — remove one to add more
            </div>
          ) : (
            <button onClick={() => setStep(1)} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%',
              padding: 16, borderRadius: 16, border: '2px dashed var(--brand-iris-200)',
              background: 'var(--brand-iris-50)', cursor: 'pointer',
            }}>
              <PlusIcon size={18} color="var(--brand-iris-600)" />
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--brand-iris-600)' }}>Add a task</span>
            </button>
          )
        ) : (
          <div style={{ padding: 18, borderRadius: 20, background: '#fff', border: '2px solid var(--brand-lilac-100)', animation: 'ivystepin 200ms ease' }}>
            {/* card header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: step === 1 ? 14 : 16 }}>
              {step > 1 && (
                <button onClick={() => setStep(step - 1)} aria-label="Back" style={cardIconBtn('var(--brand-iris-600)')}>
                  <ChevronLeftIcon size={16} color="var(--brand-iris-600)" />
                </button>
              )}
              <div style={{ flex: 1, fontSize: 13, fontWeight: 700, color: 'var(--brand-lilac-600)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {step === 1 ? 'New task' : step === 2 ? 'How often?' : 'Which days?'}
              </div>
              <button onClick={resetAdd} aria-label="Cancel" style={cardIconBtn('var(--brand-lilac-600)')}>
                <XIcon size={15} color="var(--brand-lilac-600)" />
              </button>
            </div>

            {step === 1 && (
              <>
                <input
                  autoFocus value={name} onChange={e => setName(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && name.trim()) setStep(2) }}
                  placeholder="What's the task?"
                  style={{ width: '100%', padding: '14px 15px', fontSize: 15, fontWeight: 500, color: 'var(--brand-iris-950)', background: 'var(--brand-lilac-50)', border: '2px solid var(--brand-lilac-200)', borderRadius: 14, outline: 'none' }}
                />
                <button onClick={() => name.trim() && setStep(2)} disabled={!name.trim()} style={primaryBtn(!!name.trim(), 12)}>Next →</button>
              </>
            )}

            {step === 2 && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
                  {TYPES.map(t => {
                    const sel = type === t.key
                    return (
                      <button key={t.key} onClick={() => chooseType(t.key)} style={{
                        padding: '11px 6px', borderRadius: 13, textAlign: 'center', cursor: 'pointer',
                        background: sel ? 'var(--brand-iris-600)' : 'var(--brand-iris-50)',
                        border: `2px solid ${sel ? 'var(--brand-iris-600)' : 'var(--brand-iris-200)'}`,
                        transition: 'background 150ms',
                      }}>
                        <div style={{ fontSize: 16, marginBottom: 3 }}>{t.emoji}</div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: sel ? '#fff' : 'var(--brand-iris-600)' }}>{t.label}</div>
                      </button>
                    )
                  })}
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--mauve-400)', textAlign: 'center', marginBottom: 14, lineHeight: 1.5 }}>{typeDesc}</div>
                <button onClick={step2Action} style={primaryBtn(true, 0)}>{type === 'weekly' ? 'Next →' : 'Add task'}</button>
              </>
            )}

            {step === 3 && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 12 }}>
                  {DAYS.map(d => {
                    const sel = days.includes(d)
                    return (
                      <button key={d} onClick={() => toggleDay(d)} style={{
                        padding: '10px 0', borderRadius: 10, textAlign: 'center', cursor: 'pointer',
                        fontSize: 12, fontWeight: 700,
                        background: sel ? 'var(--brand-iris-600)' : 'var(--brand-iris-100)',
                        color: sel ? '#fff' : 'var(--brand-iris-600)',
                        border: `2px solid ${sel ? 'var(--brand-iris-600)' : 'var(--brand-iris-200)'}`,
                      }}>{DAY_LABELS[d]}</button>
                    )
                  })}
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--mauve-400)', textAlign: 'center', marginBottom: 14, fontWeight: 600 }}>{daysHint}</div>
                <button onClick={() => canConfirmDays && confirmAdd()} disabled={!canConfirmDays} style={primaryBtn(canConfirmDays, 0)}>Add task</button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Scroll: task list + footer */}
      <div style={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto', padding: '12px 22px 118px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {tasks.map((t, i) => {
            const daily = (t.type || 'daily') !== 'weekly'
            return (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 13px 13px 14px', background: '#fff', border: '2px solid var(--brand-lilac-100)', borderRadius: 16 }}>
                <div style={{ flex: '0 0 auto', color: 'var(--brand-lilac-300)', cursor: 'grab', lineHeight: 0 }} title="Drag to reorder"><DragIcon size={14} color="var(--brand-lilac-300)" /></div>
                <div style={{ flex: '0 0 auto', width: 14, fontSize: 11, fontWeight: 700, color: 'var(--brand-lilac-300)', textAlign: 'center' }}>{i + 1}</div>
                <div style={{ flex: '1 1 0%', fontSize: 15, fontWeight: 600, color: 'var(--brand-iris-950)' }}>{t.name}</div>
                <div title={daily ? 'Daily' : 'Weekly'} style={{ flex: '0 0 auto', width: 22, height: 22, borderRadius: 6, background: daily ? 'var(--brand-lilac-100)' : 'var(--brand-iris-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {daily ? <RepeatIcon size={12} color="var(--brand-lilac-600)" /> : <CalendarIcon size={12} color="var(--brand-iris-600)" />}
                </div>
                <button onClick={() => del(t.id)} aria-label="Delete" style={{ flex: '0 0 auto', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10, background: 'var(--red-50)', color: 'var(--red-500)', border: 'none', cursor: 'pointer' }}>
                  <XIcon size={16} color="var(--red-500)" />
                </button>
              </div>
            )
          })}
        </div>

        <div style={{ minHeight: 10, margin: '12px 4px 0', fontSize: 12.5, fontWeight: 600, color: 'var(--mauve-400)' }}>{tasks.length} of {TASK_CAP} tasks</div>
        <div onClick={startFresh} role="button" style={{ marginTop: 18, textAlign: 'center', fontSize: 13, fontWeight: 600, color: 'var(--brand-lilac-300)', cursor: 'pointer', padding: 8 }}>Start fresh (clear all data)</div>
      </div>
    </div>
  )
}

const iconBtn = {
  width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center',
  borderRadius: 12, background: 'var(--brand-iris-50)', border: 'none', cursor: 'pointer',
}
const cardIconBtn = (color) => ({
  width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
  borderRadius: 8, background: 'var(--brand-iris-50)', color, border: 'none', cursor: 'pointer', flex: '0 0 auto',
})
function primaryBtn(enabled, marginTop) {
  return {
    width: '100%', marginTop, padding: 14, borderRadius: 14, border: 'none', textAlign: 'center',
    fontSize: 15, fontWeight: 700, color: '#fff',
    background: enabled ? 'linear-gradient(180deg, var(--brand-iris-500), var(--brand-iris-600))' : 'var(--brand-iris-200)',
    boxShadow: enabled ? '0 4px 0 var(--brand-iris-700)' : 'none',
    cursor: enabled ? 'pointer' : 'not-allowed',
  }
}
