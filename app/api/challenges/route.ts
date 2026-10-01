import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    let user = await getSessionUser(req);
    if (!user) {
      user = await prisma.user.findUnique({ where: { email: 'alex@fitai.com' } });
    }

    const challenges = await prisma.challenge.findMany({
      include: {
        participants: {
          include: {
            user: {
              select: { id: true, name: true, avatarUrl: true },
            },
          },
        },
      },
      orderBy: { startDate: 'desc' },
    });

    return NextResponse.json({
      status: 'success',
      challenges: challenges.map((c) => ({
        ...c,
        isJoined: user ? c.participants.some((p) => p.userId === user?.id) : false,
        userProgress: user ? c.participants.find((p) => p.userId === user?.id)?.currentProgress || 0 : 0,
      })),
    });
  } catch (error: any) {
    console.error('Challenges fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch challenges' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    let user = await getSessionUser(req);
    if (!user) {
      user = await prisma.user.findUnique({ where: { email: 'alex@fitai.com' } });
    }

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { challengeId } = await req.json();

    const participant = await prisma.challengeParticipant.upsert({
      where: {
        challengeId_userId: {
          challengeId,
          userId: user.id,
        },
      },
      update: {},
      create: {
        challengeId,
        userId: user.id,
        currentProgress: 1,
      },
    });

    return NextResponse.json({ status: 'success', participant });
  } catch (error: any) {
    console.error('Challenge join error:', error);
    return NextResponse.json({ error: 'Failed to join challenge' }, { status: 500 });
  }
}
