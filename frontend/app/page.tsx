'use client'

import { useState } from 'react'
import { VibrantNavbar } from '@/components/landing/VibrantNavbar'
import { VibrantHero } from '@/components/landing/VibrantHero'
import { Marquee } from '@/components/landing/Marquee'
import { VibrantFeatures } from '@/components/landing/VibrantFeatures'
import { CsmFeatures } from '@/components/landing/CsmFeatures'
import { SkillBars } from '@/components/landing/SkillBars'
import { CsmTimeline } from '@/components/landing/CsmTimeline'
import { VibrantHowItWorks } from '@/components/landing/VibrantHowItWorks'
import { Testimonials } from '@/components/landing/Testimonials'
import { ContactForm } from '@/components/landing/ContactForm'
import { VibrantCTA } from '@/components/landing/VibrantCTA'
import { VibrantFooter } from '@/components/landing/VibrantFooter'
import { ViewCounter } from '@/components/landing/ViewCounter'
import { CustomCursor } from '@/components/landing/CustomCursor'
import { PasswordGate } from '@/components/landing/PasswordGate'
import { CareerToggle } from '@/components/landing/CareerToggle'
import { useCompany } from '@/lib/company'

type CareerMode = 'dev' | 'csm'

export default function HomePage() {
  const [company, setCompany] = useCompany()
  const [careerMode, setCareerMode] = useState<CareerMode>('dev')

  if (!company) {
    return <PasswordGate onUnlock={setCompany} />
  }

  return (
    <main className="min-h-screen bg-sunny-yellow text-black overflow-x-hidden">
      <CustomCursor />
      <VibrantNavbar />
      <CareerToggle mode={careerMode} setMode={setCareerMode} />
      <VibrantHero company={company} mode={careerMode} />
      <Marquee />
      {careerMode === 'dev' ? <VibrantFeatures /> : <CsmFeatures />}
      {careerMode === 'dev' ? <SkillBars /> : <CsmTimeline />}
      <VibrantHowItWorks company={company} mode={careerMode} />
      <Testimonials mode={careerMode} />
      <ContactForm company={company} mode={careerMode} />
      <VibrantCTA mode={careerMode} />
      <VibrantFooter company={company} />
      <ViewCounter />
    </main>
  )
}
