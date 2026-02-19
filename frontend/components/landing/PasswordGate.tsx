'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, ArrowRight } from 'lucide-react'

interface PasswordGateProps {
  onUnlock: (company: string) => void
}

export function PasswordGate({ onUnlock }: PasswordGateProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [shaking, setShaking] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const { company } = await res.json()
      if (company) {
        onUnlock(company)
      } else {
        setError(true)
        setShaking(true)
        setTimeout(() => setShaking(false), 600)
        setTimeout(() => setError(false), 3000)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-sunny-yellow flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-md w-full"
      >
        {/* Lock icon */}
        <motion.div
          className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center mx-auto mb-8"
          animate={{ rotate: [0, -5, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <Lock className="w-10 h-10 text-hot-pink" />
        </motion.div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-black text-black mb-3 tracking-tight">
          psst...
        </h1>
        <p className="text-lg text-black/60 font-medium mb-10">
          enter the secret code
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <motion.div
            animate={shaking ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="type the password..."
              autoFocus
              disabled={loading}
              className="w-full px-6 py-4 text-lg rounded-2xl border-4 border-black/20 focus:border-hot-pink focus:outline-none transition-colors bg-white text-black text-center font-bold placeholder:font-normal placeholder:text-black/30 disabled:opacity-60"
            />
          </motion.div>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-hot-pink font-bold mt-3"
              >
                nice try! wrong password though 😏
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            disabled={loading}
            className="mt-6 px-8 py-4 bg-black text-sunny-yellow font-bold text-lg rounded-full hover:bg-hot-pink hover:text-white transition-colors flex items-center gap-3 mx-auto disabled:opacity-60"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? 'checking...' : 'Let me in!'}
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </form>

        {/* Hint */}
        <p className="text-black/20 text-xs mt-8">
          hint: try your company name ;)
        </p>
        <p className="text-black/20 text-xs mt-2">
          company not listed? try "google" as default
        </p>
      </motion.div>
    </div>
  )
}
