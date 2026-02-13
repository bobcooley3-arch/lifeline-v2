import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.REDIS_URL || '',
  token: process.env.REDIS_TOKEN || '',
});

export async function GET() {
  const d = await redis.get('lifeline-state');
  return NextResponse.json(d || {});
}

export async function POST(req: Request) {
  const b = await req.json();
  await redis.set('lifeline-state', b);
  return NextResponse.json({ ok: true });
}
