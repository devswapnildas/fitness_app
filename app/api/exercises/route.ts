import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const muscle = searchParams.get('muscle') || '';
    const equipment = searchParams.get('equipment') || '';
    const difficulty = searchParams.get('difficulty') || '';
    const poseSupported = searchParams.get('pose') === 'true';

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { secondaryMuscles: { contains: search } },
      ];
    }

    if (muscle && muscle !== 'all') {
      where.muscleGroup = { name: muscle };
    }

    if (equipment && equipment !== 'all') {
      where.equipment = equipment;
    }

    if (difficulty && difficulty !== 'all') {
      where.difficulty = difficulty;
    }

    if (poseSupported) {
      where.poseSupported = true;
    }

    const [exercises, muscleGroups] = await Promise.all([
      prisma.exercise.findMany({
        where,
        include: { muscleGroup: true },
        orderBy: { name: 'asc' },
      }),
      prisma.muscleGroup.findMany({ orderBy: { name: 'asc' } }),
    ]);

    return NextResponse.json({
      status: 'success',
      total: exercises.length,
      exercises,
      muscleGroups,
    });
  } catch (error: any) {
    console.error('Error fetching exercises:', error);
    return NextResponse.json({ error: 'Failed to load exercises' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      description,
      muscleGroupId,
      secondaryMuscles,
      equipment,
      difficulty = 'intermediate',
      instructions,
      defaultSets = 3,
      defaultReps = 10,
      defaultRestSeconds = 60,
      estimatedCalories = 8.0,
      exerciseType = 'strength',
      poseSupported = false,
    } = body;

    if (!name || !muscleGroupId || !equipment || !instructions) {
      return NextResponse.json({ error: 'Missing required exercise fields' }, { status: 400 });
    }

    const created = await prisma.exercise.create({
      data: {
        name,
        description: description || `Form instructions for ${name}`,
        muscleGroupId,
        secondaryMuscles,
        equipment,
        difficulty,
        instructions,
        defaultSets: Number(defaultSets),
        defaultReps: Number(defaultReps),
        defaultRestSeconds: Number(defaultRestSeconds),
        estimatedCalories: Number(estimatedCalories),
        exerciseType,
        poseSupported: Boolean(poseSupported),
      },
      include: { muscleGroup: true },
    });

    return NextResponse.json({ status: 'success', exercise: created }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating exercise:', error);
    return NextResponse.json({ error: 'Failed to create exercise' }, { status: 500 });
  }
}
