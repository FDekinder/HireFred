'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '../ui/Button'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-24">
      <div className="max-w-5xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-8"
        >
          <Sparkles className="w-4 h-4 text-primary-400" />
          <span className="text-sm text-primary-300">Now with AI-powered summaries</span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold leading-tight mb-6"
        >
          Beautiful{' '}
          <span className="gradient-text">Release Notes</span>
          <br />
          Your Users Will Love
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-xl text-white/60 max-w-2xl mx-auto mb-12"
        >
          Create stunning changelogs and release notes in minutes. Keep your users
          informed with animated, shareable updates that showcase your progress.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/register">
            <Button size="lg" className="group">
              Start for Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/changelog">
            <Button variant="secondary" size="lg">
              View Demo
            </Button>
          </Link>
        </motion.div>

        {/* Preview Window */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
          <div className="glass-card p-2 md:p-4 overflow-hidden">
            <div className="bg-black/40 rounded-xl overflow-hidden">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 rounded-lg bg-white/5 text-sm text-white/50">
                    app.releasenotehub.com
                  </div>
                </div>
              </div>
              {/* Content preview */}
              <div className="p-6 md:p-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium">
                    v2.4.0
                  </div>
                  <span className="text-white/40 text-sm">January 30, 2025</span>
                </div>
                <h3 className="text-2xl font-bold text-white">Major Performance Update</h3>
                <div className="space-y-2 text-white/60">
                  <p>We've completely rewritten our rendering engine for 10x faster load times.</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="px-2 py-1 rounded bg-primary-500/20 text-primary-300 text-xs">Performance</span>
                    <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-300 text-xs">New Feature</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
