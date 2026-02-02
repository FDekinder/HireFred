'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { ArrowLeft, Save, Send } from 'lucide-react'
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

export default function NewReleasePage() {
  const router = useRouter()
  const [content, setContent] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ReleaseForm>({
    resolver: zodResolver(releaseSchema),
    defaultValues: {
      title: '',
      version: '',
    },
  })

  const createMutation = useMutation({
    mutationFn: (data: { title: string; version: string; content_md: string; visibility: 'draft' | 'published' }) =>
      api.createRelease(data),
    onSuccess: (release) => {
      toast.success('Release created!')
      router.push(`/app/releases/${release.id}/edit`)
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to create release')
    },
  })

  const onSaveDraft = handleSubmit((data) => {
    createMutation.mutate({
      ...data,
      content_md: content,
      visibility: 'draft',
    })
  })

  const onPublish = handleSubmit((data) => {
    createMutation.mutate({
      ...data,
      content_md: content,
      visibility: 'published',
    })
  })

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/app"
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white/60" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">New Release</h1>
            <p className="text-white/60">Create a new release note</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={onSaveDraft}
            isLoading={createMutation.isPending}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button
            onClick={onPublish}
            isLoading={createMutation.isPending}
          >
            <Send className="w-4 h-4 mr-2" />
            Publish
          </Button>
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
            placeholder="Write your release notes here...

## What's New
- Feature 1
- Feature 2

## Bug Fixes
- Fixed issue with...

## Breaking Changes
- API endpoint changed..."
          />
        </div>
      </div>
    </div>
  )
}
