'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import {
  Trophy,
  Flame,
  Award,
  Users,
  CheckCircle2,
  Lock,
  Sparkles,
  Zap,
} from 'lucide-react';

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // System Achievements
  const achievements = [
    { code: 'FIRST_WORKOUT', title: 'First Rep', desc: 'Completed your very first workout on FitAI', unlocked: true, date: '1 month ago', icon: 'Flame' },
    { code: 'STREAK_7', title: 'Iron Habit', desc: 'Maintained a 7-day active fitness streak', unlocked: true, date: '2 weeks ago', icon: 'Zap' },
    { code: 'WORKOUTS_10', title: 'Decathlete', desc: 'Finished 10 verified training sessions', unlocked: true, date: '10 days ago', icon: 'Trophy' },
    { code: 'FIRST_PR', title: 'Record Shatterer', desc: 'Set a new Personal Record on an exercise', unlocked: true, date: 'Today', icon: 'Sparkles' },
    { code: 'WORKOUTS_50', title: 'Gym Veteran', desc: 'Conquer 50 intense training sessions', unlocked: false, date: 'Locked (12/50)', icon: 'Award' },
    { code: 'VOLUME_10K', title: 'Heavy Metal', desc: 'Lifted over 10,000 kg cumulative volume', unlocked: true, date: '3 days ago', icon: 'Dumbbell' },
  ];

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const res = await fetch('/api/challenges');
      if (res.ok) {
        const data = await res.json();
        setChallenges(data.challenges || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinChallenge = async (challengeId: string) => {
    try {
      const res = await fetch('/api/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId }),
      });
      if (res.ok) {
        fetchChallenges();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 pb-24 md:pb-12">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Community & Milestones
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">Public Leaderboards</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Challenges & Badges
          </h1>
        </div>

        {/* Challenges Section (Section 28) */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <span>Active Fitness Challenges</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {challenges.map((c) => (
              <div
                key={c.id}
                className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 text-[10px] font-bold uppercase tracking-wider">
                      {c.challengeType}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center space-x-1">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      <span>{c.participants?.length || 1} Athletes</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mt-2">{c.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{c.description}</p>

                  <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Goal Target</span>
                      <span className="font-mono text-cyan-400 font-bold">
                        {c.userProgress} / {c.targetValue} {c.unit}
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-cyan-500 h-full rounded-full transition-all"
                        style={{ width: `${Math.min(100, (c.userProgress / c.targetValue) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleJoinChallenge(c.id)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
                    c.isJoined
                      ? 'bg-slate-800 text-slate-300 border border-slate-700'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20'
                  }`}
                >
                  {c.isJoined ? 'Joined • Keep Logging Workouts' : 'Join Challenge'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Achievement Badges Grid (Section 26) */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>Achievement Badges & Trophies</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((ach, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border transition-all flex items-start space-x-4 ${
                  ach.unlocked
                    ? 'bg-slate-900/80 border-slate-800 hover:border-amber-500/30'
                    : 'bg-slate-950/40 border-slate-800/50 opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    ach.unlocked
                      ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 shadow-lg shadow-amber-500/20 font-black'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {ach.unlocked ? <Trophy className="w-6 h-6 fill-slate-950" /> : <Lock className="w-5 h-5" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-bold text-white">{ach.title}</h3>
                    {ach.unlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{ach.desc}</p>
                  <span className="text-[10px] text-slate-500 font-mono block pt-1">
                    {ach.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
