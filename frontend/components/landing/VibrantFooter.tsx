'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, Linkedin, Mail } from 'lucide-react'

export function VibrantFooter({ company }: { company: string }) {
  return (
    <footer className="py-12 px-6 border-t-4 border-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              className="w-10 h-10 rounded-xl bg-black flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Heart className="w-5 h-5 text-hot-pink" />
            </motion.div>
            <span className="text-xl font-black text-black">Frederick De Kinder</span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-8">
            <a href="#features" className="text-black/60 hover:text-hot-pink transition-colors font-medium">
              Skills
            </a>
            <a href="#how-it-works" className="text-black/60 hover:text-hot-pink transition-colors font-medium">
              Experience
            </a>
            <a href="mailto:frederick.de.kinder@gmail.com" className="text-black/60 hover:text-hot-pink transition-colors font-medium">
              Contact
            </a>
            <Link href="/hiring-progress" className="text-black/60 hover:text-hot-pink transition-colors font-medium">
              Job Hunt
            </Link>
          </div>

          {/* Social & copyright */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <motion.a
                href="https://linkedin.com/in/frederick-de-kinder"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-black/10 hover:bg-black/20 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Linkedin className="w-5 h-5 text-black/60" />
              </motion.a>
              <motion.a
                href="mailto:frederick.de.kinder@gmail.com"
                className="p-2 rounded-lg bg-black/10 hover:bg-black/20 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail className="w-5 h-5 text-black/60" />
              </motion.a>
            </div>
            <p className="text-black/50 text-sm">
              Made with ☺ for {company}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
