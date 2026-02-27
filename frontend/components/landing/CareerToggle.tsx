'use client'

import { motion } from 'framer-motion'
import { Code2, Users } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'

type CareerMode = 'dev' | 'csm'

interface CareerToggleProps {
  mode: CareerMode
  setMode: (mode: CareerMode) => void
}

export function CareerToggle({ mode, setMode }: CareerToggleProps) {
  const { t } = useLanguage()

  return (
    <div className="flex justify-center pt-24 pb-2 px-6">
      <div className="relative flex items-center gap-1 bg-black/10 border-2 border-black/15 rounded-full p-1.5">
        {/* Sliding background pill */}
        <motion.div
          className="absolute top-1.5 bottom-1.5 rounded-full"
          initial={false}
          animate={{
            left: mode === 'dev' ? '6px' : '50%',
            right: mode === 'dev' ? '50%' : '6px',
            backgroundColor: mode === 'dev' ? '#000000' : '#ff3fa0',
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />

        <button
          onClick={() => setMode('dev')}
          className="relative z-10 flex items-center gap-2 px-5 py-2 rounded-full font-bold text-sm transition-colors"
          style={{ color: mode === 'dev' ? '#ffffff' : 'rgba(0,0,0,0.5)' }}
        >
          <Code2 className="w-4 h-4" />
          {t.csm.toggleDev}
        </button>

        <button
          onClick={() => setMode('csm')}
          className="relative z-10 flex items-center gap-2 px-5 py-2 rounded-full font-bold text-sm transition-colors"
          style={{ color: mode === 'csm' ? '#ffffff' : 'rgba(0,0,0,0.5)' }}
        >
          <Users className="w-4 h-4" />
          {t.csm.toggleCsm}
        </button>
      </div>
    </div>
  )
}
