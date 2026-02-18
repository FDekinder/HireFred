'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Pencil, Trash2, Plus, X, LogOut } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  hiringApi,
  Application,
  ApplicationCreate,
  RecruiterContact,
  RecruiterContactCreate,
  HiringStatusBanner,
} from '@/lib/api'

// ── Zod schemas ───────────────────────────────────────────────────────────────

const applicationSchema = z.object({
  company: z.string().min(1, 'Required'),
  role: z.string().min(1, 'Required'),
  job_type: z.enum(['fulltime', 'contract', 'freelance']),
  date_sent: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD format'),
  status: z.enum(['applied', 'response', 'interview', 'offer', 'rejected', 'no_response']),
  notes: z.string().optional(),
})

const contactSchema = z.object({
  name: z.string().min(1, 'Required'),
  company: z.string().min(1, 'Required'),
  role: z.string().min(1, 'Required'),
  last_contact_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD format'),
  status: z.string().min(1, 'Required'),
  note: z.string().optional(),
  application_id: z.number().optional(),
})

const bannerSchema = z.object({
  message: z.string().min(1, 'Required'),
  is_active: z.boolean(),
})

type ApplicationForm = z.infer<typeof applicationSchema>
type ContactForm = z.infer<typeof contactSchema>
type BannerForm = z.infer<typeof bannerSchema>

type Tab = 'applications' | 'contacts' | 'settings'

// ── Shared field component ─────────────────────────────────────────────────────

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-white/60 text-xs uppercase tracking-wider">{label}</label>
      {children}
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  )
}

const inputClass = 'bg-white/5 border border-white/10 focus:border-lime/50 rounded-xl px-3 py-2 text-white outline-none transition-colors placeholder-white/20 text-sm w-full'
const selectClass = 'bg-black border border-white/10 focus:border-lime/50 rounded-xl px-3 py-2 text-white outline-none transition-colors text-sm w-full'

// ── Applications Tab ──────────────────────────────────────────────────────────

