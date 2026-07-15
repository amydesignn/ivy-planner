// ── Ivy's Planner — V1.1 store ──────────────────────────────────────────────
// Single-object model persisted under one key. Recurrence-aware (daily / weekly
// / one-time), daily auto-reset, 90-day data cycle with a 7-day warning.
// Logic ported from Oscar's V1.1 prototype. Fresh install preloads 7 stars
// (Amy's call: Ivy earned them in her day of testing; no history migration).

const KEY         = 'ivy_planner_v11'
const WELCOME_KEY = 'ivy_power_welcome_v11'
const DAY_KEYS    = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const MAX_TASKS   = 30
const RESET_DAYS  = 90
const WARN_DAYS   = 7
const SEED_STARS  = 7

// ── date helpers (local time, YYYY-MM-DD) ──
function todayISO(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
function daysBetween(aISO, bISO) {
  const a = new Date(aISO + 'T00:00:00')
  const b = new Date(bISO + 'T00:00:00')
  return Math.round((b - a) / 86400000)
}

// ── seed ──
function freshTasks() {
  return [
    { id: 't1', name: 'Make my bed',                  type: 'daily',  scheduledDays: [],                          order: 1, done: false, completedOn: null, permanentlyDone: false },
    { id: 't2', name: 'Brush teeth, morning & night', type: 'daily',  scheduledDays: [],                          order: 2, done: false, completedOn: null, permanentlyDone: false },
    { id: 't3', name: 'Read for 30 minutes',          type: 'daily',  scheduledDays: [],                          order: 3, done: false, completedOn: null, permanentlyDone: false },
    { id: 't4', name: 'Tidy my room',                 type: 'weekly', scheduledDays: ['MON', 'WED', 'FRI'],       order: 4, done: false, completedOn: null, permanentlyDone: false },
    { id: 't5', name: 'Finish my homework',           type: 'weekly', scheduledDays: ['MON', 'TUE', 'WED', 'THU'], order: 5, done: false, completedOn: null, permanentlyDone: false },
  ]
}
function freshState(stars = SEED_STARS) {
  const t = todayISO()
  // Preloaded stars also count as earned "this week" so the Progress chart greets
  // Ivy with her 7 (Amy's call) instead of an empty zero-bar chart.
  return { tasks: freshTasks(), balance: stars, earnedByDay: stars ? { [t]: stars } : {}, history: [], startedISO: t, lastActive: t }
}

// ── persistence ──
function readRaw() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw === null ? null : JSON.parse(raw)
  } catch { return null }
}
function save(state) {
  localStorage.setItem(KEY, JSON.stringify(state))
  return state
}

// Applies the daily reset (only when the day has turned over) so `done` reflects
// *today* and one-time tasks finished on a previous day drop off.
function applyDailyReset(s) {
  const today = todayISO()
  if (s.lastActive === today) return s
  const tasks = s.tasks.map(t => {
    const type = t.type || 'daily'
    if (type === 'one-time' && t.completedOn && t.completedOn !== today) {
      return { ...t, permanentlyDone: true, done: false }
    }
    return { ...t, done: false }
  })
  return {
    ...s,
    tasks,
    lastActive: today,
    earnedByDay: { ...s.earnedByDay, [today]: s.earnedByDay[today] || 0 },
  }
}

// Reads state, applying the daily reset and the 90-day cycle, and persists any change.
export function getState() {
  const raw = readRaw()
  if (!raw) return save(freshState())

  // 90-day data cycle — full wipe, restart the clock
  if (daysBetween(raw.startedISO, todayISO()) >= RESET_DAYS) {
    return save(freshState(0))
  }

  const reset = applyDailyReset(raw)
  if (reset !== raw) return save(reset)
  return raw
}

// ── recurrence ──
export function isDueToday(task, d = new Date()) {
  const type = task.type || 'daily'
  if (type === 'daily') return true
  if (type === 'one-time') return !task.permanentlyDone
  if (type === 'weekly') {
    const days = task.scheduledDays || []
    if (days.length >= 7) return true
    return days.includes(DAY_KEYS[d.getDay()])
  }
  return true
}

