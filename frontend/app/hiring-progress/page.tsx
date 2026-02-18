'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { hiringApi, DashboardStats, RecruiterContact, HiringStatusBanner } from '@/lib/api'
import { StatusBannerWidget } from '@/components/hiring/StatusBannerWidget'
import { KpiCards } from '@/components/hiring/KpiCards'
import { WeeklyBarChart } from '@/components/hiring/WeeklyBarChart'
import { StatusDonutChart } from '@/components/hiring/StatusDonutChart'
import { CumulativeLineChart } from '@/components/hiring/CumulativeLineChart'
import { JobTypeBarChart } from '@/components/hiring/JobTypeBarChart'
import { ContactsTable } from '@/components/hiring/ContactsTable'

export default function HiringProgressPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [contacts, setContacts] = useState<RecruiterContact[]>([])
  const [banner, setBanner] = useState<HiringStatusBanner | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      hiringApi.getDashboard(),
      hiringApi.getContacts(),
      hiringApi.getBanner(),
    ]).then(([statsData, contactsData, bannerData]) => {
      setStats(statsData)
      setContacts(contactsData)
      setBanner(bannerData)
      setLoading(false)
    })
  }, [])

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Grid background */}
      <div className="grid-bg fixed inset-0 pointer-events-none opacity-30" />

      {/* Header */}
      <header className="relative z-10 px-6 py-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-black gradient-text-vibrant">
              Job Search Dashboard
            </h1>
            <p className="text-white/40 mt-1 text-sm">
              Frederick De Kinder — Live Job Hunt Tracker
            </p>
          </div>
          <Link
            href="/"
            className="text-white/40 hover:text-lime transition-colors text-sm font-medium"
          >
            ← Back to Portfolio
          </Link>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* Status Banner */}
        {banner && <StatusBannerWidget banner={banner} />}

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-8 animate-pulse">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skeleton h-32 rounded-2xl" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton h-64 rounded-2xl" />
              ))}
            </div>
            <div className="skeleton h-64 rounded-2xl" />
          </div>
        )}

        {/* KPI Cards */}
        {!loading && stats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <KpiCards stats={stats} />
          </motion.div>
        )}

        {/* Charts grid */}
        {!loading && stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <WeeklyBarChart data={stats.weekly_applications} />
            <StatusDonutChart data={stats.status_breakdown} />
            <CumulativeLineChart data={stats.cumulative_applications} />
            <JobTypeBarChart data={stats.by_job_type} />
          </motion.div>
        )}

        {/* Contacts Table */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
          >
            <ContactsTable contacts={contacts} />
          </motion.div>
        )}

        {/* Footer note */}
        <p className="text-center text-white/20 text-xs pb-4">
          Updated in real time · Last fetched {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Subtle Admin link */}
      <div className="fixed bottom-6 left-6 z-40">
        <Link
          href="/hiring-progress/admin"
          className="text-white/15 hover:text-white/40 text-xs transition-colors"
        >
          Admin
        </Link>
      </div>
    </main>
  )
}
