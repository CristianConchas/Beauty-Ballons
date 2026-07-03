import { NextRequest, NextResponse } from 'next/server'
import { createLeadPublic } from '@/lib/actions/leads'
import { z } from 'zod'

const Schema = z.object({
  name:         z.string().min(2).max(60),
  message:      z.string().max(500).optional(),
  source:       z.enum(['hero','service','portfolio','lightbox','float','cta_final','faq','unknown']),
  utm_source:   z.string().optional(),
  utm_medium:   z.string().optional(),
  utm_campaign: z.string().optional(),
  device_type:  z.enum(['mobile','desktop','tablet']).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body   = await req.json()
    const parsed = Schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
    }

    await createLeadPublic(parsed.data)
    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Error interno' }, { status: 500 })
  }
}
