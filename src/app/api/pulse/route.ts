import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Save everything under 'lifeline-state'
    await kv.set('lifeline-state', body);

    return NextResponse.json({ success: true, timestamp: Date.now() });
  } catch (error) {
    console.error('KV Write Error:', error);
    return NextResponse.json({ success: false, error: 'Sync failed' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const state = await kv.get('lifeline-state');
    return NextResponse.json(state || {});
  } catch (error) {
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
  }
}
