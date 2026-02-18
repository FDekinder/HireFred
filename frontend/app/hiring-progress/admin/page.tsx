'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { AdminGate } from '@/components/hiring/AdminGate'
import { AdminDashboard } from '@/components/hiring/AdminDashboard'

const SESSION_KEY = 'hiring_admin_key'

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_KEY)
    if (stored) setAdminKey(stored)
    setChecked(true)
  }, [])

  const handleUnlock = (key: string) => {
    sessionStorage.setItem(SESSION_KEY, key)
    setAdminKey(key)
  }

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY)
    setAdminKey(null)
  }

  // Avoid flash of gate before session check
  if (!checked) return null

  return (
    <AnimatePresence mode="wait">
      {adminKey === null ? (
        <AdminGate key="gate" onUnlock={handleUnlock} />
      ) : (
        <AdminDashboard key="dashboard" adminKey={adminKey} onLogout={handleLogout} />
      )}
    </AnimatePresence>
  )
}
