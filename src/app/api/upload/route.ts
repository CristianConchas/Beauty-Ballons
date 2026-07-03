import { NextRequest, NextResponse } from 'next/server'
import { getUploadSignedUrl } from '@/lib/actions/portfolio'

export async function POST(req: NextRequest) {
  try {
    const { filename, mimeType } = await req.json()
    const result = await getUploadSignedUrl(filename, mimeType)
    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
