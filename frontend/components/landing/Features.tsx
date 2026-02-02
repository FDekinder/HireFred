'use client'

import { motion } from 'framer-motion'
import { Edit3, Globe, Zap, Lock, Palette, Share2 } from 'lucide-react'

const features = [
  {
    icon: Edit3,
    title: 'Markdown Editor',
    description: 'Write your release notes in beautiful markdown with live preview. No coding required.',
  },
  {
    icon: Globe,
    title: 'Public Changelog',
    description: 'Share your progress with a beautiful, animated public changelog page.',
  },
  {
    icon: Zap,
    title: 'Instant Publishing',
    description: 'Go from draft to published in one click. No build process, no waiting.',
  },
  {
    icon: Lock,
    title: 'Secure & Private',
    description: 'Your drafts stay private until you decide to publish them.',
  },
  {
    icon: Palette,
    title: 'Stunning Design',
    description: 'Beautiful out of the box. Dark mode, animations, and modern styling.',
  },
  {
    icon: Share2,
    title: 'Easy Sharing',
    description: 'Share individual releases or your full changelog with a unique URL.',
  },
]

export function Features() {
  return (
    <section id="features" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything you need to{' '}
            <span className="gradient-text">ship updates</span>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            A complete toolkit for creating and sharing your product updates with your users.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card-hover p-6"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-white/60">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
