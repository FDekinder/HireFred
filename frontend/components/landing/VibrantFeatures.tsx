'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Code2, Server, Database, Zap, Users, Brain } from 'lucide-react'

const features = [
  {
    icon: Code2,
    title: 'Frontend Wizard',
    description: 'Vue.js 3, TypeScript, React (learning fast!) — I build UIs that users actually enjoy. Component architecture is my jam.',
    color: 'bg-black',
    textColor: 'text-sunny-yellow',
  },
  {
    icon: Server,
    title: 'Backend Beast',
    description: 'Python, FastAPI, Node.js — REST APIs that respond 40% faster because I actually optimize them. Yes, really.',
    color: 'bg-hot-pink',
    textColor: 'text-white',
  },
  {
    icon: Database,
    title: 'Database Whisperer',
    description: 'PostgreSQL, MySQL, SQL Server — I cut query times by 50%. Your database will thank me. (Databases can\'t talk, but you get it.)',
    color: 'bg-electric-blue',
    textColor: 'text-black',
  },
  {
    icon: Zap,
    title: 'Real-Time Expert',
    description: 'Built WebSocket systems handling 1,000+ daily sessions with zero data loss. Collaboration tools that actually collaborate!',
    color: 'bg-black',
    textColor: 'text-white',
  },
  {
    icon: Users,
    title: 'Team Player',
    description: 'Reviewed 100+ PRs, mentored devs, and maintained 95%+ sprint completion. I make teams better (and meetings shorter).',
    color: 'bg-vibrant-green',
    textColor: 'text-black',
  },
  {
    icon: Brain,
    title: 'AI Enthusiast',
    description: 'Built an AI chatbot that reduced support queries by 40%. LLM integration, prompt engineering — the future is now, and I\'m ready.',
    color: 'bg-hot-pink',
    textColor: 'text-white',
  },
]

export function VibrantFeatures() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

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
            Why Hire Me?
          </span>
          <h2 className="text-5xl md:text-7xl font-black text-black mb-6">
            skills that
            <br />
            <span className="text-hot-pink">actually ship</span>
          </h2>
          <p className="text-xl text-black/60 max-w-2xl mx-auto">
            Battle-tested with zero critical incidents. My secret weapons? An insatiable hunger to learn, extensive management experience, and years of theatrical improv — because debugging is basically "yes, and..." for code. 🎭
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
