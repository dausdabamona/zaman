import { useState, useEffect, useRef } from 'react'
import { getShalatTimes, getNextPrayer } from '@/lib/shalat-api'
import { formatCountdown } from '@/lib/utils'
import type { ShalatTimes } from '@/types'

interface UseShalatReturn {
  times: ShalatTimes | null
  nextPrayer: { name: string; label: string; time: string } | null
  countdown: string
  isLoading: boolean
  error: string | null
}

export function useShalat(lat: number, lon: number): UseShalatReturn {
  const [times, setTimes] = useState<ShalatTimes | null>(null)
  const [nextPrayer, setNextPrayer] = useState<{ name: string; label: string; time: string } | null>(null)
  const [countdown, setCountdown] = useState('00:00:00')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    let mounted = true
    setIsLoading(true)

    getShalatTimes(lat, lon)
      .then((t) => {
        if (!mounted) return
        setTimes(t)
        setError(null)
      })
      .catch(() => {
        if (!mounted) return
        setError('Gagal memuat jadwal shalat')
      })
      .finally(() => {
        if (mounted) setIsLoading(false)
      })

    return () => { mounted = false }
  }, [lat, lon])

  useEffect(() => {
    if (!times) return

    const tick = () => {
      const next = getNextPrayer(times)
      setNextPrayer({ name: next.name, label: next.label, time: next.time })
      setCountdown(formatCountdown(next.secondsLeft))
    }

    tick()
    intervalRef.current = setInterval(tick, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [times])

  return { times, nextPrayer, countdown, isLoading, error }
}
