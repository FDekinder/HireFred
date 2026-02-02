const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface User {
  id: number
  email: string
  created_at: string
}

export interface Release {
  id: number
  title: string
  version: string
  slug: string | null
  content_md: string
  visibility: 'draft' | 'published'
  published_at: string | null
  created_at: string
  updated_at: string
  user_id: number
}

export interface ReleasePublic {
  id: number
  title: string
  version: string
  slug: string | null
  content_md: string
  published_at: string | null
}

export interface CreateReleaseData {
  title: string
  version: string
  content_md?: string
  visibility?: 'draft' | 'published'
}

export interface UpdateReleaseData {
  title?: string
  version?: string
  content_md?: string
  visibility?: 'draft' | 'published'
}

class ApiClient {
  private getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('token')
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'An error occurred' }))
      throw new Error(error.detail || 'An error occurred')
    }

    if (response.status === 204) {
      return null as T
    }

    return response.json()
  }

  // Auth
  async register(email: string, password: string): Promise<User> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async login(email: string, password: string): Promise<{ access_token: string }> {
    const response = await this.request<{ access_token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    if (response.access_token) {
      localStorage.setItem('token', response.access_token)
    }
    return response
  }

  async getMe(): Promise<User> {
    return this.request('/auth/me')
  }

  logout(): void {
    localStorage.removeItem('token')
  }

  // Releases (protected)
  async getReleases(status?: 'draft' | 'published'): Promise<Release[]> {
    const params = status ? `?status=${status}` : ''
    return this.request(`/releases${params}`)
  }

  async getRelease(id: number): Promise<Release> {
    return this.request(`/releases/${id}`)
  }

  async createRelease(data: CreateReleaseData): Promise<Release> {
    return this.request('/releases', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateRelease(id: number, data: UpdateReleaseData): Promise<Release> {
    return this.request(`/releases/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteRelease(id: number): Promise<void> {
    return this.request(`/releases/${id}`, {
      method: 'DELETE',
    })
  }

  async publishRelease(id: number): Promise<Release> {
    return this.request(`/releases/${id}/publish`, {
      method: 'POST',
    })
  }

  async unpublishRelease(id: number): Promise<Release> {
    return this.request(`/releases/${id}/unpublish`, {
      method: 'POST',
    })
  }

  // Public
  async getPublicReleases(): Promise<ReleasePublic[]> {
    return this.request('/public/releases')
  }

  async getPublicRelease(slug: string): Promise<ReleasePublic> {
    return this.request(`/public/releases/${slug}`)
  }
}

export const api = new ApiClient()

// ============================================
// Portfolio API (for job application)
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

// Portfolio API functions
export const portfolioApi = {
  // Get all testimonials
  async getTestimonials(): Promise<{ testimonials: Testimonial[]; total: number; message: string }> {
    const res = await fetch(`${API_URL}/api/portfolio/testimonials`)
    if (!res.ok) throw new Error('Failed to fetch testimonials')
    return res.json()
  },

  // Get a random testimonial
  async getRandomTestimonial(): Promise<Testimonial> {
    const res = await fetch(`${API_URL}/api/portfolio/testimonials/random`)
    if (!res.ok) throw new Error('Failed to fetch testimonial')
    return res.json()
  },

  // Get skills
  async getSkills(category?: string): Promise<{ skills: Skill[]; categories: string[]; average_proficiency: number }> {
    const url = category
      ? `${API_URL}/api/portfolio/skills?category=${category}`
      : `${API_URL}/api/portfolio/skills`
    const res = await fetch(url)
    if (!res.ok) throw new Error('Failed to fetch skills')
    return res.json()
  },

  // Get projects
  async getProjects(): Promise<{ projects: Project[]; total: number; tech_used: string[] }> {
    const res = await fetch(`${API_URL}/api/portfolio/projects`)
    if (!res.ok) throw new Error('Failed to fetch projects')
    return res.json()
  },

  // Track a view
  async trackView(sessionId?: string): Promise<ViewStats> {
    const res = await fetch(`${API_URL}/api/portfolio/views`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId })
    })
    if (!res.ok) throw new Error('Failed to track view')
    return res.json()
  },

  // Get view stats
  async getViewStats(): Promise<ViewStats> {
    const res = await fetch(`${API_URL}/api/portfolio/views`)
    if (!res.ok) throw new Error('Failed to fetch views')
    return res.json()
  },

  // Submit contact form
  async submitContact(data: {
    name: string
    email: string
    company?: string
    message: string
  }): Promise<ContactResponse> {
    const res = await fetch(`${API_URL}/api/portfolio/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error('Failed to submit contact')
    return res.json()
  },

  // Get all portfolio stats
  async getPortfolioStats(): Promise<PortfolioStats> {
    const res = await fetch(`${API_URL}/api/portfolio/stats`)
    if (!res.ok) throw new Error('Failed to fetch stats')
    return res.json()
  }
}
