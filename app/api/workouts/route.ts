import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const plans = await prisma.workoutPlan.findMany({
      include: {
        workouts: {
          include: {
            exercises: {
              include: { exercise: { include: { muscleGroup: true } } },
              orderBy: { orderIndex: 'asc' },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const standaloneWorkouts = await prisma.workout.findMany({
      where: { planId: null },
      include: {
        exercises: {
          include: { exercise: { include: { muscleGroup: true } } },
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    return NextResponse.json({
      status: 'success',
      plans,
      standaloneWorkouts,
    });
  } catch (error: any) {
    console.error('Error fetching workouts:', error);
    return NextResponse.json({ error: 'Failed to fetch workouts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    const body = await req.json();
    const { title, description, dayOfWeek, estimatedDurationMins = 45, exercises = [] } = body;

    if (!title || exercises.length === 0) {
      return NextResponse.json({ error: 'Workout title and at least one exercise are required' }, { status: 400 });
    }

    const workout = await prisma.workout.create({
      data: {
        title,
        description,
        dayOfWeek: dayOfWeek ? Number(dayOfWeek) : null,
        estimatedDurationMins: Number(estimatedDurationMins),
        exercises: {
          create: exercises.map((item: any, idx: number) => ({
            exerciseId: item.exerciseId,
            orderIndex: idx + 1,
            targetSets: Number(item.targetSets) || 3,
            targetReps: Number(item.targetReps) || 10,
            targetWeightKg: Number(item.targetWeightKg) || 0,
            targetRestSeconds: Number(item.targetRestSeconds) || 60,
            notes: item.notes || '',
          })),
        },
      },
      include: {
        exercises: {
          include: { exercise: true },
        },
      },
    });

    return NextResponse.json({ status: 'success', workout }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating workout:', error);
    return NextResponse.json({ error: 'Failed to create workout' }, { status: 500 });
  }
}
