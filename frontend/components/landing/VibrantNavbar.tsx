'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

function NavItem({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="px-4 py-2 font-medium transition-colors group relative"
    >
      {/* Text - visible by default, hidden on hover */}
      <span className="text-white/80 group-hover:opacity-0 transition-opacity">
        {children}
      </span>
      {/* Smiley - hidden by default, visible on hover */}
      <span className="text-sunny-yellow text-3xl absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        ☺
      </span>
    </a>
  )
}

export function VibrantNavbar() {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-3 bg-black"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div
            className="w-12 h-12 rounded-2xl bg-hot-pink flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Heart className="w-6 h-6 text-white" />
          </motion.div>
          <span id="frederick-name" className="text-2xl font-black tracking-tight relative">
            <span className="text-white group-hover:opacity-0 transition-opacity">Frederick</span>
            <span className="text-sunny-yellow text-4xl absolute inset-0 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">☺</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1">
          <NavItem href="#features">Skills</NavItem>
          <NavItem href="#how-it-works">Experience</NavItem>
          <NavItem href="https://linkedin.com/in/frederick-de-kinder">LinkedIn</NavItem>
        </div>

        {/* CTA buttons */}
        <div className="flex items-center gap-3">
          <a href="tel:514-585-7331">
            <motion.button
              className="px-5 py-2.5 font-semibold transition-colors group relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-white group-hover:opacity-0 transition-opacity">Call Me</span>
              <span className="text-sunny-yellow text-3xl absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">☺</span>
            </motion.button>
          </a>
          <a href="mailto:frederick.de.kinder@gmail.com">
            <motion.button
              className="px-6 py-2.5 bg-hot-pink text-white font-bold rounded-full hover:bg-sunny-yellow hover:text-black transition-colors group relative overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="group-hover:opacity-0 transition-opacity">Hire Me!</span>
              <span className="text-3xl absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">☺</span>
            </motion.button>
          </a>
        </div>
      </div>
    </motion.nav>
  )
}
