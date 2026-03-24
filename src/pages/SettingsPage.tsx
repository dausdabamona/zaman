import { useState, useEffect } from 'react'
import { Download, Trash2, Bell, MapPin, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { getSetting, setSetting, exportAllData, clearAllData } from '@/hooks/use-tasks'
import { useNotification } from '@/hooks/use-notification'
import { DEFAULT_COORDS } from '@/lib/constants'
import { classNames } from '@/lib/utils'

interface SettingsPageProps {
  onSettingsChanged: () => void
}

export function SettingsPage({ onSettingsChanged }: SettingsPageProps) {
  const [name, setName] = useState('Firdaus')
  const [lat, setLat] = useState(String(DEFAULT_COORDS.lat))
  const [lon, setLon] = useState(String(DEFAULT_COORDS.lon))
  const [notifShalat, setNotifShalat] = useState(false)
  const [notifDeadline, setNotifDeadline] = useState(true)
  const [saved, setSaved] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)
  const [clearing, setClearing] = useState(false)

  const { requestPermission, permission } = useNotification()

  useEffect(() => {
    Promise.all([
      getSetting('user_name', 'Firdaus'),
      getSetting('lat', String(DEFAULT_COORDS.lat)),
      getSetting('lon', String(DEFAULT_COORDS.lon)),
      getSetting('notif_shalat', 'false'),
      getSetting('notif_deadline', 'true'),
    ]).then(([n, la, lo, ns, nd]) => {
      setName(n)
      setLat(la)
      setLon(lo)
      setNotifShalat(ns === 'true')
      setNotifDeadline(nd === 'true')
    })
  }, [])

  const handleSave = async () => {
    await setSetting('user_name', name)
    await setSetting('lat', lat)
    await setSetting('lon', lon)
    await setSetting('notif_shalat', String(notifShalat))
    await setSetting('notif_deadline', String(notifDeadline))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    onSettingsChanged()
  }

  const handleExport = async () => {
    const data = await exportAllData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `zaman-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleClear = async () => {
    if (!confirmClear) {
      setConfirmClear(true)
      return
    }
    setClearing(true)
    await clearAllData()
    setClearing(false)
    setConfirmClear(false)
    onSettingsChanged()
  }

  const handleNotifShalat = async (val: boolean) => {
    if (val && permission !== 'granted') {
      await requestPermission()
    }
    setNotifShalat(val)
  }

  return (
    <div className="flex flex-col flex-1 overflow-y-auto pb-4">
      <div className="flex flex-col gap-4 p-4">
        {/* Profil */}
        <section className="bg-slate-800/40 rounded-2xl p-4 border border-slate-700/30">
          <div className="flex items-center gap-2 mb-3">
            <User size={16} className="text-slate-400" />
            <p className="text-xs font-medium text-slate-400">Profil</p>
          </div>
          <label className="block text-xs text-slate-400 mb-1">Nama</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500 text-sm min-h-[44px]"
          />
        </section>

        {/* Lokasi shalat */}
        <section className="bg-slate-800/40 rounded-2xl p-4 border border-slate-700/30">
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={16} className="text-slate-400" />
            <p className="text-xs font-medium text-slate-400">Lokasi Shalat</p>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Default: Sorong, Papua Barat Daya
          </p>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-xs text-slate-400 mb-1">Latitude</label>
              <input
                type="number"
                step="0.0001"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500 text-sm min-h-[44px]"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-slate-400 mb-1">Longitude</label>
              <input
                type="number"
                step="0.0001"
                value={lon}
                onChange={(e) => setLon(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500 text-sm min-h-[44px]"
              />
            </div>
          </div>
        </section>

        {/* Notifikasi */}
        <section className="bg-slate-800/40 rounded-2xl p-4 border border-slate-700/30">
          <div className="flex items-center gap-2 mb-3">
            <Bell size={16} className="text-slate-400" />
            <p className="text-xs font-medium text-slate-400">Notifikasi</p>
          </div>

          <div className="flex flex-col gap-3">
            {[
              { label: 'Pengingat Shalat', value: notifShalat, onChange: handleNotifShalat },
              { label: 'Pengingat Deadline', value: notifDeadline, onChange: (v: boolean) => setNotifDeadline(v) },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-sm text-slate-300">{item.label}</span>
                <button
                  onClick={() => item.onChange(!item.value)}
                  className={classNames(
                    'relative w-11 h-6 rounded-full transition-colors focus:outline-none',
                    item.value ? 'bg-blue-600' : 'bg-slate-600'
                  )}
                  aria-label={item.label}
                >
                  <span className={classNames(
                    'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform',
                    item.value ? 'translate-x-5' : 'translate-x-0'
                  )} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Simpan */}
        <Button variant="primary" onClick={handleSave} className="w-full">
          {saved ? 'Tersimpan!' : 'Simpan Pengaturan'}
        </Button>

        {/* Data */}
        <section className="bg-slate-800/40 rounded-2xl p-4 border border-slate-700/30">
          <p className="text-xs font-medium text-slate-400 mb-3">Manajemen Data</p>
          <div className="flex flex-col gap-2">
            <Button variant="secondary" onClick={handleExport} className="w-full gap-2">
              <Download size={16} /> Ekspor Data (JSON)
            </Button>
            <Button
              variant={confirmClear ? 'danger' : 'ghost'}
              onClick={handleClear}
              loading={clearing}
              className="w-full gap-2"
            >
              <Trash2 size={16} />
              {confirmClear ? 'Yakin? Klik lagi untuk hapus semua' : 'Hapus Semua Data'}
            </Button>
          </div>
        </section>

        <p className="text-center text-xs text-slate-600">ZAMAN v0.1.0 — Offline-first PWA</p>
      </div>
    </div>
  )
}
