'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { portfolioApi, Skill } from '@/lib/api'

export function SkillBars() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [skills, setSkills] = useState<Skill[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [avgProficiency, setAvgProficiency] = useState(0)

  useEffect(() => {
    loadSkills()
  }, [selectedCategory])

  async function loadSkills() {
    try {
      setLoading(true)
      const data = await portfolioApi.getSkills(selectedCategory || undefined)
      setSkills(data.skills)
      setCategories(data.categories)
      setAvgProficiency(Math.round(data.average_proficiency))
    } catch {
      // Backend not available
      setSkills([])
    } finally {
      setLoading(false)
    }
  }

  const getBarColor = (level: number) => {
    if (level >= 90) return 'bg-vibrant-green'
    if (level >= 80) return 'bg-sunny-yellow'
    if (level >= 70) return 'bg-hot-pink'
    return 'bg-electric-blue'
  }

  return (
    <section className="py-24 px-6 bg-black" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border-2 border-white/20 text-white/70 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-sunny-yellow animate-pulse" />
            Dynamic Skill Data
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            skill
            <span className="text-hot-pink"> proficiency</span>
          </h2>
          <p className="text-white/60 mb-2">
            Filter by category — data fetched from API
          </p>
          {avgProficiency > 0 && (
            <p className="text-sunny-yellow font-bold">
              Average: {avgProficiency}%
            </p>
          )}
        </motion.div>

        {/* Category filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              !selectedCategory
                ? 'bg-sunny-yellow text-black'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-hot-pink text-white'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Skills list */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-white/60">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Loading from API...
            </div>
          ) : skills.length === 0 ? (
            <div className="text-center py-12 text-white/60">
              Backend not connected. Start it with: uvicorn app.main:app --reload
            </div>
          ) : (
            skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/5 rounded-2xl p-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-white font-bold">{skill.name}</span>
                    {skill.note && (
                      <span className="text-xs bg-hot-pink/20 text-hot-pink px-2 py-0.5 rounded-full">
                        {skill.note}
                      </span>
                    )}
                  </div>
                  <span className="text-white/60 text-sm">{skill.level}%</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${skill.level}%` } : {}}
                    transition={{ duration: 1, delay: index * 0.1, ease: 'easeOut' }}
                    className={`h-full ${getBarColor(skill.level)} rounded-full`}
                  />
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* API info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <code className="text-xs bg-white/10 px-3 py-1 rounded-full text-white/50">
            GET /api/portfolio/skills{selectedCategory ? `?category=${selectedCategory}` : ''}
          </code>
        </motion.div>
      </div>
    </section>
  )
}
