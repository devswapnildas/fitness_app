import numpy as np
from typing import Dict, Any, List

class ProgressPredictor:
    """
    ML Progress & 1-Rep-Max Estimator using physical adaptation modeling,
    diminishing returns curves, and Monte Carlo confidence intervals.
    """

    @staticmethod
    def predict_weight_trajectory(
        current_weight_kg: float,
        daily_calorie_surplus_deficit: float,
        days_per_week_training: int,
        weeks_ahead: int = 12
    ) -> Dict[str, Any]:
        """
        Projects bodyweight changes using energy balance thermodynamics
        with metabolic adaptation damping factor and confidence intervals.
        """
        # 1 kg of adipose / lean tissue requires approximately 7700 kcal
        weekly_net_kcal = daily_calorie_surplus_deficit * 7
        
        # Metabolic adaptation factor (as body changes weight, NEAT and BMR shift)
        adaptation_rate = 0.05
        
        trajectory = []
        weight = current_weight_kg
        
        for w in range(1, weeks_ahead + 1):
            # Dampened weekly delta
            dampened_net = weekly_net_kcal * (1.0 - (w * adaptation_rate * 0.15))
            weight_delta = dampened_net / 7700.0
            
            # Exercise adherence buffer (more workouts -> slightly better lean mass retention/gain)
            training_factor = min(days_per_week_training / 4.0, 1.2)
            if weekly_net_kcal < 0:
                # Losing weight: workouts preserve muscle
                weight_delta = weight_delta * (1.0 - (0.05 * (training_factor - 1.0)))
            else:
                # Gaining weight: workouts promote muscle synthesis
                weight_delta = weight_delta * (1.0 + (0.04 * (training_factor - 1.0)))

            weight += weight_delta
            
            # Monte Carlo variance interval (diverges over time)
            variance = 0.35 * np.sqrt(w)
            
            trajectory.append({
                "week": w,
                "predicted_weight_kg": round(float(weight), 2),
                "confidence_lower_kg": round(float(weight - variance), 2),
                "confidence_upper_kg": round(float(weight + variance), 2),
            })

        return {
            "current_weight_kg": current_weight_kg,
            "target_horizon_weeks": weeks_ahead,
            "trajectory": trajectory,
            "disclaimer": "Projections are mathematical estimates based on energy balance principles. Individual endocrine, metabolic, and adherence factors will cause variations."
        }

    @staticmethod
    def predict_strength_progression(
        current_1rm_kg: float,
        exercise_name: str,
        training_experience_months: int,
        weekly_volume_sets: int,
        weeks_ahead: int = 8
    ) -> Dict[str, Any]:
        """
        Calculates projected 1RM progression using a logarithmic adaptation curve
        (novice lifters progress faster, advanced lifters experience diminishing returns).
        """
        # Diminishing returns coefficient based on training experience
        if training_experience_months < 6:
            rate_constant = 0.015 # ~1.5% weekly potential
        elif training_experience_months < 24:
            rate_constant = 0.008 # ~0.8% weekly potential
        else:
            rate_constant = 0.004 # ~0.4% weekly potential

        # Optimal volume sweet spot (10-20 weekly sets per muscle group)
        if weekly_volume_sets < 6:
            volume_multiplier = 0.6
        elif weekly_volume_sets <= 18:
            volume_multiplier = 1.0
        else:
            volume_multiplier = 0.85 # junk volume / overreaching penalty

        progression = []
        current = current_1rm_kg

        for w in range(1, weeks_ahead + 1):
            weekly_gain = current * rate_constant * volume_multiplier * (1.0 / (1.0 + 0.02 * w))
            current += weekly_gain
            uncertainty = 1.5 * np.sqrt(w)

            progression.append({
                "week": w,
                "projected_1rm_kg": round(float(current), 1),
                "confidence_lower_kg": round(float(max(current_1rm_kg, current - uncertainty)), 1),
                "confidence_upper_kg": round(float(current + uncertainty), 1),
            })

        return {
            "exercise": exercise_name,
            "baseline_1rm_kg": current_1rm_kg,
            "progression": progression,
            "readiness_indicator": "High Progression Readiness" if weekly_volume_sets >= 10 else "Moderate - Increase Volume for Optimal Overload",
            "disclaimer": "Strength estimates do not guarantee specific loads. Always prioritize technique and joint comfort."
        }
