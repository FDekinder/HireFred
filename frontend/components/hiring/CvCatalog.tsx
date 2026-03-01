'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Application, ApplicationStatus } from '@/lib/api'
import { useLanguage } from '@/lib/i18n/context'

// ── Helpers ───────────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  applied: 'text-lime/80 bg-lime/10 border-lime/20',
  response: 'text-electric-blue/80 bg-electric-blue/10 border-electric-blue/20',
  interview: 'text-hot-pink/80 bg-hot-pink/10 border-hot-pink/20',
  offer: 'text-vibrant-green/80 bg-vibrant-green/10 border-vibrant-green/20',
  rejected: 'text-orange/80 bg-orange/10 border-orange/20',
  no_response: 'text-white/30 bg-white/5 border-white/10',
  ghosted: 'text-white/20 bg-white/5 border-white/5',
  phone_screen: 'text-yellow-400/80 bg-yellow-400/10 border-yellow-400/20',
  master: 'text-purple-400/80 bg-purple-400/10 border-purple-400/20',
}

function extractMeta(notes: string | null | undefined): { lang?: string; location?: string; notesText?: string } {
  if (!notes) return {}
  const parts = notes.split(' | ')
  let lang: string | undefined
  let location: string | undefined
  const otherParts: string[] = []
  for (const part of parts) {
    if (part.startsWith('Lang: ')) lang = part.replace('Lang: ', '')
    else if (part.startsWith('Location: ')) location = part.replace('Location: ', '')
    else if (!part.startsWith('Industry: ')) otherParts.push(part)
  }
  return { lang, location, notesText: otherParts.join(' | ') || undefined }
}

function StatPill({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className={`flex items-center justify-between px-4 py-2 rounded-xl bg-white/5 border border-white/10`}>
      <span className="text-white/50 text-xs">{label}</span>
      <span className={`text-sm font-bold ${color}`}>{value}</span>
    </div>
  )
}

// ── Mini summary bar ──────────────────────────────────────────────────────────

