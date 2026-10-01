import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCalories(kcal: number): string {
  return new Intl.NumberFormat('en-US').format(Math.round(kcal));
}

export function formatWeight(kg: number): string {
  return `${kg.toFixed(1)} kg`;
}

export function calculateBMI(heightCm: number, weightKg: number): { bmi: number; category: string; color: string } {
  if (!heightCm || !weightKg || heightCm <= 0) {
    return { bmi: 0, category: 'Unknown', color: 'text-zinc-400' };
  }
  const heightM = heightCm / 100;
  const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));

  if (bmi < 18.5) return { bmi, category: 'Underweight', color: 'text-amber-400' };
  if (bmi < 25) return { bmi, category: 'Normal weight', color: 'text-emerald-400' };
  if (bmi < 30) return { bmi, category: 'Overweight', color: 'text-amber-400' };
  return { bmi, category: 'Obesity', color: 'text-rose-400' };
}

export function calculateBMR(gender: string, weightKg: number, heightCm: number, age: number): number {
  // Mifflin-St Jeor Equation
  if (gender === 'female') {
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age - 161);
  }
  return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + 5);
}

export function calculateTDEE(bmr: number, activityLevel: string): number {
  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    very_active: 1.725,
    extra_active: 1.9,
  };
  const mult = multipliers[activityLevel] || 1.55;
  return Math.round(bmr * mult);
}
