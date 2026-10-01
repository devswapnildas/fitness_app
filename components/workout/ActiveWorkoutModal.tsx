'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Trophy,
  ChevronRight,
  ChevronLeft,
  X,
  Flame,
  Clock,
  Sparkles,
  Zap,
} from 'lucide-react';

interface ActiveWorkoutModalProps {
  workout: any;
  onClose: () => void;
  onWorkoutComplete?: () => void;
}

export default function ActiveWorkoutModal({
  workout,
  onClose,
  onWorkoutComplete,
}: ActiveWorkoutModalProps) {
  const exercises = workout?.exercises || [];
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const currentWorkoutEx = exercises[currentExIndex];
  const currentEx = currentWorkoutEx?.exercise;

  // Timers
  const [workoutElapsedSeconds, setWorkoutElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [restSecondsRemaining, setRestSecondsRemaining] = useState(0);
  const [isResting, setIsResting] = useState(false);

  // Set Inputs
  const [weightKg, setWeightKg] = useState<number>(currentWorkoutEx?.targetWeightKg || 50);
  const [reps, setReps] = useState<number>(currentWorkoutEx?.targetReps || 10);
  const [rpe, setRpe] = useState<number>(8);

  // Completed sets tracker: { exerciseId, setNumber, repsCompleted, weightKg, rpe }
  const [completedSets, setCompletedSets] = useState<any[]>([]);

  // PR Celebration State
  const [latestPr, setLatestPr] = useState<any | null>(null);

  // Completion State
  const [isFinishing, setIsFinishing] = useState(false);
  const [workoutSummary, setWorkoutSummary] = useState<any | null>(null);

  // Workout duration ticker
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && !workoutSummary) {
      interval = setInterval(() => {
        setWorkoutElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, workoutSummary]);

  // Rest countdown ticker
  useEffect(() => {
    let restInterval: any = null;
    if (isResting && restSecondsRemaining > 0) {
      restInterval = setInterval(() => {
        setRestSecondsRemaining((prev) => {
          if (prev <= 1) {
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(restInterval);
  }, [isResting, restSecondsRemaining]);

  // Update input defaults when changing exercise
  useEffect(() => {
    if (currentWorkoutEx) {
      setWeightKg(currentWorkoutEx.targetWeightKg || 50);
      setReps(currentWorkoutEx.targetReps || 10);
    }
  }, [currentExIndex, currentWorkoutEx]);

  const currentExerciseSets = completedSets.filter(
    (s) => s.exerciseId === currentEx?.id
  );

  const handleLogSet = () => {
    const nextSetNumber = currentExerciseSets.length + 1;
    const newSet = {
      exerciseId: currentEx.id,
      exerciseName: currentEx.name,
      setNumber: nextSetNumber,
      repsCompleted: Number(reps),
      weightKg: Number(weightKg),
      rpe: Number(rpe),
    };

    setCompletedSets([...completedSets, newSet]);

    // Check PR trigger heuristic
    if (Number(weightKg) >= 95 || Number(reps) >= 12) {
      setLatestPr({
        exerciseName: currentEx.name,
        weightKg: Number(weightKg),
        repsCompleted: Number(reps),
      });

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      setTimeout(() => {
        setLatestPr(null);
      }, 4500);
    }

    // Trigger Rest Timer
    const restTarget = currentWorkoutEx?.targetRestSeconds || 60;
    setRestSecondsRemaining(restTarget);
    setIsResting(true);
  };

  const handleFinishWorkout = async () => {
    setIsFinishing(true);
    try {
      const res = await fetch('/api/workouts/active', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workoutId: workout?.id,
          title: workout?.title || 'Live Active Workout',
          durationSeconds: workoutElapsedSeconds,
          completedSets,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setWorkoutSummary(data.summary);
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.5 },
        });
        if (onWorkoutComplete) onWorkoutComplete();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsFinishing(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-3xl bg-[#0f172a] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center space-x-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {workout?.title || 'Active Training Session'}
              </h2>
              <p className="text-xs text-slate-400">
                Exercise {currentExIndex + 1} of {exercises.length}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Workout Clock */}
            <div className="flex items-center space-x-1.5 px-3 py-1 bg-slate-800/80 rounded-lg border border-slate-700 font-mono text-cyan-400 text-sm font-semibold">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>{formatTime(workoutElapsedSeconds)}</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PR Toast Banner */}
        {latestPr && (
          <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-bold px-4 py-2.5 flex items-center justify-between text-xs animate-bounce shadow-lg">
            <div className="flex items-center space-x-2">
              <Trophy className="w-4 h-4 fill-slate-950" />
              <span>
                🔥 NEW PERSONAL RECORD DETECTED! {latestPr.exerciseName} at {latestPr.weightKg} kg × {latestPr.repsCompleted} reps!
              </span>
            </div>
            <Sparkles className="w-4 h-4" />
          </div>
        )}

        {/* Workout Complete Summary Screen */}
        {workoutSummary ? (
          <div className="p-8 text-center space-y-6 overflow-y-auto">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 mx-auto flex items-center justify-center text-white shadow-xl shadow-cyan-500/20">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-white">Workout Conquered!</h3>
              <p className="text-sm text-slate-400 mt-1">
                Outstanding effort! All sets recorded and progressive overload metrics updated.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <span className="text-xs text-slate-400">Duration</span>
                <p className="text-xl font-bold text-white mt-1">
                  {workoutSummary.durationMinutes} min
                </p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <span className="text-xs text-slate-400">Total Volume</span>
                <p className="text-xl font-bold text-cyan-400 mt-1">
                  {workoutSummary.totalVolumeKg.toLocaleString()} kg
                </p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <span className="text-xs text-slate-400">Est. Calories</span>
                <p className="text-xl font-bold text-amber-400 mt-1">
                  {workoutSummary.estimatedCalories} kcal
                </p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <span className="text-xs text-slate-400">Sets Completed</span>
                <p className="text-xl font-bold text-emerald-400 mt-1">
                  {workoutSummary.setsCompletedCount}
                </p>
              </div>
            </div>

            {workoutSummary.hasPr && (
              <div className="bg-amber-500/15 border border-amber-500/40 p-4 rounded-xl max-w-md mx-auto text-left flex items-start space-x-3">
                <Trophy className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-amber-300">
                    Personal Record Shattered!
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Your estimated 1-Rep Max increased. FitAI has synced your new progression records to your Analytics dashboard.
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={onClose}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm hover:opacity-90 shadow-lg shadow-cyan-500/25 transition-all"
            >
              Return to Dashboard
            </button>
          </div>
        ) : (
          /* Active Workout Execution Screen */
          <div className="p-6 flex-1 overflow-y-auto space-y-6">
            {/* Current Exercise Details */}
            {currentEx && (
              <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-[11px] font-semibold uppercase">
                      {currentEx.muscleGroup?.name || 'Strength'}
                    </span>
                    <span className="text-xs text-slate-400 capitalize">
                      {currentEx.equipment} • {currentEx.difficulty}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mt-1">
                    {currentEx.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                    {currentEx.instructions}
                  </p>
                </div>

                {/* Target badge */}
                <div className="flex items-center space-x-3 bg-slate-800/80 px-4 py-3 rounded-xl border border-slate-700/60 shrink-0">
                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 uppercase">Target Sets</span>
                    <p className="text-base font-bold text-white">
                      {currentWorkoutEx?.targetSets || 3}
                    </p>
                  </div>
                  <div className="h-6 w-px bg-slate-700"></div>
                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 uppercase">Target Reps</span>
                    <p className="text-base font-bold text-cyan-400">
                      {currentWorkoutEx?.targetReps || 10}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Rest Timer Banner */}
            {isResting && (
              <div className="bg-gradient-to-r from-blue-900/40 to-cyan-900/40 border border-cyan-500/30 p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Zap className="w-5 h-5 text-cyan-400 animate-pulse" />
                  <div>
                    <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                      Rest Interval in Progress
                    </h4>
                    <p className="text-xs text-slate-300">
                      Take deep breaths, hydrate, and prepare for next set.
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl font-black font-mono text-cyan-400">
                    {restSecondsRemaining}s
                  </span>
                  <button
                    onClick={() => setIsResting(false)}
                    className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded"
                  >
                    Skip Rest
                  </button>
                </div>
              </div>
            )}

            {/* Set Logging Form */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
              <h4 className="text-sm font-semibold text-slate-200">
                Log Set #{currentExerciseSets.length + 1}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">
                    Weight Lifted (kg)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={weightKg}
                    onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">
                    Reps Completed
                  </label>
                  <input
                    type="number"
                    value={reps}
                    onChange={(e) => setReps(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">
                    Perceived Exertion (RPE: {rpe}/10)
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="10"
                    step="0.5"
                    value={rpe}
                    onChange={(e) => setRpe(parseFloat(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer mt-2"
                  />
                </div>
              </div>

              <button
                onClick={handleLogSet}
                className="w-full py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all shadow-md shadow-cyan-500/20"
              >
                ✓ Complete Set & Start Rest Timer
              </button>
            </div>

            {/* History of Completed Sets for Current Exercise */}
            {currentExerciseSets.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs text-slate-400 font-medium">Logged Sets:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {currentExerciseSets.map((s, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-xs flex items-center justify-between"
                    >
                      <span className="text-slate-400 font-semibold">Set {s.setNumber}:</span>
                      <span className="text-white font-mono font-bold">
                        {s.weightKg}kg × {s.repsCompleted}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation between Exercises & Finish */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                disabled={currentExIndex === 0}
                onClick={() => setCurrentExIndex((prev) => prev - 1)}
                className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev Exercise</span>
              </button>

              <button
                onClick={handleFinishWorkout}
                disabled={isFinishing || completedSets.length === 0}
                className="px-6 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-40"
              >
                {isFinishing ? 'Saving...' : 'Finish & Save Workout'}
              </button>

              <button
                disabled={currentExIndex >= exercises.length - 1}
                onClick={() => setCurrentExIndex((prev) => prev + 1)}
                className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Next Exercise</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
