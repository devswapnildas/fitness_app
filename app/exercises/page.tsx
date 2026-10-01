'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import {
  Search,
  Filter,
  Dumbbell,
  BookOpen,
  Camera,
  ChevronRight,
  X,
  Plus,
  Flame,
  CheckCircle2,
} from 'lucide-react';

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<any[]>([]);
  const [muscleGroups, setMuscleGroups] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('all');
  const [selectedEquipment, setSelectedEquipment] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [onlyPoseSupported, setOnlyPoseSupported] = useState(false);
  const [loading, setLoading] = useState(true);

  // Detail Modal
  const [selectedExercise, setSelectedExercise] = useState<any | null>(null);

  // New Exercise Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newExForm, setNewExForm] = useState({
    name: '',
    description: '',
    muscleGroupId: '',
    secondaryMuscles: '',
    equipment: 'barbell',
    difficulty: 'intermediate',
    instructions: '',
    exerciseType: 'strength',
  });

  useEffect(() => {
    fetchExercises();
  }, [search, selectedMuscle, selectedEquipment, selectedDifficulty, onlyPoseSupported]);

  const fetchExercises = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (selectedMuscle !== 'all') params.set('muscle', selectedMuscle);
      if (selectedEquipment !== 'all') params.set('equipment', selectedEquipment);
      if (selectedDifficulty !== 'all') params.set('difficulty', selectedDifficulty);
      if (onlyPoseSupported) params.set('pose', 'true');

      const res = await fetch(`/api/exercises?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setExercises(data.exercises);
        if (data.muscleGroups && muscleGroups.length === 0) {
          setMuscleGroups(data.muscleGroups);
          if (data.muscleGroups.length > 0 && !newExForm.muscleGroupId) {
            setNewExForm((prev) => ({ ...prev, muscleGroupId: data.muscleGroups[0].id }));
          }
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/exercises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExForm),
      });

      if (res.ok) {
        setCreateModalOpen(false);
        fetchExercises();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const muscleTabs = ['all', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio', 'Full Body', 'Mobility'];

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 pb-24 md:pb-12">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                100+ Movement Database
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">Kinesiology & Biomechanics Guides</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">Exercise Library</h1>
          </div>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Exercise</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search exercises by name, muscle, or instructions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex items-center space-x-2 w-full md:w-auto">
              <select
                value={selectedEquipment}
                onChange={(e) => setSelectedEquipment(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 font-medium"
              >
                <option value="all">All Equipment</option>
                <option value="barbell">Barbell</option>
                <option value="dumbbells">Dumbbells</option>
                <option value="machine">Machine</option>
                <option value="cable">Cable</option>
                <option value="bodyweight">Bodyweight</option>
                <option value="bands">Bands</option>
              </select>

              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 font-medium"
              >
                <option value="all">All Difficulties</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>

              <button
                onClick={() => setOnlyPoseSupported(!onlyPoseSupported)}
                className={`px-3 py-2.5 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 whitespace-nowrap transition-all ${
                  onlyPoseSupported
                    ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>CV Form Supported</span>
              </button>
            </div>
          </div>

          {/* Muscle Group Horizontal Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
            {muscleTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedMuscle(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all capitalize ${
                  selectedMuscle === tab
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Exercise Grid */}
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400 flex flex-col items-center space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin"></div>
            <span>Filtering movement database...</span>
          </div>
        ) : exercises.length === 0 ? (
          <div className="py-16 text-center bg-slate-900/40 border border-slate-800 rounded-2xl p-8 space-y-2">
            <BookOpen className="w-8 h-8 text-slate-500 mx-auto" />
            <h3 className="text-sm font-bold text-white">No exercises matched your filters</h3>
            <p className="text-xs text-slate-400">Try broadening your search term or equipment selection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {exercises.map((ex) => (
              <div
                key={ex.id}
                onClick={() => setSelectedExercise(ex)}
                className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all flex flex-col justify-between group space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-400 text-[10px] font-bold uppercase tracking-wider">
                      {ex.muscleGroup?.name || 'Strength'}
                    </span>
                    {ex.poseSupported && (
                      <span className="flex items-center space-x-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        <Camera className="w-3 h-3" />
                        <span>CV Pose AI</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white mt-2 group-hover:text-cyan-300 transition-colors">
                    {ex.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                    {ex.instructions}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 capitalize">
                  <span>{ex.equipment} • {ex.difficulty}</span>
                  <span className="text-cyan-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center">
                    <span>Instructions</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Exercise Instructions Detail Modal */}
      {selectedExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-bold uppercase">
                    {selectedExercise.muscleGroup?.name}
                  </span>
                  <span className="text-xs text-slate-400 capitalize">
                    {selectedExercise.equipment} • {selectedExercise.difficulty}
                  </span>
                </div>
                <h2 className="text-2xl font-black text-white mt-1">{selectedExercise.name}</h2>
              </div>
              <button
                onClick={() => setSelectedExercise(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedExercise.secondaryMuscles && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="text-slate-400 font-semibold">Synergist / Secondary Muscles: </span>
                <span className="text-slate-200">{selectedExercise.secondaryMuscles}</span>
              </div>
            )}

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Biomechanical Execution Instructions
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line bg-slate-950 p-4 rounded-xl border border-slate-800">
                {selectedExercise.instructions}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Default Sets</span>
                <p className="text-base font-bold text-white mt-0.5">{selectedExercise.defaultSets}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Target Reps</span>
                <p className="text-base font-bold text-cyan-400 mt-0.5">{selectedExercise.defaultReps}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Target Rest</span>
                <p className="text-base font-bold text-emerald-400 mt-0.5">{selectedExercise.defaultRestSeconds}s</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedExercise(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
            >
              Close Guide
            </button>
          </div>
        </div>
      )}

      {/* Add Custom Exercise Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <form
            onSubmit={handleCreateExercise}
            className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Create Custom Exercise</h3>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Exercise Name</label>
              <input
                type="text"
                required
                value={newExForm.name}
                onChange={(e) => setNewExForm({ ...newExForm, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                placeholder="e.g. Bulgarian Landmine Split Squat"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Muscle Group</label>
                <select
                  value={newExForm.muscleGroupId}
                  onChange={(e) => setNewExForm({ ...newExForm, muscleGroupId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  {muscleGroups.map((mg) => (
                    <option key={mg.id} value={mg.id}>
                      {mg.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Equipment</label>
                <select
                  value={newExForm.equipment}
                  onChange={(e) => setNewExForm({ ...newExForm, equipment: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="barbell">Barbell</option>
                  <option value="dumbbells">Dumbbells</option>
                  <option value="bodyweight">Bodyweight</option>
                  <option value="cable">Cable</option>
                  <option value="machine">Machine</option>
                  <option value="bands">Bands</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Execution Steps</label>
              <textarea
                required
                rows={3}
                value={newExForm.instructions}
                onChange={(e) => setNewExForm({ ...newExForm, instructions: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
                placeholder="Step 1... Step 2... Step 3..."
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
            >
              Save Exercise to Database
            </button>
          </form>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
