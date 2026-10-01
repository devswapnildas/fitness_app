'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import ActiveWorkoutModal from '@/components/workout/ActiveWorkoutModal';
import {
  Flame,
  Dumbbell,
  TrendingUp,
  Activity,
  Calendar,
  Sparkles,
  Trophy,
  CheckCircle2,
  Clock,
  ChevronRight,
  Play,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Zap,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export default function DashboardPage() {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeWorkout, setActiveWorkout] = useState<any | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await fetch('/api/dashboard');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-[#080c14] text-slate-100">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin"></div>
          <p className="text-xs text-slate-400">Loading FitAI Dashboard & Predictive Metrics...</p>
        </div>
      </div>
    );
  }

  const { overview, todayWorkout, charts, aiInsights, personalRecords, user } = data;

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 pb-24 md:pb-12">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                FitAI Sports Performance Hub
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400 capitalize">
                {user.role} Profile ({user.fitnessLevel || 'Intermediate'})
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Welcome back, {user.name}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Goal: {user.goal?.replace('_', ' ').toUpperCase()} • Progressive overload status is currently <span className="text-emerald-400 font-bold">OPTIMAL</span>.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {todayWorkout && (
              <button
                onClick={() => setActiveWorkout(todayWorkout)}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Start Today's Workout</span>
              </button>
            )}
          </div>
        </div>

        {/* Overview Cards (Section 5) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* 1. Current Weight */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Bodyweight</span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-xl sm:text-2xl font-black text-white font-mono">{overview.currentWeight}</span>
              <span className="text-xs text-slate-400">kg</span>
            </div>
            <div className="flex items-center text-[10px] text-emerald-400 font-semibold">
              <ArrowUpRight className="w-3 h-3 mr-0.5" />
              <span>+{overview.weightChange} kg (6 wk)</span>
            </div>
          </div>

          {/* 2. BMI */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">BMI Screening</span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-xl sm:text-2xl font-black text-white font-mono">{overview.bmi}</span>
            </div>
            <span className={`text-[10px] font-semibold ${overview.bmiColor}`}>
              {overview.bmiCategory}
            </span>
          </div>

          {/* 3. Weekly Workouts */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Weekly Sessions</span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-xl sm:text-2xl font-black text-cyan-400 font-mono">{overview.weeklyWorkouts}</span>
              <span className="text-xs text-slate-400">/ 4 days</span>
            </div>
            <span className="text-[10px] text-slate-400">Target frequency</span>
          </div>

          {/* 4. Calories Burned */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Cal. Expended</span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
                {overview.weeklyCaloriesBurned.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400">kcal</span>
            </div>
            <span className="text-[10px] text-slate-400">Active workout burn</span>
          </div>

          {/* 5. Current Streak */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Active Streak</span>
            <div className="flex items-center space-x-1.5">
              <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span className="text-xl sm:text-2xl font-black text-white font-mono">{overview.currentStreak}</span>
              <span className="text-xs text-slate-400">days</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold">Habit consistency</span>
          </div>

          {/* 6. Goal Progress */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Goal Completion</span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-xl sm:text-2xl font-black text-indigo-400 font-mono">{overview.goalProgressPct}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${overview.goalProgressPct}%` }}></div>
            </div>
          </div>
        </div>

        {/* Today's Workout & Real AI Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Plan (2 Cols) */}
          <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Today's Protocol</span>
                <h2 className="text-xl font-bold text-white mt-0.5">
                  {todayWorkout?.title || 'Hypertrophy Session'}
                </h2>
              </div>
              <div className="flex items-center space-x-3 text-xs text-slate-400">
                <span className="flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>{todayWorkout?.estimatedDurationMins || 45} mins</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>{todayWorkout?.estimatedCalories || 380} kcal</span>
                </span>
              </div>
            </div>

            {/* Exercise List */}
            <div className="space-y-2.5">
              {todayWorkout?.exercises?.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-400 text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <h3 className="text-xs font-bold text-white">{item.exercise?.name}</h3>
                      <p className="text-[11px] text-slate-400 capitalize">
                        {item.exercise?.equipment} • {item.exercise?.muscleGroup?.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-xs">
                    <span className="px-2.5 py-1 bg-slate-900 rounded-lg text-slate-300 font-mono font-semibold">
                      {item.targetSets} sets × {item.targetReps} reps
                    </span>
                    {item.targetWeightKg > 0 && (
                      <span className="text-cyan-400 font-mono font-semibold hidden sm:inline">
                        {item.targetWeightKg} kg
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-slate-400 italic">
                Rest periods set to 60-90s between working sets.
              </span>
              {todayWorkout && (
                <button
                  onClick={() => setActiveWorkout(todayWorkout)}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center space-x-1.5 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Launch Live Workout Player</span>
                </button>
              )}
            </div>
          </div>

          {/* AI Insights & PRs (1 Col) */}
          <div className="space-y-6">
            {/* AI Insights Card */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Algorithmic Data Insights</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Real-Time</span>
              </div>

              <div className="space-y-3">
                {aiInsights?.map((ins: any) => (
                  <div
                    key={ins.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">{ins.title}</span>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 font-semibold">
                        {ins.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{ins.message}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Personal Records Box */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>Verified Personal Records</span>
                </span>
              </div>

              <div className="space-y-2">
                {personalRecords?.map((pr: any) => (
                  <div
                    key={pr.id}
                    className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <h4 className="font-semibold text-slate-200">{pr.exercise?.name}</h4>
                      <p className="text-[10px] text-slate-500">1RM: ~{pr.estimatedOneRepMaxKg} kg</p>
                    </div>
                    <span className="font-mono font-bold text-amber-400">
                      {pr.bestWeightKg}kg × {pr.bestReps}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Progress Analytics Charts (Recharts) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weight & Body Composition Chart */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Historical Trend</span>
                <h3 className="text-base font-bold text-white">Bodyweight & Composition</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Last 6 Weeks</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={charts.weight}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} domain={['dataMin - 1', 'dataMax + 1']} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 8, fontSize: 12 }}
                  />
                  <Line type="monotone" dataKey="weight" name="Weight (kg)" stroke="#38bdf8" strokeWidth={3} dot={{ fill: '#0284c7', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Strength Overload Progression */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Overload Trajectory</span>
                <h3 className="text-base font-bold text-white">Bench Press & Compound Progression</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Working Loads (kg)</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.strengthProgression}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="week" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} domain={[70, 160]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 8, fontSize: 12 }}
                  />
                  <Bar dataKey="bench" name="Bench Press (kg)" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="squat" name="Squat (kg)" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="deadlift" name="Deadlift (kg)" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>

      {/* Active Workout Player Modal */}
      {activeWorkout && (
        <ActiveWorkoutModal
          workout={activeWorkout}
          onClose={() => setActiveWorkout(null)}
          onWorkoutComplete={() => {
            loadDashboard();
          }}
        />
      )}

      <BottomNav />
    </div>
  );
}
