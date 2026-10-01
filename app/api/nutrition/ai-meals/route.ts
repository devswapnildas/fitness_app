import { NextRequest, NextResponse } from 'next/server';
import { MLClient } from '@/lib/ml-client';
import { getSessionUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    const body = await req.json();
    const {
      availableIngredients = ['Eggs', 'Rice', 'Chicken', 'Vegetables'],
      fitnessGoal = user?.goals[0]?.goalType || 'gain_muscle',
      dietaryPreference = user?.profile?.dietaryPreferences || 'none',
      targetCalories = 550,
      targetProteinG = 40,
    } = body;

    const result = await MLClient.recommendMeals({
      available_ingredients: availableIngredients,
      fitness_goal: fitnessGoal,
      dietary_preference: dietaryPreference,
      target_calories: targetCalories,
      target_protein_g: targetProteinG,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('AI meal generation error:', error);
    return NextResponse.json({ error: 'Failed to generate pantry meal recommendations' }, { status: 500 });
  }
}
