'use client'

import { VibrantNavbar } from '@/components/landing/VibrantNavbar'
import { VibrantHero } from '@/components/landing/VibrantHero'
import { Marquee } from '@/components/landing/Marquee'
import { VibrantFeatures } from '@/components/landing/VibrantFeatures'
import { SkillBars } from '@/components/landing/SkillBars'
import { VibrantHowItWorks } from '@/components/landing/VibrantHowItWorks'
import { Testimonials } from '@/components/landing/Testimonials'
import { ContactForm } from '@/components/landing/ContactForm'
import { VibrantCTA } from '@/components/landing/VibrantCTA'
import { VibrantFooter } from '@/components/landing/VibrantFooter'
import { ViewCounter } from '@/components/landing/ViewCounter'
import { CustomCursor } from '@/components/landing/CustomCursor'
import { PasswordGate } from '@/components/landing/PasswordGate'
import { useCompany } from '@/lib/company'

export default function HomePage() {
  const [company, setCompany] = useCompany()

  if (!company) {
    return <PasswordGate onUnlock={setCompany} />
  }

  return (
    <main className="min-h-screen bg-sunny-yellow text-black overflow-x-hidden">
      <CustomCursor />
      <VibrantNavbar />
      <VibrantHero company={company} />
      <Marquee />
      <VibrantFeatures />
      <SkillBars />
      <VibrantHowItWorks company={company} />
      <Testimonials />
      <ContactForm company={company} />
      <VibrantCTA />
      <VibrantFooter company={company} />
      <ViewCounter />
    </main>
  )
}
