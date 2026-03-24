import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { Quadrant } from '@/types'
import { GreetingHeader } from '@/components/dashboard/GreetingHeader'
import { TodaySummary } from '@/components/dashboard/TodaySummary'
import { ShalatWidget } from '@/components/shalat/ShalatWidget'
import { TaskForm } from '@/components/task/TaskForm'

interface HomePageProps {
  userName: string
  lat: number
  lon: number
}

export function HomePage({ userName, lat, lon }: HomePageProps) {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="flex flex-col flex-1 overflow-y-auto pb-4">
      <GreetingHeader name={userName} />

      <div className="px-4 pb-3">
        <ShalatWidget lat={lat} lon={lon} />
      </div>

      <TodaySummary />

      {/* FAB */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-20 right-4 w-14 h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg shadow-blue-900/50 flex items-center justify-center transition-colors active:scale-95 z-40"
        aria-label="Tambah tugas"
      >
        <Plus size={24} />
      </button>

      <TaskForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        initialQuadrant={1 as Quadrant}
      />
    </div>
  )
}
