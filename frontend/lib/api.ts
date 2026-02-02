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