function ApplicationsTab({ adminKey }: { adminKey: string }) {
  const [apps, setApps] = useState<Application[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<ApplicationForm>({
    resolver: zodResolver(applicationSchema),
    defaultValues: { job_type: 'fulltime', status: 'applied' },
  })

  const load = () => hiringApi.getApplications(adminKey).then(setApps).catch(() => {})

  useEffect(() => { load() }, [adminKey])

  const onSubmit = async (data: ApplicationForm) => {
    try {
      if (editingId !== null) {
        await hiringApi.updateApplication(editingId, data, adminKey)
        toast.success('Application updated!')
      } else {
        await hiringApi.createApplication(data as ApplicationCreate, adminKey)
        toast.success('Application added!')
      }
      reset({ job_type: 'fulltime', status: 'applied' })
      setEditingId(null)
      setShowForm(false)
      load()
    } catch {
      toast.error('Failed to save application')
    }
  }

  const handleEdit = (app: Application) => {
    setEditingId(app.id)
    setValue('company', app.company)
    setValue('role', app.role)
    setValue('job_type', app.job_type)
    setValue('date_sent', app.date_sent)
    setValue('status', app.status)
    setValue('notes', app.notes ?? '')
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this application?')) return
    try {
      await hiringApi.deleteApplication(id, adminKey)
      toast.success('Deleted')
      load()
    } catch {
      toast.error('Failed to delete')
    }
  }

  const handleCancel = () => {
    reset({ job_type: 'fulltime', status: 'applied' })
    setEditingId(null)
    setShowForm(false)
  }

  const STATUS_BADGE: Record<string, string> = {
    applied: 'text-lime/80 bg-lime/10',
    response: 'text-electric-blue/80 bg-electric-blue/10',
    interview: 'text-hot-pink/80 bg-hot-pink/10',
    offer: 'text-vibrant-green/80 bg-vibrant-green/10',
    rejected: 'text-orange/80 bg-orange/10',
    no_response: 'text-white/40 bg-white/5',
  }

  return (
    <div className="space-y-6">
      {/* Add button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-lime text-black font-bold px-5 py-2.5 rounded-xl hover:bg-lime/80 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" /> Add Application
        </button>
      )}

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit(onSubmit)}
            className="glass-card p-6 space-y-4 border border-lime/20"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-white">{editingId !== null ? 'Edit' : 'Add'} Application</h4>
              <button type="button" onClick={handleCancel} className="text-white/40 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Company" error={errors.company?.message}>
                <input {...register('company')} className={inputClass} placeholder="e.g. Acme Corp" />
              </Field>
              <Field label="Role" error={errors.role?.message}>
                <input {...register('role')} className={inputClass} placeholder="e.g. Senior Dev" />
              </Field>
              <Field label="Date Sent" error={errors.date_sent?.message}>
                <input {...register('date_sent')} type="date" className={inputClass} />
              </Field>
              <Field label="Job Type" error={errors.job_type?.message}>
                <select {...register('job_type')} className={selectClass}>
                  <option value="fulltime">Full-Time</option>
                  <option value="contract">Contract</option>
                  <option value="freelance">Freelance</option>
                </select>
              </Field>
              <Field label="Status" error={errors.status?.message}>
                <select {...register('status')} className={selectClass}>
                  <option value="applied">Applied</option>
                  <option value="response">Recruiter Response</option>
                  <option value="interview">Interview</option>
                  <option value="offer">Offer</option>
                  <option value="rejected">Rejected</option>
                  <option value="no_response">No Response</option>
                </select>
              </Field>
              <Field label="Notes" error={errors.notes?.message}>
                <input {...register('notes')} className={inputClass} placeholder="Optional notes" />
              </Field>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="bg-lime text-black font-bold px-5 py-2 rounded-xl hover:bg-lime/80 transition-colors text-sm">
                {editingId !== null ? 'Save Changes' : 'Add Application'}
              </button>
              <button type="button" onClick={handleCancel} className="text-white/50 hover:text-white text-sm transition-colors">
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* List */}
      <div className="space-y-2">
        {apps.length === 0 && (
          <p className="text-white/30 text-sm text-center py-8">No applications yet. Add one above.</p>
        )}
        {apps.map(app => (
          <div key={app.id} className="glass-card px-5 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="min-w-0">
                <p className="text-white font-medium truncate">{app.company}</p>
                <p className="text-white/50 text-sm truncate">{app.role} · {app.date_sent}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs capitalize shrink-0 ${STATUS_BADGE[app.status] ?? 'text-white/40 bg-white/5'}`}>
                {app.status.replace('_', ' ')}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => handleEdit(app)} className="text-white/30 hover:text-lime transition-colors p-1">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(app.id)} className="text-white/30 hover:text-red-400 transition-colors p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Contacts Tab ──────────────────────────────────────────────────────────────

function ContactsTab({ adminKey }: { adminKey: string }) {
  const [contacts, setContacts] = useState<RecruiterContact[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: { status: 'active' },
  })

  const load = () => hiringApi.getContacts().then(setContacts).catch(() => {})
  useEffect(() => { load() }, [])

  const onSubmit = async (data: ContactForm) => {
    try {
      if (editingId !== null) {
        await hiringApi.updateContact(editingId, data, adminKey)
        toast.success('Contact updated!')
      } else {
        await hiringApi.createContact(data as RecruiterContactCreate, adminKey)
        toast.success('Contact added!')
      }
      reset({ status: 'active' })
      setEditingId(null)
      setShowForm(false)
      load()
    } catch {
      toast.error('Failed to save contact')
    }
  }

  const handleEdit = (c: RecruiterContact) => {
    setEditingId(c.id)
    setValue('name', c.name)
    setValue('company', c.company)
    setValue('role', c.role)
    setValue('last_contact_date', c.last_contact_date)
    setValue('status', c.status)
    setValue('note', c.note ?? '')
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this contact?')) return
    try {
      await hiringApi.deleteContact(id, adminKey)
      toast.success('Deleted')
      load()
    } catch {
      toast.error('Failed to delete')
    }
  }

  const handleCancel = () => {
    reset({ status: 'active' })
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-lime text-black font-bold px-5 py-2.5 rounded-xl hover:bg-lime/80 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" /> Add Contact
        </button>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit(onSubmit)}
            className="glass-card p-6 space-y-4 border border-lime/20"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-white">{editingId !== null ? 'Edit' : 'Add'} Contact</h4>
              <button type="button" onClick={handleCancel} className="text-white/40 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Name" error={errors.name?.message}>
                <input {...register('name')} className={inputClass} placeholder="Jane Smith" />
              </Field>
              <Field label="Company" error={errors.company?.message}>
                <input {...register('company')} className={inputClass} placeholder="Acme Corp" />
              </Field>
              <Field label="Their Role" error={errors.role?.message}>
                <input {...register('role')} className={inputClass} placeholder="Technical Recruiter" />
              </Field>
              <Field label="Last Contact Date" error={errors.last_contact_date?.message}>
                <input {...register('last_contact_date')} type="date" className={inputClass} />
              </Field>
              <Field label="Status" error={errors.status?.message}>
                <input {...register('status')} className={inputClass} placeholder="active / responded / closed" />
              </Field>
              <Field label="Note" error={errors.note?.message}>
                <input {...register('note')} className={inputClass} placeholder="Phone screen scheduled..." />
              </Field>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="bg-lime text-black font-bold px-5 py-2 rounded-xl hover:bg-lime/80 transition-colors text-sm">
                {editingId !== null ? 'Save Changes' : 'Add Contact'}
              </button>
              <button type="button" onClick={handleCancel} className="text-white/50 hover:text-white text-sm transition-colors">
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        {contacts.length === 0 && (
          <p className="text-white/30 text-sm text-center py-8">No contacts yet.</p>
        )}
        {contacts.map(c => (
          <div key={c.id} className="glass-card px-5 py-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-white font-medium">{c.name} <span className="text-white/40 font-normal">· {c.company}</span></p>
              <p className="text-white/50 text-sm">{c.role} · {c.last_contact_date}</p>
              {c.note && <p className="text-white/30 text-xs mt-0.5 truncate">{c.note}</p>}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => handleEdit(c)} className="text-white/30 hover:text-lime transition-colors p-1">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(c.id)} className="text-white/30 hover:text-red-400 transition-colors p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Settings Tab ──────────────────────────────────────────────────────────────

function SettingsTab({ adminKey }: { adminKey: string }) {
  const [banner, setBanner] = useState<HiringStatusBanner | null>(null)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<BannerForm>({
    resolver: zodResolver(bannerSchema),
    defaultValues: { is_active: true },
  })

  useEffect(() => {
    hiringApi.getBanner().then(b => {
      if (b) {
        setBanner(b)
        reset({ message: b.message, is_active: b.is_active })
      }
    })
  }, [])

  const onSubmit = async (data: BannerForm) => {
    try {
      const updated = await hiringApi.updateBanner(data, adminKey)
      setBanner(updated)
      toast.success('Status banner updated!')
    } catch {
      toast.error('Failed to update banner')
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <div className="glass-card p-6 border border-lime/10">
        <h4 className="font-bold text-white mb-4">Public Status Banner</h4>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field label="Banner Message" error={errors.message?.message}>
            <textarea
              {...register('message')}
              rows={3}
              className={`${inputClass} resize-none`}
              placeholder="Actively Looking — Open to Offers — Available Now"
            />
          </Field>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              {...register('is_active')}
              type="checkbox"
              className="w-4 h-4 accent-lime"
            />
            <span className="text-white/60 text-sm">Show banner on public dashboard</span>
          </label>
          <button type="submit" className="bg-lime text-black font-bold px-5 py-2 rounded-xl hover:bg-lime/80 transition-colors text-sm">
            Save Banner
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Main AdminDashboard ───────────────────────────────────────────────────────

export function AdminDashboard({ adminKey, onLogout }: { adminKey: string; onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<Tab>('applications')

  const TABS: { key: Tab; label: string }[] = [
    { key: 'applications', label: 'Applications' },
    { key: 'contacts', label: 'Contacts' },
    { key: 'settings', label: 'Settings' },
  ]

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="grid-bg fixed inset-0 pointer-events-none opacity-30" />

      {/* Header */}
      <header className="relative z-10 px-6 py-6 border-b border-white/10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-lime">Admin — Hiring Dashboard</h1>
            <p className="text-white/30 text-xs mt-0.5">Manage your job search data</p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/hiring-progress"
              className="text-white/40 hover:text-white text-sm transition-colors"
            >
              View Public Dashboard →
            </a>
            <button
              onClick={onLogout}
              className="text-white/30 hover:text-red-400 transition-colors p-2"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2 rounded-full font-medium text-sm capitalize transition-all ${
                activeTab === tab.key
                  ? 'bg-lime text-black'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'applications' && <ApplicationsTab adminKey={adminKey} />}
            {activeTab === 'contacts' && <ContactsTab adminKey={adminKey} />}
            {activeTab === 'settings' && <SettingsTab adminKey={adminKey} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  )
}