export function getDueTasks() {
  return getState().tasks.filter(t => isDueToday(t)).sort((a, b) => a.order - b.order)
}

// ── reward / completion ──
export function toggleTask(id) {
  const s = getState()
  const today = todayISO()
  let delta = 0
  const tasks = s.tasks.map(t => {
    if (t.id !== id) return t
    const nowDone = !t.done
    delta = nowDone ? 1 : -1
    const upd = { ...t, done: nowDone }
    if ((t.type || 'daily') === 'one-time') upd.completedOn = nowDone ? today : null
    return upd
  })
  const balance = Math.max(0, s.balance + delta)
  const earnedByDay = { ...s.earnedByDay, [today]: Math.max(0, (s.earnedByDay[today] || 0) + delta) }
  return save({ ...s, tasks, balance, earnedByDay })
}

// ── reset info (for the countdown chip) ──
export function getResetInfo() {
  const s = getState()
  const daysLeft = RESET_DAYS - daysBetween(s.startedISO, todayISO())
  return { daysLeft, shouldWarn: daysLeft <= WARN_DAYS, justReset: false }
}

// ── task management (Manage screen) ──
function renumber(tasks) {
  return tasks
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((t, i) => ({ ...t, order: i + 1 }))
}

// Accepts either a plain name (compat) or a full descriptor.
export function addTask(input) {
  const s = getState()
  if (s.tasks.length >= MAX_TASKS) return null
  const desc = typeof input === 'string' ? { name: input, type: 'daily', scheduledDays: [] } : input
  const name = (desc.name || '').trim()
  if (!name) return null
  const type = desc.type || 'daily'
  const task = {
    id: `t${Date.now()}`,
    name,
    type,
    scheduledDays: type === 'weekly' ? (desc.scheduledDays || []) : [],
    order: s.tasks.length + 1,
    done: false,
    completedOn: null,
    permanentlyDone: false,
  }
  return save({ ...s, tasks: renumber([...s.tasks, task]) })
}

export function removeTask(id) {
  const s = getState()
  return save({ ...s, tasks: renumber(s.tasks.filter(t => t.id !== id)) })
}

export function reorderTasks(orderedIds) {
  const s = getState()
  const byId = Object.fromEntries(s.tasks.map(t => [t.id, t]))
  const tasks = orderedIds.map((id, i) => ({ ...byId[id], order: i + 1 }))
  return save({ ...s, tasks })
}

export const TASK_CAP = MAX_TASKS

// ── redemption ──
export function redeemStars(count, itemName) {
  const s = getState()
  if (count <= 0 || count > s.balance) return false
  const remaining = s.balance - count
  const entry = {
    id: `r${Date.now()}`,
    dateISO: todayISO(),
    item: (itemName || '').trim(),
    spent: count,
    remaining,
  }
  save({ ...s, balance: remaining, history: [entry, ...s.history] })
  return true
}

// ── welcome popup (one-time) ──
export function shouldShowWelcome() {
  return !localStorage.getItem(WELCOME_KEY)
}
export function markWelcomeSeen() {
  localStorage.setItem(WELCOME_KEY, 'seen')
}

// ── "Start fresh (clear all data)" — deliberate full wipe, stars to zero ──
export function resetAll() {
  return save(freshState(0))
}

// ── simple readers ──
export function getStars()   { return getState().balance }
export function getHistory() { return getState().history }
export function getTasks()   { return getState().tasks }

// 4-week earned totals (oldest → newest) from earnedByDay, for the Progress screen.
export function getWeeklyStarTotals() {
  const { earnedByDay } = getState()
  const weeks = [0, 0, 0, 0]
  const today = todayISO()
  for (const [iso, n] of Object.entries(earnedByDay)) {
    const w = Math.floor(daysBetween(iso, today) / 7)
    if (w >= 0 && w < 4) weeks[w] += n
  }
  return weeks.reverse()
}
