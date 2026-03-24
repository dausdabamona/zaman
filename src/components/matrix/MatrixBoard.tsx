import type { Task, Quadrant, TaskFilter } from '@/types'
import { useTasksByQuadrant } from '@/hooks/use-tasks'
import { QuadrantCard } from './QuadrantCard'

interface MatrixBoardProps {
  filter: TaskFilter
  onAddTask: (quadrant: Quadrant) => void
  onTapTask: (task: Task) => void
}

export function MatrixBoard({ filter, onAddTask, onTapTask }: MatrixBoardProps) {
  const { byQuadrant, completedByQuadrant } = useTasksByQuadrant(filter)

  const quadrants: Quadrant[] = [1, 2, 3, 4]

  return (
    <div className="grid grid-cols-2 gap-3 p-3 flex-1">
      {quadrants.map((q) => (
        <QuadrantCard
          key={q}
          quadrant={q}
          tasks={byQuadrant(q)}
          completedCount={completedByQuadrant(q).length}
          onAddTask={onAddTask}
          onTapTask={onTapTask}
        />
      ))}
    </div>
  )
}
