'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '../ui/Button'

export function CTA() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card p-12 md:p-16 text-center relative overflow-hidden"
        >
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 via-transparent to-purple-500/20 pointer-events-none" />

          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Ready to ship better updates?
            </h2>
            <p className="text-xl text-white/60 max-w-xl mx-auto mb-8">
              Join hundreds of teams already using ReleaseNoteHub to keep their users in the loop.
            </p>
            <Link href="/register">
              <Button size="lg" className="group">
                Get Started for Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <p className="mt-4 text-sm text-white/40">No credit card required</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
