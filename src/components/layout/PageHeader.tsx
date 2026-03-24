import { ArrowLeft } from 'lucide-react'
import { classNames } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  onBack?: () => void
  actions?: React.ReactNode
  className?: string
}

export function PageHeader({ title, onBack, actions, className }: PageHeaderProps) {
  return (
    <header className={classNames('flex items-center gap-3 px-4 py-3 shrink-0 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50', className)}>
      {onBack && (
        <button
          onClick={onBack}
          className="p-1.5 -ml-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Kembali"
        >
          <ArrowLeft size={20} />
        </button>
      )}
      <h1 className="flex-1 text-base font-semibold text-slate-100 truncate">{title}</h1>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  )
}
