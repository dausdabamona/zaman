import { useState } from 'react'
import type { Task, Quadrant, TaskFilter } from '@/types'
import { MatrixBoard } from '@/components/matrix/MatrixBoard'
import { TaskForm } from '@/components/task/TaskForm'
import { TaskDetail } from '@/components/task/TaskDetail'
import { Plus } from 'lucide-react'
import { classNames } from '@/lib/utils'

const FILTERS: { value: TaskFilter; label: string }[] = [
  { value: 'semua', label: 'Semua' },
  { value: 'hari-ini', label: 'Hari Ini' },
  { value: 'minggu-ini', label: 'Minggu Ini' },
]

export function MatrixPage() {
  const [filter, setFilter] = useState<TaskFilter>('semua')
  const [showForm, setShowForm] = useState(false)
  const [formQuadrant, setFormQuadrant] = useState<Quadrant>(1)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [editTask, setEditTask] = useState<Task | null>(null)

  const handleAddTask = (quadrant: Quadrant) => {
    setFormQuadrant(quadrant)
    setShowForm(true)
  }

  const handleEditTask = (task: Task) => {
    setSelectedTask(null)
    setEditTask(task)
    setShowForm(true)
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Filter Tabs */}
      <div className="flex gap-2 px-4 py-2 shrink-0">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={classNames(
              'flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-colors min-h-[36px]',
              filter === f.value
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-300'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Matrix Board */}
      <div className="flex-1 overflow-y-auto">
        <MatrixBoard
          filter={filter}
          onAddTask={handleAddTask}
          onTapTask={setSelectedTask}
        />
      </div>

      {/* FAB */}
      <button
        onClick={() => { setFormQuadrant(1); setShowForm(true) }}
        className="fixed bottom-20 right-4 w-14 h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg shadow-blue-900/50 flex items-center justify-center transition-colors active:scale-95 z-40"
        aria-label="Tambah tugas"
      >
        <Plus size={24} />
      </button>

      <TaskForm
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditTask(null) }}
        initialQuadrant={formQuadrant}
        editTask={editTask ?? undefined}
      />

      <TaskDetail
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onEdit={handleEditTask}
      />
    </div>
  )
}
