import type { ShalatTimes } from '@/types'
import { FALLBACK_SORONG, SHALAT_METHOD } from './constants'
import { db } from './db'

const CACHE_TTL_MS = 24 * 60 * 60 * 1000 // 24 jam

function getCacheKey(lat: number, lon: number, dateStr: string): string {
  return `shalat_cache_${lat}_${lon}_${dateStr}`
}

function toDateStr(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

async function getCached(key: string): Promise<ShalatTimes | null> {
  try {
    const setting = await db.settings.get(key)
    if (!setting) return null
    const parsed = JSON.parse(setting.value) as { times: ShalatTimes; fetchedAt: number }
    if (Date.now() - parsed.fetchedAt > CACHE_TTL_MS) return null
    return parsed.times
  } catch {
    return null
  }
}

async function setCache(key: string, times: ShalatTimes): Promise<void> {
  try {
    await db.settings.put({
      key,
      value: JSON.stringify({ times, fetchedAt: Date.now() }),
    })
  } catch {
    // Cache tidak kritis, abaikan error
  }
}

async function fetchFromApi(lat: number, lon: number, date: Date): Promise<ShalatTimes> {
  const dateStr = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`
  const url = `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lon}&method=${SHALAT_METHOD}`

  const response = await fetch(url, { signal: AbortSignal.timeout(8000) })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)

  const data = await response.json() as {
    code: number
    data: { timings: Record<string, string> }
  }

  if (data.code !== 200) throw new Error('API error')

  const t = data.data.timings
  return {
    Fajr: t['Fajr'],
    Sunrise: t['Sunrise'],
    Dhuhr: t['Dhuhr'],
    Asr: t['Asr'],
    Maghrib: t['Maghrib'],
    Isha: t['Isha'],
  }
}

export async function getShalatTimes(lat: number, lon: number, date?: Date): Promise<ShalatTimes> {
  const d = date ?? new Date()
  const dateStr = toDateStr(d)
  const cacheKey = getCacheKey(lat, lon, dateStr)

  // Cek cache
  const cached = await getCached(cacheKey)
  if (cached) return cached

  // Fetch dari API
  try {
    const times = await fetchFromApi(lat, lon, d)
    await setCache(cacheKey, times)
    return times
  } catch {
    // Fallback data Sorong
    return { ...FALLBACK_SORONG }
  }
}

export function getNextPrayer(times: ShalatTimes): { name: string; label: string; time: string; secondsLeft: number } {
  const prayers = [
    { name: 'Fajr', label: 'Subuh', time: times.Fajr },
    { name: 'Dhuhr', label: 'Dzuhur', time: times.Dhuhr },
    { name: 'Asr', label: 'Ashar', time: times.Asr },
    { name: 'Maghrib', label: 'Maghrib', time: times.Maghrib },
    { name: 'Isha', label: 'Isya', time: times.Isha },
  ]

  const now = new Date()
  const nowSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()

  for (const p of prayers) {
    const [h, m] = p.time.split(':').map(Number)
    const pSec = h * 3600 + m * 60
    if (pSec > nowSec) {
      return { ...p, secondsLeft: pSec - nowSec }
    }
  }

  // Setelah Isya → Subuh besok
  const [h, m] = times.Fajr.split(':').map(Number)
  const fajrSec = h * 3600 + m * 60
  const secondsLeft = (86400 - nowSec) + fajrSec
  return { name: 'Fajr', label: 'Subuh', time: times.Fajr, secondsLeft }
}
