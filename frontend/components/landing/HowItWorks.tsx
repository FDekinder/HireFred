'use client'

import { motion } from 'framer-motion'

const steps = [
  {
    number: '01',
    title: 'Create an account',
    description: 'Sign up in seconds with just your email. No credit card required.',
  },
  {
    number: '02',
    title: 'Write your release',
    description: 'Use our beautiful markdown editor to craft your release notes with live preview.',
  },
  {
    number: '03',
    title: 'Publish & Share',
    description: 'Hit publish and instantly share your changelog with a unique, branded URL.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How it <span className="gradient-text">works</span>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Get started in minutes, not hours. Our simple workflow gets you from idea to published changelog fast.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-px bg-gradient-to-r from-primary-500/50 to-transparent" />
              )}

              <div className="glass-card p-8 relative">
                <div className="text-6xl font-bold text-primary-500/20 mb-4">{step.number}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-white/60">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
