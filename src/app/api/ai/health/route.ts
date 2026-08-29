import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const isConfigured = !!apiKey && apiKey.length > 5;

  return NextResponse.json({
    configured: isConfigured,
    provider: isConfigured ? 'gemini' : 'offline',
    status: isConfigured ? 'ready' : 'offline_fallback',
    message: isConfigured
      ? 'Google Gemini AI Tutor is connected and ready.'
      : 'Offline Intelligent Tutor active (no API key required).',
  });
}
