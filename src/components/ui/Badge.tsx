import type { Quadrant, TaskTag } from '@/types'
import { classNames } from '@/lib/utils'

const quadrantColors: Record<Quadrant, string> = {
  1: 'bg-red-500/20 text-red-300 border border-red-500/30',
  2: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  3: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
  4: 'bg-gray-500/20 text-gray-300 border border-gray-500/30',
}

const tagColors: Record<TaskTag, string> = {
  pekerjaan: 'bg-indigo-500/20 text-indigo-300',
  pribadi: 'bg-purple-500/20 text-purple-300',
  ppg: 'bg-teal-500/20 text-teal-300',
  keluarga: 'bg-pink-500/20 text-pink-300',
  lainnya: 'bg-slate-500/20 text-slate-300',
}

interface QuadrantBadgeProps {
  quadrant: Quadrant
  label?: string
  className?: string
}

export function QuadrantBadge({ quadrant, label, className }: QuadrantBadgeProps) {
  const labels: Record<Quadrant, string> = { 1: 'Q1', 2: 'Q2', 3: 'Q3', 4: 'Q4' }
  return (
    <span className={classNames('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', quadrantColors[quadrant], className)}>
      {label ?? labels[quadrant]}
    </span>
  )
}

interface TagBadgeProps {
  tag: TaskTag
  className?: string
}

export function TagBadge({ tag, className }: TagBadgeProps) {
  const labels: Record<TaskTag, string> = {
    pekerjaan: 'Pekerjaan',
    pribadi: 'Pribadi',
    ppg: 'PPG',
    keluarga: 'Keluarga',
    lainnya: 'Lainnya',
  }
  return (
    <span className={classNames('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', tagColors[tag], className)}>
      {labels[tag]}
    </span>
  )
}
