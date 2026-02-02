'use client'

import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { Quote, RefreshCw, Loader2 } from 'lucide-react'
import { portfolioApi, Testimonial } from '@/lib/api'

export function Testimonials() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadTestimonials()
  }, [])

  useEffect(() => {
    if (testimonials.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [testimonials.length])

  async function loadTestimonials() {
    try {
      setLoading(true)
      const data = await portfolioApi.getTestimonials()
      setTestimonials(data.testimonials)
      setError(null)
    } catch {
      setError('Backend not connected - start it with: uvicorn app.main:app --reload')
    } finally {
      setLoading(false)
    }
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section className="py-24 px-6 bg-black/5" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/10 border-2 border-black/20 text-black/70 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-vibrant-green animate-pulse" />
            Live from Backend API
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-black mb-4">
            what they say
            <br />
            <span className="text-hot-pink">about my work</span>
          </h2>
          <p className="text-black/60">
            Real achievements, fetched dynamically from the API. Refresh to shuffle!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="bg-black rounded-3xl p-8 md:p-12 min-h-[280px] flex flex-col justify-center">
            {loading ? (
              <div className="flex flex-col items-center justify-center gap-4 text-white/60">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p>Fetching from backend...</p>
              </div>
            ) : error ? (
              <div className="text-center">
                <p className="text-hot-pink mb-4">{error}</p>
                <button
                  onClick={loadTestimonials}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-hot-pink text-white rounded-full hover:bg-sunny-yellow hover:text-black transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry
                </button>
              </div>
            ) : currentTestimonial ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <Quote className="w-12 h-12 text-hot-pink mx-auto mb-6" />
                  <p className="text-xl md:text-2xl text-white font-medium mb-8 leading-relaxed">
                    "{currentTestimonial.quote}"
                  </p>
                  <div>
                    <p className="text-sunny-yellow font-bold">{currentTestimonial.author}</p>
                    <p className="text-white/60 text-sm">
                      {currentTestimonial.role} @ {currentTestimonial.company}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : null}

            {/* Dots indicator */}
            {testimonials.length > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentIndex ? 'bg-hot-pink w-6' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Refresh button */}
          {!loading && !error && (
            <motion.button
              onClick={loadTestimonials}
              className="absolute -bottom-4 right-4 p-3 bg-sunny-yellow text-black rounded-full shadow-lg hover:bg-hot-pink hover:text-white transition-colors"
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
              title="Shuffle testimonials (API call)"
            >
              <RefreshCw className="w-5 h-5" />
            </motion.button>
          )}
        </motion.div>

        {/* API info badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <code className="text-xs bg-black/10 px-3 py-1 rounded-full text-black/50">
            GET /api/portfolio/testimonials
          </code>
        </motion.div>
      </div>
    </section>
  )
}
