import { useState } from 'react'
import type { Task, Quadrant, TaskTag } from '@/types'
import { QUADRANT_INFO, TAG_OPTIONS } from '@/lib/constants'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { addTask, updateTask } from '@/hooks/use-tasks'
import { classNames } from '@/lib/utils'

interface TaskFormProps {
  isOpen: boolean
  onClose: () => void
  initialQuadrant?: Quadrant
  editTask?: Task
  onSaved?: () => void
}

export function TaskForm({ isOpen, onClose, initialQuadrant = 1, editTask, onSaved }: TaskFormProps) {
  const [title, setTitle] = useState(editTask?.title ?? '')
  const [description, setDescription] = useState(editTask?.description ?? '')
  const [quadrant, setQuadrant] = useState<Quadrant>(editTask?.quadrant ?? initialQuadrant)
  const [tag, setTag] = useState<TaskTag>(editTask?.tag ?? 'lainnya')
  const [deadline, setDeadline] = useState(editTask?.deadline ?? '')
  const [reminderEnabled, setReminderEnabled] = useState(!!editTask?.reminderAt)
  const [reminderAt, setReminderAt] = useState(editTask?.reminderAt?.slice(0, 16) ?? '')
  const [loading, setLoading] = useState(false)

  const isEdit = !!editTask

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    try {
      const data = {
        title: title.trim(),
        description: description.trim() || undefined,
        quadrant,
        tag,
        deadline: deadline || undefined,
        reminderAt: reminderEnabled && reminderAt ? new Date(reminderAt).toISOString() : undefined,
        isCompleted: editTask?.isCompleted ?? false,
      }

      if (isEdit && editTask.id) {
        await updateTask(editTask.id, data)
      } else {
        await addTask(data)
      }

      onSaved?.()
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Tugas' : 'Tambah Tugas'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
        {/* Judul */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">
            Judul <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Apa yang perlu dikerjakan?"
            required
            className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm min-h-[44px]"
          />
        </div>

        {/* Deskripsi */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Deskripsi</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Catatan tambahan (opsional)"
            rows={2}
            className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm resize-none"
          />
        </div>

        {/* Kuadran */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-2">Kuadran</label>
          <div className="grid grid-cols-2 gap-2">
            {QUADRANT_INFO.map((info) => (
              <button
                key={info.quadrant}
                type="button"
                onClick={() => setQuadrant(info.quadrant)}
                className={classNames(
                  'flex flex-col items-start p-2.5 rounded-xl border transition-all text-left min-h-[44px]',
                  quadrant === info.quadrant
                    ? 'border-current bg-current/10'
                    : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                )}
                style={quadrant === info.quadrant ? { borderColor: info.color, color: info.color } : {}}
              >
                <span className="text-base leading-none">{info.emoji}</span>
                <span className="text-xs font-semibold mt-1" style={quadrant === info.quadrant ? { color: info.color } : { color: '#94a3b8' }}>
                  {info.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tag */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-2">Tag</label>
          <div className="flex flex-wrap gap-2">
            {TAG_OPTIONS.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setTag(t.value)}
                className={classNames(
                  'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors min-h-[36px]',
                  tag === t.value
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:border-slate-500'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Deadline */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Deadline</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500 text-sm min-h-[44px] [color-scheme:dark]"
          />
        </div>

        {/* Reminder */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-slate-400">Pengingat</label>
            <button
              type="button"
              onClick={() => setReminderEnabled(!reminderEnabled)}
              className={classNames(
                'relative w-11 h-6 rounded-full transition-colors focus:outline-none',
                reminderEnabled ? 'bg-blue-600' : 'bg-slate-600'
              )}
              aria-label="Toggle pengingat"
            >
              <span className={classNames(
                'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform',
                reminderEnabled ? 'translate-x-5' : 'translate-x-0'
              )} />
            </button>
          </div>
          {reminderEnabled && (
            <input
              type="datetime-local"
              value={reminderAt}
              onChange={(e) => setReminderAt(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500 text-sm min-h-[44px] [color-scheme:dark]"
            />
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Batal
          </Button>
          <Button type="submit" variant="primary" loading={loading} className="flex-1">
            {isEdit ? 'Simpan Perubahan' : 'Tambah Tugas'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
