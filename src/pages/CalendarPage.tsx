import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Task } from '@/types'
import { ShalatSchedule } from '@/components/shalat/ShalatSchedule'
import { TaskDetail } from '@/components/task/TaskDetail'
import { TaskForm } from '@/components/task/TaskForm'
import { QUADRANT_INFO, HARI_INDONESIA, BULAN_INDONESIA } from '@/lib/constants'
import { toDateString, isSameDay } from '@/lib/utils'
import { useTasks } from '@/hooks/use-tasks'

interface CalendarPageProps {
  lat: number
  lon: number
}

export function CalendarPage({ lat, lon }: CalendarPageProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [editTask, setEditTask] = useState<Task | null>(null)
  const [showForm, setShowForm] = useState(false)

  const allTasks = useTasks('semua')

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDow = firstDay.getDay()

  const days: (Date | null)[] = []
  for (let i = 0; i < startDow; i++) days.push(null)
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d))

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const getTasksForDate = (date: Date) =>
    allTasks.filter((t: Task) => {
      const d = t.deadline ?? t.createdAt.slice(0, 10)
      return d === toDateString(date)
    })

  const selectedDateStr = toDateString(selectedDate)
  const selectedTasks = allTasks.filter((t: Task) => {
    const d = t.deadline ?? t.createdAt.slice(0, 10)
    return d === selectedDateStr
  })

  const handleEditTask = (task: Task) => {
    setSelectedTask(null)
    setEditTask(task)
    setShowForm(true)
  }

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      {/* Month nav */}
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-slate-700/50 text-slate-400 min-h-[44px] min-w-[44px] flex items-center justify-center">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-sm font-semibold text-slate-100">
          {BULAN_INDONESIA[month]} {year}
        </h2>
        <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-slate-700/50 text-slate-400 min-h-[44px] min-w-[44px] flex items-center justify-center">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 px-3 mb-1">
        {HARI_INDONESIA.map((h) => (
          <div key={h} className="text-center text-xs text-slate-500 font-medium py-1">
            {h.slice(0, 1)}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 px-3 gap-y-1">
        {days.map((date, i) => {
          if (!date) return <div key={`empty-${i}`} />
          const isToday = isSameDay(date, new Date())
          const isSelected = isSameDay(date, selectedDate)
          const dayTasks = getTasksForDate(date)

          return (
            <button
              key={date.toISOString()}
              onClick={() => setSelectedDate(date)}
              className={`flex flex-col items-center py-1.5 rounded-xl transition-colors min-h-[44px] ${
                isSelected
                  ? 'bg-blue-600 text-white'
                  : isToday
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              <span className="text-xs font-medium">{date.getDate()}</span>
              {dayTasks.length > 0 && (
                <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center max-w-[28px]">
                  {dayTasks.slice(0, 3).map((t: Task) => {
                    const info = QUADRANT_INFO[t.quadrant - 1]
                    return (
                      <span
                        key={t.id}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: info.color }}
                      />
                    )
                  })}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Selected date tasks */}
      {selectedTasks.length > 0 && (
        <div className="mx-4 mt-3">
          <p className="text-xs font-medium text-slate-400 mb-2">
            Tugas — {selectedDate.getDate()} {BULAN_INDONESIA[selectedDate.getMonth()]}
          </p>
          <div className="flex flex-col gap-1.5">
            {selectedTasks.map((t: Task) => {
              const info = QUADRANT_INFO[t.quadrant - 1]
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTask(t)}
                  className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-xl text-left hover:bg-slate-700/40 transition-colors min-h-[44px]"
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: info.color }} />
                  <span className={`text-sm flex-1 truncate ${t.isCompleted ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                    {t.title}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Shalat schedule */}
      <div className="mt-3 border-t border-slate-700/50">
        <ShalatSchedule lat={lat} lon={lon} />
      </div>

      <TaskDetail
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onEdit={handleEditTask}
      />

      <TaskForm
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditTask(null) }}
        editTask={editTask ?? undefined}
      />
    </div>
  )
}
