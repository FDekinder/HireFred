'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/lib/i18n/context'

const COLORS = [
  { accent: 'text-hot-pink', border: 'border-hot-pink/30', bg: 'bg-hot-pink/10', dot: 'bg-hot-pink' },
  { accent: 'text-sunny-yellow', border: 'border-sunny-yellow/30', bg: 'bg-sunny-yellow/10', dot: 'bg-sunny-yellow' },
  { accent: 'text-electric-blue', border: 'border-electric-blue/30', bg: 'bg-electric-blue/10', dot: 'bg-electric-blue' },
  { accent: 'text-vibrant-green', border: 'border-vibrant-green/30', bg: 'bg-vibrant-green/10', dot: 'bg-vibrant-green' },
]

export function CsmTimeline() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { t } = useLanguage()

  const entries = [
    { company: t.csm.tl1Company, period: t.csm.tl1Period, role: t.csm.tl1Role, desc: t.csm.tl1Desc },
    { company: t.csm.tl2Company, period: t.csm.tl2Period, role: t.csm.tl2Role, desc: t.csm.tl2Desc },
    { company: t.csm.tl3Company, period: t.csm.tl3Period, role: t.csm.tl3Role, desc: t.csm.tl3Desc },
    { company: t.csm.tl4Company, period: t.csm.tl4Period, role: t.csm.tl4Role, desc: t.csm.tl4Desc },
  ]

  return (
    <section className="py-24 px-6 bg-black" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            {t.csm.timelineTitle}
            <span className="text-hot-pink"> {t.csm.timelineSubtitle}</span>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-white/10" />

          <div className="space-y-8">
            {entries.map((entry, index) => {
              const c = COLORS[index]
              return (
                <motion.div
                  key={entry.company}
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="relative pl-20"
                >
                  {/* Timeline dot */}
                  <div className={`absolute left-6 top-6 w-4 h-4 rounded-full ${c.dot} border-4 border-black`} />

                  <div className={`${c.bg} border ${c.border} rounded-3xl p-6`}>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                      <div>
                        <h3 className={`text-xl font-black ${c.accent}`}>{entry.company}</h3>
                        <p className="text-white/70 font-semibold">{entry.role}</p>
                      </div>
                      <span className="text-white/40 text-sm font-mono whitespace-nowrap">{entry.period}</span>
                    </div>
                    <p className="text-white/60 leading-relaxed">{entry.desc}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
