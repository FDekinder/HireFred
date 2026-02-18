const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// ============================================
// Portfolio Interfaces
// ============================================

export interface Testimonial {
  id: number
  quote: string
  author: string
  company: string
  role: string
}

export interface Skill {
  name: string
  level: number
  category: string
  note?: string
}

export interface Project {
  id: number
  title: string
  description: string
  impact: string
  tech: string[]
}

export interface ViewStats {
  total_views: number
  unique_visitors: number
  popularity: string
  is_new_visitor?: boolean
  message?: string
}

export interface PortfolioStats {
  experience: {
    years: number
    features_shipped: number
    critical_incidents: number
    prs_reviewed: number
    daily_users_served: number
  }
  highlights: string[]
  availability: {
    status: string
    work_preferences: string[]
    location: string
    languages: string[]
  }
  fun_facts: string[]
}

export interface ContactResponse {
  success: boolean
  message: string
  reference_id: number
}

// ============================================
// DEMO MODE - Fallback data when backend is unavailable
// ============================================
const DEMO_MODE = false // Set to false when backend is working

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  { id: 1, quote: "Frederick's WebSocket implementation handled 1,000+ daily sessions flawlessly. Zero data loss.", author: "Tech Lead", company: "Bell Canada", role: "Real-Time Collaboration Project" },
  { id: 2, quote: "He reduced our API response times by 40%. The optimization skills are real.", author: "Senior Developer", company: "Bell Canada", role: "Backend Team" },
  { id: 3, quote: "80+ features shipped with zero critical incidents. That's not luck, that's skill.", author: "Project Manager", company: "Bell Canada", role: "Network Automation Platform" },
  { id: 4, quote: "His AI chatbot reduced support queries by 40% in the pilot phase. Impressive work.", author: "Operations Lead", company: "Bell Canada", role: "Big Data Team" },
  { id: 5, quote: "Frederick reviewed 100+ PRs and actually made our code better. Rare find.", author: "Dev Team", company: "Bell Canada", role: "Code Quality Initiative" },
]

const FALLBACK_SKILLS: Skill[] = [
  { name: "Vue.js 3", level: 95, category: "Frontend" },
  { name: "TypeScript", level: 90, category: "Frontend" },
  { name: "React", level: 70, category: "Frontend", note: "Learning fast!" },
  { name: "Python", level: 92, category: "Backend" },
  { name: "FastAPI", level: 90, category: "Backend" },
  { name: "Node.js", level: 85, category: "Backend" },
  { name: "PostgreSQL", level: 88, category: "Database" },
  { name: "WebSocket", level: 90, category: "Real-Time" },
  { name: "Git", level: 95, category: "Tools" },
  { name: "Docker", level: 80, category: "DevOps" },
]

const FALLBACK_PROJECTS: Project[] = [
  { id: 1, title: "Real-Time Collaboration System", description: "WebSocket-based node-locking system preventing data conflicts in multi-user workflows", impact: "1,000+ daily sessions with zero data loss", tech: ["WebSocket", "Vue.js 3", "TypeScript", "Python", "FastAPI"] },
  { id: 2, title: "Python SDK for Network Automation", description: "Built from scratch for network service automation across multiple client environments", impact: "Reduced manual operations by 60%", tech: ["Python", "REST APIs", "Network Protocols"] },
  { id: 3, title: "AI-Powered Support Chatbot", description: "Conversational agent using OpenAI API with prompt engineering and context management", impact: "40% reduction in repetitive support queries", tech: ["OpenAI API", "Vue.js", "JavaScript", "LLM Integration"] },
]

const FALLBACK_STATS: PortfolioStats = {
  experience: { years: 3, features_shipped: 80, critical_incidents: 0, prs_reviewed: 100, daily_users_served: 1000 },
  highlights: ["40% faster API response times", "50% reduction in query times", "60% reduction in manual operations", "40% fewer support queries with AI chatbot", "95%+ sprint completion rate"],
  availability: { status: "Available Immediately", work_preferences: ["Hybrid", "Remote", "On-site"], location: "Montreal, QC", languages: ["French (Native)", "English (Professional)"] },
  fun_facts: ["I do theatrical improv - debugging is basically 'yes, and...' for code", "Extensive management experience = I know how to ship AND communicate", "Zero critical incidents isn't luck, it's attention to detail"]
}

// ============================================
// Portfolio API with Demo Mode Fallback
// ============================================

// Helper to try API first, fall back to demo data
async function tryFetchOrFallback<T>(fetchFn: () => Promise<T>, fallback: T): Promise<T> {
  if (DEMO_MODE) {
    return fallback
  }
  try {
    return await fetchFn()
  } catch {
    return fallback
  }
}

