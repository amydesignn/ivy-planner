import { useState } from 'react'
import { getTasks, addTask, removeTask } from '../lib/store'

export default function ManageTasks() {
  const [tasks, setTasks] = useState(getTasks)
  const [input, setInput] = useState('')
  const [error, setError] = useState('')

  function handleAdd() {
    if (!input.trim()) { setError('Task name cannot be empty.'); return }
    if (tasks.length >= 10) { setError('You\'ve reached the 10-task limit. Remove one to add another.'); return }
    const updated = addTask(input)
    if (updated) {
      setTasks(updated)
      setInput('')
      setError('')
    }
  }

  function handleRemove(id) {
    setTasks(removeTask(id))
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleAdd()
  }

  const atLimit = tasks.length >= 10

  return (
    <div className="flex flex-col min-h-full pb-24 pt-10 px-5">
      <p className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-widest mb-1">
        Settings
      </p>
      <h1 className="text-3xl font-[550] text-[var(--text-primary)] mb-2">Manage Tasks</h1>
      <p className="text-sm text-[var(--text-muted)] mb-6">
        {tasks.length}/10 tasks
        {atLimit && ' — remove one to add another'}
      </p>

      {/* Add task */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="New task name…"
          value={input}
          maxLength={60}
          onChange={e => { setInput(e.target.value); setError('') }}
          onKeyDown={handleKeyDown}
          disabled={atLimit}
          className="flex-1 px-4 py-3.5 rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] text-[var(--text-primary)] text-sm outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--border-brand)] transition disabled:opacity-40"
        />
        <button
          onClick={handleAdd}
          disabled={atLimit}
          className="px-4 py-3.5 bg-[var(--brand-primary)] text-white text-sm font-bold rounded-xl disabled:opacity-40 active:scale-[0.97] transition-all"
        >
          Add
        </button>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-[var(--error-subtle)] border border-[var(--error)] rounded-xl text-sm text-[var(--error)]">
          {error}
        </div>
      )}

      {/* Task list */}
      <div className="flex flex-col gap-2">
        {tasks.map(task => (
          <div
            key={task.id}
            className="flex items-center gap-3 px-4 py-4 bg-[var(--surface-card)] border border-[var(--border-default)] rounded-xl"
          >
            <span
              className={`w-2 h-2 rounded-full flex-shrink-0 ${task.completed ? 'bg-[var(--success)]' : 'bg-[var(--border-strong)]'}`}
              title={task.completed ? 'Completed today' : 'Not done yet'}
            />
            <span className="flex-1 text-sm font-[500] text-[var(--text-primary)]">
              {task.name}
            </span>
            {task.completed && (
              <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--success)] bg-[var(--success-subtle)] px-2 py-0.5 rounded-full">
                done today
              </span>
            )}
            {task.isPreset && (
              <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--text-muted)] bg-[var(--neutral-100)] px-2 py-0.5 rounded-full">
                preset
              </span>
            )}
            <button
              onClick={() => handleRemove(task.id)}
              className="w-7 h-7 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--error)] hover:bg-[var(--error-subtle)] rounded-lg transition-colors flex-shrink-0"
              aria-label={`Remove ${task.name}`}
            >
              ×
            </button>
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="text-center py-12 text-[var(--text-muted)]">
            <p className="text-3xl mb-2">📋</p>
            <p className="text-sm">No tasks yet. Add one above.</p>
          </div>
        )}
      </div>
    </div>
  )
}
