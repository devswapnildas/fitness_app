'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import {
  TrendingUp,
  Trophy,
  Scale,
  Sparkles,
  Plus,
  AlertCircle,
  Calendar,
  Layers,
  ChevronRight,
  X,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export default function ProgressPage() {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMeasureModal, setNewMeasureModal] = useState(false);

  // New Measurement form
  const [mForm, setMForm] = useState({
    weightKg: 78.5,
    bodyFatPct: 14.8,
    chestCm: 104,
    waistCm: 81,
    armsCm: 38.5,
    thighsCm: 60.5,
    notes: '',
  });

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const res = await fetch('/api/progress');
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

  const handleLogMeasurement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mForm),
      });

      if (res.ok) {
        setNewMeasureModal(false);
        fetchProgress();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-[#080c14] text-slate-100">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-xs text-slate-400">
          Loading ML Forecasting & Trajectory Engine...
        </div>
      </div>
    );
  }

  const { measurements, prs, weightPrediction, strengthPrediction, insights } = data;

  const chartMeasurements = measurements.map((m: any) => ({
    date: new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: m.weightKg,
    bodyFat: m.bodyFatPct || 0,
    waist: m.waistCm || 0,
    arms: m.armsCm || 0,
  }));

  const trajectoryChartData = weightPrediction?.trajectory?.map((t: any) => ({
    week: `Wk ${t.week}`,
    predicted: t.predicted_weight_kg,
    lower: t.confidence_lower_kg,
    upper: t.confidence_upper_kg,
  })) || [];

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 pb-24 md:pb-12">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Longitudinal Anthropometrics
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">Monte Carlo Confidence Bounds</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Progress & ML Trajectory Forecasting
            </h1>
          </div>

          <button
            onClick={() => setNewMeasureModal(true)}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Log Body Measurements</span>
          </button>
        </div>

        {/* AI Analytical Insights Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights?.map((ins: any, idx: number) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  {ins.type} Analysis
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold">
                  {ins.status}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{ins.text}</p>
            </div>
          ))}
        </div>

        {/* ML Goal Trajectory Prediction (Section 15) */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-indigo-500/30 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h3 className="text-base font-bold text-white">
                  ML-Based 12-Week Progress Trajectory (Uncertainty Range)
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Projects bodyweight adaptation based on daily caloric surplus/deficit with confidence intervals.
              </p>
            </div>
            <div className="flex items-center space-x-3 text-xs font-mono">
              <span className="flex items-center space-x-1 text-cyan-400">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                <span>Expected Weight</span>
              </span>
              <span className="flex items-center space-x-1 text-indigo-400">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500/40"></span>
                <span>Confidence Bounds</span>
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trajectoryChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="week" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 8, fontSize: 12 }}
                />
                <Area type="monotone" dataKey="upper" name="Upper Bound (kg)" stroke="none" fill="#6366f1" fillOpacity={0.15} />
                <Area type="monotone" dataKey="lower" name="Lower Bound (kg)" stroke="none" fill="#080c14" fillOpacity={0.8} />
                <Line type="monotone" dataKey="predicted" name="Projected Trajectory (kg)" stroke="#38bdf8" strokeWidth={3} dot={{ fill: '#38bdf8', r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <span>{weightPrediction?.disclaimer}</span>
          </div>
        </div>

        {/* Historical Body Measurements Chart & Personal Records Table */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Historical Trend */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Measured Data</span>
                <h3 className="text-base font-bold text-white">Weight & Body Fat %</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Verified Logs</span>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartMeasurements}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                  <YAxis yAxisId="left" stroke="#38bdf8" fontSize={11} domain={['dataMin - 1', 'dataMax + 1']} />
                  <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={11} domain={[12, 18]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 8, fontSize: 12 }}
                  />
                  <Line yAxisId="left" type="monotone" dataKey="weight" name="Weight (kg)" stroke="#38bdf8" strokeWidth={2} dot={{ r: 3 }} />
                  <Line yAxisId="right" type="monotone" dataKey="bodyFat" name="Body Fat %" stroke="#10b981" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Personal Record Hall of Fame (Section 25) */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Personal Record Leaderboard</h3>
              </div>
              <span className="text-xs text-amber-400 font-semibold font-mono">Auto-Calculated 1RM</span>
            </div>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {prs.map((pr: any) => (
                <div
                  key={pr.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800/90 flex items-center justify-between text-xs"
                >
                  <div>
                    <h4 className="font-bold text-white">{pr.exercise?.name}</h4>
                    <p className="text-[10px] text-slate-500">
                      Achieved: {new Date(pr.achievedAt).toLocaleDateString()} • Cumulative Volume: {pr.totalVolumeKg.toLocaleString()}kg
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-black text-amber-400 text-sm">
                      {pr.bestWeightKg}kg × {pr.bestReps}
                    </span>
                    <span className="text-[10px] text-cyan-400 block font-mono">
                      est 1RM: {pr.estimatedOneRepMaxKg}kg
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Log Measurement Modal */}
      {newMeasureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <form
            onSubmit={handleLogMeasurement}
            className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Record Body Measurements</h3>
              <button
                type="button"
                onClick={() => setNewMeasureModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={mForm.weightKg}
                  onChange={(e) => setMForm({ ...mForm, weightKg: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Body Fat % (Optional)</label>
                <input
                  type="number"
                  step="0.1"
                  value={mForm.bodyFatPct}
                  onChange={(e) => setMForm({ ...mForm, bodyFatPct: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Waist Circumference (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  value={mForm.waistCm}
                  onChange={(e) => setMForm({ ...mForm, waistCm: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Arms Circumference (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  value={mForm.armsCm}
                  onChange={(e) => setMForm({ ...mForm, armsCm: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
            >
              Save Anthropometric Record
            </button>
          </form>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
