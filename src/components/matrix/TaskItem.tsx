import { Check, Clock } from 'lucide-react'
import type { Task, Quadrant } from '@/types'
import { getDaysDiff, classNames } from '@/lib/utils'
import { toggleComplete } from '@/hooks/use-tasks'

const quadrantBorderColors: Record<Quadrant, string> = {
  1: 'border-l-red-500',
  2: 'border-l-blue-500',
  3: 'border-l-orange-500',
  4: 'border-l-gray-500',
}

interface TaskItemProps {
  task: Task
  onTap: (task: Task) => void
}

export function TaskItem({ task, onTap }: TaskItemProps) {
  const diff = task.deadline ? getDaysDiff(task.deadline) : null

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (task.id) toggleComplete(task.id, !task.isCompleted)
  }

  let deadlineColor = 'text-slate-400'
  let deadlineLabel = ''
  if (diff !== null) {
    if (diff < 0) { deadlineColor = 'text-red-400'; deadlineLabel = `${Math.abs(diff)}h lalu` }
    else if (diff === 0) { deadlineColor = 'text-yellow-400'; deadlineLabel = 'Hari ini' }
    else if (diff === 1) { deadlineColor = 'text-orange-400'; deadlineLabel = 'Besok' }
    else { deadlineLabel = `${diff}h lagi` }
  }

  return (
    <div
      onClick={() => onTap(task)}
      className={classNames(
        'flex items-start gap-3 p-3 rounded-xl border-l-2 bg-slate-800/60 hover:bg-slate-700/60 cursor-pointer transition-colors min-h-[44px]',
        quadrantBorderColors[task.quadrant],
        task.isCompleted ? 'opacity-50' : ''
      )}
    >
      {/* Checkbox */}
      <button
        onClick={handleToggle}
        className={classNames(
          'mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors',
          task.isCompleted
            ? 'bg-green-500 border-green-500'
            : 'border-slate-500 hover:border-green-400'
        )}
        aria-label={task.isCompleted ? 'Tandai belum selesai' : 'Tandai selesai'}
      >
        {task.isCompleted && <Check size={12} strokeWidth={3} className="text-white" />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={classNames('text-sm text-slate-100 leading-tight', task.isCompleted && 'line-through text-slate-400')}>
          {task.title}
        </p>
        {deadlineLabel && (
          <div className={classNames('flex items-center gap-1 mt-1', deadlineColor)}>
            <Clock size={11} />
            <span className="text-xs">{deadlineLabel}</span>
          </div>
        )}
      </div>
    </div>
  )
}
