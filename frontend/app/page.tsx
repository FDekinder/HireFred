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

export default function HomePage() {
  return (
    <main className="min-h-screen bg-sunny-yellow text-black overflow-x-hidden">
      <VibrantNavbar />
      <VibrantHero />
      <Marquee />
      <VibrantFeatures />
      <SkillBars />
      <VibrantHowItWorks />
      <Testimonials />
      <ContactForm />
      <VibrantCTA />
      <VibrantFooter />
      <ViewCounter />
    </main>
  )
}
