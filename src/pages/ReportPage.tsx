import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db'
import { QUADRANT_INFO, MOOD_OPTIONS } from '@/lib/constants'
import { LoadingPage } from '@/components/ui/LoadingSpinner'
import { Button } from '@/components/ui/Button'
import { getWeeklyStats, getReflection, saveReflection } from '@/hooks/use-tasks'
import { toDateString, classNames } from '@/lib/utils'
import type { Mood, Task } from '@/types'

export function ReportPage() {
  const [weeklyStats, setWeeklyStats] = useState<{ date: string; total: number; completed: number }[]>([])
  const [reflectionNote, setReflectionNote] = useState('')
  const [reflectionMood, setReflectionMood] = useState<Mood>('biasa')
  const [savingReflection, setSavingReflection] = useState(false)

  const today = toDateString(new Date())

  const allTasks = useLiveQuery(() => db.tasks.toArray(), [])

  useEffect(() => {
    getWeeklyStats().then(setWeeklyStats)
  }, [allTasks])

  useEffect(() => {
    getReflection(today).then((r) => {
      if (r) {
        setReflectionNote(r.note)
        setReflectionMood(r.mood)
      }
    })
  }, [today])

  if (!allTasks) return <LoadingPage />

  // Distribusi kuadran
  const quadrantData = QUADRANT_INFO.map((info) => ({
    name: `Q${info.quadrant}`,
    value: allTasks.filter((t: Task) => t.quadrant === info.quadrant).length,
    color: info.color,
    label: info.label,
  })).filter((d) => d.value > 0)

  // Streak
  const today0 = new Date()
  today0.setHours(0, 0, 0, 0)
  let streak = 0
  for (let i = 0; i < 30; i++) {
    const d = new Date(today0)
    d.setDate(today0.getDate() - i)
    const ds = toDateString(d)
    const has = allTasks.some((t: Task) => {
      const td = t.completedAt?.slice(0, 10)
      return td === ds
    })
    if (has) streak++
    else if (i > 0) break
  }

  const totalCompleted = allTasks.filter((t: Task) => t.isCompleted).length
  const completionRate = allTasks.length > 0 ? Math.round((totalCompleted / allTasks.length) * 100) : 0

  const handleSaveReflection = async () => {
    setSavingReflection(true)
    try {
      await saveReflection(today, reflectionNote, reflectionMood)
    } finally {
      setSavingReflection(false)
    }
  }

  const barData = weeklyStats.map((d) => ({
    name: d.date.slice(5),
    selesai: d.completed,
    total: d.total,
  }))

  return (
    <div className="flex flex-col flex-1 overflow-y-auto pb-4">
      {/* Stats summary */}
      <div className="grid grid-cols-3 gap-3 px-4 pt-4">
        <div className="bg-slate-800/40 rounded-2xl p-3 text-center border border-slate-700/30">
          <p className="text-2xl font-bold text-blue-400">{streak}</p>
          <p className="text-xs text-slate-400 mt-0.5">Hari Streak</p>
        </div>
        <div className="bg-slate-800/40 rounded-2xl p-3 text-center border border-slate-700/30">
          <p className="text-2xl font-bold text-green-400">{totalCompleted}</p>
          <p className="text-xs text-slate-400 mt-0.5">Selesai</p>
        </div>
        <div className="bg-slate-800/40 rounded-2xl p-3 text-center border border-slate-700/30">
          <p className="text-2xl font-bold text-orange-400">{completionRate}%</p>
          <p className="text-xs text-slate-400 mt-0.5">Completion</p>
        </div>
      </div>

      {/* Donut chart */}
      {quadrantData.length > 0 && (
        <div className="mx-4 mt-4 p-4 bg-slate-800/40 rounded-2xl border border-slate-700/30">
          <p className="text-xs font-medium text-slate-400 mb-3">Distribusi Kuadran</p>
          <div className="flex items-center gap-4">
            <PieChart width={120} height={120}>
              <Pie
                data={quadrantData}
                cx={55}
                cy={55}
                innerRadius={35}
                outerRadius={55}
                dataKey="value"
                strokeWidth={0}
              >
                {quadrantData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
            <div className="flex flex-col gap-1.5 flex-1">
              {quadrantData.map((d) => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-xs text-slate-300">{d.name}</span>
                  </div>
                  <span className="text-xs font-medium text-slate-400">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bar chart mingguan */}
      {barData.some((d) => d.total > 0) && (
        <div className="mx-4 mt-3 p-4 bg-slate-800/40 rounded-2xl border border-slate-700/30">
          <p className="text-xs font-medium text-slate-400 mb-3">Aktivitas Minggu Ini</p>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={barData} barGap={2}>
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#94a3b8' }}
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              />
              <Bar dataKey="total" name="Total" fill="#334155" radius={[4, 4, 0, 0]} />
              <Bar dataKey="selesai" name="Selesai" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Muhasabah */}
      <div className="mx-4 mt-3 p-4 bg-slate-800/40 rounded-2xl border border-slate-700/30">
        <p className="text-xs font-medium text-slate-400 mb-3">Muhasabah Harian</p>

        {/* Mood picker */}
        <div className="flex gap-2 mb-3">
          {MOOD_OPTIONS.map((m) => (
            <button
              key={m.value}
              onClick={() => setReflectionMood(m.value)}
              className={classNames(
                'flex-1 flex flex-col items-center py-2 px-1 rounded-xl border text-center transition-colors min-h-[56px]',
                reflectionMood === m.value
                  ? 'bg-blue-600/20 border-blue-500/50 text-blue-300'
                  : 'border-slate-700 text-slate-400 hover:border-slate-600'
              )}
            >
              <span className="text-lg">{m.emoji}</span>
              <span className="text-xs mt-0.5">{m.label}</span>
            </button>
          ))}
        </div>

        <textarea
          value={reflectionNote}
          onChange={(e) => setReflectionNote(e.target.value)}
          placeholder="Bagaimana hari ini? Apa yang sudah baik dan perlu ditingkatkan?"
          rows={3}
          className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm resize-none mb-3"
        />

        <Button
          variant="primary"
          size="sm"
          onClick={handleSaveReflection}
          loading={savingReflection}
          className="w-full"
        >
          Simpan Muhasabah
        </Button>
      </div>
    </div>
  )
}
