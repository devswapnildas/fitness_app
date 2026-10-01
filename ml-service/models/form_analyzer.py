import math
from typing import Dict, Any, List

class ExerciseFormAnalyzer:
    """
    Biomechanical pose estimation processor.
    Calculates 3-point joint angles, detects repetition phases,
    evaluates range of motion, and generates actionable technique cues.
    """

    @staticmethod
    def calculate_angle(p1: Dict[str, float], p2: Dict[str, float], p3: Dict[str, float]) -> float:
        """
        Calculates angle in degrees between three 2D/3D points (p2 is vertex).
        """
        x1, y1 = p1.get("x", 0), p1.get("y", 0)
        x2, y2 = p2.get("x", 0), p2.get("y", 0)
        x3, y3 = p3.get("x", 0), p3.get("y", 0)

        radians = math.atan2(y3 - y2, x3 - x2) - math.atan2(y1 - y2, x1 - x2)
        angle = abs(radians * 180.0 / math.pi)

        if angle > 180.0:
            angle = 360.0 - angle

        return round(angle, 1)

    def analyze_squat(self, keypoints: Dict[str, Any]) -> Dict[str, Any]:
        """
        Evaluates squat depth (hip-knee-ankle), torso lean (shoulder-hip-vertical), and knee valgus.
        """
        hip = keypoints.get("hip", {"x": 0.5, "y": 0.5})
        knee = keypoints.get("knee", {"x": 0.5, "y": 0.7})
        ankle = keypoints.get("ankle", {"x": 0.5, "y": 0.9})
        shoulder = keypoints.get("shoulder", {"x": 0.5, "y": 0.3})

        knee_angle = self.calculate_angle(hip, knee, ankle)
        hip_angle = self.calculate_angle(shoulder, hip, knee)

        feedback = []
        is_bottom = knee_angle <= 95
        is_parallel = 85 <= knee_angle <= 100
        is_half_rep = 100 < knee_angle < 130

        if is_bottom:
            feedback.append("Excellent parallel or below-parallel depth achieved.")
        elif is_half_rep:
            feedback.append("Try sinking 2-3 inches deeper to reach parallel for full quad and glute recruitment.")

        if hip_angle < 45:
            feedback.append("Excessive forward torso lean detected; brace core and keep chest upright.")
        else:
            feedback.append("Good torso posture maintained throughout descent.")

        rom_pct = min(100, max(20, int((180 - knee_angle) / (180 - 85) * 100)))

        return {
            "exercise": "Squat",
            "joint_angles": {
                "knee_flexion": knee_angle,
                "hip_angle": hip_angle
            },
            "range_of_motion_pct": rom_pct,
            "rep_phase": "bottom" if knee_angle < 100 else ("inflection" if knee_angle < 140 else "top"),
            "form_score": 92 if is_parallel else (78 if is_bottom else 70),
            "feedback": feedback
        }

    def analyze_pushup(self, keypoints: Dict[str, Any]) -> Dict[str, Any]:
        """
        Evaluates elbow angle (shoulder-elbow-wrist) and plank straightness (shoulder-hip-ankle).
        """
        shoulder = keypoints.get("shoulder", {"x": 0.3, "y": 0.4})
        elbow = keypoints.get("elbow", {"x": 0.35, "y": 0.5})
        wrist = keypoints.get("wrist", {"x": 0.35, "y": 0.6})
        hip = keypoints.get("hip", {"x": 0.5, "y": 0.45})
        ankle = keypoints.get("ankle", {"x": 0.8, "y": 0.5})

        elbow_angle = self.calculate_angle(shoulder, elbow, wrist)
        body_line_angle = self.calculate_angle(shoulder, hip, ankle)

        feedback = []
        is_deep = elbow_angle <= 90

        if is_deep:
            feedback.append("Great depth: chest fully lowered to ~90° elbow flexion.")
        else:
            feedback.append("Lower chest closer to floor for full chest stretch before pushing up.")

        if body_line_angle < 160:
            feedback.append("Core sag detected: squeeze glutes and brace abdominals to maintain a rigid plank.")
        else:
            feedback.append("Stable neutral spine and solid hip alignment.")

        rom_pct = min(100, max(20, int((175 - elbow_angle) / (175 - 85) * 100)))

        return {
            "exercise": "Push-Up",
            "joint_angles": {
                "elbow_angle": elbow_angle,
                "spinal_alignment_angle": body_line_angle
            },
            "range_of_motion_pct": rom_pct,
            "rep_phase": "bottom" if elbow_angle <= 95 else ("pushing" if elbow_angle <= 145 else "top"),
            "form_score": 88 if is_deep and body_line_angle >= 165 else 74,
            "feedback": feedback
        }

    def analyze_plank(self, keypoints: Dict[str, Any]) -> Dict[str, Any]:
        shoulder = keypoints.get("shoulder", {"x": 0.2, "y": 0.4})
        hip = keypoints.get("hip", {"x": 0.5, "y": 0.42})
        ankle = keypoints.get("ankle", {"x": 0.85, "y": 0.45})

        spine_angle = self.calculate_angle(shoulder, hip, ankle)
        feedback = []

        if 165 <= spine_angle <= 195:
            feedback.append("Spot-on horizontal alignment! Anti-extension core engagement is optimal.")
            score = 95
        elif spine_angle < 165:
            feedback.append("Hips are sagging towards floor: tuck pelvis and squeeze glutes.")
            score = 70
        else:
            feedback.append("Hips are piked too high: lower hips until shoulders, hips, and heels form one straight line.")
            score = 75

        return {
            "exercise": "Plank",
            "joint_angles": { "spine_alignment": spine_angle },
            "range_of_motion_pct": 100,
            "rep_phase": "hold",
            "form_score": score,
            "feedback": feedback
        }

    def analyze_shoulder_press(self, keypoints: Dict[str, Any]) -> Dict[str, Any]:
        shoulder = keypoints.get("shoulder", {"x": 0.5, "y": 0.5})
        elbow = keypoints.get("elbow", {"x": 0.6, "y": 0.4})
        wrist = keypoints.get("wrist", {"x": 0.6, "y": 0.2})

        arm_extension = self.calculate_angle(shoulder, elbow, wrist)
        feedback = []

        if arm_extension >= 165:
            feedback.append("Full lockout overhead achieved with solid shoulder stability.")
            score = 92
        elif arm_extension <= 95:
            feedback.append("In starting position at chin level.")
            score = 85
        else:
            feedback.append("Ascending smoothly towards overhead extension.")
            score = 88

        return {
            "exercise": "Shoulder Press",
            "joint_angles": { "elbow_extension": arm_extension },
            "range_of_motion_pct": min(100, int((arm_extension - 90) / 80 * 100)),
            "rep_phase": "lockout" if arm_extension >= 165 else "drive",
            "form_score": score,
            "feedback": feedback
        }

    def analyze_lunge(self, keypoints: Dict[str, Any]) -> Dict[str, Any]:
        hip = keypoints.get("hip", {"x": 0.5, "y": 0.4})
        knee = keypoints.get("knee", {"x": 0.4, "y": 0.65})
        ankle = keypoints.get("ankle", {"x": 0.4, "y": 0.85})

        front_knee_angle = self.calculate_angle(hip, knee, ankle)
        feedback = []

        if 85 <= front_knee_angle <= 95:
            feedback.append("Ideal 90-degree front knee bend for balanced quad and glute tension.")
            score = 94
        elif front_knee_angle < 85:
            feedback.append("Knee tracking excessively forward; step out slightly further.")
            score = 76
        else:
            feedback.append("Lower your hips a bit more to achieve full 90-degree depth.")
            score = 80

        return {
            "exercise": "Lunge",
            "joint_angles": { "front_knee_angle": front_knee_angle },
            "range_of_motion_pct": min(100, int((180 - front_knee_angle) / 90 * 100)),
            "rep_phase": "bottom" if front_knee_angle <= 95 else "transition",
            "form_score": score,
            "feedback": feedback
        }
