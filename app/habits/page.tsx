'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import {
  CheckCircle2,
  Droplets,
  Moon,
  Footprints,
  HeartPulse,
  Flame,
  Plus,
  Activity,
  Calculator,
  AlertCircle,
} from 'lucide-react';
import { calculateBMI, calculateBMR, calculateTDEE } from '@/lib/utils';

export default function HabitsPage() {
  const [habits, setHabits] = useState<any[]>([]);
  const [waterData, setWaterData] = useState<any | null>(null);
  const [sleepData, setSleepData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Calculator states
  const [calcHeight, setCalcHeight] = useState(180);
  const [calcWeight, setCalcWeight] = useState(78.5);
  const [calcAge, setCalcAge] = useState(26);
  const [calcGender, setCalcGender] = useState('male');
  const [calcActivity, setCalcActivity] = useState('moderate');

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [hRes, wRes, sRes] = await Promise.all([
        fetch('/api/habits'),
        fetch('/api/water'),
        fetch('/api/sleep'),
      ]);

      if (hRes.ok) {
        const data = await hRes.json();
        setHabits(data.habits || []);
      }
      if (wRes.ok) {
        const data = await wRes.json();
        setWaterData(data);
      }
      if (sRes.ok) {
        const data = await sRes.json();
        setSleepData(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleHabit = async (habitId: string, currentCompleted: boolean) => {
    try {
      const res = await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ habitId, completed: !currentCompleted }),
      });
      if (res.ok) {
        loadAll();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddWater = async (amountMl: number) => {
    try {
      const res = await fetch('/api/water', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountMl }),
      });
      if (res.ok) {
        loadAll();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const bmiResult = calculateBMI(calcHeight, calcWeight);
  const bmrResult = calculateBMR(calcGender, calcWeight, calcHeight, calcAge);
  const tdeeResult = calculateTDEE(bmrResult, calcActivity);

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 pb-24 md:pb-12">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Wellness & Recovery Systems
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">Daily Health Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Habits, Hydration & Calculators
          </h1>
        </div>

        {/* Habits & Hydration Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Habits Tracker (2 Cols) */}
          <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                  <span>Daily Habit Matrix</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Consistent micro-habits anchor long-term physiological transformation.
                </p>
              </div>
              <span className="text-xs text-slate-400 font-mono">Today's Check-in</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {habits.map((h) => {
                const isCompleted = h.habitLogs && h.habitLogs.length > 0 ? h.habitLogs[0].completed : false;
                return (
                  <div
                    key={h.id}
                    onClick={() => handleToggleHabit(h.id, isCompleted)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isCompleted
                        ? 'border-emerald-500/40 bg-emerald-500/10'
                        : 'border-slate-800 bg-slate-950/80 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <h4 className={`text-xs font-bold ${isCompleted ? 'text-emerald-300' : 'text-white'}`}>
                        {h.name}
                      </h4>
                      <span className="text-[10px] text-slate-400">
                        Target: {h.defaultTarget} {h.unit}
                      </span>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                        isCompleted
                          ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                          : 'border-slate-700 text-transparent'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 fill-slate-950 text-white" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Water Tracker (1 Col) */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Droplets className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Hydration Tracker</h3>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-400">
                {waterData?.percentage || 0}%
              </span>
            </div>

            <div className="text-center space-y-2">
              <span className="text-xs text-slate-400 font-medium">Logged Today</span>
              <div className="flex items-baseline justify-center space-x-1 font-mono">
                <span className="text-4xl font-black text-cyan-400">
                  {waterData?.totalTodayMl || 0}
                </span>
                <span className="text-xs text-slate-400">/ {waterData?.targetMl || 2500} ml</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-cyan-500 h-full rounded-full transition-all"
                  style={{ width: `${waterData?.percentage || 0}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => handleAddWater(250)}
                className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700"
              >
                + 250 ml (Cup)
              </button>
              <button
                onClick={() => handleAddWater(500)}
                className="py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-xs font-bold text-slate-950 shadow-md shadow-cyan-500/20"
              >
                + 500 ml (Bottle)
              </button>
            </div>
          </div>
        </div>

        {/* Sleep Tracker Card */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Moon className="w-5 h-5 text-indigo-400" />
              <div>
                <h3 className="text-base font-bold text-white">Sleep Logging & Performance Correlation</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Sleep duration averages {sleepData?.averageHours || 7.8} hours per night.
                </p>
              </div>
            </div>
            <span className="text-xs text-indigo-400 font-mono font-semibold">Weekly Average</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
            <span className="text-indigo-400 font-bold block mb-1">Statistical Correlation Insight:</span>
            {sleepData?.correlationInsight}
          </div>
        </div>

        {/* Interactive Calculators (BMR, TDEE, BMI) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calorie Calculator (Section 22) */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-800">
              <Calculator className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="text-base font-bold text-white">Metabolic & Calorie Calculator</h3>
                <p className="text-xs text-slate-400">Mifflin-St Jeor Energy Expenditure Estimation</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Age</label>
                <input
                  type="number"
                  value={calcAge}
                  onChange={(e) => setCalcAge(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="0.5"
                  value={calcWeight}
                  onChange={(e) => setCalcWeight(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={calcHeight}
                  onChange={(e) => setCalcHeight(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="text-[11px] text-slate-400 block mb-1">Activity Multiplier</label>
                <select
                  value={calcActivity}
                  onChange={(e) => setCalcActivity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                >
                  <option value="sedentary">Sedentary (Little or no exercise)</option>
                  <option value="light">Lightly Active (1-3 days/week)</option>
                  <option value="moderate">Moderately Active (3-5 days/week)</option>
                  <option value="very_active">Very Active (6-7 days/week)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400">Estimated BMR</span>
                <p className="text-xl font-mono font-black text-cyan-400 mt-0.5">{bmrResult} kcal</p>
                <span className="text-[10px] text-slate-500">Basal metabolic burn</span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400">Estimated TDEE</span>
                <p className="text-xl font-mono font-black text-emerald-400 mt-0.5">{tdeeResult} kcal</p>
                <span className="text-[10px] text-slate-500">Maintenance energy</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 italic">
              *Disclaimer: BMR and TDEE are mathematical screening estimates and vary with individual thyroid and lean muscle ratios.
            </p>
          </div>

          {/* BMI Calculator (Section 23) */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-800">
              <Activity className="w-5 h-5 text-indigo-400" />
              <div>
                <h3 className="text-base font-bold text-white">Body Mass Index (BMI) Screen</h3>
                <p className="text-xs text-slate-400">Standard World Health Organization Scale</p>
              </div>
            </div>

            <div className="text-center p-6 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <span className="text-xs uppercase font-bold text-slate-400">Calculated Score</span>
              <p className="text-4xl font-mono font-black text-white">{bmiResult.bmi}</p>
              <span className={`text-xs font-bold px-3 py-1 rounded-full bg-slate-900 border border-slate-800 inline-block ${bmiResult.color}`}>
                {bmiResult.category}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-mono">
              <div className="p-2 rounded bg-slate-950 text-slate-400">
                <span className="block font-bold">&lt; 18.5</span>
                <span>Underweight</span>
              </div>
              <div className="p-2 rounded bg-slate-950 text-emerald-400 font-bold">
                <span className="block font-bold">18.5 - 24.9</span>
                <span>Normal</span>
              </div>
              <div className="p-2 rounded bg-slate-950 text-amber-400">
                <span className="block font-bold">25 - 29.9</span>
                <span>Overweight</span>
              </div>
              <div className="p-2 rounded bg-slate-950 text-rose-400">
                <span className="block font-bold">&ge; 30.0</span>
                <span>Obesity</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 italic">
              *Context Notice: BMI does not distinguish between skeletal muscle mass and adipose tissue. Heavily muscled athletes may screen as overweight despite low body fat.
            </p>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
