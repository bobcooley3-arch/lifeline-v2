import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'

// The Vault Connection
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export async function POST(req) {
  try {
    const data = await req.json();
    const timestamp = Date.now();
    
    // Lock the data into the Frankfurt Vault
    // We use a "List" so we have a chronological forensic trail
    await redis.lpush('sarah_lifeline_logs', JSON.stringify({
      ...data,
      timestamp,
      forensic_id: `LOG-${timestamp}`
    }));

    return NextResponse.json({ success: true, message: "Vault Secured" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
