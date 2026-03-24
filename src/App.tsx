import { useState, useEffect } from 'react'
import type { Page } from '@/types'
import { BottomNav } from '@/components/layout/BottomNav'
import { PageHeader } from '@/components/layout/PageHeader'
import { ToastContainer, useToast } from '@/components/ui/Toast'
import { HomePage } from '@/pages/HomePage'
import { MatrixPage } from '@/pages/MatrixPage'
import { CalendarPage } from '@/pages/CalendarPage'
import { ReportPage } from '@/pages/ReportPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { getSetting } from '@/hooks/use-tasks'
import { DEFAULT_COORDS } from '@/lib/constants'

const PAGE_TITLES: Record<Page, string> = {
  home: 'ZAMAN',
  matrix: 'Eisenhower Matrix',
  calendar: 'Kalender',
  report: 'Laporan',
  settings: 'Pengaturan',
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const [userName, setUserName] = useState('Firdaus')
  const [lat, setLat] = useState(DEFAULT_COORDS.lat)
  const [lon, setLon] = useState(DEFAULT_COORDS.lon)
  const { toasts, show, dismiss } = useToast()

  const loadSettings = async () => {
    const name = await getSetting('user_name', 'Firdaus')
    const latStr = await getSetting('lat', String(DEFAULT_COORDS.lat))
    const lonStr = await getSetting('lon', String(DEFAULT_COORDS.lon))
    setUserName(name)
    setLat(parseFloat(latStr))
    setLon(parseFloat(lonStr))
  }

  useEffect(() => {
    loadSettings()
  }, [])

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage userName={userName} lat={lat} lon={lon} />
      case 'matrix':
        return <MatrixPage />
      case 'calendar':
        return <CalendarPage lat={lat} lon={lon} />
      case 'report':
        return <ReportPage />
      case 'settings':
        return (
          <SettingsPage
            onSettingsChanged={() => {
              loadSettings()
              show('Pengaturan tersimpan', 'success')
            }}
          />
        )
    }
  }

  return (
    <div className="flex flex-col h-svh bg-slate-900 text-slate-100">
      <ToastContainer toasts={toasts} onDismiss={dismiss} />

      {/* Header */}
      <PageHeader title={PAGE_TITLES[currentPage]} />

      {/* Page content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {renderPage()}
      </main>

      {/* Bottom navigation */}
      <BottomNav currentPage={currentPage} onNavigate={setCurrentPage} />
    </div>
  )
}
