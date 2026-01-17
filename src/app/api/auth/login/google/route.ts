import { NextResponse } from 'next/server';

/**
 * Google OAuth 로그인 시작
 *
 * GET /api/auth/login/google
 * → Google 인증 페이지로 리다이렉트
 * → Google이 백엔드 callback URL로 리다이렉트
 */
export async function GET() {
  try {
    // 백엔드 callback URL
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const redirectUri = `${backendUrl}/api/auth/login/google/callback`;

    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID || '',
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'email profile',
      access_type: 'offline',
      prompt: 'consent',
    });

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

    return NextResponse.redirect(googleAuthUrl);
  } catch (error) {
    console.error('[Google OAuth] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
