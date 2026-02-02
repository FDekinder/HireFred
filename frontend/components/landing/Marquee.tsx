'use client'

import { motion } from 'framer-motion'

const words = [
  'HIRE ME',
  'I AM OBVIOUSLY AWESOME',
  'VUE.JS 3',
  'TYPESCRIPT',
  'PYTHON',
  'FASTAPI',
  'REACT (LEARNING)',
  'HIRE ME',
  'I AM OBVIOUSLY AWESOME',
]

export function Marquee() {
  return (
    <div className="py-8 overflow-hidden border-y-4 border-black bg-black">
      <div className="flex whitespace-nowrap">
        <motion.div
          className="flex gap-8 items-center"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          {[...words, ...words].map((word, i) => (
            <span
              key={i}
              className="text-2xl md:text-4xl font-black text-sunny-yellow flex items-center gap-8"
            >
              {word}
              <span className="text-hot-pink">★</span>
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
