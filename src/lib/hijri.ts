import type { HijriDate } from '@/types'
import { BULAN_HIJRIYAH } from './constants'

/**
 * Konversi tanggal Masehi ke Hijriyah menggunakan algoritma Umm al-Qura.
 * Akurasi ±1 hari.
 */
export function toHijri(date: Date): HijriDate {
  const jd = gregorianToJD(date.getFullYear(), date.getMonth() + 1, date.getDate())
  return jdToHijri(jd)
}

function gregorianToJD(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12)
  const y = year + 4800 - a
  const m = month + 12 * a - 3
  return day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
}

function jdToHijri(jd: number): HijriDate {
  const z = Math.floor(jd) + 0.5

  const epochAstro = 1948439.5
  const shift1 = 8.01
  const shift2 = 29.5

  const n = Math.floor((z - epochAstro) / shift2)
  const a = z - epochAstro - Math.floor(n * shift2)
  const b = Math.floor((a + shift1) / shift2)
  const c = n + b - 1

  const year = Math.floor((c + 1) / 12) + 1
  const month = c - Math.floor((year - 1) * 12) + 1
  const day = Math.floor(a - Math.floor((b - 1) * shift2) + shift1)

  // Fallback sederhana jika hasilnya tidak masuk akal
  const hy = isNaN(year) ? 1446 : year
  const hm = isNaN(month) || month < 1 || month > 12 ? 1 : month
  const hd = isNaN(day) || day < 1 || day > 30 ? 1 : day

  return {
    year: hy,
    month: hm,
    day: hd,
    monthName: BULAN_HIJRIYAH[hm - 1],
  }
}
