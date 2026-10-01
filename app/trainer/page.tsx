'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import {
  Users,
  Award,
  CheckCircle2,
  Calendar,
  Clock,
  Dumbbell,
  Send,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

export default function TrainerPage() {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  const [coachNotes, setCoachNotes] = useState('Alex is progressing exceptionally well on his Upper/Lower hypertrophy split.');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchTrainerData();
  }, []);

  const fetchTrainerData = async () => {
    try {
      const res = await fetch('/api/trainer');
      if (res.ok) {
        const json = await res.json();
        setData(json);
        if (json.trainer?.clients?.length > 0) {
          setSelectedClient(json.trainer.clients[0]);
          if (json.trainer.clients[0].notes) {
            setCoachNotes(json.trainer.clients[0].notes);
          }
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedClient) return;
    try {
      const res = await fetch('/api/trainer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: selectedClient.clientId,
          notes: coachNotes,
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
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
          Loading Trainer Portal...
        </div>
      </div>
    );
  }

  const { trainer, workoutTemplates } = data;
  const clientUser = selectedClient?.client;

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 pb-24 md:pb-12">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Trainer Profile Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/30 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                Certified Strength Coach (CSCS)
              </span>
              <span className="text-xs text-slate-400">Rating: ★ {trainer?.rating || 4.95}</span>
            </div>
            <h1 className="text-2xl font-black text-white mt-1">{trainer?.user?.name || 'Coach Marcus Vance'}</h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">{trainer?.bio}</p>
          </div>

          <div className="flex items-center space-x-3 text-xs bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <div>
              <span className="text-slate-500 text-[10px] block uppercase font-bold">Active Clients</span>
              <span className="text-base font-bold text-white">{trainer?.clients?.length || 1} Athletes</span>
            </div>
            <div className="h-6 w-px bg-slate-800"></div>
            <div>
              <span className="text-slate-500 text-[10px] block uppercase font-bold">Hourly Rate</span>
              <span className="text-base font-bold text-emerald-400">${trainer?.hourlyRate || 85}/hr</span>
            </div>
          </div>
        </div>

        {/* Client Management Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Client List (1 Col) */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Assigned Athletes</span>
            </h3>

            <div className="space-y-2">
              {trainer?.clients?.map((cl: any) => (
                <div
                  key={cl.id}
                  onClick={() => setSelectedClient(cl)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                    selectedClient?.id === cl.id
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center">
                      {cl.client?.name?.charAt(0) || 'A'}
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{cl.client?.name}</h4>
                      <span className="text-[10px] text-slate-400">{cl.client?.email}</span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold uppercase">
                    {cl.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Client Overview & Workout Assignment (2 Cols) */}
          {clientUser && (
            <div className="lg:col-span-2 space-y-6">
              {/* Telemetry Header */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-white">{clientUser.name} — Progress Telemetry</h3>
                    <p className="text-xs text-slate-400">
                      Weight: {clientUser.profile?.currentWeightKg} kg • Experience: {clientUser.profile?.fitnessLevel}
                    </p>
                  </div>
                  <span className="text-xs text-cyan-400 font-semibold font-mono">Status: Verified</span>
                </div>

                {/* PRs Achieved by Client */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-400">Client Personal Records:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {clientUser.progressRecords?.map((pr: any) => (
                      <div
                        key={pr.id}
                        className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <span className="font-medium text-slate-300">{pr.exercise?.name}</span>
                        <span className="font-mono font-bold text-amber-400">{pr.bestWeightKg}kg × {pr.bestReps}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trainer Notes & Feedback Input */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Coach Periodization & Form Notes
                  </label>
                  <textarea
                    rows={3}
                    value={coachNotes}
                    onChange={(e) => setCoachNotes(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
                  />
                  <div className="flex items-center justify-between pt-1">
                    {saveSuccess && (
                      <span className="text-xs text-emerald-400 font-semibold">
                        ✓ Client notes successfully updated!
                      </span>
                    )}
                    <button
                      onClick={handleSaveNotes}
                      className="ml-auto px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20"
                    >
                      Save & Send Notes to Client
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
