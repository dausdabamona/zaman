import Dexie, { type EntityTable } from 'dexie'
import type { Task, DailyReflection, Setting } from '@/types'

class ZamanDB extends Dexie {
  tasks!: EntityTable<Task, 'id'>
  daily_reflections!: EntityTable<DailyReflection, 'id'>
  settings!: EntityTable<Setting, 'key'>

  constructor() {
    super('ZamanDB')

    this.version(1).stores({
      tasks: '++id, quadrant, tag, isCompleted, deadline, createdAt',
      daily_reflections: '++id, date',
      settings: 'key',
    })
  }
}

export const db = new ZamanDB()
