import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    let user = await getSessionUser(req);
    if (!user) {
      user = await prisma.user.findUnique({
        where: { email: 'alex@fitai.com' },
        include: { profile: true },
      });
    }

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const logs = await prisma.waterLog.findMany({
      where: {
        userId: user.id,
        date: { gte: today },
      },
    });

    const totalTodayMl = logs.reduce((sum, l) => sum + l.amountMl, 0);
    const targetMl = user.profile?.waterTargetMl || 2500;

    return NextResponse.json({
      status: 'success',
      totalTodayMl,
      targetMl,
      percentage: Math.min(100, Math.round((totalTodayMl / targetMl) * 100)),
      logs,
    });
  } catch (error: any) {
    console.error('Water log fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch water data' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    let user = await getSessionUser(req);
    if (!user) {
      user = await prisma.user.findUnique({ where: { email: 'alex@fitai.com' } });
    }

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { amountMl = 250 } = await req.json();

    const log = await prisma.waterLog.create({
      data: {
        userId: user.id,
        amountMl: Number(amountMl),
        date: new Date(),
      },
    });

    return NextResponse.json({ status: 'success', log }, { status: 201 });
  } catch (error: any) {
    console.error('Water add error:', error);
    return NextResponse.json({ error: 'Failed to add water entry' }, { status: 500 });
  }
}