function CvMiniStats({ apps, t }: { apps: Application[]; t: ReturnType<typeof useLanguage>['t'] }) {
  const byStatus = useMemo(() => {
    const map: Record<string, number> = {}
    for (const a of apps) {
      map[a.status] = (map[a.status] ?? 0) + 1
    }
    return map
  }, [apps])

  const byLang = useMemo(() => {
    const map: Record<string, number> = {}
    for (const a of apps) {
      const { lang } = extractMeta(a.notes)
      if (lang) map[lang] = (map[lang] ?? 0) + 1
    }
    return map
  }, [apps])

  const STATUS_DISPLAY: Record<string, { label: string; color: string }> = {
    applied: { label: t.charts.statusApplied, color: 'text-lime' },
    response: { label: t.charts.statusResponse, color: 'text-electric-blue' },
    interview: { label: t.charts.statusInterview, color: 'text-hot-pink' },
    offer: { label: t.charts.statusOffer, color: 'text-vibrant-green' },
    rejected: { label: t.charts.statusRejected, color: 'text-orange' },
    no_response: { label: t.charts.statusNoResponse, color: 'text-white/40' },
    ghosted: { label: t.charts.statusGhosted, color: 'text-white/20' },
    phone_screen: { label: t.charts.statusPhoneScreen, color: 'text-yellow-400' },
    master: { label: t.charts.statusMaster, color: 'text-purple-400' },
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {/* By Status */}
      <div className="glass-card p-4 space-y-2">
        <p className="text-white/40 text-xs uppercase tracking-wider mb-3">{t.cvCatalog.statByStatus}</p>
        {Object.entries(byStatus).map(([status, count]) => (
          <StatPill
            key={status}
            label={STATUS_DISPLAY[status]?.label ?? status}
            value={count}
            color={STATUS_DISPLAY[status]?.color ?? 'text-white'}
          />
        ))}
      </div>

      {/* By Language */}
      <div className="glass-card p-4 space-y-2">
        <p className="text-white/40 text-xs uppercase tracking-wider mb-3">{t.cvCatalog.statByLanguage}</p>
        {Object.entries(byLang).map(([lang, count]) => (
          <StatPill
            key={lang}
            label={lang}
            value={count}
            color={lang === 'FR' ? 'text-lime' : 'text-electric-blue'}
          />
        ))}
        {Object.keys(byLang).length === 0 && (
          <p className="text-white/20 text-xs">—</p>
        )}
      </div>

      {/* Total sent */}
      <div className="glass-card p-4 flex flex-col items-center justify-center">
        <p className="text-5xl font-black text-lime">{apps.length}</p>
        <p className="text-white/40 text-sm mt-2">{t.kpi.resumesSent}</p>
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export function CvCatalog({ applications }: { applications: Application[] }) {
  const { t } = useLanguage()
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [langFilter, setLangFilter] = useState<string>('all')

  // Only show applications that have Lang metadata (imported from cv_catalog)
  // or all if none have it — graceful fallback
  const catalogApps = useMemo(() => {
    const withMeta = applications.filter(a => extractMeta(a.notes).lang !== undefined)
    return withMeta.length > 0 ? withMeta : applications
  }, [applications])

  const availableLangs = useMemo(() => {
    const langs = new Set<string>()
    for (const a of catalogApps) {
      const { lang } = extractMeta(a.notes)
      if (lang) langs.add(lang)
    }
    return Array.from(langs).sort()
  }, [catalogApps])

  const filtered = useMemo(() => {
    return catalogApps.filter(a => {
      if (statusFilter !== 'all' && a.status !== statusFilter) return false
      if (langFilter !== 'all') {
        const { lang } = extractMeta(a.notes)
        if (lang !== langFilter) return false
      }
      return true
    })
  }, [catalogApps, statusFilter, langFilter])

  const STATUS_OPTIONS: { value: string; label: string }[] = [
    { value: 'all', label: t.cvCatalog.filterAll },
    { value: 'applied', label: t.charts.statusApplied },
    { value: 'response', label: t.charts.statusResponse },
    { value: 'interview', label: t.charts.statusInterview },
    { value: 'offer', label: t.charts.statusOffer },
    { value: 'rejected', label: t.charts.statusRejected },
    { value: 'no_response', label: t.charts.statusNoResponse },
    { value: 'ghosted', label: t.charts.statusGhosted },
    { value: 'phone_screen', label: t.charts.statusPhoneScreen },
    { value: 'master', label: t.charts.statusMaster },
  ]

  if (applications.length === 0) {
    return (
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold mb-2 text-white">{t.cvCatalog.title}</h3>
        <p className="text-white/30 text-sm">{t.cvCatalog.empty}</p>
      </div>
    )
  }

  return (
    <div className="glass-card p-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">{t.cvCatalog.title}</h3>
          <p className="text-white/40 text-sm mt-0.5">{t.cvCatalog.subtitle}</p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-white/5 border border-white/10 focus:border-lime/50 rounded-xl px-3 py-1.5 text-white/70 text-xs outline-none transition-colors"
          >
            {STATUS_OPTIONS.map(o => (
              <option key={o.value} value={o.value} className="bg-black">{t.cvCatalog.filterStatus}: {o.label}</option>
            ))}
          </select>

          {/* Language filter */}
          {availableLangs.length > 0 && (
            <select
              value={langFilter}
              onChange={e => setLangFilter(e.target.value)}
              className="bg-white/5 border border-white/10 focus:border-lime/50 rounded-xl px-3 py-1.5 text-white/70 text-xs outline-none transition-colors"
            >
              <option value="all" className="bg-black">{t.cvCatalog.filterLanguage}: {t.cvCatalog.filterAll}</option>
              {availableLangs.map(l => (
                <option key={l} value={l} className="bg-black">{t.cvCatalog.filterLanguage}: {l}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Mini stats */}
      <CvMiniStats apps={catalogApps} t={t} />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              {[
                t.cvCatalog.colCompany,
                t.cvCatalog.colRole,
                t.cvCatalog.colDate,
                t.cvCatalog.colLanguage,
                t.cvCatalog.colLocation,
                t.cvCatalog.colStatus,
                t.cvCatalog.colNotes,
              ].map(col => (
                <th key={col} className="text-left py-3 px-3 text-white/40 font-medium text-xs uppercase tracking-wider">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((app, i) => {
              const { lang, location, notesText } = extractMeta(app.notes)
              const colorClass = STATUS_COLORS[app.status] ?? STATUS_COLORS.no_response
              return (
                <motion.tr
                  key={app.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.3) }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-2.5 px-3 text-white font-medium">{app.company}</td>
                  <td className="py-2.5 px-3 text-white/70 max-w-[160px] truncate">{app.role}</td>
                  <td className="py-2.5 px-3 text-white/50 whitespace-nowrap">{app.date_sent}</td>
                  <td className="py-2.5 px-3">
                    {lang ? (
                      <span className={`px-2 py-0.5 rounded-full text-xs border font-bold ${lang === 'FR' ? 'text-lime/80 bg-lime/10 border-lime/20' : 'text-electric-blue/80 bg-electric-blue/10 border-electric-blue/20'}`}>
                        {lang}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="py-2.5 px-3 text-white/50">{location ?? '—'}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs border capitalize ${colorClass}`}>
                      {app.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-white/30 max-w-[200px] truncate text-xs">{notesText ?? '—'}</td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center py-8 text-white/30 text-sm">{t.cvCatalog.empty}</p>
        )}
        {filtered.length > 0 && (
          <p className="text-right text-white/20 text-xs mt-3">{filtered.length} résultats</p>
        )}
      </div>
    </div>
  )
}
