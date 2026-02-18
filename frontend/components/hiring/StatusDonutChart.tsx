'use client'

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { ApplicationStatus, DashboardStats } from '@/lib/api'

const STATUS_COLORS: Record<string, string> = {
  applied: '#CDFF00',
  response: '#00FFFF',
  interview: '#FF00FF',
  offer: '#00FF66',
  rejected: '#FF6B00',
  no_response: 'rgba(255,255,255,0.2)',
}

const STATUS_LABELS: Record<string, string> = {
  applied: 'Applied',
  response: 'Response',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected',
  no_response: 'No Response',
}

const TOOLTIP_STYLE = {
  background: 'rgba(0,0,0,0.85)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '13px',
}

export function StatusDonutChart({ data }: { data: DashboardStats['status_breakdown'] }) {
  const chartData = Object.entries(data)
    .map(([key, value]) => ({
      name: STATUS_LABELS[key] ?? key,
      value: value ?? 0,
      color: STATUS_COLORS[key] ?? '#888',
    }))
    .filter(d => d.value > 0)

  if (chartData.length === 0) {
    return (
      <div className="glass-card p-6 flex flex-col items-center justify-center h-full min-h-[280px]">
        <h3 className="text-lg font-bold mb-2 text-white">Application Status Breakdown</h3>
        <p className="text-white/30 text-sm">No data yet</p>
      </div>
    )
  }

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-bold mb-6 text-white">Application Status Breakdown</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={52}
            outerRadius={88}
            dataKey="value"
            paddingAngle={3}
          >
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <Legend
            formatter={(value) => (
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
