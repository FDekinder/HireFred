'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Download, Coffee, Sparkles, Code2, Zap, Heart } from 'lucide-react'

export function VibrantHero() {
  return (
    <section className="relative px-6 pt-28 pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left side - Text content */}
          <div className="text-center lg:text-left relative z-10">
            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-black/20 bg-black/10 mb-8"
            >
              <Sparkles className="w-4 h-4 text-hot-pink fill-hot-pink" />
              <span className="text-black font-semibold text-sm">Status: Available & Ready to Ship Code</span>
              <Coffee className="w-4 h-4 text-black" />
            </motion.div>

            {/* Giant headline */}
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter mb-8"
            >
              <span className="text-black">hey</span>
              <br />
              <span className="text-hot-pink">Volume7</span>
              <br />
              <span className="text-black">hire me!</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-lg md:text-xl text-black/70 max-w-lg mx-auto lg:mx-0 mb-10 font-medium"
            >
              I'm <span className="font-black text-black">Frederick De Kinder</span> — a Full Stack Developer
              who ships 80+ features with zero critical incidents. I turn coffee into clean code
              and deadlines into done deals. ☕→💻→🚀
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4"
            >
              <a href="mailto:frederick.de.kinder@gmail.com">
                <motion.button
                  className="group flex items-center gap-3 px-8 py-4 bg-black text-sunny-yellow font-bold text-lg rounded-full hover:bg-hot-pink hover:text-white transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Let's Talk!
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </a>
              <a href="https://linkedin.com/in/frederick-de-kinder" target="_blank" rel="noopener noreferrer">
                <motion.button
                  className="group flex items-center gap-3 px-8 py-4 border-2 border-black/30 text-black font-bold text-lg rounded-full hover:border-black hover:bg-black/10 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download className="w-5 h-5" />
                  LinkedIn
                </motion.button>
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-8 mt-12 pt-8 border-t border-black/10"
            >
              {[
                { value: '3+', label: 'Years Shipping Code' },
                { value: '80+', label: 'Features Deployed' },
                { value: '0', label: 'Critical Incidents 😎' },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="text-3xl md:text-4xl font-black text-black">{stat.value}</div>
                  <div className="text-black/50 font-medium text-sm">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right side - Animated Icons */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative lg:pl-8 flex items-center justify-center"
          >
            <div className="relative w-80 h-80">
              {/* Central icon */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-black rounded-3xl flex items-center justify-center"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Code2 className="w-16 h-16 text-sunny-yellow" />
              </motion.div>

              {/* Orbiting icons */}
              <motion.div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 bg-hot-pink rounded-2xl flex items-center justify-center"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Zap className="w-8 h-8 text-white" />
              </motion.div>

              <motion.div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-16 bg-black rounded-2xl flex items-center justify-center"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              >
                <Heart className="w-8 h-8 text-hot-pink" />
              </motion.div>

              <motion.div
                className="absolute top-1/2 left-0 -translate-y-1/2 w-16 h-16 bg-hot-pink/20 border-2 border-hot-pink rounded-2xl flex items-center justify-center"
                animate={{ x: [0, -10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Coffee className="w-8 h-8 text-black" />
              </motion.div>

              <motion.div
                className="absolute top-1/2 right-0 -translate-y-1/2 w-16 h-16 bg-black/10 border-2 border-black rounded-2xl flex items-center justify-center"
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
              >
                <Sparkles className="w-8 h-8 text-hot-pink" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background decorative shapes */}
      <motion.div
        className="absolute top-[15%] left-[3%] w-20 h-20 border-4 border-hot-pink rounded-full z-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute bottom-[20%] left-[5%] w-12 h-12 bg-hot-pink rounded-xl z-0"
        animate={{
          rotate: [0, 180, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-[30%] left-[8%] w-6 h-6 bg-black rounded-full z-0"
        animate={{ y: [-15, 15, -15] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
    </section>
  )
}
