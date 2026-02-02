'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Share2, Zap, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import { api, ReleasePublic } from '@/lib/api'
import { AnimatedBackground } from '@/components/landing/AnimatedBackground'
import toast from 'react-hot-toast'

function ReleaseItem({ release, index }: { release: ReleasePublic; index: number }) {
  const [isExpanded, setIsExpanded] = useState(index === 0)

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/changelog#${release.slug}`
    : ''

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${release.title} - v${release.version}`,
        url: shareUrl,
      })
    } else {
      navigator.clipboard.writeText(shareUrl)
      toast.success('Link copied to clipboard!')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      id={release.slug || undefined}
      className="relative"
    >
      {/* Timeline connector */}
      <div className="absolute left-6 top-12 bottom-0 w-px bg-gradient-to-b from-primary-500/50 to-transparent" />

      <div className="relative pl-16">
        {/* Timeline dot */}
        <div className="absolute left-4 top-4 w-5 h-5 rounded-full bg-primary-500 border-4 border-background" />

        {/* Card */}
        <div className="glass-card overflow-hidden">
          {/* Header */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full p-6 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 rounded-full bg-primary-500/20 text-primary-400 text-sm font-medium">
                v{release.version}
              </span>
              <div>
                <h3 className="text-lg font-semibold text-white">{release.title}</h3>
                {release.published_at && (
                  <p className="text-sm text-white/50">
                    {format(new Date(release.published_at), 'MMMM d, yyyy')}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleShare()
                }}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                title="Share"
              >
                <Share2 className="w-4 h-4 text-white/60" />
              </button>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-5 h-5 text-white/40" />
              </motion.div>
            </div>
          </button>

          {/* Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6 border-t border-white/10 pt-4">
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => (
                          <h1 className="text-xl font-bold text-white mt-4 mb-2">{children}</h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-lg font-semibold text-white mt-4 mb-2">{children}</h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-base font-semibold text-white mt-3 mb-2">{children}</h3>
                        ),
                        p: ({ children }) => (
                          <p className="text-white/70 mb-3">{children}</p>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc list-inside text-white/70 mb-3 space-y-1">{children}</ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal list-inside text-white/70 mb-3 space-y-1">{children}</ol>
                        ),
                        li: ({ children }) => (
                          <li className="text-white/70">{children}</li>
                        ),
                        code: ({ children }) => (
                          <code className="px-1.5 py-0.5 rounded bg-white/10 text-primary-300 text-sm">
                            {children}
                          </code>
                        ),
                        pre: ({ children }) => (
                          <pre className="p-4 rounded-lg bg-black/30 overflow-x-auto mb-3">
                            {children}
                          </pre>
                        ),
                        a: ({ href, children }) => (
                          <a href={href} className="text-primary-400 hover:text-primary-300 underline">
                            {children}
                          </a>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-4 border-primary-500 pl-4 italic text-white/60 my-3">
                            {children}
                          </blockquote>
                        ),
                      }}
                    >
                      {release.content_md || 'No content yet.'}
                    </ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

export default function ChangelogPage() {
  const { data: releases, isLoading } = useQuery({
    queryKey: ['public-releases'],
    queryFn: () => api.getPublicReleases(),
  })

  return (
    <main className="min-h-screen bg-background">
      <AnimatedBackground />

      {/* Header */}
      <header className="relative z-10 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4 mb-4"
          >
            <div className="w-12 h-12 rounded-xl bg-primary-500 flex items-center justify-center">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Changelog</h1>
              <p className="text-white/60">All the latest updates and improvements</p>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Timeline */}
      <section className="relative z-10 px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="pl-16 relative">
                  <div className="absolute left-4 top-4 w-5 h-5 rounded-full skeleton" />
                  <div className="glass-card p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-20 h-7 skeleton rounded-full" />
                      <div className="w-48 h-6 skeleton rounded" />
                    </div>
                    <div className="w-32 h-4 skeleton rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : releases && releases.length > 0 ? (
            <div className="space-y-6">
              {releases.map((release, index) => (
                <ReleaseItem key={release.id} release={release} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-12 text-center"
            >
              <p className="text-white/60">No releases published yet. Check back soon!</p>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  )
}