// Portfolio API functions with fallback support
export const portfolioApi = {
  // Get all testimonials
  async getTestimonials(): Promise<{ testimonials: Testimonial[]; total: number; message: string }> {
    const fallback = {
      testimonials: FALLBACK_TESTIMONIALS,
      total: FALLBACK_TESTIMONIALS.length,
      message: "These are real achievements from my time at Bell Canada!"
    }
    return tryFetchOrFallback(async () => {
      const res = await fetch(`${API_URL}/api/portfolio/testimonials`)
      if (!res.ok) throw new Error('Failed to fetch testimonials')
      return res.json()
    }, fallback)
  },

  // Get a random testimonial
  async getRandomTestimonial(): Promise<Testimonial> {
    const fallback = FALLBACK_TESTIMONIALS[Math.floor(Math.random() * FALLBACK_TESTIMONIALS.length)]
    return tryFetchOrFallback(async () => {
      const res = await fetch(`${API_URL}/api/portfolio/testimonials/random`)
      if (!res.ok) throw new Error('Failed to fetch testimonial')
      return res.json()
    }, fallback)
  },

  // Get skills
  async getSkills(category?: string): Promise<{ skills: Skill[]; categories: string[]; average_proficiency: number }> {
    const filteredSkills = category
      ? FALLBACK_SKILLS.filter(s => s.category.toLowerCase() === category.toLowerCase())
      : FALLBACK_SKILLS
    const fallback = {
      skills: filteredSkills,
      categories: Array.from(new Set(FALLBACK_SKILLS.map(s => s.category))),
      average_proficiency: filteredSkills.reduce((sum, s) => sum + s.level, 0) / filteredSkills.length
    }
    return tryFetchOrFallback(async () => {
      const url = category
        ? `${API_URL}/api/portfolio/skills?category=${category}`
        : `${API_URL}/api/portfolio/skills`
      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to fetch skills')
      return res.json()
    }, fallback)
  },

  // Get projects
  async getProjects(): Promise<{ projects: Project[]; total: number; tech_used: string[] }> {
    const fallback = {
      projects: FALLBACK_PROJECTS,
      total: FALLBACK_PROJECTS.length,
      tech_used: Array.from(new Set(FALLBACK_PROJECTS.flatMap(p => p.tech)))
    }
    return tryFetchOrFallback(async () => {
      const res = await fetch(`${API_URL}/api/portfolio/projects`)
      if (!res.ok) throw new Error('Failed to fetch projects')
      return res.json()
    }, fallback)
  },

  // Track a view
  async trackView(sessionId?: string): Promise<ViewStats> {
    const fallback = {
      total_views: 42,
      unique_visitors: 28,
      is_new_visitor: true,
      popularity: "Growing!",
      message: "Thanks for checking out my application!"
    }
    return tryFetchOrFallback(async () => {
      const res = await fetch(`${API_URL}/api/portfolio/views`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId })
      })
      if (!res.ok) throw new Error('Failed to track view')
      return res.json()
    }, fallback)
  },

  // Get view stats
  async getViewStats(): Promise<ViewStats> {
    const fallback = {
      total_views: 42,
      unique_visitors: 28,
      popularity: "Growing!"
    }
    return tryFetchOrFallback(async () => {
      const res = await fetch(`${API_URL}/api/portfolio/views`)
      if (!res.ok) throw new Error('Failed to fetch views')
      return res.json()
    }, fallback)
  },

  // Submit contact form
  async submitContact(data: {
    name: string
    email: string
    company?: string
    message: string
  }): Promise<ContactResponse> {
    const fallback = {
      success: true,
      message: `Thanks ${data.name}! I'll get back to you soon!`,
      reference_id: Math.floor(Math.random() * 1000)
    }
    return tryFetchOrFallback(async () => {
      const res = await fetch(`${API_URL}/api/portfolio/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error('Failed to submit contact')
      return res.json()
    }, fallback)
  },

  // Get all portfolio stats
  async getPortfolioStats(): Promise<PortfolioStats> {
    return tryFetchOrFallback(async () => {
      const res = await fetch(`${API_URL}/api/portfolio/stats`)
      if (!res.ok) throw new Error('Failed to fetch stats')
      return res.json()
    }, FALLBACK_STATS)
  }
}

// ============================================
// Hiring Progress Interfaces
// ============================================

export type ApplicationStatus = 'applied' | 'response' | 'interview' | 'offer' | 'rejected' | 'no_response'
export type JobType = 'fulltime' | 'contract' | 'freelance'

export interface Application {
  id: number
  company: string
  role: string
  job_type: JobType
  date_sent: string
  status: ApplicationStatus
  notes?: string
  created_at: string
}

export interface ApplicationCreate {
  company: string
  role: string
  job_type: JobType
  date_sent: string
  status: ApplicationStatus
  notes?: string
}

export interface RecruiterContact {
  id: number
  application_id?: number
  name: string
  company: string
  role: string
  last_contact_date: string
  status: string
  note?: string
}

export interface RecruiterContactCreate {
  application_id?: number
  name: string
  company: string
  role: string
  last_contact_date: string
  status: string
  note?: string
}

export interface HiringStatusBanner {
  id: number
  message: string
  is_active: boolean
  updated_at: string
}

export interface WeeklyDataPoint {
  week: string
  count: number
}

export interface CumulativeDataPoint {
  date: string
  total: number
}

export interface DashboardStats {
  total_sent: number
  total_responses: number
  response_rate: number
  active_interviews: number
  offers_received: number
  status_breakdown: Partial<Record<ApplicationStatus, number>>
  weekly_applications: WeeklyDataPoint[]
  cumulative_applications: CumulativeDataPoint[]
  by_job_type: Partial<Record<JobType, number>>
}

// ============================================
// Hiring Fallback Data
// ============================================

const FALLBACK_DASHBOARD_STATS: DashboardStats = {
  total_sent: 0,
  total_responses: 0,
  response_rate: 0,
  active_interviews: 0,
  offers_received: 0,
  status_breakdown: {},
  weekly_applications: Array.from({ length: 8 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (7 - i) * 7)
    const year = d.getFullYear()
    const week = Math.ceil(((d.getTime() - new Date(year, 0, 1).getTime()) / 86400000 + 1) / 7)
    return { week: `${year}-W${String(week).padStart(2, '0')}`, count: 0 }
  }),
  cumulative_applications: [],
  by_job_type: {},
}

const FALLBACK_CONTACTS: RecruiterContact[] = []

const FALLBACK_BANNER: HiringStatusBanner = {
  id: 1,
  message: 'Actively Looking — Open to Offers — Available Now',
  is_active: true,
  updated_at: new Date().toISOString(),
}

// ============================================
// Hiring API
// ============================================

export const hiringApi = {
  async getDashboard(): Promise<DashboardStats> {
    return tryFetchOrFallback(async () => {
      const res = await fetch(`${API_URL}/api/hiring/dashboard`)
      if (!res.ok) throw new Error('Failed to fetch dashboard')
      return res.json()
    }, FALLBACK_DASHBOARD_STATS)
  },

  async getContacts(): Promise<RecruiterContact[]> {
    return tryFetchOrFallback(async () => {
      const res = await fetch(`${API_URL}/api/hiring/contacts`)
      if (!res.ok) throw new Error('Failed to fetch contacts')
      return res.json()
    }, FALLBACK_CONTACTS)
  },

  async getBanner(): Promise<HiringStatusBanner | null> {
    return tryFetchOrFallback(async () => {
      const res = await fetch(`${API_URL}/api/hiring/banner`)
      if (!res.ok) throw new Error('Failed to fetch banner')
      return res.json()
    }, FALLBACK_BANNER)
  },

  async getApplications(adminKey: string): Promise<Application[]> {
    const res = await fetch(`${API_URL}/api/hiring/applications`, {
      headers: { 'X-Admin-Key': adminKey },
    })
    if (!res.ok) throw new Error('Failed to fetch applications')
    return res.json()
  },

  async createApplication(data: ApplicationCreate, adminKey: string): Promise<Application> {
    const res = await fetch(`${API_URL}/api/hiring/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Key': adminKey },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to create application')
    return res.json()
  },

  async updateApplication(id: number, data: Partial<ApplicationCreate>, adminKey: string): Promise<Application> {
    const res = await fetch(`${API_URL}/api/hiring/applications/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Key': adminKey },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to update application')
    return res.json()
  },

  async deleteApplication(id: number, adminKey: string): Promise<void> {
    const res = await fetch(`${API_URL}/api/hiring/applications/${id}`, {
      method: 'DELETE',
      headers: { 'X-Admin-Key': adminKey },
    })
    if (!res.ok) throw new Error('Failed to delete application')
  },

  async createContact(data: RecruiterContactCreate, adminKey: string): Promise<RecruiterContact> {
    const res = await fetch(`${API_URL}/api/hiring/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Key': adminKey },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to create contact')
    return res.json()
  },

  async updateContact(id: number, data: Partial<RecruiterContactCreate>, adminKey: string): Promise<RecruiterContact> {
    const res = await fetch(`${API_URL}/api/hiring/contacts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Key': adminKey },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to update contact')
    return res.json()
  },

  async deleteContact(id: number, adminKey: string): Promise<void> {
    const res = await fetch(`${API_URL}/api/hiring/contacts/${id}`, {
      method: 'DELETE',
      headers: { 'X-Admin-Key': adminKey },
    })
    if (!res.ok) throw new Error('Failed to delete contact')
  },

  async updateBanner(data: { message?: string; is_active?: boolean }, adminKey: string): Promise<HiringStatusBanner> {
    const res = await fetch(`${API_URL}/api/hiring/banner`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Key': adminKey },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to update banner')
    return res.json()
  },
}
