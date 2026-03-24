import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db'
import { isToday, isThisWeek, toDateString } from '@/lib/utils'
import type { Task, TaskFilter, Quadrant } from '@/types'

export { toDateString }

export function useTasks(filter: TaskFilter = 'semua') {
  const tasks = useLiveQuery(async () => {
    const all = await db.tasks.orderBy('createdAt').reverse().toArray()

    if (filter === 'semua') return all

    return all.filter((t: Task) => {
      const dateStr = t.deadline ?? t.createdAt.slice(0, 10)
      if (filter === 'hari-ini') return isToday(dateStr)
      if (filter === 'minggu-ini') return isThisWeek(dateStr)
      return true
    })
  }, [filter])

  return tasks ?? []
}

export function useTasksByQuadrant(filter: TaskFilter = 'semua') {
  const tasks = useTasks(filter)

  const byQuadrant = (q: Quadrant) => tasks.filter((t) => t.quadrant === q && !t.isCompleted)
  const completedByQuadrant = (q: Quadrant) => tasks.filter((t) => t.quadrant === q && t.isCompleted)

  return { tasks, byQuadrant, completedByQuadrant }
}

export function useTodayTasks() {
  const tasks = useLiveQuery(async () => {
    const all = await db.tasks.toArray()
    return all.filter((t: Task) => {
      const dateStr = t.deadline ?? t.createdAt.slice(0, 10)
      return isToday(dateStr)
    })
  }, [])
  return tasks ?? []
}

// CRUD
export async function addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
  const now = new Date().toISOString()
  await db.tasks.add({ ...task, createdAt: now, updatedAt: now })
}

export async function updateTask(id: number, data: Partial<Task>): Promise<void> {
  await db.tasks.update(id, { ...data, updatedAt: new Date().toISOString() })
}

export async function deleteTask(id: number): Promise<void> {
  await db.tasks.delete(id)
}

export async function toggleComplete(id: number, isCompleted: boolean): Promise<void> {
  await db.tasks.update(id, {
    isCompleted,
    completedAt: isCompleted ? new Date().toISOString() : undefined,
    updatedAt: new Date().toISOString(),
  })
}

export async function getTasksByDate(dateStr: string): Promise<Task[]> {
  const all = await db.tasks.toArray()
  return all.filter((t) => {
    const d = t.deadline ?? t.createdAt.slice(0, 10)
    return d === dateStr
  })
}

export async function getWeeklyStats() {
  const now = new Date()
  const days: { date: string; total: number; completed: number }[] = []

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(now.getDate() - i)
    const dateStr = toDateString(d)
    const dayTasks = await getTasksByDate(dateStr)
    days.push({
      date: dateStr,
      total: dayTasks.length,
      completed: dayTasks.filter((t) => t.isCompleted).length,
    })
  }

  return days
}

export async function getReflection(date: string) {
  return db.daily_reflections.where('date').equals(date).first()
}

export async function saveReflection(date: string, note: string, mood: 'produktif' | 'biasa' | 'kurang') {
  const existing = await db.daily_reflections.where('date').equals(date).first()
  if (existing?.id) {
    await db.daily_reflections.update(existing.id, { note, mood })
  } else {
    await db.daily_reflections.add({ date, note, mood, createdAt: new Date().toISOString() })
  }
}

export async function getSetting(key: string, defaultValue = ''): Promise<string> {
  const s = await db.settings.get(key)
  return s?.value ?? defaultValue
}

export async function setSetting(key: string, value: string): Promise<void> {
  await db.settings.put({ key, value })
}

export async function exportAllData() {
  const tasks = await db.tasks.toArray()
  const reflections = await db.daily_reflections.toArray()
  const settings = await db.settings.toArray()
  return { tasks, reflections, settings, exportedAt: new Date().toISOString() }
}

export async function clearAllData() {
  await db.tasks.clear()
  await db.daily_reflections.clear()
  await db.settings.clear()
}
