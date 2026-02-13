import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.REDIS_URL || '',
  token: process.env.REDIS_TOKEN || '',
});

export async function GET() {
  try {
    const data = await redis.get('lifeline-state');
    return NextResponse.json(data || { lat: 51.5074, lng: -0.1278 });
  } catch (e) {
    return NextResponse.json({ error: 'Read Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await redis.set('lifeline-state', body);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Write Error' }, { status: 500 });
  }
}
