import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    let user = await getSessionUser(req);
    if (!user) {
      user = await prisma.user.findUnique({
        where: { email: 'alex@fitai.com' },
      });
    }

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const habits = await prisma.habit.findMany({
      include: {
        habitLogs: {
          where: { userId: user.id },
          orderBy: { date: 'desc' },
          take: 7,
        },
      },
    });

    return NextResponse.json({ status: 'success', habits });
  } catch (error: any) {
    console.error('Habits load error:', error);
    return NextResponse.json({ error: 'Failed to load habits' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    let user = await getSessionUser(req);
    if (!user) {
      user = await prisma.user.findUnique({
        where: { email: 'alex@fitai.com' },
      });
    }

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { habitId, completed, value = 1 } = await req.json();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingLog = await prisma.habitLog.findFirst({
      where: {
        userId: user.id,
        habitId,
        date: { gte: today },
      },
    });

    let log;
    if (existingLog) {
      log = await prisma.habitLog.update({
        where: { id: existingLog.id },
        data: { completed, value },
      });
    } else {
      log = await prisma.habitLog.create({
        data: {
          userId: user.id,
          habitId,
          date: new Date(),
          completed,
          value,
        },
      });
    }

    return NextResponse.json({ status: 'success', log });
  } catch (error: any) {
    console.error('Habit log error:', error);
    return NextResponse.json({ error: 'Failed to update habit' }, { status: 500 });
  }
}
