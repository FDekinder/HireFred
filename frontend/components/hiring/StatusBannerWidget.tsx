'use client'

import { motion } from 'framer-motion'
import { Radio } from 'lucide-react'
import { HiringStatusBanner } from '@/lib/api'

export function StatusBannerWidget({ banner }: { banner: HiringStatusBanner }) {
  if (!banner.is_active) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card border border-lime/30 p-4 flex items-center gap-4"
    >
      <div className="flex items-center gap-2 shrink-0">
        <Radio className="w-5 h-5 text-lime animate-pulse" />
        <span className="text-lime font-bold text-xs uppercase tracking-widest">Live Status</span>
      </div>
      <div className="w-px h-5 bg-white/20 shrink-0" />
      <p className="text-white font-medium">{banner.message}</p>
    </motion.div>
  )
}
