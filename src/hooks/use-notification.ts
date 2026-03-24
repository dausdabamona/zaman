import { useState, useCallback } from 'react'

export function useNotification() {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  )

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (typeof Notification === 'undefined') return false
    if (Notification.permission === 'granted') return true

    const result = await Notification.requestPermission()
    setPermission(result)
    return result === 'granted'
  }, [])

  const scheduleNotification = useCallback(async (
    title: string,
    body: string,
    at: Date
  ): Promise<ReturnType<typeof setTimeout> | null> => {
    const granted = await requestPermission()
    if (!granted) return null

    const delay = at.getTime() - Date.now()
    if (delay <= 0) {
      new Notification(title, { body, icon: '/zaman/icons/icon-192.png' })
      return null
    }

    const timer = setTimeout(() => {
      new Notification(title, { body, icon: '/zaman/icons/icon-192.png' })
    }, delay)

    return timer
  }, [requestPermission])

  const showNow = useCallback(async (title: string, body: string): Promise<void> => {
    const granted = await requestPermission()
    if (!granted) return
    new Notification(title, { body, icon: '/zaman/icons/icon-192.png' })
  }, [requestPermission])

  return { permission, requestPermission, scheduleNotification, showNow }
}
