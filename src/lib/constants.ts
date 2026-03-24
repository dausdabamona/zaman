import type { QuadrantInfo, TaskTag, Mood } from '@/types'

export const QUADRANT_INFO: QuadrantInfo[] = [
  {
    quadrant: 1,
    label: 'KERJAKAN SEKARANG',
    emoji: '🔴',
    description: 'Penting & Mendesak',
    color: '#EF4444',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
  },
  {
    quadrant: 2,
    label: 'JADWALKAN',
    emoji: '🔵',
    description: 'Penting & Tidak Mendesak',
    color: '#3B82F6',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
  },
  {
    quadrant: 3,
    label: 'DELEGASIKAN',
    emoji: '🟠',
    description: 'Tidak Penting & Mendesak',
    color: '#F97316',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
  },
  {
    quadrant: 4,
    label: 'ELIMINASI',
    emoji: '⚪',
    description: 'Tidak Penting & Tidak Mendesak',
    color: '#9CA3AF',
    bgColor: 'bg-gray-500/10',
    borderColor: 'border-gray-500/30',
  },
]

export const TAG_OPTIONS: { value: TaskTag; label: string }[] = [
  { value: 'pekerjaan', label: 'Pekerjaan' },
  { value: 'pribadi', label: 'Pribadi' },
  { value: 'ppg', label: 'PPG' },
  { value: 'keluarga', label: 'Keluarga' },
  { value: 'lainnya', label: 'Lainnya' },
]

export const MOOD_OPTIONS: { value: Mood; label: string; emoji: string }[] = [
  { value: 'produktif', label: 'Produktif', emoji: '😊' },
  { value: 'biasa', label: 'Biasa', emoji: '😐' },
  { value: 'kurang', label: 'Kurang', emoji: '😔' },
]

export const DEFAULT_COORDS = {
  lat: -0.8833,
  lon: 131.2500,
  city: 'Sorong',
}

export const SHALAT_METHOD = 11 // Singapore — mendekati Kemenag RI

export const SHALAT_NAMES: { key: string; label: string }[] = [
  { key: 'Fajr', label: 'Subuh' },
  { key: 'Dhuhr', label: 'Dzuhur' },
  { key: 'Asr', label: 'Ashar' },
  { key: 'Maghrib', label: 'Maghrib' },
  { key: 'Isha', label: 'Isya' },
]

export const FALLBACK_SORONG = {
  Fajr: '04:45',
  Sunrise: '06:01',
  Dhuhr: '12:03',
  Asr: '15:18',
  Maghrib: '18:05',
  Isha: '19:17',
}

export const BULAN_INDONESIA = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

export const HARI_INDONESIA = [
  'Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu',
]

export const BULAN_HIJRIYAH = [
  'Muharram', 'Shafar', 'Rabiul Awal', 'Rabiul Akhir',
  'Jumadil Awal', 'Jumadil Akhir', 'Rajab', 'Syaban',
  'Ramadan', 'Syawal', 'Dzulqadah', 'Dzulhijjah',
]
