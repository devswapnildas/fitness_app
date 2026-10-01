import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { MLClient } from '@/lib/ml-client';

export async function POST(req: NextRequest) {
  try {
    let user = await getSessionUser(req);
    if (!user) {
      user = await prisma.user.findUnique({
        where: { email: 'alex@fitai.com' },
        include: { profile: true, goals: true },
      });
    }

    const body = await req.json();
    const {
      fitnessGoal = user?.goals[0]?.goalType || 'gain_muscle',
      fitnessLevel = user?.profile?.fitnessLevel || 'intermediate',
      availableEquipment = ['barbell', 'dumbbells', 'bodyweight'],
      availableDays = user?.profile?.workoutDaysPerWeek || 4,
      workoutDurationMins = user?.profile?.preferredDurationMins || 45,
      preferredExercises = [],
      injuriesLimitations = user?.profile?.limitations || '',
    } = body;

    // Call ML Microservice with rule-based safety validation
    const result = await MLClient.generateWorkoutPlan({
      fitness_goal: fitnessGoal,
      fitness_level: fitnessLevel,
      available_equipment: availableEquipment,
      available_days: availableDays,
      workout_duration_mins: workoutDurationMins,
      preferred_exercises: preferredExercises,
      injuries_limitations: injuriesLimitations,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('AI Workout Generator error:', error);
    return NextResponse.json({ error: 'Failed to generate AI workout plan' }, { status: 500 });
  }
}
