'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Eye, Users, Flame, TrendingUp } from 'lucide-react'
import { portfolioApi, ViewStats } from '@/lib/api'

export function ViewCounter() {
  const [stats, setStats] = useState<ViewStats | null>(null)
  const [tracked, setTracked] = useState(false)

  useEffect(() => {
    // Generate or get session ID
    let sessionId = sessionStorage.getItem('portfolio_session')
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('portfolio_session', sessionId)
    }

    // Track the view
    if (!tracked) {
      portfolioApi.trackView(sessionId)
        .then(data => {
          setStats(data)
          setTracked(true)
        })
        .catch(() => {
          // Backend not available, show placeholder
          setStats({
            total_views: 0,
            unique_visitors: 0,
            popularity: 'Waiting for backend...'
          })
        })
    }
  }, [tracked])

  if (!stats) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 }}
      className="fixed bottom-6 right-6 z-40"
    >
      <motion.div
        className="bg-black text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-4"
        whileHover={{ scale: 1.05 }}
      >
        <div className="flex items-center gap-2 border-r border-white/20 pr-4">
          <Eye className="w-4 h-4 text-hot-pink" />
          <span className="font-bold">{stats.total_views}</span>
          <span className="text-white/60 text-sm">views</span>
        </div>
        <div className="flex items-center gap-2 border-r border-white/20 pr-4">
          <Users className="w-4 h-4 text-sunny-yellow" />
          <span className="font-bold">{stats.unique_visitors}</span>
          <span className="text-white/60 text-sm">visitors</span>
        </div>
        <div className="flex items-center gap-1">
          {stats.total_views > 10 ? (
            <Flame className="w-4 h-4 text-orange-500" />
          ) : (
            <TrendingUp className="w-4 h-4 text-vibrant-green" />
          )}
          <span className="text-xs text-white/60">{stats.popularity}</span>
        </div>
      </motion.div>

      {/* API badge */}
      <div className="text-center mt-2">
        <code className="text-[10px] bg-black/80 px-2 py-0.5 rounded text-white/40">
          POST /api/portfolio/views
        </code>
      </div>
    </motion.div>
  )
}
