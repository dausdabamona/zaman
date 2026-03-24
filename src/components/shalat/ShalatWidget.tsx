import { Clock } from 'lucide-react'
import { useShalat } from '@/hooks/use-shalat'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface ShalatWidgetProps {
  lat: number
  lon: number
}

export function ShalatWidget({ lat, lon }: ShalatWidgetProps) {
  const { nextPrayer, countdown, isLoading, error } = useShalat(lat, lon)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4 bg-slate-800/40 rounded-2xl border border-slate-700/50">
        <LoadingSpinner size="sm" />
      </div>
    )
  }

  if (error || !nextPrayer) {
    return (
      <div className="p-3 bg-slate-800/40 rounded-2xl border border-slate-700/50 text-center">
        <p className="text-xs text-slate-500">Jadwal shalat tidak tersedia</p>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-800/80 to-blue-900/30 rounded-2xl border border-blue-500/20">
      <div className="p-2.5 bg-blue-500/20 rounded-xl">
        <Clock size={20} className="text-blue-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-400">Shalat berikutnya</p>
        <p className="text-sm font-semibold text-slate-100">{nextPrayer.label} — {nextPrayer.time}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-xs text-slate-500">Tersisa</p>
        <p className="text-sm font-mono font-bold text-blue-400">{countdown}</p>
      </div>
    </div>
  )
}
