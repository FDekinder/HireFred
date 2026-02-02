'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { FileText, Plus } from 'lucide-react'
import { Button } from '../ui/Button'

interface EmptyStateProps {
  title?: string
  description?: string
  showCTA?: boolean
}

export function EmptyState({
  title = 'No releases yet',
  description = 'Create your first release to get started',
  showCTA = true,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-12 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-primary-500/20 flex items-center justify-center mx-auto mb-6">
        <FileText className="w-8 h-8 text-primary-400" />
      </div>

      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-white/60 mb-6 max-w-sm mx-auto">{description}</p>

      {showCTA && (
        <Link href="/app/releases/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Release
          </Button>
        </Link>
      )}
    </motion.div>
  )
}
