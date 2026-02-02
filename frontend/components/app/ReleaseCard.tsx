'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Edit2, Trash2, Eye, EyeOff } from 'lucide-react'
import { format } from 'date-fns'
import { Release } from '@/lib/api'

interface ReleaseCardProps {
  release: Release
  onDelete?: (id: number) => void
  onTogglePublish?: (id: number, isPublished: boolean) => void
  index?: number
}

export function ReleaseCard({ release, onDelete, onTogglePublish, index = 0 }: ReleaseCardProps) {
  const isPublished = release.visibility === 'published'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="glass-card p-6 group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                isPublished
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-yellow-500/20 text-yellow-400'
              }`}
            >
              {release.version}
            </span>
            <span
              className={`px-2 py-0.5 rounded text-xs ${
                isPublished
                  ? 'bg-green-500/10 text-green-400/80'
                  : 'bg-white/5 text-white/50'
              }`}
            >
              {isPublished ? 'Published' : 'Draft'}
            </span>
          </div>

          <h3 className="text-lg font-semibold text-white truncate mb-1">
            {release.title}
          </h3>

          <p className="text-sm text-white/50">
            {isPublished && release.published_at
              ? `Published ${format(new Date(release.published_at), 'MMM d, yyyy')}`
              : `Created ${format(new Date(release.created_at), 'MMM d, yyyy')}`}
          </p>

          {release.content_md && (
            <p className="text-sm text-white/40 mt-2 line-clamp-2">
              {release.content_md.substring(0, 150)}
              {release.content_md.length > 150 ? '...' : ''}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onTogglePublish?.(release.id, isPublished)}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            title={isPublished ? 'Unpublish' : 'Publish'}
          >
            {isPublished ? (
              <EyeOff className="w-4 h-4 text-white/60" />
            ) : (
              <Eye className="w-4 h-4 text-white/60" />
            )}
          </button>

          <Link
            href={`/app/releases/${release.id}/edit`}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            title="Edit"
          >
            <Edit2 className="w-4 h-4 text-white/60" />
          </Link>

          <button
            onClick={() => onDelete?.(release.id)}
            className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4 text-white/60 hover:text-red-400" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
