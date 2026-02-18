'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff } from 'lucide-react'

interface AdminGateProps {
  onUnlock: (adminKey: string) => void
}

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_HIRING_ADMIN_KEY || 'hiring-admin-2025'

export function AdminGate({ onUnlock }: AdminGateProps) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(false)
  const [shaking, setShaking] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      onUnlock(password)
    } else {
      setError(true)
      setShaking(true)
      setTimeout(() => setShaking(false), 500)
      setTimeout(() => setError(false), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="grid-bg fixed inset-0 pointer-events-none opacity-30" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={
          shaking
            ? { x: [-8, 8, -8, 8, 0], opacity: 1, scale: 1 }
            : { opacity: 1, scale: 1, x: 0 }
        }
        transition={{ duration: shaking ? 0.4 : 0.3 }}
        className="relative z-10 glass-card p-10 w-full max-w-sm flex flex-col items-center gap-6"
      >
        <div className="w-14 h-14 rounded-full bg-lime/10 border border-lime/30 flex items-center justify-center">
          <Lock className="w-6 h-6 text-lime" />
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-black text-white">Admin Access</h1>
          <p className="text-white/40 text-sm mt-1">Hiring Progress Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter admin password"
              autoFocus
              className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none transition-all pr-12 ${
                error
                  ? 'border-red-500/50 focus:border-red-500'
                  : 'border-white/10 focus:border-lime/50'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">Incorrect password. Try again.</p>
          )}

          <button
            type="submit"
            className="w-full bg-lime text-black font-bold py-3 rounded-xl hover:bg-lime/80 transition-colors"
          >
            Unlock Admin
          </button>
        </form>

        <a
          href="/hiring-progress"
          className="text-white/30 hover:text-white/50 text-xs transition-colors"
        >
          ← Back to Dashboard
        </a>
      </motion.div>
    </div>
  )
}
