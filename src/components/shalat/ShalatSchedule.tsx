import { useShalat } from '@/hooks/use-shalat'
import { SHALAT_NAMES } from '@/lib/constants'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { classNames } from '@/lib/utils'

interface ShalatScheduleProps {
  lat: number
  lon: number
}

export function ShalatSchedule({ lat, lon }: ShalatScheduleProps) {
  const { times, nextPrayer, isLoading, error } = useShalat(lat, lon)

  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <LoadingSpinner size="md" />
      </div>
    )
  }

  if (error || !times) {
    return (
      <div className="py-4 text-center text-sm text-slate-500">
        Gagal memuat jadwal shalat
      </div>
    )
  }

  const nowHour = new Date().getHours() * 60 + new Date().getMinutes()

  return (
    <div className="flex flex-col gap-1.5 p-3">
      <p className="text-xs font-medium text-slate-400 mb-2">Jadwal Shalat Hari Ini</p>
      {SHALAT_NAMES.map(({ key, label }) => {
        const time = times[key as keyof typeof times]
        const [h, m] = time.split(':').map(Number)
        const pMin = h * 60 + m
        const isNext = nextPrayer?.name === key
        const isPast = pMin < nowHour && !isNext

        return (
          <div
            key={key}
            className={classNames(
              'flex items-center justify-between px-4 py-3 rounded-xl transition-colors',
              isNext
                ? 'bg-blue-500/20 border border-blue-500/30'
                : isPast
                ? 'bg-slate-800/30 opacity-50'
                : 'bg-slate-800/40'
            )}
          >
            <div className="flex items-center gap-3">
              {isNext && (
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shrink-0" />
              )}
              {!isNext && <span className="w-2 h-2 shrink-0" />}
              <span className={classNames('text-sm font-medium', isNext ? 'text-blue-300' : 'text-slate-300')}>
                {label}
              </span>
            </div>
            <span className={classNames('text-sm font-mono font-semibold', isNext ? 'text-blue-400' : 'text-slate-400')}>
              {time.slice(0, 5)}
            </span>
          </div>
        )
      })}
    </div>
  )
}
