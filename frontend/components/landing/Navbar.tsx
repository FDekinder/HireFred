'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import { Button } from '../ui/Button'

export function Navbar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white">ReleaseNoteHub</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-white/70 hover:text-white transition-colors">
            Features
          </Link>
          <Link href="#how-it-works" className="text-white/70 hover:text-white transition-colors">
            How it Works
          </Link>
          <Link href="/changelog" className="text-white/70 hover:text-white transition-colors">
            Changelog
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" size="sm">Log in</Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </div>
    </motion.nav>
  )
}
