'use client'

import { useState, useEffect } from 'react'

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
