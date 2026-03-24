export type Quadrant = 1 | 2 | 3 | 4

export type TaskTag = 'pekerjaan' | 'pribadi' | 'ppg' | 'keluarga' | 'lainnya'

export type Mood = 'produktif' | 'biasa' | 'kurang'

export type TaskFilter = 'semua' | 'hari-ini' | 'minggu-ini'

export type Page = 'home' | 'matrix' | 'calendar' | 'report' | 'settings'

export interface Task {
  id?: number
  title: string
  description?: string
  quadrant: Quadrant
  tag: TaskTag
  deadline?: string      // ISO date string YYYY-MM-DD
  reminderAt?: string    // ISO datetime string
  isCompleted: boolean
  completedAt?: string
  createdAt: string
  updatedAt: string
}

export interface DailyReflection {
  id?: number
  date: string           // YYYY-MM-DD
  note: string
  mood: Mood
  createdAt: string
}

export interface Setting {
  key: string
  value: string
}

export interface ShalatTimes {
  Fajr: string
  Sunrise: string
  Dhuhr: string
  Asr: string
  Maghrib: string
  Isha: string
}

export interface ShalatPrayer {
  name: string
  label: string
  time: string
}

export interface HijriDate {
  day: number
  month: number
  year: number
  monthName: string
}

export interface QuadrantInfo {
  quadrant: Quadrant
  label: string
  color: string
  bgColor: string
  borderColor: string
  emoji: string
  description: string
}
