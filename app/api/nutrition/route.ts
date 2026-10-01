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

    // Fetch meals logged today
    const meals = await prisma.meal.findMany({
      where: {
        userId: user.id,
        date: { gte: today },
      },
      include: {
        items: {
          include: { food: true },
        },
      },
    });

    // Fetch foods database
    const foods = await prisma.food.findMany({
      orderBy: { name: 'asc' },
    });

    // Fetch or calculate today's nutrition log
    let nutritionLog = await prisma.nutritionLog.findFirst({
      where: {
        userId: user.id,
        date: { gte: today },
      },
    });

    const targetCalories = user.profile?.calorieTarget || 2500;
    const targetProteinG = Math.round((user.profile?.currentWeightKg || 75) * 2.2); // ~2.2g per kg
    const targetCarbsG = Math.round((targetCalories * 0.45) / 4);
    const targetFatG = Math.round((targetCalories * 0.25) / 9);

    let consumedCalories = 0;
    let consumedProteinG = 0;
    let consumedCarbsG = 0;
    let consumedFatG = 0;

    meals.forEach((m) => {
      consumedCalories += m.totalCalories;
      consumedProteinG += m.totalProteinG;
      consumedCarbsG += m.totalCarbsG;
      consumedFatG += m.totalFatG;
    });

    if (!nutritionLog && meals.length > 0) {
      nutritionLog = await prisma.nutritionLog.create({
        data: {
          userId: user.id,
          date: new Date(),
          targetCalories,
          consumedCalories,
          targetProteinG,
          consumedProteinG,
          targetCarbsG,
          consumedCarbsG,
          targetFatG,
          consumedFatG,
        },
      });
    }

    return NextResponse.json({
      status: 'success',
      targets: {
        calories: targetCalories,
        proteinG: targetProteinG,
        carbsG: targetCarbsG,
        fatG: targetFatG,
      },
      consumed: {
        calories: Math.round(consumedCalories),
        proteinG: Math.round(consumedProteinG),
        carbsG: Math.round(consumedCarbsG),
        fatG: Math.round(consumedFatG),
      },
      meals,
      foods,
    });
  } catch (error: any) {
    console.error('Nutrition load error:', error);
    return NextResponse.json({ error: 'Failed to load nutrition data' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    let user = await getSessionUser(req);
    if (!user) {
      user = await prisma.user.findUnique({
        where: { email: 'alex@fitai.com' },
        include: { profile: true },
      });
    }

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { mealName = 'Lunch', items = [] } = body;

    let totalCalories = 0;
    let totalProteinG = 0;
    let totalCarbsG = 0;
    let totalFatG = 0;

    const formattedItems = [];

    for (const it of items) {
      const food = await prisma.food.findUnique({ where: { id: it.foodId } });
      if (food) {
        const servings = Number(it.servings) || 1;
        const cal = food.calories * servings;
        const p = food.proteinG * servings;
        const c = food.carbsG * servings;
        const f = food.fatG * servings;

        totalCalories += cal;
        totalProteinG += p;
        totalCarbsG += c;
        totalFatG += f;

        formattedItems.push({
          foodId: food.id,
          servings,
          calories: Math.round(cal),
          proteinG: Math.round(p),
          carbsG: Math.round(c),
          fatG: Math.round(f),
        });
      }
    }

    const meal = await prisma.meal.create({
      data: {
        userId: user.id,
        name: mealName,
        date: new Date(),
        totalCalories: Math.round(totalCalories),
        totalProteinG: Math.round(totalProteinG),
        totalCarbsG: Math.round(totalCarbsG),
        totalFatG: Math.round(totalFatG),
        items: {
          create: formattedItems,
        },
      },
      include: {
        items: { include: { food: true } },
      },
    });

    return NextResponse.json({ status: 'success', meal }, { status: 201 });
  } catch (error: any) {
    console.error('Error logging meal:', error);
    return NextResponse.json({ error: 'Failed to log meal' }, { status: 500 });
  }
}
