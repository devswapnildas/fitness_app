'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import Link from 'next/link';
import { CheckCircle2, Flame, Sparkles } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 pb-24 md:pb-12">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-wider text-cyan-400 font-bold">
            Transparent Subscription Architecture
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white">
            Simple Pricing for Athletes & Coaches
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Select the optimal performance package. All plans include continuous algorithm updates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Tier */}
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Free Athlete</h2>
              <p className="text-xs text-slate-400 mt-1">Core tracking essentials</p>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-black text-white font-mono">$0</span>
                <span className="text-xs text-slate-400 ml-1">/ forever</span>
              </div>
              <ul className="mt-6 space-y-3 text-xs text-slate-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>100+ Exercise Movement Library</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Standard Workout & Set Logging</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Daily Nutrition Tracker</span>
                </li>
              </ul>
            </div>
            <Link
              href="/dashboard"
              className="mt-8 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs text-center transition-all block"
            >
              Get Started
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-cyan-950/40 border-2 border-cyan-500 shadow-2xl shadow-cyan-500/15 flex flex-col justify-between relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
              Most Popular
            </span>
            <div>
              <h2 className="text-lg font-bold text-white">FitAI Pro</h2>
              <p className="text-xs text-cyan-300 mt-1">Full AI & Computer Vision Suite</p>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-black text-white font-mono">$14.99</span>
                <span className="text-xs text-slate-400 ml-1">/ month</span>
              </div>
              <ul className="mt-6 space-y-3 text-xs text-slate-200">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Unlimited AI Workout Generator</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Live CV Form Analysis & Rep Counter</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>AI Food Image Recognition</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>ML 1RM & Weight Trajectory Forecast</span>
                </li>
              </ul>
            </div>
            <Link
              href="/dashboard"
              className="mt-8 w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs text-center shadow-lg shadow-cyan-500/25 transition-all block"
            >
              Start 14-Day Free Pro Trial
            </Link>
          </div>

          {/* Trainer Tier */}
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Certified Trainer</h2>
              <p className="text-xs text-slate-400 mt-1">Client roster & periodization</p>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-black text-white font-mono">$49.99</span>
                <span className="text-xs text-slate-400 ml-1">/ month</span>
              </div>
              <ul className="mt-6 space-y-3 text-xs text-slate-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Manage Up to 25 Active Clients</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Custom Workout Blueprint Assignment</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>In-App Coach Messaging</span>
                </li>
              </ul>
            </div>
            <Link
              href="/trainer"
              className="mt-8 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs text-center transition-all block"
            >
              Access Trainer Portal
            </Link>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
