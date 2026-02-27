'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Users, Code2, MessageCircle, Crown, BarChart2, TrendingUp } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'

export function CsmFeatures() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { t } = useLanguage()

  const features = [
    { icon: Users, title: t.csm.card1Title, description: t.csm.card1Desc, color: 'bg-black', textColor: 'text-sunny-yellow' },
    { icon: Code2, title: t.csm.card2Title, description: t.csm.card2Desc, color: 'bg-hot-pink', textColor: 'text-white' },
    { icon: MessageCircle, title: t.csm.card3Title, description: t.csm.card3Desc, color: 'bg-electric-blue', textColor: 'text-black' },
    { icon: Crown, title: t.csm.card4Title, description: t.csm.card4Desc, color: 'bg-vibrant-green', textColor: 'text-black' },
    { icon: BarChart2, title: t.csm.card5Title, description: t.csm.card5Desc, color: 'bg-black', textColor: 'text-white' },
    { icon: TrendingUp, title: t.csm.card6Title, description: t.csm.card6Desc, color: 'bg-hot-pink', textColor: 'text-white' },
  ]

  return (
    <section id="features" className="py-32 px-6" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-black/10 border-2 border-black/20 text-black/70 text-sm font-medium mb-6">
            {t.csm.featBadge}
          </span>
          <h2 className="text-5xl md:text-7xl font-black text-black mb-6">
            {t.csm.featHeading1}
            <br />
            <span className="text-hot-pink">{t.csm.featHeading2}</span>
          </h2>
          <p className="text-xl text-black/60 max-w-2xl mx-auto">
            {t.csm.featSubtitle}
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`${feature.color} ${feature.textColor} p-8 rounded-3xl relative overflow-hidden group cursor-pointer`}
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                <feature.icon className="w-7 h-7" />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="opacity-80 font-medium leading-relaxed">{feature.description}</p>

              {/* Decorative */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-white/10 group-hover:scale-150 transition-transform duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
