'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import PoseFormAnalyzer from '@/components/vision/PoseFormAnalyzer';
import { Camera, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export default function FormAnalysisPage() {
  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 pb-24 md:pb-12">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Computer Vision Kinematics
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">Biomechanical Pose Estimation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Exercise Form Analysis & Repetition Counter
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            FitAI uses pose estimation models to calculate 3-point joint angles, track repetition depth,
            measure cadence, and provide real-time biomechanical feedback for Squat, Push-up, Plank, Lunge, and Shoulder Press.
          </p>
        </div>

        {/* Embedded Pose Analyzer */}
        <PoseFormAnalyzer />

        {/* How it works info cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-xs">
              01
            </div>
            <h3 className="text-sm font-bold text-white">Trigonometric Joint Angles</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Calculates precise angular flexion at the knee, hip, shoulder, and elbow vertices using atan2 vector mathematics.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs">
              02
            </div>
            <h3 className="text-sm font-bold text-white">Rep Inflection Detection</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Detects full extension, inflection point, and bottom turnaround phase to register clean completed repetitions automatically.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-xs">
              03
            </div>
            <h3 className="text-sm font-bold text-white">Actionable Form Cues</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Provides immediate auditory and visual corrective cues to avoid pelvic tucking, knee valgus, or excessive lumbar extension.
            </p>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
