import { useEffect, useState } from 'react'
import { getGreeting, formatDate } from '@/lib/utils'
import { toHijri } from '@/lib/hijri'
import { BULAN_HIJRIYAH } from '@/lib/constants'

interface GreetingHeaderProps {
  name: string
}

export function GreetingHeader({ name }: GreetingHeaderProps) {
  const [greeting, setGreeting] = useState(getGreeting())

  useEffect(() => {
    const interval = setInterval(() => setGreeting(getGreeting()), 60000)
    return () => clearInterval(interval)
  }, [])

  const today = new Date()
  const hijri = toHijri(today)
  const hijriStr = `${hijri.day} ${BULAN_HIJRIYAH[hijri.month - 1]} ${hijri.year} H`

  return (
    <div className="px-4 pt-4 pb-3">
      <h2 className="text-lg font-bold text-slate-100">
        {greeting}, {name}
      </h2>
      <p className="text-sm text-slate-400">{formatDate(today.toISOString())}</p>
      <p className="text-xs text-slate-500 mt-0.5">{hijriStr}</p>
    </div>
  )
}
