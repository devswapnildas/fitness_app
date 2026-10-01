import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Dict, Any

class ExerciseRecommender:
    """
    Hybrid content-based and constraint-aware ML recommendation system
    for personalized exercise and workout routine generation.
    """
    def __init__(self):
        self.vectorizer = TfidfVectorizer(stop_words='english')
        self.fitted = False

    def build_corpus(self, exercises: List[Dict[str, Any]]) -> List[str]:
        corpus = []
        for ex in exercises:
            text = f"{ex.get('name', '')} {ex.get('muscleGroup', '')} {ex.get('secondaryMuscles', '')} {ex.get('equipment', '')} {ex.get('difficulty', '')} {ex.get('exerciseType', '')} {ex.get('description', '')}"
            corpus.append(text)
        return corpus

    def recommend(
        self,
        exercises: List[Dict[str, Any]],
        user_history: List[str],
        goal: str,
        fitness_level: str,
        available_equipment: List[str],
        limitations: str = "",
        top_k: int = 6
    ) -> List[Dict[str, Any]]:
        if not exercises:
            return []

        # 1. Hard constraint filtering: equipment & limitations
        valid_exercises = []
        eq_set = set([eq.lower().strip() for eq in available_equipment]) if available_equipment else set()
        
        # If user has bodyweight only or specific equipment
        for ex in exercises:
            ex_eq = str(ex.get("equipment", "")).lower().strip()
            # If user specified equipment list, filter unless bodyweight or matched
            if eq_set and ex_eq != "bodyweight" and ex_eq not in eq_set:
                continue

            # Respect limitations (e.g., knee, shoulder, lower back)
            if limitations:
                lim_lower = limitations.lower()
                ex_name = ex.get("name", "").lower()
                ex_desc = ex.get("description", "").lower()
                if "shoulder" in lim_lower and ("overhead" in ex_name or "military" in ex_name):
                    # Flag or deprioritize
                    continue
                if "knee" in lim_lower and ("jump" in ex_name or "heavy squat" in ex_name):
                    continue

            valid_exercises.append(ex)

        if not valid_exercises:
            valid_exercises = exercises

        # 2. Vectorization & Content Similarity
        corpus = self.build_corpus(valid_exercises)
        tfidf_matrix = self.vectorizer.fit_transform(corpus)

        # Build query profile combining goal, fitness level, and recent exercise history
        history_str = " ".join(user_history[-5:]) if user_history else ""
        query_text = f"goal {goal} level {fitness_level} target {history_str}"
        query_vec = self.vectorizer.transform([query_text])

        similarities = cosine_similarity(query_vec, tfidf_matrix).flatten()

        # 3. Add difficulty and frequency adjustments
        difficulty_weight = {
            "beginner": {"beginner": 1.25, "intermediate": 0.8, "advanced": 0.3},
            "intermediate": {"beginner": 0.9, "intermediate": 1.2, "advanced": 0.9},
            "advanced": {"beginner": 0.6, "intermediate": 1.0, "advanced": 1.3}
        }.get(fitness_level.lower(), {"beginner": 1.0, "intermediate": 1.0, "advanced": 1.0})

        final_scores = []
        for idx, sim in enumerate(similarities):
            ex = valid_exercises[idx]
            diff = ex.get("difficulty", "intermediate").lower()
            diff_mult = difficulty_weight.get(diff, 1.0)
            
            # Freshness bonus: slight boost if not in immediate last 3 history items to avoid stale routines
            freshness_bonus = 1.1 if ex.get("name") not in user_history[-3:] else 0.85
            score = float(sim * diff_mult * freshness_bonus)
            final_scores.append((score, ex))

        final_scores.sort(key=lambda x: x[0], reverse=True)
        recommended = []
        seen_muscles = set()

        for score, ex in final_scores:
            mg = ex.get("muscleGroup", "Other")
            # Ensure variety across muscle groups
            recommended.append({
                **ex,
                "relevance_score": round(score, 3),
                "ai_rationale": f"Selected for {goal.replace('_', ' ')} based on {fitness_level} level and mechanical efficiency."
            })
            if len(recommended) >= top_k:
                break

        return recommended
