import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      status: 'success',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        profile: user.profile,
        goals: user.goals,
        trainerProfile: user.trainerProfile,
        subscription: user.subscriptions[0] || { tier: 'pro', status: 'active' },
      },
    });
  } catch (error: any) {
    console.error('Session retrieval error:', error);
    return NextResponse.json({ error: 'Failed to verify session' }, { status: 500 });
  }
}
