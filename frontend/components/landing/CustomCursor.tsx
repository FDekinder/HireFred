'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [angle, setAngle] = useState(0)
  const [isHoveringName, setIsHoveringName] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isOnDark, setIsOnDark] = useState(false)
  const nameRef = useRef<DOMRect | null>(null)

  useEffect(() => {
    // Find the name element position
    const updateNamePosition = () => {
      const nameElement = document.getElementById('frederick-name')
      if (nameElement) {
        nameRef.current = nameElement.getBoundingClientRect()
      }
    }

    // Update on load and scroll
    updateNamePosition()
    window.addEventListener('scroll', updateNamePosition)
    window.addEventListener('resize', updateNamePosition)

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)

      // Calculate angle to point toward the name
      if (nameRef.current) {
        const nameX = nameRef.current.left + nameRef.current.width / 2
        const nameY = nameRef.current.top + nameRef.current.height / 2
        const deltaX = nameX - e.clientX
        const deltaY = nameY - e.clientY
        const angleRad = Math.atan2(deltaY, deltaX)
        const angleDeg = (angleRad * 180) / Math.PI
        setAngle(angleDeg)
      }

      // Check if hovering over name
      const nameElement = document.getElementById('frederick-name')
      if (nameElement) {
        const rect = nameElement.getBoundingClientRect()
        const isHovering =
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        setIsHoveringName(isHovering)
      }

      // Check if cursor is over a dark background
      const elementUnder = document.elementFromPoint(e.clientX, e.clientY)
      if (elementUnder) {
        const bgColor = window.getComputedStyle(elementUnder).backgroundColor
        // Check if element or its parents have dark background
        let isDark = false
        let el: Element | null = elementUnder
        while (el && !isDark) {
          const bg = window.getComputedStyle(el).backgroundColor
          // Parse rgb/rgba values
          const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
          if (match) {
            const r = parseInt(match[1])
            const g = parseInt(match[2])
            const b = parseInt(match[3])
            // If brightness is low, it's dark
            const brightness = (r * 299 + g * 587 + b * 114) / 1000
            if (brightness < 128 && bg !== 'rgba(0, 0, 0, 0)') {
              isDark = true
            }
          }
          el = el.parentElement
        }
        setIsOnDark(isDark)
      }
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('scroll', updateNamePosition)
      window.removeEventListener('resize', updateNamePosition)
    }
  }, [])

  // Hide on mobile/touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null
  }

  return (
    <>
      {/* Hide default cursor */}
      <style jsx global>{`
        * {
          cursor: none !important;
        }
        a, button {
          cursor: none !important;
        }
      `}</style>

      {/* Custom cursor */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed pointer-events-none z-[9999]"
            style={{
              left: position.x,
              top: position.y,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            {/* Arrow pointing to name */}
            <motion.div
              className="relative"
              animate={{ rotate: angle }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              style={{ transformOrigin: 'center center' }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                className="absolute -translate-x-1/2 -translate-y-1/2"
              >
                {/* Arrow pointing right (will be rotated) */}
                <path
                  d="M8 16H24M24 16L18 10M24 16L18 22"
                  stroke={isOnDark ? "#FF69B4" : "black"}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>

            {/* Small dot at cursor position */}
            <div className={`absolute w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2 ${isOnDark ? 'bg-hot-pink' : 'bg-black'}`} />

            {/* HIRE ME tooltip when hovering name - clickable! */}
            <AnimatePresence>
              {isHoveringName && (
                <motion.a
                  href="mailto:frederick.de.kinder@gmail.com"
                  initial={{ opacity: 0, scale: 0.5, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5, y: 10 }}
                  className="absolute left-4 top-4 bg-hot-pink text-white px-4 py-2 rounded-full font-black text-sm whitespace-nowrap shadow-lg pointer-events-auto hover:bg-black hover:scale-110 transition-all"
                >
                  HIRE ME!
                </motion.a>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
