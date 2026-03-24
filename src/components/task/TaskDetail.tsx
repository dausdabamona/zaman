import { useState } from 'react'
import { Edit2, Trash2, CheckCircle, Circle } from 'lucide-react'
import type { Task } from '@/types'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { QuadrantBadge, TagBadge } from '@/components/ui/Badge'
import { QUADRANT_INFO } from '@/lib/constants'
import { deleteTask, toggleComplete } from '@/hooks/use-tasks'
import { formatDateShort } from '@/lib/utils'

interface TaskDetailProps {
  task: Task | null
  onClose: () => void
  onEdit: (task: Task) => void
}

export function TaskDetail({ task, onClose, onEdit }: TaskDetailProps) {
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (!task) return null

  const info = QUADRANT_INFO[task.quadrant - 1]

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    setDeleting(true)
    if (task.id) await deleteTask(task.id)
    onClose()
  }

  const handleToggle = async () => {
    if (task.id) await toggleComplete(task.id, !task.isCompleted)
    onClose()
  }

  return (
    <Modal isOpen={!!task} onClose={onClose} title="Detail Tugas">
      <div className="p-4 flex flex-col gap-4">
        {/* Status */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: info.color }} />
          <span className="text-xs font-semibold" style={{ color: info.color }}>
            {info.emoji} {info.label}
          </span>
        </div>

        {/* Judul */}
        <div>
          <h3 className={`text-base font-semibold text-slate-100 ${task.isCompleted ? 'line-through text-slate-400' : ''}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-slate-400 mt-1">{task.description}</p>
          )}
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-2">
          <QuadrantBadge quadrant={task.quadrant} label={`Q${task.quadrant}`} />
          <TagBadge tag={task.tag} />
          {task.isCompleted && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">
              Selesai
            </span>
          )}
        </div>

        {/* Deadline */}
        {task.deadline && (
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span className="text-slate-500">Deadline:</span>
            <span>{formatDateShort(task.deadline)}</span>
          </div>
        )}

        {/* Reminder */}
        {task.reminderAt && (
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span className="text-slate-500">Pengingat:</span>
            <span>{new Date(task.reminderAt).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2 pt-2 border-t border-slate-700">
          <Button
            variant={task.isCompleted ? 'secondary' : 'primary'}
            onClick={handleToggle}
            className="w-full gap-2"
          >
            {task.isCompleted ? (
              <><Circle size={16} /> Tandai Belum Selesai</>
            ) : (
              <><CheckCircle size={16} /> Tandai Selesai</>
            )}
          </Button>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => onEdit(task)} className="flex-1 gap-2">
              <Edit2 size={16} /> Edit
            </Button>
            <Button
              variant={confirmDelete ? 'danger' : 'ghost'}
              onClick={handleDelete}
              loading={deleting}
              className="flex-1 gap-2"
            >
              <Trash2 size={16} />
              {confirmDelete ? 'Yakin hapus?' : 'Hapus'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
