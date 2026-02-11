'use client'

import { useState, useEffect } from 'react'

const PASSWORD_MAP: Record<string, string> = {
  volume7: 'Volume7',
  google: 'Google',
  amazon: 'Amazon',
  poka: 'Poka',
  dialogue: 'Dialogue',
  ladev: 'Ladev',
}

export function getCompany(password: string): string | null {
  return PASSWORD_MAP[password.toLowerCase()] || null
}

export function useCompany(): [string | null, (name: string | null) => void] {
  const [company, setCompany] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('company')
    if (stored) setCompany(stored)
  }, [])

  const setAndStore = (name: string | null) => {
    if (name) {
      localStorage.setItem('company', name)
    } else {
      localStorage.removeItem('company')
    }
    setCompany(name)
  }

  return [company, setAndStore]
}
