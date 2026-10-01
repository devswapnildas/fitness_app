'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import FoodVisionModal from '@/components/nutrition/FoodVisionModal';
import {
  Apple,
  Camera,
  Sparkles,
  Plus,
  Flame,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  Utensils,
  ChevronRight,
} from 'lucide-react';

export default function NutritionPage() {
  const [nutritionData, setNutritionData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [foodVisionOpen, setFoodVisionOpen] = useState(false);
  const [pantryModalOpen, setPantryModalOpen] = useState(false);
  const [pantryIngredients, setPantryIngredients] = useState('Eggs, Jasmine Rice, Chicken Breast, Broccoli, Olive Oil');
  const [pantryRecipes, setPantryRecipes] = useState<any[]>([]);
  const [isGeneratingPantry, setIsGeneratingPantry] = useState(false);

  // Manual Log Food Modal
  const [logFoodModalOpen, setLogFoodModalOpen] = useState(false);
  const [selectedMealCategory, setSelectedMealCategory] = useState('Lunch');
  const [foodSearch, setFoodSearch] = useState('');
  const [selectedFood, setSelectedFood] = useState<any | null>(null);
  const [servings, setServings] = useState(1);

  useEffect(() => {
    fetchNutrition();
  }, []);

  const fetchNutrition = async () => {
    try {
      const res = await fetch('/api/nutrition');
      if (res.ok) {
        const data = await res.json();
        setNutritionData(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePantryMeals = async () => {
    setIsGeneratingPantry(true);
    try {
      const ingredients = pantryIngredients.split(',').map((s) => s.trim());
      const res = await fetch('/api/nutrition/ai-meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availableIngredients: ingredients }),
      });

      if (res.ok) {
        const data = await res.json();
        setPantryRecipes(data.recipes || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingPantry(false);
    }
  };

  const handleAddFoodToMeal = async () => {
    if (!selectedFood) return;
    try {
      const res = await fetch('/api/nutrition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mealName: selectedMealCategory,
          items: [{ foodId: selectedFood.id, servings: Number(servings) }],
        }),
      });

      if (res.ok) {
        setLogFoodModalOpen(false);
        setSelectedFood(null);
        fetchNutrition();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !nutritionData) {
    return (
      <div className="min-h-screen bg-[#080c14] text-slate-100">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-xs text-slate-400">
          Loading Nutrition Engine...
        </div>
      </div>
    );
  }

  const { targets, consumed, meals, foods } = nutritionData;
  const remainingCalories = Math.max(0, targets.calories - consumed.calories);

  const filteredFoods = foods.filter((f: any) =>
    f.name.toLowerCase().includes(foodSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 pb-24 md:pb-12">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Nutritional Science & Macro Engine
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">Dietary Target Optimization</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">Nutrition & Fuel</h1>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setPantryModalOpen(true)}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700"
            >
              <Utensils className="w-4 h-4 text-emerald-400" />
              <span>What I Have at Home AI</span>
            </button>

            <button
              onClick={() => setFoodVisionOpen(true)}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
            >
              <Camera className="w-4 h-4" />
              <span>AI Food Image Scan</span>
            </button>
          </div>
        </div>

        {/* Calorie & Macro Target Progress Card */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            {/* Calorie Dial */}
            <div className="md:col-span-1 text-center md:text-left space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Calories Remaining</span>
              <div className="flex items-baseline justify-center md:justify-start space-x-2">
                <span className="text-4xl font-black text-white font-mono">{remainingCalories.toLocaleString()}</span>
                <span className="text-xs text-slate-400">/ {targets.calories.toLocaleString()} kcal</span>
              </div>
              <p className="text-xs text-slate-400">
                Consumed: <span className="text-amber-400 font-bold">{consumed.calories.toLocaleString()} kcal</span>
              </p>
            </div>

            {/* Macro Bars */}
            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Protein */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300">Protein</span>
                  <span className="text-cyan-400 font-mono font-bold">
                    {consumed.proteinG}g / {targets.proteinG}g
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-cyan-500 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, (consumed.proteinG / targets.proteinG) * 100)}%` }}
                  ></div>
                </div>
                <span className="text-[10px] text-slate-500 block">Muscle Protein Synthesis</span>
              </div>

              {/* Carbohydrates */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300">Carbohydrates</span>
                  <span className="text-emerald-400 font-mono font-bold">
                    {consumed.carbsG}g / {targets.carbsG}g
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, (consumed.carbsG / targets.carbsG) * 100)}%` }}
                  ></div>
                </div>
                <span className="text-[10px] text-slate-500 block">Glycogen Replenishment</span>
              </div>

              {/* Fats */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300">Healthy Fats</span>
                  <span className="text-rose-400 font-mono font-bold">
                    {consumed.fatG}g / {targets.fatG}g
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, (consumed.fatG / targets.fatG) * 100)}%` }}
                  ></div>
                </div>
                <span className="text-[10px] text-slate-500 block">Endocrine Function</span>
              </div>
            </div>
          </div>
        </div>

        {/* Meal Logging Section (Breakfast, Lunch, Dinner, Snacks) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Daily Meals</h2>
            <button
              onClick={() => {
                setSelectedFood(null);
                setLogFoodModalOpen(true);
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-400"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Food to Meal</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map((category) => {
              const matchedMeal = meals.find((m: any) => m.name.toLowerCase() === category.toLowerCase());
              return (
                <div
                  key={category}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div>
                        <h3 className="text-base font-bold text-white">{category}</h3>
                        <p className="text-xs text-slate-400">
                          {matchedMeal ? `${matchedMeal.totalCalories} kcal • ${matchedMeal.totalProteinG}g P` : 'No foods logged yet'}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedMealCategory(category);
                          setLogFoodModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        title={`Add food to ${category}`}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {matchedMeal && matchedMeal.items?.length > 0 ? (
                      <div className="space-y-2">
                        {matchedMeal.items.map((it: any) => (
                          <div
                            key={it.id}
                            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                          >
                            <div>
                              <span className="font-semibold text-slate-200">{it.food?.name}</span>
                              <span className="text-[10px] text-slate-500 block">
                                {it.servings} serving ({it.food?.servingSize} {it.food?.servingUnit})
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="font-mono font-bold text-amber-400">{it.calories} kcal</span>
                              <span className="text-[10px] text-cyan-400 block">{it.proteinG}g P</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic py-2">
                        Log food manually, via photo recognition, or using pantry ideas.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* AI Pantry Meal Generator Modal (Section 11) */}
      {pantryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-base font-bold text-white">Generate Meals Using What I Have at Home</h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Input raw ingredients in your fridge/pantry for instant balanced macro meal recipes.
                </p>
              </div>
              <button onClick={() => setPantryModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-xs text-slate-300 font-medium block">
                Available Ingredients (Comma-separated)
              </label>
              <textarea
                rows={2}
                value={pantryIngredients}
                onChange={(e) => setPantryIngredients(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
                placeholder="e.g. Eggs, Rice, Chicken, Spinach, Avocado, Olive oil"
              />

              <button
                onClick={handleGeneratePantryMeals}
                disabled={isGeneratingPantry}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center space-x-1.5"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>{isGeneratingPantry ? 'Synthesizing Recipes...' : 'Generate Anabolic Meal Ideas'}</span>
              </button>
            </div>

            {/* Generated Recipes List */}
            {pantryRecipes.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[11px] text-amber-300">
                  *Disclaimer: Nutritional estimates are computed using empirical database figures and do not replace clinical dietetic advice.
                </div>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {pantryRecipes.map((r, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white">{r.title}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">~{r.prep_time_mins} min</span>
                      </div>
                      <div className="flex items-center space-x-3 text-xs font-mono">
                        <span className="text-amber-400">{r.estimated_nutrition?.calories} kcal</span>
                        <span className="text-cyan-400">{r.estimated_nutrition?.protein_g}g Protein</span>
                        <span className="text-emerald-400">{r.estimated_nutrition?.carbs_g}g Carbs</span>
                        <span className="text-rose-400">{r.estimated_nutrition?.fat_g}g Fat</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{r.instructions}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Manual Food Logger Modal */}
      {logFoodModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-base font-bold text-white">Log to {selectedMealCategory}</h3>
              <button onClick={() => setLogFoodModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search food database..."
                value={foodSearch}
                onChange={(e) => setFoodSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white"
              />
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {filteredFoods.slice(0, 8).map((f: any) => (
                <div
                  key={f.id}
                  onClick={() => setSelectedFood(f)}
                  className={`p-2.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between text-xs ${
                    selectedFood?.id === f.id
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <span className="font-semibold text-white">{f.name}</span>
                    <span className="text-[10px] text-slate-500 block">
                      {f.servingSize} {f.servingUnit}
                    </span>
                  </div>
                  <span className="font-mono text-cyan-400 font-bold">{f.calories} kcal</span>
                </div>
              ))}
            </div>

            {selectedFood && (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Servings</span>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={servings}
                    onChange={(e) => setServings(parseFloat(e.target.value) || 1)}
                    className="w-20 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-center font-mono text-white text-xs"
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>Total: {Math.round(selectedFood.calories * servings)} kcal</span>
                  <span>{Math.round(selectedFood.proteinG * servings)}g P</span>
                  <span>{Math.round(selectedFood.carbsG * servings)}g C</span>
                  <span>{Math.round(selectedFood.fatG * servings)}g F</span>
                </div>
              </div>
            )}

            <button
              onClick={handleAddFoodToMeal}
              disabled={!selectedFood}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 disabled:opacity-40"
            >
              Add Food to {selectedMealCategory}
            </button>
          </div>
        </div>
      )}

      {/* AI Food Image Recognition Modal */}
      {foodVisionOpen && (
        <FoodVisionModal
          onClose={() => setFoodVisionOpen(false)}
          onFoodLogged={() => fetchNutrition()}
        />
      )}

      <BottomNav />
    </div>
  );
}
