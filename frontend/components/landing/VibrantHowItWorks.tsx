'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

function getSteps(company: string) {
  return [
    {
      number: '01',
      title: 'Big Data Dev',
      description: 'Jan 2022 - Dec 2022 @ Bell Canada. Analyzed 10M+ records, built AI chatbot with OpenAI, cut query times by 50%. Data nerd phase unlocked.',
      color: 'text-hot-pink',
      borderColor: 'border-black',
      bgColor: 'bg-black',
    },
    {
      number: '02',
      title: 'Full Stack Dev',
      description: 'Jan 2023 - Nov 2025 @ Bell Canada. 80+ features, 1,000+ daily users, zero incidents. Built real-time collab systems. Became a PR review machine.',
      color: 'text-sunny-yellow',
      borderColor: 'border-black',
      bgColor: 'bg-black',
    },
    {
      number: '03',
      title: `${company}?`,
      description: `Feb 2025 - ??? Your next awesome hire! Ready to build React/Node apps, review PRs, mentor devs, and make your Slack channels funnier. 🚀`,
      color: 'text-electric-blue',
      borderColor: 'border-black',
      bgColor: 'bg-black',
    },
  ]
}

export function VibrantHowItWorks({ company }: { company: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="how-it-works" className="py-32 px-6 bg-black/5" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-black/10 border-2 border-black/20 text-black/70 text-sm font-medium mb-6">
            My Journey
          </span>
          <h2 className="text-5xl md:text-7xl font-black text-black mb-6">
            experience
            <br />
            <span className="text-hot-pink">that delivers</span>
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-4">
          {getSteps(company).map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative"
            >
              {/* Connector line */}
              {index < getSteps(company).length - 1 && (
                <div className="hidden md:block absolute top-16 left-1/2 w-full h-px bg-gradient-to-r from-black/30 to-transparent" />
              )}

              <div className={`border-4 ${step.borderColor} rounded-3xl p-8 md:p-10 ${step.bgColor}`}>
                {/* Number */}
                <div className={`text-8xl md:text-9xl font-black ${step.color} opacity-30 leading-none mb-4`}>
                  {step.number}
                </div>

                {/* Content */}
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-lg text-white/70 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
