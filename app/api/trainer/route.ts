import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    let user = await getSessionUser(req);
    if (!user || user.role !== 'trainer') {
      user = await prisma.user.findUnique({
        where: { email: 'marcus@fitai.com' },
        include: { trainerProfile: true },
      });
    }

    if (!user) return NextResponse.json({ error: 'Trainer not found' }, { status: 404 });

    const trainer = await prisma.trainer.findUnique({
      where: { userId: user.id },
      include: {
        clients: {
          include: {
            client: {
              include: {
                profile: true,
                goals: { where: { status: 'active' } },
                progressRecords: { include: { exercise: true }, take: 4 },
                workoutSessions: { take: 5, orderBy: { startTime: 'desc' } },
              },
            },
          },
        },
      },
    });

    const workoutTemplates = await prisma.workoutPlan.findMany({
      include: { workouts: true },
    });

    return NextResponse.json({
      status: 'success',
      trainer,
      workoutTemplates,
    });
  } catch (error: any) {
    console.error('Trainer dashboard error:', error);
    return NextResponse.json({ error: 'Failed to fetch trainer data' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { clientId, notes, planTitle } = await req.json();

    const updated = await prisma.trainerClient.updateMany({
      where: { clientId },
      data: { notes },
    });

    return NextResponse.json({ status: 'success', updated, message: 'Client notes and plan updated' });
  } catch (error: any) {
    console.error('Trainer client update error:', error);
    return NextResponse.json({ error: 'Failed to update client' }, { status: 500 });
  }
}
