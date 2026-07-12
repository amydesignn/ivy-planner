const KEYS = {
  tasks:   'ivy-tasks',
  stars:   'ivy-stars',
  history: 'ivy-history',
  epoch:   'ivy-epoch',
}

const PRESET_TASKS = [
  { id: 'p1', name: 'Make my bed', isPreset: true, completed: false },
  { id: 'p2', name: 'Do my homework', isPreset: true, completed: false },
  { id: 'p3', name: 'Tidy my room', isPreset: true, completed: false },
  { id: 'p4', name: 'Read for 20 minutes', isPreset: true, completed: false },
  { id: 'p5', name: 'Help with dinner', isPreset: true, completed: false },
]

const RESET_INTERVAL_MS = 90 * 24 * 60 * 60 * 1000 // 90 days
const WARN_BEFORE_MS    =  7 * 24 * 60 * 60 * 1000 // 7 days

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getTasks() {
  return read(KEYS.tasks, PRESET_TASKS)
}

export function saveTasks(tasks) {
  write(KEYS.tasks, tasks)
}

export function getStars() {
  return read(KEYS.stars, 0)
}

export function saveStars(n) {
  write(KEYS.stars, Math.max(0, n))
}

export function getHistory() {
  return read(KEYS.history, [])
}

export function addHistoryEntry(entry) {
  const history = getHistory()
  write(KEYS.history, [entry, ...history])
}

export function getEpoch() {
  const stored = localStorage.getItem(KEYS.epoch)
  if (!stored) {
    const now = Date.now()
    localStorage.setItem(KEYS.epoch, String(now))
    return now
  }
  return Number(stored)
}

export function getResetInfo() {
  const epoch   = getEpoch()
  const now     = Date.now()
  const resetAt = epoch + RESET_INTERVAL_MS
  const msLeft  = resetAt - now

  if (msLeft <= 0) {
    // Reset is due — perform it
    performReset()
    return { daysLeft: null, shouldWarn: false, justReset: true }
  }

  const daysLeft   = Math.ceil(msLeft / (24 * 60 * 60 * 1000))
  const shouldWarn = msLeft <= WARN_BEFORE_MS
  return { daysLeft, shouldWarn, justReset: false }
}

export function performReset() {
  write(KEYS.tasks,   PRESET_TASKS)
  write(KEYS.stars,   0)
  write(KEYS.history, [])
  localStorage.setItem(KEYS.epoch, String(Date.now()))
}

export function completeTask(taskId) {
  const tasks = getTasks()
  const updated = tasks.map(t =>
    t.id === taskId ? { ...t, completed: true } : t
  )
  saveTasks(updated)
  saveStars(getStars() + 1)
  return updated
}

export function uncompleteTask(taskId) {
  const tasks = getTasks()
  const task  = tasks.find(t => t.id === taskId)
  if (!task || !task.completed) return tasks
  const updated = tasks.map(t =>
    t.id === taskId ? { ...t, completed: false } : t
  )
  saveTasks(updated)
  saveStars(Math.max(0, getStars() - 1))
  return updated
}

export function addTask(name) {
  const tasks = getTasks()
  if (tasks.length >= 10) return null
  const newTask = {
    id: `u-${Date.now()}`,
    name: name.trim(),
    isPreset: false,
    completed: false,
  }
  const updated = [...tasks, newTask]
  saveTasks(updated)
  return updated
}

export function removeTask(taskId) {
  const tasks   = getTasks()
  const task    = tasks.find(t => t.id === taskId)
  if (task?.completed) saveStars(Math.max(0, getStars() - 1))
  const updated = tasks.filter(t => t.id !== taskId)
  saveTasks(updated)
  return updated
}

export function redeemStars(count, itemName) {
  const stars = getStars()
  if (count > stars || count <= 0) return false
  saveStars(stars - count)
  addHistoryEntry({
    id:             `r-${Date.now()}`,
    date:           new Date().toISOString(),
    item:           itemName.trim(),
    starsSpent:     count,
    starsRemaining: stars - count,
  })
  return true
}

export function getWeeklyStarTotals() {
  const history = getHistory()
  const now     = Date.now()
  const weeks   = [0, 0, 0, 0]

  history.forEach(entry => {
    const age  = now - new Date(entry.date).getTime()
    const week = Math.floor(age / (7 * 24 * 60 * 60 * 1000))
    if (week < 4) weeks[week] += entry.starsSpent
  })

  // Also count currently-held stars as week 0 earned
  // (use completed tasks count instead — simpler)
  const completed = getTasks().filter(t => t.completed).length
  weeks[0] += completed

  return weeks.reverse() // oldest → newest
}
