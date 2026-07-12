import { useState, useCallback } from 'react'
import { completeTask, uncompleteTask, getTasks, getStars, getResetInfo } from '../lib/store'
import StarBurst from '../components/StarBurst'

export default function Home() {
  const [tasks, setTasks]       = useState(getTasks)
  const [stars, setStars]       = useState(getStars)
  const [burstId, setBurstId]   = useState(null)
  const resetInfo               = getResetInfo()

  const toggle = useCallback((task) => {
    if (task.completed) {
      setTasks(uncompleteTask(task.id))
      setStars(s => Math.max(0, s - 1))
    } else {
      setTasks(completeTask(task.id))
      setStars(s => s + 1)
      setBurstId(task.id)
    }
  }, [])

  const completedCount = tasks.filter(t => t.completed).length

  return (
    <div className="flex flex-col min-h-full pb-24">
      {/* Header */}
      <div className="px-5 pt-10 pb-6">
        <p className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-widest mb-1">
          Today
        </p>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-[550] text-[var(--text-primary)]">
            My Tasks
          </h1>
          {/* Star counter */}
          <div className="flex items-center gap-1.5 bg-[var(--star-gold-subtle)] px-3 py-1.5 rounded-full">
            <span className="text-lg leading-none">⭐</span>
            <span className="text-2xl font-[550] text-[var(--star-gold-text)] leading-none">
              {stars}
            </span>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1.5">
            <span>{completedCount} of {tasks.length} done</span>
            {completedCount === tasks.length && tasks.length > 0 && (
              <span className="text-[var(--success)] font-semibold">All done! 🎉</span>
            )}
          </div>
          <div className="h-2 bg-[var(--border-default)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--brand-primary)] rounded-full transition-all duration-500"
              style={{ width: tasks.length ? `${(completedCount / tasks.length) * 100}%` : '0%' }}
            />
          </div>
        </div>
      </div>

      {/* Reset warning */}
      {resetInfo.shouldWarn && (
        <div className="mx-5 mb-4 px-4 py-3 bg-[var(--warning-subtle)] border border-[var(--warning)] rounded-xl flex items-center gap-2">
          <span>⚠️</span>
          <p className="text-xs text-[var(--text-primary)]">
            Your data resets in <strong>{resetInfo.daysLeft} day{resetInfo.daysLeft !== 1 ? 's' : ''}</strong>. Stars spent won't carry over.
          </p>
        </div>
      )}

      {/* Task list */}
      <div className="mx-5 flex flex-col gap-2">
        {tasks.map(task => (
          <button
            key={task.id}
            onClick={() => toggle(task)}
            className={`relative flex items-center gap-3 px-4 py-4 rounded-xl border text-left transition-all duration-200 w-full
              ${task.completed
                ? 'bg-[var(--surface-brand-wash)] border-[var(--border-brand)]'
                : 'bg-[var(--surface-card)] border-[var(--border-default)] active:scale-[0.98]'
              }`}
          >
            {/* Checkbox */}
            <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
              ${task.completed
                ? 'bg-[var(--brand-primary)] border-[var(--brand-primary)]'
                : 'border-[var(--border-strong)]'
              }`}
            >
              {task.completed && <span className="text-white text-xs font-bold">✓</span>}
            </span>

            <span className={`text-[15px] font-[500] transition-all
              ${task.completed
                ? 'line-through text-[var(--text-muted)]'
                : 'text-[var(--text-primary)]'
              }`}
            >
              {task.name}
            </span>

            {/* Star burst on completion */}
            {burstId === task.id && (
              <StarBurst onDone={() => setBurstId(null)} />
            )}
          </button>
        ))}

        {tasks.length === 0 && (
          <div className="text-center py-16 text-[var(--text-muted)]">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-sm">No tasks yet. Add some in Manage.</p>
          </div>
        )}
      </div>
    </div>
  )
}
