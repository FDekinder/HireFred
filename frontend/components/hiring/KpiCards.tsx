'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Send, MessageSquare, TrendingUp, Users, Trophy } from 'lucide-react'
import { DashboardStats } from '@/lib/api'
import { useLanguage } from '@/lib/i18n/context'

export function KpiCards({ stats }: { stats: DashboardStats }) {
  const { t } = useLanguage()

  const CARDS: { key: string; label: string; icon: React.ElementType; color: string; border: string; suffix?: string }[] = [
    { key: 'total_sent', label: t.kpi.resumesSent, icon: Send, color: 'text-lime', border: 'border-lime/20' },
    { key: 'total_responses', label: t.kpi.recruiterResponses, icon: MessageSquare, color: 'text-electric-blue', border: 'border-electric-blue/20' },
    { key: 'response_rate', label: t.kpi.responseRate, icon: TrendingUp, color: 'text-hot-pink', border: 'border-hot-pink/20', suffix: '%' },
    { key: 'active_interviews', label: t.kpi.activeInterviews, icon: Users, color: 'text-sunny-yellow', border: 'border-sunny-yellow/20' },
    { key: 'offers_received', label: t.kpi.offersReceived, icon: Trophy, color: 'text-vibrant-green', border: 'border-vibrant-green/20' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {CARDS.map((card, i) => {
        const value = stats[card.key as keyof DashboardStats] as number
        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className={`glass-card p-6 flex flex-col gap-3 border ${card.border}`}
          >
            <card.icon className={`w-5 h-5 ${card.color}`} />
            <p className={`text-3xl font-black ${card.color}`}>
              {card.suffix ? value.toFixed(1) : value}{card.suffix ?? ''}
            </p>
            <p className="text-white/50 text-sm leading-snug">{card.label}</p>
          </motion.div>
        )
      })}
    </div>
  )
}
