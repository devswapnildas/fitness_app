import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { MLClient } from '@/lib/ml-client';

export async function GET(req: NextRequest) {
  try {
    let user = await getSessionUser(req);
    if (!user) {
      user = await prisma.user.findUnique({
        where: { email: 'alex@fitai.com' },
        include: { profile: true, goals: true },
      });
    }

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user recent workout history
    const recentSessions = await prisma.workoutSession.findMany({
      where: { userId: user.id },
      take: 5,
      include: {
        exerciseSets: {
          include: { exercise: true },
        },
      },
    });

    const userHistory: string[] = [];
    recentSessions.forEach((s) => {
      s.exerciseSets.forEach((set) => {
        if (set.exercise && !userHistory.includes(set.exercise.name)) {
          userHistory.push(set.exercise.name);
        }
      });
    });

    // Fetch exercises from database
    const allExercises = await prisma.exercise.findMany({
      include: { muscleGroup: true },
    });

    const formattedExercises = allExercises.map((ex) => ({
      id: ex.id,
      name: ex.name,
      description: ex.description,
      muscleGroup: ex.muscleGroup.name,
      secondaryMuscles: ex.secondaryMuscles || '',
      equipment: ex.equipment,
      difficulty: ex.difficulty,
      exerciseType: ex.exerciseType,
      defaultSets: ex.defaultSets,
      defaultReps: ex.defaultReps,
      defaultRestSeconds: ex.defaultRestSeconds,
    }));

    let equipmentList = ['barbell', 'dumbbells', 'bodyweight'];
    try {
      if (user.profile?.equipment) {
        equipmentList = JSON.parse(user.profile.equipment);
      }
    } catch {
      // fallback
    }

    const mlResponse = await MLClient.recommendWorkouts({
      exercises: formattedExercises,
      user_history: userHistory,
      goal: user.goals[0]?.goalType || 'gain_muscle',
      fitness_level: user.profile?.fitnessLevel || 'intermediate',
      available_equipment: equipmentList,
      limitations: user.profile?.limitations || '',
      top_k: 6,
    });

    return NextResponse.json({
      status: 'success',
      userProfile: {
        goal: user.goals[0]?.goalType || 'gain_muscle',
        level: user.profile?.fitnessLevel || 'intermediate',
        equipment: equipmentList,
      },
      ...mlResponse,
    });
  } catch (error: any) {
    console.error('Recommendations error:', error);
    return NextResponse.json({ error: 'Failed to generate recommendations' }, { status: 500 });
  }
}
