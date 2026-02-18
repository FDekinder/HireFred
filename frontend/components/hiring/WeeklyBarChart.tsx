'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { WeeklyDataPoint } from '@/lib/api'

const TOOLTIP_STYLE = {
  background: 'rgba(0,0,0,0.85)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '13px',
}

export function WeeklyBarChart({ data }: { data: WeeklyDataPoint[] }) {
  const maxVal = Math.max(...data.map(d => d.count), 1)

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-bold mb-6 text-white">Resumes Sent per Week</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="week"
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
            tickFormatter={(w: string) => {
              const parts = w.split('-W')
              return parts[1] ? `W${parts[1]}` : w
            }}
          />
          <YAxis
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
            allowDecimals={false}
            domain={[0, maxVal + 1]}
          />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Resumes">
            {data.map((_, i) => (
              <Cell
                key={i}
                fill={i === data.length - 1 ? '#CDFF00' : 'rgba(205,255,0,0.35)'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
