'use client';

import React, { useState } from 'react';
import { Camera, Upload, Check, AlertCircle, X, Sparkles, Edit3 } from 'lucide-react';

interface FoodVisionModalProps {
  onClose: () => void;
  onFoodLogged?: (meal: any) => void;
}

export default function FoodVisionModal({ onClose, onFoodLogged }: FoodVisionModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [classificationResult, setClassificationResult] = useState<any | null>(null);

  // Editable fields for user correction
  const [foodName, setFoodName] = useState('');
  const [portionGrams, setPortionGrams] = useState(350);
  const [calories, setCalories] = useState(480);
  const [protein, setProtein] = useState(42);
  const [carbs, setCarbs] = useState(50);
  const [fat, setFat] = useState(12);

  const sampleImages = [
    { name: 'Grilled Chicken & Rice', hint: 'chicken rice broccoli', sampleUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300' },
    { name: 'Avocado Toast & Eggs', hint: 'eggs avocado toast', sampleUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=300' },
    { name: 'Salmon Sweet Potato', hint: 'salmon sweet potato', sampleUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300' },
  ];

  const handleSelectSample = (sample: any) => {
    setPreviewUrl(sample.sampleUrl);
    runClassification(sample.name, sample.hint);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      runClassification(file.name, '');
    }
  };

  const runClassification = async (filename: string, hint: string) => {
    setIsClassifying(true);
    try {
      const formData = new FormData();
      if (selectedFile) formData.append('image', selectedFile);
      formData.append('hint', hint);

      const res = await fetch('/api/nutrition/food-vision', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setClassificationResult(data);
        setFoodName(data.predicted_food);
        setPortionGrams(data.estimated_portion_grams);
        setCalories(data.nutrition_estimates.calories);
        setProtein(data.nutrition_estimates.protein_g);
        setCarbs(data.nutrition_estimates.carbs_g);
        setFat(data.nutrition_estimates.fat_g);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsClassifying(false);
    }
  };

  const handleSaveToMealLog = async () => {
    try {
      // Save directly to meal log
      const res = await fetch('/api/nutrition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mealName: 'AI Scanned Meal',
          items: [
            // If food exists or fallback
          ],
        }),
      });

      if (onFoodLogged) onFoodLogged({ foodName, calories, protein, carbs, fat });
      onClose();
    } catch {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Camera className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-white">AI Food Image Recognition</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          {/* Upload or Sample Selector */}
          {!previewUrl && (
            <div className="space-y-4">
              <label className="border-2 border-dashed border-slate-700 hover:border-cyan-500/50 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-950/50">
                <Upload className="w-10 h-10 text-cyan-400 mb-3" />
                <span className="text-sm font-semibold text-white">Upload meal photo or drag here</span>
                <span className="text-xs text-slate-400 mt-1">Supports JPG, PNG, WEBP up to 10MB</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>

              <div>
                <span className="text-xs font-semibold text-slate-400 block mb-2">Or select a demo plate:</span>
                <div className="grid grid-cols-3 gap-2">
                  {sampleImages.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectSample(s)}
                      className="p-2 bg-slate-950 border border-slate-800 rounded-lg hover:border-cyan-500 text-left transition-all"
                    >
                      <img src={s.sampleUrl} alt={s.name} className="w-full h-16 object-cover rounded mb-1.5" />
                      <span className="text-[11px] font-medium text-slate-300 line-clamp-1">{s.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Classification Result View */}
          {previewUrl && (
            <div className="space-y-4">
              <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-800 bg-black max-h-56">
                <img src={previewUrl} alt="Meal preview" className="w-full h-full object-cover" />
                {isClassifying && (
                  <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center space-x-2 text-cyan-400 text-sm font-bold">
                    <Sparkles className="w-5 h-5 animate-spin" />
                    <span>Analyzing food composition & portion...</span>
                  </div>
                )}
              </div>

              {classificationResult && !isClassifying && (
                <div className="space-y-4">
                  {/* Confidence banner */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-xs">
                    <div className="flex items-center space-x-2 text-cyan-300">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <span className="font-semibold">Match Confidence: {Math.round(classificationResult.confidence_score * 100)}%</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">Portion ~{portionGrams}g</span>
                  </div>

                  {/* Mandatory Uncertainty Disclaimer */}
                  <div className="flex items-start space-x-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>Estimated nutrition — actual values may vary depending on preparation and condiments. You can edit any value below before logging.</span>
                  </div>

                  {/* Editable Fields */}
                  <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                        <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Verify & Adjust Nutrition</span>
                      </span>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Identified Meal Name</label>
                      <input
                        type="text"
                        value={foodName}
                        onChange={(e) => setFoodName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Calories</label>
                        <input
                          type="number"
                          value={calories}
                          onChange={(e) => setCalories(Number(e.target.value))}
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-amber-400 font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Protein (g)</label>
                        <input
                          type="number"
                          value={protein}
                          onChange={(e) => setProtein(Number(e.target.value))}
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-cyan-400 font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Carbs (g)</label>
                        <input
                          type="number"
                          value={carbs}
                          onChange={(e) => setCarbs(Number(e.target.value))}
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-emerald-400 font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Fat (g)</label>
                        <input
                          type="number"
                          value={fat}
                          onChange={(e) => setFat(Number(e.target.value))}
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-rose-400 font-mono font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => {
                        setPreviewUrl(null);
                        setClassificationResult(null);
                      }}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      ← Retake Photo
                    </button>
                    <button
                      onClick={handleSaveToMealLog}
                      className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
                    >
                      Confirm & Log Meal
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
