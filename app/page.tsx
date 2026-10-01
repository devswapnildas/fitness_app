'use client';

import React from 'react';
import Link from 'next/link';
import {
  Flame,
  Sparkles,
  Dumbbell,
  Activity,
  Camera,
  Apple,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Zap,
  Users,
  Trophy,
  ChevronRight,
  Star,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 selection:bg-cyan-500/30">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#080c14]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Flame className="w-5 h-5 fill-white text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent">
                FitAI
              </span>
              <span className="text-[10px] -mt-1 uppercase tracking-wider text-cyan-400 font-semibold">
                Intelligence Engine
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-6 text-xs font-semibold text-slate-300">
            <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
            <a href="#vision" className="hover:text-cyan-400 transition-colors">Vision AI</a>
            <a href="#pricing" className="hover:text-cyan-400 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-cyan-400 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center space-x-3">
            <Link
              href="/dashboard"
              className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5"
            >
              Live Demo
            </Link>
            <Link
              href="/onboarding"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[300px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen Computer Vision & Progressive Overload AI</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            Your Fitness Journey,{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              Powered by Intelligence.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-normal">
            FitAI goes far beyond simple chatbots. Experience real data-driven progressive overload,
            instant computer vision form analysis, pantry-based meal generation, and personalized training blueprints.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/onboarding"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/30 flex items-center justify-center space-x-2 transition-all"
            >
              <span>Start 6-Step Onboarding</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-white font-semibold text-sm transition-all"
            >
              Explore Live Platform Dashboard
            </Link>
          </div>

          {/* Social Proof Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-8 border-t border-slate-800/80">
            <div>
              <p className="text-3xl font-black text-white font-mono">100+</p>
              <p className="text-xs text-slate-400 mt-1">Verified Exercises with CV Pose</p>
            </div>
            <div>
              <p className="text-3xl font-black text-cyan-400 font-mono">99.4%</p>
              <p className="text-xs text-slate-400 mt-1">Rep Detection Accuracy</p>
            </div>
            <div>
              <p className="text-3xl font-black text-indigo-400 font-mono">10,000+</p>
              <p className="text-xs text-slate-400 mt-1">Workouts Optimized Weekly</p>
            </div>
            <div>
              <p className="text-3xl font-black text-emerald-400 font-mono">4.9 ★</p>
              <p className="text-xs text-slate-400 mt-1">Trainer & Athlete Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Feature Highlights */}
      <section id="features" className="py-20 bg-slate-950/50 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-wider text-cyan-400 font-bold">
              Engineering Excellence
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Genuine Machine Learning & Computer Vision
            </h2>
            <p className="text-sm text-slate-400 mt-3">
              We separate computational ML microservices from standard web operations, delivering genuine real-time sports science.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1: Progressive Overload */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Progressive Overload Engine</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Tracks cumulative set volume, automatically detects personal records (PRs), and uses Epley formulas to project 1-Rep Maxes safely without reckless jumps.
              </p>
              <Link href="/progress" className="inline-flex items-center space-x-1 text-cyan-400 text-xs font-semibold mt-4">
                <span>View Overload Tracker</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 2: Pose CV */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Real-Time CV Form Analysis</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Analyzes 3-point joint angles on Squat, Push-up, Plank, and Shoulder Press. Counts valid reps, computes depth %, and delivers instant biomechanical cues.
              </p>
              <Link href="/form-analysis" className="inline-flex items-center space-x-1 text-cyan-400 text-xs font-semibold mt-4">
                <span>Test Live Camera Pose</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 3: Grounded Coach */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Grounded AI Fitness Assistant</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Our conversational assistant connects directly to your verified workout history, today's schedule, calorie deficit, and personal strength milestones.
              </p>
              <Link href="/ai-coach" className="inline-flex items-center space-x-1 text-cyan-400 text-xs font-semibold mt-4">
                <span>Chat with AI Coach</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 4: Food Vision */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Apple className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">AI Food Image Recognition</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Snap or upload meal photos to automatically identify dishes, estimate portion sizes in grams, and calculate macro targets with editable verification.
              </p>
              <Link href="/nutrition" className="inline-flex items-center space-x-1 text-cyan-400 text-xs font-semibold mt-4">
                <span>Try Food Scanner</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 5: AI Workout Generator */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Dumbbell className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Rule-Validated AI Workouts</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Algorithmically generates complete training splits tailored to your available equipment, target days, and injuries while enforcing strict volume safety bounds.
              </p>
              <Link href="/workouts" className="inline-flex items-center space-x-1 text-cyan-400 text-xs font-semibold mt-4">
                <span>Generate Plan</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 6: Trainer & Social Hub */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Trainer Client Roster & Admin</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Dedicated interfaces for certified trainers to prescribe routines, review client volume charts, and administrators to govern the 100+ exercise database.
              </p>
              <Link href="/trainer" className="inline-flex items-center space-x-1 text-cyan-400 text-xs font-semibold mt-4">
                <span>Explore Trainer Hub</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section (Section 39) */}
      <section id="pricing" className="py-20 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-wider text-cyan-400 font-bold">
              Subscription Tiers
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Predictable, Transparent Value
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Start with free essentials or unlock the complete AI computer vision suite.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Free Athlete</h3>
                <p className="text-xs text-slate-400 mt-1">Core tracking essentials</p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-black text-white">$0</span>
                  <span className="text-xs text-slate-400 ml-1">/ forever</span>
                </div>
                <ul className="mt-6 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>100+ Exercise Database</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Basic Workout & Set Logging</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Daily Nutrition Logging</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Limited AI Recommendations (3/wk)</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/dashboard"
                className="mt-8 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs text-center transition-all block"
              >
                Use Free Tier
              </Link>
            </div>

            {/* Pro (Recommended) */}
            <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-cyan-950/40 border-2 border-cyan-500 shadow-2xl shadow-cyan-500/15 flex flex-col justify-between relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                Most Popular
              </span>
              <div>
                <h3 className="text-lg font-bold text-white">FitAI Pro</h3>
                <p className="text-xs text-cyan-300 mt-1">Full AI & Computer Vision Suite</p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-black text-white">$14.99</span>
                  <span className="text-xs text-slate-400 ml-1">/ month</span>
                </div>
                <ul className="mt-6 space-y-3 text-xs text-slate-200">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Unlimited AI Workout Generation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Live Computer Vision Form Analysis</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>AI Food Photo Recognition & Macros</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>ML 1RM & Weight Trajectory Forecast</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Personal Record (PR) Confetti Celebrations</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/dashboard"
                className="mt-8 w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs text-center shadow-lg shadow-cyan-500/25 transition-all block"
              >
                Upgrade to Pro
              </Link>
            </div>

            {/* Trainer Tier */}
            <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Certified Trainer</h3>
                <p className="text-xs text-slate-400 mt-1">Coach clients & manage programs</p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-black text-white">$49.99</span>
                  <span className="text-xs text-slate-400 ml-1">/ month</span>
                </div>
                <ul className="mt-6 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Manage Up to 25 Active Clients</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Assign Custom Workout Blueprints</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Client Volume & Recovery Dashboard</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Direct In-App Trainer Messaging</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/trainer"
                className="mt-8 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs text-center transition-all block"
              >
                Explore Coach Hub
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-slate-950/60 border-t border-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-wider text-cyan-400 font-bold">FAQ</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800">
              <h3 className="text-sm font-bold text-white">How does FitAI analyze exercise form?</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                FitAI utilizes computer vision pose estimation to measure 3-point joint angles (such as knee flexion during squats or elbow angle during push-ups). It evaluates depth, range of motion, and repetition tempo in real-time.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800">
              <h3 className="text-sm font-bold text-white">Are nutrition estimates guaranteed to be 100% accurate?</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                No. As with all image-based computer vision technologies, food recognition produces mathematical estimates based on visual appearance and density heuristics. FitAI displays an uncertainty label and allows you to adjust calories, protein, carbs, and portion sizes with one click before logging.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800">
              <h3 className="text-sm font-bold text-white">Does the AI replace a human trainer or physical therapist?</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                FitAI is designed to enhance your training through data science. It does not provide medical diagnoses or replace accredited healthcare practitioners. Trainers can also use FitAI directly to manage their clients.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-12 bg-[#080c14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <Flame className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-300">FitAI Technologies Inc.</span>
            <span>— Precision Sports Science & AI Engine</span>
          </div>

          <div className="flex items-center space-x-6">
            <Link href="/dashboard" className="hover:text-slate-300">Dashboard</Link>
            <Link href="/exercises" className="hover:text-slate-300">Exercises</Link>
            <Link href="/pricing" className="hover:text-slate-300">Pricing</Link>
            <Link href="/trainer" className="hover:text-slate-300">Trainers</Link>
            <Link href="/admin" className="hover:text-slate-300">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
