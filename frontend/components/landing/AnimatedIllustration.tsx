'use client'

import { motion } from 'framer-motion'

export function AnimatedIllustration() {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Main floating container */}
      <motion.div
        className="relative"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Glow effect behind */}
        <div className="absolute inset-0 bg-gradient-to-r from-lime/30 via-electric-blue/30 to-hot-pink/30 blur-3xl scale-110" />

        {/* Main app window */}
        <motion.div
          className="relative bg-[#111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {/* Window header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
            <div className="flex gap-1.5">
              <motion.div
                className="w-3 h-3 rounded-full bg-red-500"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0 }}
              />
              <motion.div
                className="w-3 h-3 rounded-full bg-yellow-500"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="w-3 h-3 rounded-full bg-green-500"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
              />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="px-4 py-1 bg-white/5 rounded-lg text-xs text-white/40">
                releasenotehub.com
              </div>
            </div>
          </div>

          {/* App content */}
          <div className="p-6 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <motion.div
                className="h-8 w-32 bg-lime rounded-lg"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="h-8 w-24 bg-white/10 rounded-full"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
            </div>

            {/* Release cards */}
            {[
              { color: 'bg-hot-pink', version: 'v2.4.0', delay: 0 },
              { color: 'bg-electric-blue', version: 'v2.3.0', delay: 0.2 },
              { color: 'bg-vibrant-green', version: 'v2.2.0', delay: 0.4 },
            ].map((card, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + card.delay }}
              >
                <motion.div
                  className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center`}
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: card.delay }}
                >
                  <span className="text-black font-bold text-xs">{card.version}</span>
                </motion.div>
                <div className="flex-1 space-y-2">
                  <motion.div
                    className="h-4 bg-white/20 rounded-full"
                    style={{ width: `${80 - i * 15}%` }}
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity, delay: card.delay }}
                  />
                  <motion.div
                    className="h-3 bg-white/10 rounded-full"
                    style={{ width: `${60 - i * 10}%` }}
                    animate={{ opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: card.delay }}
                  />
                </div>
                <motion.div
                  className="w-8 h-8 bg-lime/20 rounded-full flex items-center justify-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: card.delay }}
                >
                  <svg className="w-4 h-4 text-lime" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              </motion.div>
            ))}

            {/* Bottom action */}
            <motion.div
              className="flex justify-center pt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.5 }}
            >
              <motion.div
                className="px-6 py-3 bg-lime text-black font-bold rounded-full text-sm"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                + New Release
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating elements around the illustration */}
      <motion.div
        className="absolute -top-6 -right-6 w-16 h-16 bg-lime rounded-2xl"
        animate={{
          rotate: [0, 15, 0, -15, 0],
          y: [0, -10, 0],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-4 -left-4 w-12 h-12 bg-hot-pink rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          y: [0, 10, 0],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/2 -right-8 w-8 h-8 bg-electric-blue rounded-lg"
        animate={{
          rotate: 360,
          x: [0, 10, 0],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute -top-2 left-1/4 w-6 h-6 bg-sunny-yellow rounded-full"
        animate={{ y: [-5, 10, -5] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
