'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Save, Send, Eye, EyeOff, Trash2 } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { MarkdownEditor } from '@/components/app/MarkdownEditor'

const releaseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  version: z.string().min(1, 'Version is required').max(50),
})

type ReleaseForm = z.infer<typeof releaseSchema>

export default function EditReleasePage() {
  const router = useRouter()
  const params = useParams()
  const releaseId = Number(params.id)
  const queryClient = useQueryClient()
  const [content, setContent] = useState('')

  const { data: release, isLoading } = useQuery({
    queryKey: ['release', releaseId],
    queryFn: () => api.getRelease(releaseId),
    enabled: !!releaseId,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ReleaseForm>({
    resolver: zodResolver(releaseSchema),
  })

  useEffect(() => {
    if (release) {
      reset({
        title: release.title,
        version: release.version,
      })
      setContent(release.content_md)
    }
  }, [release, reset])

  const updateMutation = useMutation({
    mutationFn: (data: { title?: string; version?: string; content_md?: string }) =>
      api.updateRelease(releaseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['release', releaseId] })
      queryClient.invalidateQueries({ queryKey: ['releases'] })
      toast.success('Release saved!')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to save')
    },
  })

  const publishMutation = useMutation({
    mutationFn: () => api.publishRelease(releaseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['release', releaseId] })
      queryClient.invalidateQueries({ queryKey: ['releases'] })
      toast.success('Release published!')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to publish')
    },
  })

  const unpublishMutation = useMutation({
    mutationFn: () => api.unpublishRelease(releaseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['release', releaseId] })
      queryClient.invalidateQueries({ queryKey: ['releases'] })
      toast.success('Release unpublished')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to unpublish')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => api.deleteRelease(releaseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['releases'] })
      toast.success('Release deleted')
      router.push('/app')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to delete')
    },
  })

  const onSave = handleSubmit((data) => {
    updateMutation.mutate({
      ...data,
      content_md: content,
    })
  })

  const onPublish = () => {
    handleSubmit((data) => {
      updateMutation.mutate(
        { ...data, content_md: content },
        { onSuccess: () => publishMutation.mutate() }
      )
    })()
  }

  const onUnpublish = () => {
    unpublishMutation.mutate()
  }

  const onDelete = () => {
    if (confirm('Are you sure you want to delete this release? This cannot be undone.')) {
      deleteMutation.mutate()
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!release) {
    return (
      <div className="text-center py-20">
        <p className="text-white/60">Release not found</p>
      </div>
    )
  }

  const isPublished = release.visibility === 'published'
  const isSaving = updateMutation.isPending || publishMutation.isPending || unpublishMutation.isPending

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/app"
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white/60" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">Edit Release</h1>
              <span
                className={`px-2 py-0.5 rounded text-xs ${
                  isPublished
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}
              >
                {isPublished ? 'Published' : 'Draft'}
              </span>
            </div>
            <p className="text-white/60">{release.version}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Button
            variant="ghost"
            onClick={onDelete}
            disabled={deleteMutation.isPending}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>

          <Button
            variant="secondary"
            onClick={onSave}
            isLoading={updateMutation.isPending}
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>

          {isPublished ? (
            <Button
              variant="secondary"
              onClick={onUnpublish}
              isLoading={unpublishMutation.isPending}
            >
              <EyeOff className="w-4 h-4 mr-2" />
              Unpublish
            </Button>
          ) : (
            <Button
              onClick={onPublish}
              isLoading={publishMutation.isPending}
            >
              <Send className="w-4 h-4 mr-2" />
              Publish
            </Button>
          )}
        </div>
      </div>

      {/* Form */}
      <div className="glass-card p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <Input
            label="Title"
            placeholder="e.g., Major Performance Update"
            error={errors.title?.message}
            {...register('title')}
          />
          <Input
            label="Version"
            placeholder="e.g., 2.4.0"
            error={errors.version?.message}
            {...register('version')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Content
          </label>
          <MarkdownEditor
            value={content}
            onChange={setContent}
          />
        </div>
      </div>
    </div>
  )
}
