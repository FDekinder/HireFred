import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { password } = await req.json()

  if (!password || typeof password !== 'string') {
    return NextResponse.json({ company: null }, { status: 400 })
  }

  // COMPANY_PASSWORDS format: "slug1:Company Name 1,slug2:Company Name 2"
  const raw = process.env.COMPANY_PASSWORDS ?? ''
  const map: Record<string, string> = {}
  for (const entry of raw.split(',')) {
    const [slug, ...nameParts] = entry.trim().split(':')
    if (slug && nameParts.length) map[slug.toLowerCase()] = nameParts.join(':')
  }

  const company = map[password.toLowerCase()] ?? null
  return NextResponse.json({ company })
}
