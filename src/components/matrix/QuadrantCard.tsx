import { Plus } from 'lucide-react'
import type { Task, Quadrant } from '@/types'
import { QUADRANT_INFO } from '@/lib/constants'
import { classNames } from '@/lib/utils'
import { TaskItem } from './TaskItem'

interface QuadrantCardProps {
  quadrant: Quadrant
  tasks: Task[]
  completedCount: number
  onAddTask: (quadrant: Quadrant) => void
  onTapTask: (task: Task) => void
}

export function QuadrantCard({ quadrant, tasks, completedCount, onAddTask, onTapTask }: QuadrantCardProps) {
  const info = QUADRANT_INFO[quadrant - 1]
  const total = tasks.length + completedCount

  return (
    <div className={classNames('flex flex-col rounded-2xl border bg-slate-800/40 overflow-hidden', info.borderColor)}>
      {/* Header */}
      <div className={classNames('px-3 py-2 flex items-center justify-between', info.bgColor)}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">{info.emoji}</span>
            <span className="text-xs font-bold tracking-wide" style={{ color: info.color }}>
              {info.label}
            </span>
          </div>
          <p className="text-xs text-slate-400 truncate">{info.description}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-2">
          {total > 0 && (
            <span className="text-xs text-slate-400">{completedCount}/{total}</span>
          )}
          <button
            onClick={() => onAddTask(quadrant)}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:opacity-80 min-h-[44px] min-w-[44px]"
            style={{ backgroundColor: info.color + '33', color: info.color }}
            aria-label={`Tambah tugas ${info.label}`}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Task list */}
      <div className="flex-1 p-2 flex flex-col gap-1.5 min-h-[80px] max-h-[180px] overflow-y-auto">
        {tasks.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-xs text-slate-600 italic">Belum ada tugas</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskItem key={task.id} task={task} onTap={onTapTask} />
          ))
        )}
      </div>
    </div>
  )
}
