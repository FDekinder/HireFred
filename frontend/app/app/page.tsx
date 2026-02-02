'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Filter } from 'lucide-react'
import toast from 'react-hot-toast'
import { api, Release } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { ReleaseCard } from '@/components/app/ReleaseCard'
import { ReleaseSkeletonList } from '@/components/app/ReleaseSkeleton'
import { EmptyState } from '@/components/app/EmptyState'

type FilterType = 'all' | 'draft' | 'published'

export default function DashboardPage() {
  const [filter, setFilter] = useState<FilterType>('all')
  const queryClient = useQueryClient()

  const { data: releases, isLoading } = useQuery({
    queryKey: ['releases', filter],
    queryFn: () => api.getReleases(filter === 'all' ? undefined : filter),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.deleteRelease(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['releases'] })
      toast.success('Release deleted')
    },
    onError: () => {
      toast.error('Failed to delete release')
    },
  })

  const publishMutation = useMutation({
    mutationFn: ({ id, isPublished }: { id: number; isPublished: boolean }) =>
      isPublished ? api.unpublishRelease(id) : api.publishRelease(id),
    onSuccess: (_, { isPublished }) => {
      queryClient.invalidateQueries({ queryKey: ['releases'] })
      toast.success(isPublished ? 'Release unpublished' : 'Release published!')
    },
    onError: () => {
      toast.error('Failed to update release')
    },
  })

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this release?')) {
      deleteMutation.mutate(id)
    }
  }

  const handleTogglePublish = (id: number, isPublished: boolean) => {
    publishMutation.mutate({ id, isPublished })
  }

  const filters: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'draft', label: 'Drafts' },
    { value: 'published', label: 'Published' },
  ]

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Releases</h1>
          <p className="text-white/60 mt-1">Manage your release notes and changelogs</p>
        </div>

        <Link href="/app/releases/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Release
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-4 h-4 text-white/40" />
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              filter === f.value
                ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                : 'bg-white/5 text-white/60 hover:bg-white/10 border border-transparent'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <ReleaseSkeletonList count={3} />
      ) : releases && releases.length > 0 ? (
        <div className="space-y-4">
          {releases.map((release, index) => (
            <ReleaseCard
              key={release.id}
              release={release}
              index={index}
              onDelete={handleDelete}
              onTogglePublish={handleTogglePublish}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title={filter === 'all' ? 'No releases yet' : `No ${filter} releases`}
          description={
            filter === 'all'
              ? 'Create your first release to get started'
              : `You don't have any ${filter} releases yet`
          }
          showCTA={filter === 'all'}
        />
      )}
    </div>
  )
}
