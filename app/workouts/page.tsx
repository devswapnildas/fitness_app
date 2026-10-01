'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import ActiveWorkoutModal from '@/components/workout/ActiveWorkoutModal';
import {
  Dumbbell,
  Play,
  Sparkles,
  Plus,
  Clock,
  Flame,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  X,
} from 'lucide-react';

export default function WorkoutsPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [standaloneWorkouts, setStandaloneWorkouts] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Active Live Workout Player Modal
  const [selectedWorkoutForExecution, setSelectedWorkoutForExecution] = useState<any | null>(null);

  // AI Workout Generator Modal
  const [generatorModalOpen, setGeneratorModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<any | null>(null);

  const [genForm, setGenForm] = useState({
    fitnessGoal: 'gain_muscle',
    fitnessLevel: 'intermediate',
    availableEquipment: ['barbell', 'dumbbells', 'bodyweight'],
    availableDays: 4,
    workoutDurationMins: 45,
    injuriesLimitations: '',
  });

  useEffect(() => {
    loadWorkoutsData();
  }, []);

  const loadWorkoutsData = async () => {
    try {
      const [wRes, rRes] = await Promise.all([
        fetch('/api/workouts'),
        fetch('/api/ai/recommendations'),
      ]);

      if (wRes.ok) {
        const data = await wRes.json();
        setPlans(data.plans || []);
        setStandaloneWorkouts(data.standaloneWorkouts || []);
      }

      if (rRes.ok) {
        const rData = await rRes.json();
        setRecommendations(rData.recommendations || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAIPlan = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/workout-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(genForm),
      });

      if (res.ok) {
        const result = await res.json();
        setGeneratedPlan(result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 pb-24 md:pb-12">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Training Programs & Execution
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">Periodized Splits</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">Workouts & Routines</h1>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setGeneratedPlan(null);
                setGeneratorModalOpen(true);
              }}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              <span>AI Workout Generator</span>
            </button>
          </div>
        </div>

        {/* ML Recommended Exercises Row (Section 8) */}
        {recommendations.length > 0 && (
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/30 border border-cyan-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="p-1 rounded-md bg-cyan-500/20 text-cyan-400">
                  <Sparkles className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-bold text-white">
                  ML Personalized Recommendations (Scikit-Learn Content-Based)
                </h3>
              </div>
              <span className="text-[10px] text-cyan-400 font-mono">Matched on Adherence & 1RM</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {recommendations.slice(0, 3).map((rec, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{rec.name}</span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold">
                      {Math.round(rec.relevance_score * 100)}% Match
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{rec.ai_rationale}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Training Programs */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-cyan-400" />
            <span>Structured Workout Programs</span>
          </h2>

          <div className="space-y-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                        {plan.daysPerWeek} Days / Week • {plan.durationWeeks} Weeks
                      </span>
                      {plan.isAiGenerated && (
                        <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                          AI Blueprint
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white mt-1">{plan.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">{plan.description}</p>
                  </div>
                </div>

                {/* Sub-Workouts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {plan.workouts?.map((w: any) => (
                    <div
                      key={w.id}
                      className="p-5 rounded-xl bg-slate-950/70 border border-slate-800/90 hover:border-cyan-500/30 flex flex-col justify-between space-y-4 transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase text-slate-400">
                            Day {w.dayOfWeek || 1}
                          </span>
                          <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3.5 h-3.5 text-cyan-400" />
                              <span>{w.estimatedDurationMins}m</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Flame className="w-3.5 h-3.5 text-amber-400" />
                              <span>{w.estimatedCalories} kcal</span>
                            </span>
                          </div>
                        </div>

                        <h4 className="text-base font-bold text-white mt-2">{w.title}</h4>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{w.description}</p>

                        {/* Movement Pills */}
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {w.exercises?.map((e: any, idx: number) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300"
                            >
                              {e.exercise?.name} ({e.targetSets}×{e.targetReps})
                            </span>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedWorkoutForExecution(w)}
                        className="w-full py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-cyan-500/20 transition-all"
                      >
                        <Play className="w-3.5 h-3.5 fill-slate-950" />
                        <span>Launch Workout Mode</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* AI Workout Generator Modal (Section 7) */}
      {generatorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">Rule-Validated AI Workout Generator</h3>
                  <p className="text-[11px] text-slate-400">
                    Calculates optimal volume distribution with strict equipment & injury constraint validation.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setGeneratorModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!generatedPlan ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-300 font-medium block mb-1">Target Goal</label>
                    <select
                      value={genForm.fitnessGoal}
                      onChange={(e) => setGenForm({ ...genForm, fitnessGoal: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value="gain_muscle">Muscle Hypertrophy</option>
                      <option value="improve_strength">Power & Maximum Strength</option>
                      <option value="lose_weight">Fat Loss & Conditioning</option>
                      <option value="general_fitness">Functional Fitness</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 font-medium block mb-1">Weekly Training Days</label>
                    <select
                      value={genForm.availableDays}
                      onChange={(e) => setGenForm({ ...genForm, availableDays: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value={2}>2 Days / Week (Full Body)</option>
                      <option value={3}>3 Days / Week (Push/Pull/Legs)</option>
                      <option value={4}>4 Days / Week (Upper/Lower Split)</option>
                      <option value={5}>5 Days / Week (Specialization)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 font-medium block mb-1">Workout Duration</label>
                    <select
                      value={genForm.workoutDurationMins}
                      onChange={(e) => setGenForm({ ...genForm, workoutDurationMins: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value={30}>30 Minutes</option>
                      <option value={45}>45 Minutes (Optimal)</option>
                      <option value={60}>60 Minutes</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 font-medium block mb-1">Experience Level</label>
                    <select
                      value={genForm.fitnessLevel}
                      onChange={(e) => setGenForm({ ...genForm, fitnessLevel: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">
                    Injury / Limitation Safeguard
                  </label>
                  <input
                    type="text"
                    value={genForm.injuriesLimitations}
                    onChange={(e) => setGenForm({ ...genForm, injuriesLimitations: e.target.value })}
                    placeholder="e.g. Mild shoulder pain, avoid heavy overhead presses"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400 space-y-1">
                  <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Rule-Based Safety Audit Active</span>
                  </div>
                  <p className="text-[11px]">
                    Volume capping, frequency spacing, and joint overload guardrails will be checked prior to plan synthesis.
                  </p>
                </div>

                <button
                  onClick={handleGenerateAIPlan}
                  disabled={isGenerating}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isGenerating ? 'Synthesizing Safe Blueprint...' : 'Generate Validated Workout Plan'}</span>
                </button>
              </div>
            ) : (
              /* Generated Plan Preview */
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/40 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-cyan-400">Audit Status: Passed</span>
                  <h4 className="text-base font-bold text-white">{generatedPlan.plan_title}</h4>
                  <p className="text-xs text-slate-300">
                    {generatedPlan.weekly_days} Training Days • {generatedPlan.daily_duration_mins} mins daily • {generatedPlan.progression_protocol}
                  </p>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {generatedPlan.schedule?.map((item: any, idx: number) => (
                    <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">Day {item.day}: {item.title}</span>
                        <span className="text-[10px] text-cyan-400 font-mono">{item.duration_mins} min</span>
                      </div>
                      <div className="flex flex-wrap gap-1 text-[10px] text-slate-400">
                        <span>Target: {item.target_sets}, {item.target_reps}</span>
                      </div>
                      <p className="text-[10px] text-emerald-400">{item.safety_note}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <button
                    onClick={() => setGeneratedPlan(null)}
                    className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
                  >
                    Adjust Parameters
                  </button>
                  <button
                    onClick={() => {
                      setGeneratorModalOpen(false);
                      loadWorkoutsData();
                    }}
                    className="w-1/2 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
                  >
                    Save & Activate Plan
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Live Active Workout Execution Modal */}
      {selectedWorkoutForExecution && (
        <ActiveWorkoutModal
          workout={selectedWorkoutForExecution}
          onClose={() => setSelectedWorkoutForExecution(null)}
          onWorkoutComplete={() => {
            loadWorkoutsData();
          }}
        />
      )}

      <BottomNav />
    </div>
  );
}
