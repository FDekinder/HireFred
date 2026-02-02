'use client'

import Link from 'next/link'
import { Zap } from 'lucide-react'

export function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">ReleaseNoteHub</span>
          </Link>

          <div className="flex items-center gap-8">
            <Link href="/changelog" className="text-white/60 hover:text-white transition-colors">
              Changelog
            </Link>
            <Link href="/login" className="text-white/60 hover:text-white transition-colors">
              Login
            </Link>
            <Link href="/register" className="text-white/60 hover:text-white transition-colors">
              Sign Up
            </Link>
          </div>

          <p className="text-white/40 text-sm">
            &copy; {new Date().getFullYear()} ReleaseNoteHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
