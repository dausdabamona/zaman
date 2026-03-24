import { useTodayTasks } from '@/hooks/use-tasks'
import { QUADRANT_INFO } from '@/lib/constants'
import type { Quadrant, Task } from '@/types'

export function TodaySummary() {
  const tasks = useTodayTasks()

  if (tasks.length === 0) {
    return (
      <div className="mx-4 p-4 bg-slate-800/40 rounded-2xl border border-slate-700/50">
        <p className="text-xs text-slate-500 text-center">Belum ada tugas untuk hari ini</p>
      </div>
    )
  }

  return (
    <div className="px-4">
      <p className="text-xs font-medium text-slate-400 mb-2">Ringkasan Hari Ini</p>
      <div className="grid grid-cols-2 gap-2">
        {([1, 2, 3, 4] as Quadrant[]).map((q) => {
          const info = QUADRANT_INFO[q - 1]
          const qTasks = tasks.filter((t: Task) => t.quadrant === q)
          const completed = qTasks.filter((t: Task) => t.isCompleted).length
          const total = qTasks.length

          if (total === 0) return null

          const pct = Math.round((completed / total) * 100)

          return (
            <div
              key={q}
              className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/30"
            >
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-sm">{info.emoji}</span>
                <span className="text-xs font-medium truncate" style={{ color: info.color }}>
                  {info.label}
                </span>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-lg font-bold text-slate-100">{completed}/{total}</span>
                <span className="text-xs text-slate-400">{pct}%</span>
              </div>
              {/* Progress bar */}
              <div className="mt-2 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, backgroundColor: info.color }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
