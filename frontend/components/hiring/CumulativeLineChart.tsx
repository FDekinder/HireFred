'use client'

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { CumulativeDataPoint } from '@/lib/api'

const TOOLTIP_STYLE = {
  background: 'rgba(0,0,0,0.85)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '13px',
}

export function CumulativeLineChart({ data }: { data: CumulativeDataPoint[] }) {
  // Sample down to ~20 points for readability
  const displayData = data.length > 20
    ? data.filter((_, i) => i % Math.ceil(data.length / 20) === 0 || i === data.length - 1)
    : data

  if (displayData.length === 0) {
    return (
      <div className="glass-card p-6 flex flex-col items-center justify-center h-full min-h-[280px]">
        <h3 className="text-lg font-bold mb-2 text-white">Cumulative Applications</h3>
        <p className="text-white/30 text-sm">No data yet</p>
      </div>
    )
  }

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-bold mb-6 text-white">Cumulative Applications</h3>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={displayData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="cumulativeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00FFFF" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#00FFFF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
            tickFormatter={(d: string) => d.slice(5)}
          />
          <YAxis
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
            allowDecimals={false}
          />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ stroke: 'rgba(0,255,255,0.3)' }} />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#00FFFF"
            strokeWidth={2}
            fill="url(#cumulativeGrad)"
            name="Total Sent"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
