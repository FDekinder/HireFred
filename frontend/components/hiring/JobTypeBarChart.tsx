'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { JobType, DashboardStats } from '@/lib/api'

const COLORS: Record<string, string> = {
  fulltime: '#FF00FF',
  contract: '#CDFF00',
  freelance: '#00FFFF',
}

const LABELS: Record<string, string> = {
  fulltime: 'Full-Time',
  contract: 'Contract',
  freelance: 'Freelance',
}

const TOOLTIP_STYLE = {
  background: 'rgba(0,0,0,0.85)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '13px',
}

export function JobTypeBarChart({ data }: { data: DashboardStats['by_job_type'] }) {
  const chartData = Object.entries(data).map(([key, value]) => ({
    name: LABELS[key] ?? key,
    value: value ?? 0,
    color: COLORS[key] ?? '#888',
  }))

  if (chartData.length === 0) {
    return (
      <div className="glass-card p-6 flex flex-col items-center justify-center h-full min-h-[280px]">
        <h3 className="text-lg font-bold mb-2 text-white">Applications by Job Type</h3>
        <p className="text-white/30 text-sm">No data yet</p>
      </div>
    )
  }

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-bold mb-6 text-white">Applications by Job Type</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <XAxis
            type="number"
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
            allowDecimals={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
            width={80}
          />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} name="Applications">
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
