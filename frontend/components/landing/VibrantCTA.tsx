'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight, Sparkles, Mail, Phone, MapPin } from 'lucide-react'

export function VibrantCTA() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-32 px-6" ref={ref}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto"
      >
        <div className="relative bg-black rounded-[3rem] p-12 md:p-20 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute -top-20 -right-20 w-60 h-60 bg-hot-pink/20 rounded-full"
              animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute -bottom-10 -left-10 w-40 h-40 bg-sunny-yellow/20 rounded-full"
              animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          {/* Content */}
          <div className="relative text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sunny-yellow/20 text-sunny-yellow text-sm font-semibold mb-8"
            >
              <Sparkles className="w-4 h-4" />
              Available Immediately
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight"
            >
              let's build
              <br />
              <span className="text-sunny-yellow">something awesome!</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-xl text-white/60 mb-10 max-w-xl mx-auto"
            >
              I speak French (natively) and English (professionally). I work hybrid, remote, or on-site.
              Basically, I'm flexible like a yoga instructor who codes.
            </motion.p>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="flex flex-wrap justify-center gap-6 mb-10 text-white/80"
            >
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-hot-pink" />
                <span>frederick.de.kinder@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-hot-pink" />
                <span>514-585-7331</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-hot-pink" />
                <span>Montreal, QC</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <a href="mailto:frederick.de.kinder@gmail.com">
                <motion.button
                  className="group inline-flex items-center gap-3 px-10 py-5 bg-sunny-yellow text-black font-bold text-xl rounded-full hover:bg-hot-pink hover:text-white transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Hire Me Now!
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </a>
              <a href="https://linkedin.com/in/frederick-de-kinder" target="_blank" rel="noopener noreferrer">
                <motion.button
                  className="group inline-flex items-center gap-3 px-10 py-5 border-2 border-sunny-yellow text-sunny-yellow font-bold text-xl rounded-full hover:bg-sunny-yellow hover:text-black transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  LinkedIn
                </motion.button>
              </a>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
