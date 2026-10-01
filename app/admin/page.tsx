'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import {
  ShieldCheck,
  Users,
  Dumbbell,
  Apple,
  Activity,
  Trash2,
  CheckCircle2,
  Server,
  Zap,
} from 'lucide-react';

export default function AdminPage() {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminMetrics();
  }, []);

  const fetchAdminMetrics = async () => {
    try {
      const res = await fetch('/api/admin');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEntity = async (type: string, id: string) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      const res = await fetch(`/api/admin?type=${type}&id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchAdminMetrics();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-[#080c14] text-slate-100">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-xs text-slate-400">
          Loading Administrator Control Plane...
        </div>
      </div>
    );
  }

  const { metrics, recentUsers, exercises, foods } = data;

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 pb-24 md:pb-12">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
              System Administration
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">Governance & Platform Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            FitAI Admin Control Plane
          </h1>
        </div>

        {/* Global Platform Metrics (Section 32) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 font-medium">Total Registered Users</span>
            <p className="text-2xl sm:text-3xl font-black text-white font-mono">{metrics.totalUsers.toLocaleString()}</p>
            <span className="text-[10px] text-emerald-400 font-bold">+18% this month</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 font-medium">Completed Workouts</span>
            <p className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">{metrics.totalWorkoutsCompleted.toLocaleString()}</p>
            <span className="text-[10px] text-slate-400 font-mono">Sessions logged</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 font-medium">AI Invocations</span>
            <p className="text-2xl sm:text-3xl font-black text-indigo-400 font-mono">{metrics.aiFeatureInvocations.toLocaleString()}</p>
            <span className="text-[10px] text-indigo-300">CV & ML endpoints</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 font-medium">Server & ML Health</span>
            <p className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">{metrics.serverUptime}</p>
            <span className="text-[10px] text-emerald-400 flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>All Microservices Operational</span>
            </span>
          </div>
        </div>

        {/* Database Entities Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Management */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Recent Users</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">{recentUsers.length} Users</span>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {recentUsers.map((u: any) => (
                <div
                  key={u.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-white block">{u.name}</span>
                    <span className="text-[10px] text-slate-400">{u.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-300 uppercase">
                      {u.role}
                    </span>
                    {u.role !== 'admin' && (
                      <button
                        onClick={() => handleDeleteEntity('user', u.id)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                        title="Delete user"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Exercise Management */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Dumbbell className="w-4 h-4 text-cyan-400" />
                <span>Exercise Database (100+)</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">{metrics.totalExercises} Exercises</span>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {exercises.map((ex: any) => (
                <div
                  key={ex.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-white block">{ex.name}</span>
                    <span className="text-[10px] text-slate-400 capitalize">
                      {ex.muscleGroup?.name} • {ex.equipment}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteEntity('exercise', ex.id)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                    title="Delete exercise"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
