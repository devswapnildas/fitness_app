import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { role = 'user' } = await req.json();

    const emailMap: Record<string, string> = {
      user: 'alex@fitai.com',
      trainer: 'marcus@fitai.com',
      admin: 'admin@fitai.com',
    };

    const targetEmail = emailMap[role] || 'alex@fitai.com';
    const user = await prisma.user.findUnique({
      where: { email: targetEmail },
      include: { profile: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'Demo account not found' }, { status: 404 });
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      status: 'success',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        onboardingCompleted: user.profile?.onboardingCompleted ?? true,
      },
      token,
    });

    response.cookies.set('fitai_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    console.error('Demo login error:', error);
    return NextResponse.json({ error: 'Failed to authenticate demo account' }, { status: 500 });
  }
}
