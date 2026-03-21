import { NextRequest, NextResponse } from 'next/server'

// In-memory store (resets on server restart)
// Replace with a real database (e.g. Vercel KV, Upstash Redis) for persistence
const likesStore: Record<string, number> = {}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const likes = likesStore[slug] ?? 0
  return NextResponse.json({ likes })
}

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  likesStore[slug] = (likesStore[slug] ?? 0) + 1
  return NextResponse.json({ likes: likesStore[slug] })
}
