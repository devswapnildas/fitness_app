import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, signToken } from '@/lib/auth';
import { calculateBMR, calculateTDEE } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      password,
      dateOfBirth,
      gender,
      height,
      weight,
      fitnessLevel = 'beginner',
      fitnessGoal = 'general_fitness',
      activityLevel = 'moderate',
    } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const heightCm = height ? parseFloat(height) : 175;
    const currentWeightKg = weight ? parseFloat(weight) : 70;
    const age = dateOfBirth ? Math.max(16, Math.floor((Date.now() - new Date(dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))) : 25;

    const bmr = calculateBMR(gender || 'male', currentWeightKg, heightCm, age);
    const tdee = calculateTDEE(bmr, activityLevel);

    // Goal based calorie adjustment
    let calorieTarget = tdee;
    if (fitnessGoal === 'lose_weight') calorieTarget = Math.max(1400, tdee - 500);
    if (fitnessGoal === 'gain_muscle') calorieTarget = tdee + 350;

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        passwordHash,
        role: 'user',
        profile: {
          create: {
            dateOfBirth,
            gender,
            heightCm,
            currentWeightKg,
            targetWeightKg: currentWeightKg,
            fitnessLevel,
            activityLevel,
            bmr,
            tdee,
            calorieTarget,
            waterTargetMl: 2500,
            onboardingCompleted: false,
          },
        },
        goals: {
          create: {
            goalType: fitnessGoal,
            targetValue: currentWeightKg,
            currentValue: currentWeightKg,
            unit: 'kg',
            status: 'active',
          },
        },
      },
      include: {
        profile: true,
      },
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      status: 'success',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        onboardingCompleted: false,
      },
      token,
    }, { status: 201 });

    response.cookies.set('fitai_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Failed to create user account' }, { status: 500 });
  }
}
