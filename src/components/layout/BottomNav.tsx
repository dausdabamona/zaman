import { Home, LayoutGrid, Calendar, BarChart2, Settings } from 'lucide-react'
import type { Page } from '@/types'
import { classNames } from '@/lib/utils'

interface NavItem {
  page: Page
  label: string
  icon: React.ReactNode
}

const NAV_ITEMS: NavItem[] = [
  { page: 'home', label: 'Beranda', icon: <Home size={22} /> },
  { page: 'matrix', label: 'Matrix', icon: <LayoutGrid size={22} /> },
  { page: 'calendar', label: 'Kalender', icon: <Calendar size={22} /> },
  { page: 'report', label: 'Laporan', icon: <BarChart2 size={22} /> },
  { page: 'settings', label: 'Pengaturan', icon: <Settings size={22} /> },
]

interface BottomNavProps {
  currentPage: Page
  onNavigate: (page: Page) => void
}

export function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  return (
    <nav className="shrink-0 border-t border-slate-700/50 bg-slate-900/95 backdrop-blur-sm pb-safe">
      <div className="flex items-center justify-around h-14">
        {NAV_ITEMS.map((item) => {
          const isActive = currentPage === item.page
          return (
            <button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              className={classNames(
                'flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors',
                isActive ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'
              )}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {item.icon}
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
