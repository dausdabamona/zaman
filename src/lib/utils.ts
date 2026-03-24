import { BULAN_INDONESIA, HARI_INDONESIA } from './constants'

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const hari = HARI_INDONESIA[date.getDay()]
  const tanggal = date.getDate()
  const bulan = BULAN_INDONESIA[date.getMonth()]
  const tahun = date.getFullYear()
  return `${hari}, ${tanggal} ${bulan} ${tahun}`
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr)
  const tanggal = date.getDate()
  const bulan = BULAN_INDONESIA[date.getMonth()]
  return `${tanggal} ${bulan}`
}

export function formatTime(timeStr: string): string {
  // timeStr sudah dalam format HH:mm
  return timeStr.slice(0, 5)
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour >= 4 && hour < 11) return 'Selamat Pagi'
  if (hour >= 11 && hour < 15) return 'Selamat Siang'
  if (hour >= 15 && hour < 18) return 'Selamat Sore'
  return 'Selamat Malam'
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function isToday(dateStr: string): boolean {
  const date = new Date(dateStr)
  return isSameDay(date, new Date())
}

export function isThisWeek(dateStr: string): boolean {
  const date = new Date(dateStr)
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0, 0, 0, 0)
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)
  endOfWeek.setHours(23, 59, 59, 999)
  return date >= startOfWeek && date <= endOfWeek
}

export function getDaysDiff(dateStr: string): number {
  const date = new Date(dateStr)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  date.setHours(0, 0, 0, 0)
  return Math.round((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export function toDateString(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function formatCountdown(seconds: number): string {
  if (seconds <= 0) return '00:00:00'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function classNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
