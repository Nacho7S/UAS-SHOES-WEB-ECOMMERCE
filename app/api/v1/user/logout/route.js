import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const res = NextResponse.json({ success: true });

    res.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0,
    });

    return res;
  } catch (err) {
    console.error('Logout error:', err);
    return NextResponse.json(
      { success: false, message: 'Internal server error during logout' },
      { status: 500 }
    );
  }
}