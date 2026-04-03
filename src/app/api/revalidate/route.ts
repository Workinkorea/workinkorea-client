import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { tag, secret } = await request.json()

  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!tag || typeof tag !== 'string') {
    return NextResponse.json({ error: 'tag is required' }, { status: 400 })
  }

  revalidateTag(tag)
  return NextResponse.json({ revalidated: true, tag })
}
