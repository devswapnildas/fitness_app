'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Flame,
  User,
  Activity,
  Target,
  Clock,
  Dumbbell,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
} from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Personal
    age: 26,
    gender: 'male',
    heightCm: 180,
    weightKg: 78.5,
    // Step 2: Level
    fitnessLevel: 'intermediate',
    // Step 3: Goal
    goal: 'gain_muscle',
    // Step 4: Lifestyle
    activityLevel: 'moderate',
    dailySleepHours: 7.5,
    workType: 'desk',
    workoutDaysPerWeek: 4,
    preferredDurationMins: 45,
    // Step 5: Equipment
    equipment: ['barbell', 'dumbbells', 'bodyweight'],
    // Step 6: Preferences
    workoutIntensity: 'high',
    dietaryPreferences: 'high_protein',
    limitations: '',
  });

  const equipmentOptions = [
    { id: 'bodyweight', label: 'Bodyweight Only' },
    { id: 'dumbbells', label: 'Dumbbells' },
    { id: 'barbell', label: 'Barbell & Weight Plates' },
    { id: 'cable', label: 'Cable Machine' },
    { id: 'machine', label: 'Full Commercial Gym' },
    { id: 'bands', label: 'Resistance Bands' },
    { id: 'treadmill', label: 'Treadmill / Cardio Sled' },
  ];

  const handleToggleEquipment = (id: string) => {
    if (formData.equipment.includes(id)) {
      setFormData({
        ...formData,
        equipment: formData.equipment.filter((item) => item !== id),
      });
    } else {
      setFormData({
        ...formData,
        equipment: [...formData.equipment, id],
      });
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/dashboard');
        router.refresh();
      } else {
        router.push('/dashboard');
      }
    } catch {
      router.push('/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col justify-between p-4 sm:p-8">
      {/* Brand Header */}
      <div className="max-w-3xl mx-auto w-full flex items-center justify-between py-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white">
            <Flame className="w-4 h-4 fill-white text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">FitAI Personalization Engine</span>
        </div>
        <span className="text-xs text-slate-400 font-mono">Step {currentStep} of 6</span>
      </div>

      {/* Progress Line */}
      <div className="max-w-3xl mx-auto w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-8">
        <div
          className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-300 rounded-full"
          style={{ width: `${(currentStep / 6) * 100}%` }}
        ></div>
      </div>

      {/* Main Wizard Card */}
      <div className="max-w-3xl mx-auto w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl relative">
        {/* Step 1: Personal Info */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs uppercase tracking-wider text-cyan-400 font-bold">Step 1</span>
              <h2 className="text-2xl font-bold text-white mt-1">Biometrics & Basic Information</h2>
              <p className="text-xs text-slate-400 mt-1">
                Used to calculate precise basal metabolic rates (BMR) and total daily energy expenditure (TDEE).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Biological Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={formData.heightCm}
                  onChange={(e) => setFormData({ ...formData, heightCm: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Current Weight (kg)</label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.weightKg}
                  onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Fitness Level */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs uppercase tracking-wider text-cyan-400 font-bold">Step 2</span>
              <h2 className="text-2xl font-bold text-white mt-1">Current Fitness Experience</h2>
              <p className="text-xs text-slate-400 mt-1">
                Calibrates recovery thresholds, starting loads, and volume progression curves.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { id: 'beginner', title: 'Beginner (< 1 year)', desc: 'Learning compound movements, rapid neuromuscular adaptation.' },
                { id: 'intermediate', title: 'Intermediate (1 - 3 years)', desc: 'Consistent training history, familiar with progressive overload principles.' },
                { id: 'advanced', title: 'Advanced (3+ years)', desc: 'Requires periodized volume loading and tailored fatigue management.' },
              ].map((lvl) => (
                <div
                  key={lvl.id}
                  onClick={() => setFormData({ ...formData, fitnessLevel: lvl.id })}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    formData.fitnessLevel === lvl.id
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white">{lvl.title}</span>
                    {formData.fitnessLevel === lvl.id && <CheckCircle2 className="w-5 h-5 text-cyan-400" />}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{lvl.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Goal */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs uppercase tracking-wider text-cyan-400 font-bold">Step 3</span>
              <h2 className="text-2xl font-bold text-white mt-1">Primary Fitness Objective</h2>
              <p className="text-xs text-slate-400 mt-1">Select your focal training ambition for the next 8-12 weeks.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'gain_muscle', label: 'Gain Muscle & Hypertrophy', icon: '💪' },
                { id: 'lose_weight', label: 'Lose Weight & Fat Burn', icon: '🔥' },
                { id: 'improve_strength', label: 'Maximize Power & Strength', icon: '⚡' },
                { id: 'improve_endurance', label: 'Enhance Cardiovascular Stamina', icon: '🏃' },
                { id: 'improve_flexibility', label: 'Mobility & Joint Flexibility', icon: '🧘' },
                { id: 'general_fitness', label: 'General Health & Vitality', icon: '🌟' },
              ].map((g) => (
                <div
                  key={g.id}
                  onClick={() => setFormData({ ...formData, goal: g.id })}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center space-x-3 ${
                    formData.goal === g.id
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                  }`}
                >
                  <span className="text-2xl">{g.icon}</span>
                  <span className="text-sm font-semibold text-white">{g.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Lifestyle */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs uppercase tracking-wider text-cyan-400 font-bold">Step 4</span>
              <h2 className="text-2xl font-bold text-white mt-1">Lifestyle & Time Budget</h2>
              <p className="text-xs text-slate-400 mt-1">Ensures the routine fits realistically into your daily schedule.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Available Workout Days / Week</label>
                <select
                  value={formData.workoutDaysPerWeek}
                  onChange={(e) => setFormData({ ...formData, workoutDaysPerWeek: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
                >
                  <option value={2}>2 Days (Full Body Routine)</option>
                  <option value={3}>3 Days (Classic Push/Pull/Legs)</option>
                  <option value={4}>4 Days (Upper / Lower Split)</option>
                  <option value={5}>5 Days (Body-Part Specialization)</option>
                  <option value={6}>6 Days (High Frequency)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Target Workout Duration (Mins)</label>
                <select
                  value={formData.preferredDurationMins}
                  onChange={(e) => setFormData({ ...formData, preferredDurationMins: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
                >
                  <option value={30}>30 Minutes (Express HIIT/Supersets)</option>
                  <option value={45}>45 Minutes (Optimal Standard)</option>
                  <option value={60}>60 Minutes (Hypertrophy & Strength)</option>
                  <option value={75}>75 Minutes (Extended Volume)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Daily Sleep Average (Hours)</label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.dailySleepHours}
                  onChange={(e) => setFormData({ ...formData, dailySleepHours: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Occupation Type</label>
                <select
                  value={formData.workType}
                  onChange={(e) => setFormData({ ...formData, workType: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
                >
                  <option value="desk">Sedentary / Desk Job</option>
                  <option value="mixed">Mixed Movement / Standing</option>
                  <option value="active">High Physical Activity</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Equipment */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs uppercase tracking-wider text-cyan-400 font-bold">Step 5</span>
              <h2 className="text-2xl font-bold text-white mt-1">Available Training Equipment</h2>
              <p className="text-xs text-slate-400 mt-1">
                FitAI filters out exercises requiring unavailable gear to ensure every plan is 100% executable.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {equipmentOptions.map((opt) => {
                const selected = formData.equipment.includes(opt.id);
                return (
                  <div
                    key={opt.id}
                    onClick={() => handleToggleEquipment(opt.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      selected ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-800 bg-slate-950'
                    }`}
                  >
                    <span className="text-sm font-semibold text-white">{opt.label}</span>
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                        selected ? 'bg-cyan-500 border-cyan-500 text-slate-950' : 'border-slate-700'
                      }`}
                    >
                      {selected && <CheckCircle2 className="w-4 h-4 fill-slate-950" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 6: Preferences & Limitations */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs uppercase tracking-wider text-cyan-400 font-bold">Step 6</span>
              <h2 className="text-2xl font-bold text-white mt-1">Preferences & Injury Safeguards</h2>
              <p className="text-xs text-slate-400 mt-1">
                Tell us about any joint issues or dietary choices for safety validation.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">
                  Joint Limitations or Recent Injuries (e.g., knee, shoulder, lumbar)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mild right shoulder impingement on heavy overhead work"
                  value={formData.limitations}
                  onChange={(e) => setFormData({ ...formData, limitations: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Dietary Strategy</label>
                <select
                  value={formData.dietaryPreferences}
                  onChange={(e) => setFormData({ ...formData, dietaryPreferences: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
                >
                  <option value="high_protein">High Protein (Standard Athlete)</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Plant-Based / Vegan</option>
                  <option value="keto">Ketogenic</option>
                  <option value="paleo">Paleo Whole Foods</option>
                </select>
              </div>

              <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-300 flex items-start space-x-2">
                <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  By completing setup, FitAI will automatically calculate your BMR, TDEE, recommended daily macros, and configure your personalized dashboard.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-800">
          {currentStep > 1 ? (
            <button
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div></div>
          )}

          {currentStep < 6 ? (
            <button
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="flex items-center space-x-1.5 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={isSubmitting}
              className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-xl shadow-cyan-500/30 transition-all"
            >
              {isSubmitting ? 'Configuring Your Engine...' : 'Generate Personalized Engine'}
            </button>
          )}
        </div>
      </div>

      <div className="py-4 text-center text-xs text-slate-500">
        FitAI Engine • Production Grade Sports Intelligence Architecture
      </div>
    </div>
  );
}
