import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { calculateBMR, calculateTDEE } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      age,
      gender,
      heightCm,
      weightKg,
      fitnessLevel = 'intermediate',
      goal = 'gain_muscle',
      activityLevel = 'moderate',
      dailySleepHours = 7.5,
      workType = 'desk',
      workoutDaysPerWeek = 4,
      preferredDurationMins = 45,
      equipment = ['bodyweight'],
      dietaryPreferences = 'none',
      limitations = '',
    } = body;

    const bmr = calculateBMR(gender || 'male', Number(weightKg) || 75, Number(heightCm) || 175, Number(age) || 25);
    const tdee = calculateTDEE(bmr, activityLevel);

    let calorieTarget = tdee;
    if (goal === 'lose_weight') calorieTarget = Math.max(1400, tdee - 500);
    else if (goal === 'gain_muscle') calorieTarget = tdee + 350;

    // Update profile
    const updatedProfile = await prisma.userProfile.upsert({
      where: { userId: user.id },
      update: {
        gender,
        heightCm: Number(heightCm),
        currentWeightKg: Number(weightKg),
        fitnessLevel,
        activityLevel,
        dailySleepHours: Number(dailySleepHours),
        workType,
        workoutDaysPerWeek: Number(workoutDaysPerWeek),
        preferredDurationMins: Number(preferredDurationMins),
        equipment: JSON.stringify(equipment),
        dietaryPreferences,
        limitations,
        bmr,
        tdee,
        calorieTarget,
        onboardingCompleted: true,
      },
      create: {
        userId: user.id,
        gender,
        heightCm: Number(heightCm),
        currentWeightKg: Number(weightKg),
        fitnessLevel,
        activityLevel,
        dailySleepHours: Number(dailySleepHours),
        workType,
        workoutDaysPerWeek: Number(workoutDaysPerWeek),
        preferredDurationMins: Number(preferredDurationMins),
        equipment: JSON.stringify(equipment),
        dietaryPreferences,
        limitations,
        bmr,
        tdee,
        calorieTarget,
        onboardingCompleted: true,
      },
    });

    // Update or create active goal
    await prisma.fitnessGoal.create({
      data: {
        userId: user.id,
        goalType: goal,
        targetValue: Number(weightKg),
        currentValue: Number(weightKg),
        unit: 'kg',
        status: 'active',
      },
    });

    return NextResponse.json({
      status: 'success',
      profile: updatedProfile,
      message: 'Onboarding completed successfully!',
    });
  } catch (error: any) {
    console.error('Onboarding update error:', error);
    return NextResponse.json({ error: 'Failed to complete onboarding' }, { status: 500 });
  }
}
