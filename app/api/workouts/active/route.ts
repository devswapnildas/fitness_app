import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    let user = await getSessionUser(req);
    if (!user) {
      user = await prisma.user.findUnique({
        where: { email: 'alex@fitai.com' },
        include: { profile: true, goals: true, trainerProfile: true, subscriptions: true },
      });
    }

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      workoutId,
      title = 'Active Training Session',
      durationSeconds = 3000,
      perceivedExertion = 8,
      notes = '',
      completedSets = [], // [{ exerciseId, setNumber, repsCompleted, weightKg, rpe }]
    } = body;

    let totalVolumeKg = 0;
    const detectedPrs: any[] = [];

    // Calculate estimated 1RM helper: Epley Formula: 1RM = weight * (1 + reps / 30)
    const calc1RM = (weight: number, reps: number) => {
      if (reps <= 1) return weight;
      return Number((weight * (1 + reps / 30)).toFixed(1));
    };

    // Check each set against user's historical progress records
    const processedSets = [];

    for (const set of completedSets) {
      const weight = Number(set.weightKg) || 0;
      const reps = Number(set.repsCompleted) || 0;
      totalVolumeKg += weight * reps;

      const current1RM = calc1RM(weight, reps);

      // Check existing PR
      const existingPr = await prisma.progressRecord.findFirst({
        where: { userId: user.id, exerciseId: set.exerciseId },
      });

      let isPr = false;
      if (weight > 0 && reps > 0) {
        if (!existingPr || current1RM > existingPr.estimatedOneRepMaxKg || weight > existingPr.bestWeightKg) {
          isPr = true;
          // Fetch exercise name
          const exInfo = await prisma.exercise.findUnique({ where: { id: set.exerciseId } });
          detectedPrs.push({
            exerciseName: exInfo?.name || 'Exercise',
            weightKg: weight,
            repsCompleted: reps,
            estimated1RM: current1RM,
          });

          // Upsert PR record
          if (existingPr) {
            await prisma.progressRecord.update({
              where: { id: existingPr.id },
              data: {
                bestWeightKg: Math.max(weight, existingPr.bestWeightKg),
                bestReps: Math.max(reps, existingPr.bestReps),
                estimatedOneRepMaxKg: Math.max(current1RM, existingPr.estimatedOneRepMaxKg),
                totalVolumeKg: existingPr.totalVolumeKg + (weight * reps),
                achievedAt: new Date(),
              },
            });
          } else {
            await prisma.progressRecord.create({
              data: {
                userId: user.id,
                exerciseId: set.exerciseId,
                bestWeightKg: weight,
                bestReps: reps,
                estimatedOneRepMaxKg: current1RM,
                totalVolumeKg: weight * reps,
                achievedAt: new Date(),
              },
            });
          }
        }
      }

      processedSets.push({
        exerciseId: set.exerciseId,
        setNumber: Number(set.setNumber) || 1,
        repsCompleted: reps,
        weightKg: weight,
        rpe: Number(set.rpe) || 8,
        isPr,
      });
    }

    // Estimated calories burned ~ 7 kcal per minute of lifting
    const estimatedCalories = Math.round((durationSeconds / 60) * 7.5);

    // Create completed session
    const session = await prisma.workoutSession.create({
      data: {
        userId: user.id,
        workoutId: workoutId || null,
        title,
        startTime: new Date(Date.now() - durationSeconds * 1000),
        endTime: new Date(),
        durationSeconds,
        totalVolumeKg,
        totalCaloriesBurned: estimatedCalories,
        perceivedExertion: Number(perceivedExertion),
        notes,
        completed: true,
        exerciseSets: {
          create: processedSets,
        },
      },
      include: {
        exerciseSets: {
          include: { exercise: true },
        },
      },
    });

    // Check achievement unlock: First Workout
    const firstWorkoutAch = await prisma.achievement.findUnique({ where: { code: 'FIRST_WORKOUT' } });
    if (firstWorkoutAch) {
      await prisma.userAchievement.upsert({
        where: { userId_achievementId: { userId: user.id, achievementId: firstWorkoutAch.id } },
        update: {},
        create: { userId: user.id, achievementId: firstWorkoutAch.id },
      });
    }

    // Check achievement unlock: PR
    if (detectedPrs.length > 0) {
      const prAch = await prisma.achievement.findUnique({ where: { code: 'FIRST_PR' } });
      if (prAch) {
        await prisma.userAchievement.upsert({
          where: { userId_achievementId: { userId: user.id, achievementId: prAch.id } },
          update: {},
          create: { userId: user.id, achievementId: prAch.id },
        });
      }

      // Add Notification
      await prisma.notification.create({
        data: {
          userId: user.id,
          title: '🔥 New Personal Record!',
          message: `Congratulations! You set a new PR on ${detectedPrs[0].exerciseName}: ${detectedPrs[0].weightKg}kg × ${detectedPrs[0].repsCompleted} reps!`,
          type: 'pr',
        },
      });
    }

    return NextResponse.json({
      status: 'success',
      session,
      detectedPrs,
      summary: {
        durationSeconds,
        durationMinutes: Math.round(durationSeconds / 60),
        totalVolumeKg,
        estimatedCalories,
        exercisesCompletedCount: new Set(processedSets.map((s) => s.exerciseId)).size,
        setsCompletedCount: processedSets.length,
        hasPr: detectedPrs.length > 0,
      },
    });
  } catch (error: any) {
    console.error('Active workout submission error:', error);
    return NextResponse.json({ error: 'Failed to record workout session' }, { status: 500 });
  }
}
