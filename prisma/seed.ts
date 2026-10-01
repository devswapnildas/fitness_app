import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting FitAI database seeding...');

  // Clean existing data
  await prisma.report.deleteMany({});
  await prisma.subscription.deleteMany({});
  await prisma.exerciseAnalysis.deleteMany({});
  await prisma.mlPrediction.deleteMany({});
  await prisma.aiMessage.deleteMany({});
  await prisma.aiConversation.deleteMany({});
  await prisma.aiRecommendation.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.trainerClient.deleteMany({});
  await prisma.trainer.deleteMany({});
  await prisma.challengeParticipant.deleteMany({});
  await prisma.challenge.deleteMany({});
  await prisma.userAchievement.deleteMany({});
  await prisma.achievement.deleteMany({});
  await prisma.waterLog.deleteMany({});
  await prisma.sleepLog.deleteMany({});
  await prisma.habitLog.deleteMany({});
  await prisma.habit.deleteMany({});
  await prisma.nutritionLog.deleteMany({});
  await prisma.mealItem.deleteMany({});
  await prisma.meal.deleteMany({});
  await prisma.food.deleteMany({});
  await prisma.bodyMeasurement.deleteMany({});
  await prisma.progressRecord.deleteMany({});
  await prisma.exerciseSet.deleteMany({});
  await prisma.workoutSession.deleteMany({});
  await prisma.workoutExercise.deleteMany({});
  await prisma.workout.deleteMany({});
  await prisma.workoutPlan.deleteMany({});
  await prisma.exercise.deleteMany({});
  await prisma.muscleGroup.deleteMany({});
  await prisma.fitnessGoal.deleteMany({});
  await prisma.userProfile.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Creating Muscle Groups...');
  const muscleGroupNames = [
    { name: 'Chest', description: 'Pectoralis major and minor muscles' },
    { name: 'Back', description: 'Latissimus dorsi, rhomboids, trapezius, and erector spinae' },
    { name: 'Shoulders', description: 'Anterior, lateral, and posterior deltoids' },
    { name: 'Arms', description: 'Biceps brachii, triceps brachii, and forearms' },
    { name: 'Legs', description: 'Quadriceps, hamstrings, gluteus, and calves' },
    { name: 'Core', description: 'Rectus abdominis, obliques, and transverse abdominis' },
    { name: 'Cardio', description: 'Aerobic and anaerobic conditioning' },
    { name: 'Full Body', description: 'Compound multi-joint compound kinetic chains' },
    { name: 'Mobility', description: 'Joint flexibility, range of motion, and tissue health' },
  ];

  const muscleGroupMap: Record<string, string> = {};
  for (const mg of muscleGroupNames) {
    const created = await prisma.muscleGroup.create({ data: mg });
    muscleGroupMap[mg.name] = created.id;
  }

  console.log('Seeding 100+ Exercise Database...');
  const exercisesData = [
    // Chest (12)
    {
      name: 'Barbell Bench Press',
      muscle: 'Chest',
      secondary: 'Triceps, Front Deltoids',
      equipment: 'barbell',
      difficulty: 'intermediate',
      instructions: '1. Lie on bench with eyes under barbell. 2. Grip bar slightly wider than shoulder-width. 3. Unrack, lower bar to mid-chest with elbows at ~45-75 degrees. 4. Press explosively back to starting position without locking elbows harshly.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Push-Up',
      muscle: 'Chest',
      secondary: 'Triceps, Core, Front Deltoids',
      equipment: 'bodyweight',
      difficulty: 'beginner',
      instructions: '1. Assume plank position with hands slightly wider than shoulders. 2. Keep body in a straight line from heels to crown. 3. Lower chest until it hovers an inch above ground. 4. Push back to starting position.',
      type: 'strength',
      pose: true,
    },
    {
      name: 'Incline Dumbbell Press',
      muscle: 'Chest',
      secondary: 'Clavicular Head, Triceps',
      equipment: 'dumbbells',
      difficulty: 'intermediate',
      instructions: 'Set bench to 30-45 degrees. Lower dumbbells smoothly to upper chest level, press up directly above shoulders.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Dips (Chest Focus)',
      muscle: 'Chest',
      secondary: 'Triceps, Shoulders',
      equipment: 'bodyweight',
      difficulty: 'advanced',
      instructions: 'Lean torso forward roughly 30 degrees. Lower body until elbows reach 90 degrees, press upward contracting chest.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Cable Crossover',
      muscle: 'Chest',
      secondary: 'Anterior Deltoid',
      equipment: 'cable',
      difficulty: 'intermediate',
      instructions: 'Stand centered with high pulleys. Step forward in staggered stance, arc hands together down and in front.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Dumbbell Flyes',
      muscle: 'Chest',
      secondary: 'Anterior Deltoids',
      equipment: 'dumbbells',
      difficulty: 'intermediate',
      instructions: 'Maintain slight elbow bend throughout. Open arms wide to feel chest stretch, squeeze dumbbells back to top.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Decline Barbell Bench Press',
      muscle: 'Chest',
      secondary: 'Triceps',
      equipment: 'barbell',
      difficulty: 'intermediate',
      instructions: 'Secure legs on decline bench. Lower barbell to lower sternum and press smoothly upward.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Diamond Push-Up',
      muscle: 'Chest',
      secondary: 'Triceps',
      equipment: 'bodyweight',
      difficulty: 'intermediate',
      instructions: 'Form diamond shape with thumbs and index fingers under chest. Lower chest to hands and drive up.',
      type: 'strength',
      pose: true,
    },
    {
      name: 'Machine Chest Press',
      muscle: 'Chest',
      secondary: 'Triceps',
      equipment: 'machine',
      difficulty: 'beginner',
      instructions: 'Adjust seat so handles align with mid-chest. Press outward with controlled tempo.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Resistance Band Chest Press',
      muscle: 'Chest',
      secondary: 'Front Deltoids',
      equipment: 'bands',
      difficulty: 'beginner',
      instructions: 'Anchor band behind back or pole, press forward keeping tension constant.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Pec Deck Fly Machine',
      muscle: 'Chest',
      secondary: 'Anterior Deltoid',
      equipment: 'machine',
      difficulty: 'beginner',
      instructions: 'Sit flush with back pad, squeeze levers together concentrating on inner chest tension.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Floor Press with Dumbbells',
      muscle: 'Chest',
      secondary: 'Triceps',
      equipment: 'dumbbells',
      difficulty: 'beginner',
      instructions: 'Lie on floor with knees bent. Lower elbows until triceps lightly touch floor, pause and press.',
      type: 'strength',
      pose: false,
    },

    // Back (12)
    {
      name: 'Conventional Barbell Deadlift',
      muscle: 'Back',
      secondary: 'Hamstrings, Glutes, Traps, Forearms',
      equipment: 'barbell',
      difficulty: 'advanced',
      instructions: '1. Stand mid-foot under barbell, hip-width stance. 2. Hinge at hips to grip bar. 3. Pull chest up, pack lats, brace core. 4. Drive through ground, standing tall with hips locked.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Pull-Up',
      muscle: 'Back',
      secondary: 'Biceps, Rear Deltoids, Core',
      equipment: 'bodyweight',
      difficulty: 'intermediate',
      instructions: 'Pronated grip wider than shoulders. Pull chest up toward bar until chin clears bar. Lower under control.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Bent-Over Barbell Row',
      muscle: 'Back',
      secondary: 'Rear Delts, Biceps, Core',
      equipment: 'barbell',
      difficulty: 'intermediate',
      instructions: 'Hinge at hips at 45 degree torso angle. Pull barbell toward belly button, tucking elbows.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Seated Cable Row',
      muscle: 'Back',
      secondary: 'Biceps, Rhomboids',
      equipment: 'cable',
      difficulty: 'beginner',
      instructions: 'Sit upright, pull V-bar or wide handle into abdomen, squeezing shoulder blades together.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Lat Pulldown',
      muscle: 'Back',
      secondary: 'Biceps, Rear Deltoids',
      equipment: 'cable',
      difficulty: 'beginner',
      instructions: 'Grip bar wide, lean back slightly. Pull bar smoothly down to clavicle, pausing for peak contraction.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Single-Arm Dumbbell Row',
      muscle: 'Back',
      secondary: 'Biceps, Lats',
      equipment: 'dumbbells',
      difficulty: 'beginner',
      instructions: 'Support knee and hand on flat bench. Row dumbbell along hip crease without twisting spine.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'T-Bar Row',
      muscle: 'Back',
      secondary: 'Trapezius, Rhomboids',
      equipment: 'barbell',
      difficulty: 'intermediate',
      instructions: 'Straddle bar with close handle. Pull weight smoothly to lower sternum.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Chin-Up',
      muscle: 'Back',
      secondary: 'Biceps (High Emphasis)',
      equipment: 'bodyweight',
      difficulty: 'intermediate',
      instructions: 'Supinated (palms facing you) grip shoulder-width. Drive elbows down to pull chest to bar.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Hyperextensions (Back Extension)',
      muscle: 'Back',
      secondary: 'Glutes, Hamstrings',
      equipment: 'bodyweight',
      difficulty: 'beginner',
      instructions: 'Lock ankles into 45-degree bench. Hinge at hips keeping back flat, extend spine to neutral.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Face Pull',
      muscle: 'Back',
      secondary: 'Rear Delts, Rotator Cuff',
      equipment: 'cable',
      difficulty: 'beginner',
      instructions: 'Attach rope to eye level. Pull towards forehead while externally rotating shoulders.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Dumbbell Pullover',
      muscle: 'Back',
      secondary: 'Chest, Triceps',
      equipment: 'dumbbells',
      difficulty: 'intermediate',
      instructions: 'Lie across bench supporting shoulders. Lower dumbbell behind head with slight elbow bend and pull over.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Inverted Bodyweight Row',
      muscle: 'Back',
      secondary: 'Biceps, Traps',
      equipment: 'bodyweight',
      difficulty: 'beginner',
      instructions: 'Lie underneath barbell set at waist height. Pull chest up to bar maintaining rigid plank.',
      type: 'strength',
      pose: false,
    },

    // Legs (16)
    {
      name: 'Barbell Back Squat',
      muscle: 'Legs',
      secondary: 'Glutes, Hamstrings, Core, Spinal Erectors',
      equipment: 'barbell',
      difficulty: 'intermediate',
      instructions: '1. Place bar comfortably across upper traps. 2. Set feet shoulder-width, toes turned out 15-30°. 3. Break simultaneously at knees and hips. 4. Descend until hip crease is below knee top. 5. Drive up evenly through feet.',
      type: 'strength',
      pose: true,
    },
    {
      name: 'Bodyweight Squat',
      muscle: 'Legs',
      secondary: 'Glutes, Core',
      equipment: 'bodyweight',
      difficulty: 'beginner',
      instructions: 'Feet shoulder width apart. Sit hips back and down into deep squat keeping chest proud. Press through midfoot.',
      type: 'strength',
      pose: true,
    },
    {
      name: 'Walking Lunges',
      muscle: 'Legs',
      secondary: 'Glutes, Hamstrings, Balance',
      equipment: 'bodyweight',
      difficulty: 'beginner',
      instructions: 'Step forward into 90-degree knee bend. Rear knee softly kisses ground. Drive up into next step.',
      type: 'strength',
      pose: true,
    },
    {
      name: 'Romanian Deadlift (RDL)',
      muscle: 'Legs',
      secondary: 'Hamstrings, Glutes, Lower Back',
      equipment: 'barbell',
      difficulty: 'intermediate',
      instructions: 'Maintain soft knee bend. Push hips back as barbell skims down shins until deep hamstring stretch. Squeeze glutes forward.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Leg Press',
      muscle: 'Legs',
      secondary: 'Quadriceps, Glutes',
      equipment: 'machine',
      difficulty: 'beginner',
      instructions: 'Place feet shoulder-width on sled platform. Lower sled with control until knees reach 90 degrees, press smoothly.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Bulgarian Split Squat',
      muscle: 'Legs',
      secondary: 'Quadriceps, Glutes',
      equipment: 'dumbbells',
      difficulty: 'intermediate',
      instructions: 'Rear foot elevated on bench behind you. Lower front thigh parallel to floor, drive through front heel.',
      type: 'strength',
      pose: true,
    },
    {
      name: 'Barbell Hip Thrust',
      muscle: 'Legs',
      secondary: 'Glutes (High Target), Hamstrings',
      equipment: 'barbell',
      difficulty: 'intermediate',
      instructions: 'Upper back against bench, barbell across hips with pad. Drive hips up until thighs and torso align horizontally.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Leg Extension Machine',
      muscle: 'Legs',
      secondary: 'Quadriceps Isolation',
      equipment: 'machine',
      difficulty: 'beginner',
      instructions: 'Sit with knees aligned with machine pivot. Extend legs fully, squeeze quads for 1 second, lower slowly.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Lying Leg Curl Machine',
      muscle: 'Legs',
      secondary: 'Hamstrings Isolation',
      equipment: 'machine',
      difficulty: 'beginner',
      instructions: 'Lie face down with roller against achilles. Curl heels toward glutes, lower under tension.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Standing Calf Raise',
      muscle: 'Legs',
      secondary: 'Gastrocnemius, Soleus',
      equipment: 'machine',
      difficulty: 'beginner',
      instructions: 'Balls of feet on step edge. Drop heels for deep calf stretch, explode onto tip-toes, hold top peak.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Goblet Squat',
      muscle: 'Legs',
      secondary: 'Quadriceps, Core',
      equipment: 'dumbbells',
      difficulty: 'beginner',
      instructions: 'Hold dumbbell vertically against chest. Squat between knees keeping torso upright and elbows pointing down.',
      type: 'strength',
      pose: true,
    },
    {
      name: 'Reverse Lunge',
      muscle: 'Legs',
      secondary: 'Glutes, Hamstrings',
      equipment: 'dumbbells',
      difficulty: 'beginner',
      instructions: 'Step backwards into lunge, lower rear knee toward floor, push through front foot to stand.',
      type: 'strength',
      pose: true,
    },
    {
      name: 'Front Squat',
      muscle: 'Legs',
      secondary: 'Quadriceps, Upper Back, Core',
      equipment: 'barbell',
      difficulty: 'advanced',
      instructions: 'Rest bar across anterior deltoids in clean grip. Squat deeply while keeping elbows high and spine erect.',
      type: 'strength',
      pose: true,
    },
    {
      name: 'Glute Bridge',
      muscle: 'Legs',
      secondary: 'Glutes, Hamstrings',
      equipment: 'bodyweight',
      difficulty: 'beginner',
      instructions: 'Lie on back with knees bent, feet flat on floor. Drive hips toward ceiling, squeeze glutes at top.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Sumo Deadlift',
      muscle: 'Legs',
      secondary: 'Adductors, Glutes, Quads',
      equipment: 'barbell',
      difficulty: 'intermediate',
      instructions: 'Wide stance with feet pointing out 45 degrees. Grip inside knees, push knees out and pull bar smoothly.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Seated Calf Raise',
      muscle: 'Legs',
      secondary: 'Soleus',
      equipment: 'machine',
      difficulty: 'beginner',
      instructions: 'Place pads over lower thighs. Lower heels down and press up onto balls of feet.',
      type: 'strength',
      pose: false,
    },

    // Shoulders (12)
    {
      name: 'Overhead Barbell Shoulder Press',
      muscle: 'Shoulders',
      secondary: 'Triceps, Upper Chest, Core',
      equipment: 'barbell',
      difficulty: 'intermediate',
      instructions: '1. Hold barbell at clavicle height with full grip. 2. Brace glutes and abs. 3. Press barbell overhead in straight vertical path, moving head back then through.',
      type: 'strength',
      pose: true,
    },
    {
      name: 'Seated Dumbbell Shoulder Press',
      muscle: 'Shoulders',
      secondary: 'Anterior & Lateral Deltoids, Triceps',
      equipment: 'dumbbells',
      difficulty: 'beginner',
      instructions: 'Sit upright on bench. Press dumbbells overhead from ear level until arms extend.',
      type: 'strength',
      pose: true,
    },
    {
      name: 'Dumbbell Lateral Raise',
      muscle: 'Shoulders',
      secondary: 'Trapezius',
      equipment: 'dumbbells',
      difficulty: 'beginner',
      instructions: 'Stand tall with dumbbells at sides. Raise arms out to sides with slight elbow bend until parallel with floor.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Cable Lateral Raise',
      muscle: 'Shoulders',
      secondary: 'Lateral Deltoids',
      equipment: 'cable',
      difficulty: 'intermediate',
      instructions: 'Attach handle to lowest pulley. Pull across body outward to shoulder height under continuous tension.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Bent-Over Rear Delt Fly',
      muscle: 'Shoulders',
      secondary: 'Rear Delts, Rhomboids',
      equipment: 'dumbbells',
      difficulty: 'beginner',
      instructions: 'Hinge torso to 45 degrees. Raise dumbbells laterally squeezing rear shoulders without using momentum.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Barbell Upright Row',
      muscle: 'Shoulders',
      secondary: 'Traps, Lateral Delts',
      equipment: 'barbell',
      difficulty: 'intermediate',
      instructions: 'Grip bar shoulder width. Pull vertically with elbows leading until bar reaches chest height.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Arnold Press',
      muscle: 'Shoulders',
      secondary: 'Triceps, Rotator Cuff',
      equipment: 'dumbbells',
      difficulty: 'intermediate',
      instructions: 'Start dumbbells in front of chest palms facing in. Rotate palms outward as you press overhead.',
      type: 'strength',
      pose: true,
    },
    {
      name: 'Barbell Shrugs',
      muscle: 'Shoulders',
      secondary: 'Upper Trapezius',
      equipment: 'barbell',
      difficulty: 'beginner',
      instructions: 'Hold heavy barbell in front of thighs. Elevate shoulders straight up towards ears, hold, then lower.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Pike Push-Up',
      muscle: 'Shoulders',
      secondary: 'Triceps, Upper Chest',
      equipment: 'bodyweight',
      difficulty: 'intermediate',
      instructions: 'Form inverted V shape with hips high. Lower head towards ground in front of hands, press up.',
      type: 'strength',
      pose: true,
    },
    {
      name: 'Front Dumbbell Raise',
      muscle: 'Shoulders',
      secondary: 'Anterior Deltoids',
      equipment: 'dumbbells',
      difficulty: 'beginner',
      instructions: 'Raise dumbbell straight forward to eye level, pause, and lower slowly.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Reverse Pec Deck Machine',
      muscle: 'Shoulders',
      secondary: 'Rear Deltoids',
      equipment: 'machine',
      difficulty: 'beginner',
      instructions: 'Sit facing the machine pad. Grip handles with arms straight, pull back in wide horizontal arc.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Plate Overhead Carry',
      muscle: 'Shoulders',
      secondary: 'Core, Traps, Rotator Cuff',
      equipment: 'barbell',
      difficulty: 'intermediate',
      instructions: 'Lock weight plate or barbell overhead. Walk with deliberate steps maintaining rib cage down.',
      type: 'strength',
      pose: false,
    },

    // Arms (14)
    {
      name: 'Standing Barbell Bicep Curl',
      muscle: 'Arms',
      secondary: 'Brachialis, Forearms',
      equipment: 'barbell',
      difficulty: 'beginner',
      instructions: 'Keep elbows tucked at sides. Curl bar upward towards shoulders without swinging lower back.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Incline Dumbbell Curl',
      muscle: 'Arms',
      secondary: 'Long Head Biceps',
      equipment: 'dumbbells',
      difficulty: 'intermediate',
      instructions: 'Sit on 45-degree incline. Let arms hang back for full stretch, curl dumbbells while supinating wrists.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Hammer Curl',
      muscle: 'Arms',
      secondary: 'Brachioradialis, Forearms',
      equipment: 'dumbbells',
      difficulty: 'beginner',
      instructions: 'Maintain neutral grip (palms facing inward). Curl dumbbells upward squeezing forearms.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Preacher Curl Machine',
      muscle: 'Arms',
      secondary: 'Short Head Biceps',
      equipment: 'machine',
      difficulty: 'beginner',
      instructions: 'Armpits flush against angled pad. Curl handles up to full contraction, lower under control.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Tricep Rope Pushdown',
      muscle: 'Arms',
      secondary: 'Lateral Head Triceps',
      equipment: 'cable',
      difficulty: 'beginner',
      instructions: 'Pin elbows to ribs. Push rope downward and spread ends apart at bottom for peak tricep contraction.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Skull Crushers (EZ Bar)',
      muscle: 'Arms',
      secondary: 'Medial & Long Head Triceps',
      equipment: 'barbell',
      difficulty: 'intermediate',
      instructions: 'Lie on flat bench. Lower barbell down towards forehead by bending at elbows only, extend arms up.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Overhead Dumbbell Tricep Extension',
      muscle: 'Arms',
      secondary: 'Long Head Triceps',
      equipment: 'dumbbells',
      difficulty: 'beginner',
      instructions: 'Hold single heavy dumbbell with both hands overhead. Lower behind neck and press back up.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Close-Grip Barbell Bench Press',
      muscle: 'Arms',
      secondary: 'Triceps, Chest',
      equipment: 'barbell',
      difficulty: 'intermediate',
      instructions: 'Grip barbell roughly shoulder-width. Keep elbows close to sides as you lower bar and press.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Concentration Curl',
      muscle: 'Arms',
      secondary: 'Biceps Peak',
      equipment: 'dumbbells',
      difficulty: 'beginner',
      instructions: 'Brace elbow inside inner thigh. Curl dumbbell smoothly towards face without body sway.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Cable Overhead Tricep Extension',
      muscle: 'Arms',
      secondary: 'Long Head Triceps',
      equipment: 'cable',
      difficulty: 'intermediate',
      instructions: 'Face away from high cable pulley with rope attachment. Extend arms forward overhead.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Bench Dips',
      muscle: 'Arms',
      secondary: 'Triceps, Front Shoulders',
      equipment: 'bodyweight',
      difficulty: 'beginner',
      instructions: 'Hands on bench behind hips, legs extended. Lower hips towards floor, press through palms.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Barbell Wrist Curl',
      muscle: 'Arms',
      secondary: 'Wrist Flexors, Forearms',
      equipment: 'barbell',
      difficulty: 'beginner',
      instructions: 'Rest forearms on thighs with wrists hanging off knees. Curl bar upward using wrist flexion.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Spider Curl',
      muscle: 'Arms',
      secondary: 'Biceps Isolation',
      equipment: 'dumbbells',
      difficulty: 'intermediate',
      instructions: 'Lie prone with chest against incline bench. Hang arms vertically and curl without shoulder movement.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Kickbacks with Dumbbell',
      muscle: 'Arms',
      secondary: 'Triceps Lateral Head',
      equipment: 'dumbbells',
      difficulty: 'beginner',
      instructions: 'Torso hinged parallel to floor, upper arm parallel. Kick dumbbell back until arm is straight.',
      type: 'strength',
      pose: false,
    },

    // Core (12)
    {
      name: 'Plank',
      muscle: 'Core',
      secondary: 'Shoulders, Glutes, Transverse Abdominis',
      equipment: 'bodyweight',
      difficulty: 'beginner',
      instructions: 'Rest on forearms and toes. Maintain neutral spine, contract glutes and draw navel in firmly. Hold steady.',
      type: 'strength',
      pose: true,
    },
    {
      name: 'Hanging Leg Raise',
      muscle: 'Core',
      secondary: 'Hip Flexors, Forearms, Rectus Abdominis',
      equipment: 'bodyweight',
      difficulty: 'advanced',
      instructions: 'Hang from pull-up bar. Without swinging, raise straight legs until parallel to ground or touching bar.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Ab Wheel Rollout',
      muscle: 'Core',
      secondary: 'Lats, Shoulders, Deep Core',
      equipment: 'bodyweight',
      difficulty: 'advanced',
      instructions: 'Kneel holding ab wheel. Roll wheel forward keeping posterior pelvic tilt, pull back with core.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Cable Woodchopper',
      muscle: 'Core',
      secondary: 'Obliques, Rotators',
      equipment: 'cable',
      difficulty: 'intermediate',
      instructions: 'Set cable to shoulder height. Rotate torso diagonally across body using obliques, pivoting rear foot.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Bicycle Crunch',
      muscle: 'Core',
      secondary: 'Rectus Abdominis, Obliques',
      equipment: 'bodyweight',
      difficulty: 'beginner',
      instructions: 'Lie on back, hands behind ears. Alternate bringing opposite elbow to knee in smooth pedaling rhythm.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Russian Twist',
      muscle: 'Core',
      secondary: 'Obliques',
      equipment: 'bodyweight',
      difficulty: 'beginner',
      instructions: 'Sit with knees bent, torso reclined 45 degrees. Rotate shoulders side to side touching ground.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Side Plank',
      muscle: 'Core',
      secondary: 'Quadratus Lumborum, Obliques',
      equipment: 'bodyweight',
      difficulty: 'beginner',
      instructions: 'Prop body on one forearm and foot edge. Keep hips lifted in a straight diagonal line.',
      type: 'strength',
      pose: true,
    },
    {
      name: 'Decline Crunch',
      muscle: 'Core',
      secondary: 'Upper Abdominals',
      equipment: 'bodyweight',
      difficulty: 'beginner',
      instructions: 'Hook legs on decline bench. Curl chest toward hips contracting abs, lower under control.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Dead Bug',
      muscle: 'Core',
      secondary: 'Deep Core Stabilizers',
      equipment: 'bodyweight',
      difficulty: 'beginner',
      instructions: 'Lie flat, lower back glued to floor. Slowly lower opposite arm and leg while bracing core firmly.',
      type: 'mobility',
      pose: false,
    },
    {
      name: 'Paloff Press',
      muscle: 'Core',
      secondary: 'Anti-Rotation Core',
      equipment: 'cable',
      difficulty: 'beginner',
      instructions: 'Stand perpendicular to cable. Hold handle at sternum and press straight forward resisting rotation.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Mountain Climbers',
      muscle: 'Core',
      secondary: 'Cardio, Shoulders',
      equipment: 'bodyweight',
      difficulty: 'beginner',
      instructions: 'From plank position, drive knees alternately toward chest in rapid rhythmic cadence.',
      type: 'cardio',
      pose: false,
    },
    {
      name: 'Dragon Flag',
      muscle: 'Core',
      secondary: 'Lats, Total Core',
      equipment: 'bodyweight',
      difficulty: 'advanced',
      instructions: 'Grip bench behind head. Lift entire torso and legs as a straight rigid unit, lower under extreme control.',
      type: 'strength',
      pose: false,
    },

    // Cardio & Full Body (12)
    {
      name: 'Burpees',
      muscle: 'Full Body',
      secondary: 'Chest, Quads, Core, Lungs',
      equipment: 'bodyweight',
      difficulty: 'intermediate',
      instructions: 'Drop into squat, kick feet back into push-up plank, perform push-up, jump feet in, jump explosively up.',
      type: 'cardio',
      pose: false,
    },
    {
      name: 'Kettlebell Swing',
      muscle: 'Full Body',
      secondary: 'Glutes, Hamstrings, Core, Back',
      equipment: 'dumbbells',
      difficulty: 'intermediate',
      instructions: 'Hinge hips back holding bell. Snap hips explosively forward, letting bell float to chest level.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Thruster (Barbell or Dumbbell)',
      muscle: 'Full Body',
      secondary: 'Quads, Shoulders, Triceps',
      equipment: 'barbell',
      difficulty: 'advanced',
      instructions: 'Perform deep front squat, then use leg drive to launch directly into overhead shoulder press.',
      type: 'strength',
      pose: true,
    },
    {
      name: 'Rowing Machine Intervals',
      muscle: 'Cardio',
      secondary: 'Back, Legs, Core',
      equipment: 'machine',
      difficulty: 'beginner',
      instructions: 'Drive with legs, lean slightly back, pull handle into lower ribs. Reverse smoothly.',
      type: 'cardio',
      pose: false,
    },
    {
      name: 'Jump Rope',
      muscle: 'Cardio',
      secondary: 'Calves, Shoulders, Coordination',
      equipment: 'bodyweight',
      difficulty: 'beginner',
      instructions: 'Bounce lightly on balls of feet, turning rope primarily with wrists rather than shoulders.',
      type: 'cardio',
      pose: false,
    },
    {
      name: 'Box Jump',
      muscle: 'Full Body',
      secondary: 'Quads, Calves, Hip Extension',
      equipment: 'bodyweight',
      difficulty: 'intermediate',
      instructions: 'Swing arms and jump explosively onto sturdy plyometric box, landing softly in partial squat.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Battle Ropes Wave',
      muscle: 'Cardio',
      secondary: 'Shoulders, Arms, Core',
      equipment: 'bodyweight',
      difficulty: 'intermediate',
      instructions: 'Athletic half-squat stance. Rapidly alternate slamming ropes to generate fluid continuous waves.',
      type: 'cardio',
      pose: false,
    },
    {
      name: 'High Knees Sprint in Place',
      muscle: 'Cardio',
      secondary: 'Hip Flexors, Calves',
      equipment: 'bodyweight',
      difficulty: 'beginner',
      instructions: 'Drive knees up towards waist height with rapid arm pump cadence.',
      type: 'cardio',
      pose: false,
    },
    {
      name: 'Clean and Jerk',
      muscle: 'Full Body',
      secondary: 'Full Kinetic Chain',
      equipment: 'barbell',
      difficulty: 'advanced',
      instructions: 'Explosively pull bar from floor to shoulders in clean, then drive bar overhead in jerk split or squat.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Sled Push / Prowler',
      muscle: 'Full Body',
      secondary: 'Quads, Calves, Glutes, Stamina',
      equipment: 'machine',
      difficulty: 'intermediate',
      instructions: 'Lean forward with straight arms against sled uprights, drive legs forward with high knee drive.',
      type: 'strength',
      pose: false,
    },
    {
      name: 'Shadow Boxing Combos',
      muscle: 'Cardio',
      secondary: 'Shoulders, Core, Footwork',
      equipment: 'bodyweight',
      difficulty: 'beginner',
      instructions: 'Move continuously throwing jab-cross-hook combinations with active rotational core power.',
      type: 'cardio',
      pose: false,
    },
    {
      name: 'Treadmill Incline Sprints',
      muscle: 'Cardio',
      secondary: 'Hamstrings, Calves, Cardiovascular',
      equipment: 'machine',
      difficulty: 'intermediate',
      instructions: 'Set incline to 8-12%, sprint for 30s bursts followed by 60s walking recovery.',
      type: 'cardio',
      pose: false,
    },

    // Mobility (12)
    {
      name: 'World\'s Greatest Stretch',
      muscle: 'Mobility',
      secondary: 'Hip Flexors, Hamstrings, Thoracic Spine',
      equipment: 'bodyweight',
      difficulty: 'beginner',
      instructions: 'Step into deep lunge, bring elbow to instep, then rotate arm up towards ceiling opening thoracic spine.',
      type: 'mobility',
      pose: false,
    },
    {
      name: 'Cat-Cow Flow',
      muscle: 'Mobility',
      secondary: 'Spinal Articulation',
      equipment: 'bodyweight',
      difficulty: 'beginner',
      instructions: 'On all fours, inhale as belly drops and chest lifts (Cow), exhale rounding back to ceiling (Cat).',
      type: 'mobility',
      pose: false,
    },
    {
      name: 'Pigeon Pose',
      muscle: 'Mobility',
      secondary: 'Gluteus Medius, Piriformis, Hip Capsule',
      equipment: 'bodyweight',
      difficulty: 'beginner',
      instructions: 'Slide one shin forward perpendicular or angled across mat, extend rear leg back and fold gently forward.',
      type: 'mobility',
      pose: false,
    },
    {
      name: 'Thoracic Foam Rolling',
      muscle: 'Mobility',
      secondary: 'Mid Back Extension',
      equipment: 'bodyweight',
      difficulty: 'beginner',
      instructions: 'Roll slowly between upper and mid back, supporting head with hands to encourage extension.',
      type: 'mobility',
      pose: false,
    },
    {
      name: '90/90 Hip Switch',
      muscle: 'Mobility',
      secondary: 'Internal & External Hip Rotation',
      equipment: 'bodyweight',
      difficulty: 'intermediate',
      instructions: 'Sit with both legs bent at 90 degrees. Transition smoothly across without using hands if possible.',
      type: 'mobility',
      pose: false,
    },
    {
      name: 'Shoulder Pass-Throughs (Broomstick/Band)',
      muscle: 'Mobility',
      secondary: 'Chest, Rotator Cuff, Anterior Shoulder',
      equipment: 'bands',
      difficulty: 'beginner',
      instructions: 'Wide grip on stick or band. Maintain straight arms while moving smoothly from front to back.',
      type: 'mobility',
      pose: false,
    },
    {
      name: 'Ankle Dorsiflexion Wall Mobilization',
      muscle: 'Mobility',
      secondary: 'Ankle Joint, Achilles Tendon',
      equipment: 'bodyweight',
      difficulty: 'beginner',
      instructions: 'Stand facing wall, drive knee forward over pinky toe while keeping heel glued to ground.',
      type: 'mobility',
      pose: false,
    },
    {
      name: 'Downward Facing Dog',
      muscle: 'Mobility',
      secondary: 'Calves, Hamstrings, Lats',
      equipment: 'bodyweight',
      difficulty: 'beginner',
      instructions: 'Press through hands to lift hips high into inverted V, pedal heels alternately to stretch calves.',
      type: 'mobility',
      pose: false,
    },
    {
      name: 'Couch Stretch (Quad & Hip Flexor)',
      muscle: 'Mobility',
      secondary: 'Psoas, Rectus Femoris',
      equipment: 'bodyweight',
      difficulty: 'intermediate',
      instructions: 'Place back knee against wall corner with shin vertical. Step front leg forward, squeeze back glute and sit tall.',
      type: 'mobility',
      pose: false,
    },
    {
      name: 'Deep Squat Hold with Arm Reach',
      muscle: 'Mobility',
      secondary: 'Adductors, Ankles, Thoracic',
      equipment: 'bodyweight',
      difficulty: 'intermediate',
      instructions: 'Hold deep resting squat, grasp opposite ankle and rotate other arm high to ceiling.',
      type: 'mobility',
      pose: true,
    },
    {
      name: 'Child\'s Pose with Lat Reach',
      muscle: 'Mobility',
      secondary: 'Lats, Lower Back, Hips',
      equipment: 'bodyweight',
      difficulty: 'beginner',
      instructions: 'Sink hips back onto heels, reach hands forward and walk fingers to the side to stretch the latissimus.',
      type: 'mobility',
      pose: false,
    },
    {
      name: 'Scapular Wall Slides',
      muscle: 'Mobility',
      secondary: 'Serratus Anterior, Lower Traps',
      equipment: 'bodyweight',
      difficulty: 'beginner',
      instructions: 'Press lower back, head, elbows, and wrists against wall. Slide arms overhead without arching spine.',
      type: 'mobility',
      pose: false,
    },
  ];

  const exerciseMap: Record<string, string> = {};
  for (const ex of exercisesData) {
    const created = await prisma.exercise.create({
      data: {
        name: ex.name,
        description: `Comprehensive form instructions and safety guide for ${ex.name}. Focus on controlled eccentric contractions and full range of motion.`,
        muscleGroupId: muscleGroupMap[ex.muscle],
        secondaryMuscles: ex.secondary,
        equipment: ex.equipment,
        difficulty: ex.difficulty,
        instructions: ex.instructions,
        defaultSets: 3,
        defaultReps: ex.type === 'mobility' ? 12 : 10,
        defaultRestSeconds: ex.type === 'strength' ? 90 : 60,
        estimatedCalories: ex.type === 'cardio' ? 12.0 : 8.0,
        exerciseType: ex.type,
        poseSupported: ex.pose,
      },
    });
    exerciseMap[ex.name] = created.id;
  }
  console.log(`Created ${Object.keys(exerciseMap).length} exercises!`);

  console.log('Seeding Food Database...');
  const foodsData = [
    { name: 'Boneless Skinless Chicken Breast', brand: 'Generic', calories: 165, proteinG: 31, carbsG: 0, fatG: 3.6, fiberG: 0, servingSize: 100, servingUnit: 'g', category: 'Protein' },
    { name: 'Eggs (Whole, Large)', brand: 'Farm Fresh', calories: 143, proteinG: 12.6, carbsG: 0.7, fatG: 9.5, fiberG: 0, servingSize: 100, servingUnit: 'g', category: 'Protein' },
    { name: 'Egg Whites', brand: 'Generic', calories: 52, proteinG: 11, carbsG: 0.7, fatG: 0.2, fiberG: 0, servingSize: 100, servingUnit: 'g', category: 'Protein' },
    { name: 'Wild Atlantic Salmon', brand: 'Ocean Fresh', calories: 208, proteinG: 20, carbsG: 0, fatG: 13, fiberG: 0, servingSize: 100, servingUnit: 'g', category: 'Protein' },
    { name: 'Lean Ground Beef 90/10', brand: 'Butcher Select', calories: 176, proteinG: 20, carbsG: 0, fatG: 10, fiberG: 0, servingSize: 100, servingUnit: 'g', category: 'Protein' },
    { name: 'Greek Yogurt 0% Fat', brand: 'Oikos / Chobani', calories: 59, proteinG: 10, carbsG: 3.6, fatG: 0.4, fiberG: 0, servingSize: 100, servingUnit: 'g', category: 'Dairy' },
    { name: 'Whey Protein Isolate (Vanilla)', brand: 'Optimum Nutrition', calories: 120, proteinG: 24, carbsG: 2, fatG: 1, fiberG: 0, servingSize: 30, servingUnit: 'g', category: 'Supplements' },
    { name: 'Cottage Cheese 2% Low Fat', brand: 'Daisy', calories: 84, proteinG: 11, carbsG: 4.3, fatG: 2.3, fiberG: 0, servingSize: 100, servingUnit: 'g', category: 'Dairy' },
    { name: 'Extra Firm Tofu', brand: 'House Foods', calories: 83, proteinG: 10, carbsG: 1.5, fatG: 5, fiberG: 1, servingSize: 100, servingUnit: 'g', category: 'Protein' },
    { name: 'Canned Tuna in Water', brand: 'StarKist', calories: 109, proteinG: 25, carbsG: 0, fatG: 1, fiberG: 0, servingSize: 100, servingUnit: 'g', category: 'Protein' },
    
    // Carbs / Grains
    { name: 'Jasmine White Rice (Cooked)', brand: 'Generic', calories: 130, proteinG: 2.7, carbsG: 28, fatG: 0.3, fiberG: 0.4, servingSize: 100, servingUnit: 'g', category: 'Grains' },
    { name: 'Brown Rice (Cooked)', brand: 'Generic', calories: 112, proteinG: 2.6, carbsG: 24, fatG: 0.9, fiberG: 1.8, servingSize: 100, servingUnit: 'g', category: 'Grains' },
    { name: 'Rolled Oats (Dry)', brand: 'Quaker', calories: 379, proteinG: 13.2, carbsG: 67.7, fatG: 6.5, fiberG: 10.1, servingSize: 100, servingUnit: 'g', category: 'Grains' },
    { name: 'Sweet Potato (Baked)', brand: 'Generic', calories: 90, proteinG: 2, carbsG: 20.7, fatG: 0.2, fiberG: 3.3, servingSize: 100, servingUnit: 'g', category: 'Vegetables' },
    { name: 'Russet Potato (Boiled)', brand: 'Generic', calories: 87, proteinG: 1.9, carbsG: 20, fatG: 0.1, fiberG: 1.8, servingSize: 100, servingUnit: 'g', category: 'Vegetables' },
    { name: 'Whole Wheat Bread', brand: 'Dave\'s Killer', calories: 80, proteinG: 5, carbsG: 15, fatG: 1, fiberG: 3, servingSize: 35, servingUnit: 'slice', category: 'Grains' },
    { name: 'Cooked Quinoa', brand: 'Generic', calories: 120, proteinG: 4.4, carbsG: 21.3, fatG: 1.9, fiberG: 2.8, servingSize: 100, servingUnit: 'g', category: 'Grains' },
    { name: 'Whole Grain Pasta (Cooked)', brand: 'Barilla', calories: 140, proteinG: 5.5, carbsG: 27, fatG: 1, fiberG: 4, servingSize: 100, servingUnit: 'g', category: 'Grains' },
    
    // Healthy Fats
    { name: 'Avocado', brand: 'Fresh Hass', calories: 160, proteinG: 2, carbsG: 8.5, fatG: 14.7, fiberG: 6.7, servingSize: 100, servingUnit: 'g', category: 'Healthy Fats' },
    { name: 'Extra Virgin Olive Oil', brand: 'Kirkland', calories: 119, proteinG: 0, carbsG: 0, fatG: 13.5, fiberG: 0, servingSize: 14, servingUnit: 'ml', category: 'Healthy Fats' },
    { name: 'Almonds (Raw)', brand: 'Blue Diamond', calories: 164, proteinG: 6, carbsG: 6, fatG: 14, fiberG: 3.5, servingSize: 28, servingUnit: 'g', category: 'Healthy Fats' },
    { name: 'Natural Peanut Butter', brand: 'Smuckers', calories: 190, proteinG: 8, carbsG: 6, fatG: 16, fiberG: 2, servingSize: 32, servingUnit: 'g', category: 'Healthy Fats' },
    { name: 'Chia Seeds', brand: 'Generic', calories: 138, proteinG: 4.7, carbsG: 12, fatG: 8.7, fiberG: 9.8, servingSize: 28, servingUnit: 'g', category: 'Healthy Fats' },

    // Fruits & Veggies
    { name: 'Fresh Banana', brand: 'Chiquita', calories: 89, proteinG: 1.1, carbsG: 22.8, fatG: 0.3, fiberG: 2.6, servingSize: 100, servingUnit: 'g', category: 'Fruit' },
    { name: 'Blueberries', brand: 'Fresh', calories: 57, proteinG: 0.7, carbsG: 14.5, fatG: 0.3, fiberG: 2.4, servingSize: 100, servingUnit: 'g', category: 'Fruit' },
    { name: 'Fuji Apple', brand: 'Fresh', calories: 52, proteinG: 0.3, carbsG: 13.8, fatG: 0.2, fiberG: 2.4, servingSize: 100, servingUnit: 'g', category: 'Fruit' },
    { name: 'Raw Spinach', brand: 'Fresh', calories: 23, proteinG: 2.9, carbsG: 3.6, fatG: 0.4, fiberG: 2.2, servingSize: 100, servingUnit: 'g', category: 'Vegetables' },
    { name: 'Steamed Broccoli', brand: 'Fresh', calories: 35, proteinG: 2.4, carbsG: 7.2, fatG: 0.4, fiberG: 3.3, servingSize: 100, servingUnit: 'g', category: 'Vegetables' },
    { name: 'Bell Peppers (Mixed)', brand: 'Fresh', calories: 31, proteinG: 1, carbsG: 6, fatG: 0.3, fiberG: 2.1, servingSize: 100, servingUnit: 'g', category: 'Vegetables' },
  ];

  const foodRecords: Record<string, string> = {};
  for (const f of foodsData) {
    const created = await prisma.food.create({ data: f });
    foodRecords[f.name] = created.id;
  }
  console.log(`Created ${Object.keys(foodRecords).length} food items!`);

  console.log('Creating Achievements...');
  const achievements = [
    { code: 'FIRST_WORKOUT', title: 'First Rep', description: 'Completed your very first workout on FitAI', icon: 'Flame', category: 'workouts', criteriaThreshold: 1 },
    { code: 'STREAK_7', title: 'Iron Habit', description: 'Maintained a 7-day active fitness streak', icon: 'Zap', category: 'streak', criteriaThreshold: 7 },
    { code: 'WORKOUTS_10', title: 'Decathlete', description: 'Finished 10 verified training sessions', icon: 'Trophy', category: 'workouts', criteriaThreshold: 10 },
    { code: 'WORKOUTS_50', title: 'Gym Veteran', description: 'Conquered 50 intense training sessions', icon: 'Medal', category: 'workouts', criteriaThreshold: 50 },
    { code: 'FIRST_PR', title: 'Record Shatterer', description: 'Set a new Personal Record on an exercise', icon: 'Sparkles', category: 'pr', criteriaThreshold: 1 },
    { code: 'VOLUME_10K', title: 'Heavy Metal', description: 'Lifted over 10,000 kg total cumulative workout volume', icon: 'Dumbbell', category: 'volume', criteriaThreshold: 10000 },
    { code: 'HYDRATION_HERO', title: 'Hydration Hero', description: 'Met daily water target 5 days in a row', icon: 'Droplets', category: 'habits', criteriaThreshold: 5 },
  ];

  const achievementMap: Record<string, string> = {};
  for (const ach of achievements) {
    const created = await prisma.achievement.create({ data: ach });
    achievementMap[ach.code] = created.id;
  }

  console.log('Creating Habit Templates...');
  const habitsData = [
    { name: 'Daily Workout', category: 'workout', icon: 'Activity', defaultTarget: 1, unit: 'session' },
    { name: 'Drink 2.5L Water', category: 'water', icon: 'Droplet', defaultTarget: 2500, unit: 'ml' },
    { name: 'Sleep 8 Hours', category: 'sleep', icon: 'Moon', defaultTarget: 8, unit: 'hours' },
    { name: '10,000 Daily Steps', category: 'steps', icon: 'Footprints', defaultTarget: 10000, unit: 'steps' },
    { name: 'Hit Protein Target', category: 'nutrition', icon: 'Utensils', defaultTarget: 160, unit: 'grams' },
    { name: 'Post-Workout Mobility', category: 'stretching', icon: 'HeartPulse', defaultTarget: 15, unit: 'minutes' },
  ];

  const habitMap: Record<string, string> = {};
  for (const h of habitsData) {
    const created = await prisma.habit.create({ data: h });
    habitMap[h.name] = created.id;
  }

  console.log('Creating System Users...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Alex Rivera - Standard Active User
  const alexUser = await prisma.user.create({
    data: {
      name: 'Alex Rivera',
      email: 'alex@fitai.com',
      passwordHash: hashedPassword,
      role: 'user',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      profile: {
        create: {
          dateOfBirth: '1998-05-14',
          gender: 'male',
          heightCm: 180,
          currentWeightKg: 78.5,
          targetWeightKg: 82.0,
          fitnessLevel: 'intermediate',
          activityLevel: 'moderate',
          dailySleepHours: 7.8,
          workType: 'desk',
          workoutDaysPerWeek: 4,
          preferredDurationMins: 60,
          equipment: JSON.stringify(['barbell', 'dumbbells', 'cable', 'machine', 'bodyweight']),
          limitations: 'Mild right shoulder tightness on heavy overhead presses',
          dietaryPreferences: 'high_protein',
          bmr: 1780,
          tdee: 2550,
          calorieTarget: 2750,
          waterTargetMl: 3000,
          onboardingCompleted: true,
        },
      },
      goals: {
        create: [
          {
            goalType: 'gain_muscle',
            targetValue: 82.0,
            currentValue: 78.5,
            unit: 'kg',
            targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            status: 'active',
          },
          {
            goalType: 'improve_strength',
            targetValue: 120.0,
            currentValue: 105.0,
            unit: 'kg Bench Press',
            targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
            status: 'active',
          },
        ],
      },
    },
  });

  // 2. Marcus Vance - Certified Trainer
  const trainerUser = await prisma.user.create({
    data: {
      name: 'Marcus Vance, CSCS',
      email: 'marcus@fitai.com',
      passwordHash: hashedPassword,
      role: 'trainer',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      trainerProfile: {
        create: {
          bio: 'Former collegiate strength coach with 10+ years specializing in hypertrophy, biomechanics, and sustainable fat loss.',
          specialties: 'Hypertrophy, Strength Periodization, Injury Prevention',
          certification: 'NSCA - CSCS, Precision Nutrition Level 1',
          hourlyRate: 85,
          rating: 4.95,
        },
      },
    },
  });

  // Connect Trainer with Alex
  const trainerRecord = await prisma.trainer.findUnique({ where: { userId: trainerUser.id } });
  if (trainerRecord) {
    await prisma.trainerClient.create({
      data: {
        trainerId: trainerRecord.id,
        clientId: alexUser.id,
        status: 'active',
        notes: 'Alex is progressing exceptionally well on his Upper/Lower hypertrophy split.',
      },
    });
  }

  // 3. Admin User
  await prisma.user.create({
    data: {
      name: 'FitAI Administrator',
      email: 'admin@fitai.com',
      passwordHash: hashedPassword,
      role: 'admin',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    },
  });

  console.log('Seeding Workout Plans & Historical Sessions for Alex...');
  // Create a 4-Day Push/Pull/Legs/Upper Plan
  const plan = await prisma.workoutPlan.create({
    data: {
      title: 'Hypertrophy Mastery: 4-Day Power Split',
      description: 'Scientific periodized plan prioritizing chest, back, and leg development with progressive overload tracking.',
      targetGoal: 'gain_muscle',
      fitnessLevel: 'intermediate',
      daysPerWeek: 4,
      durationWeeks: 8,
      isAiGenerated: true,
      creatorId: trainerUser.id,
    },
  });

  // Workout 1: Push Hypertrophy
  const pushWorkout = await prisma.workout.create({
    data: {
      planId: plan.id,
      title: 'Chest & Delts Hypertrophy',
      description: 'High mechanical tension on pectorals with front and lateral shoulder emphasis.',
      dayOfWeek: 1,
      estimatedDurationMins: 55,
      estimatedCalories: 380,
    },
  });

  await prisma.workoutExercise.createMany({
    data: [
      { workoutId: pushWorkout.id, exerciseId: exerciseMap['Barbell Bench Press'], orderIndex: 1, targetSets: 4, targetReps: 8, targetWeightKg: 95, targetRestSeconds: 120 },
      { workoutId: pushWorkout.id, exerciseId: exerciseMap['Incline Dumbbell Press'], orderIndex: 2, targetSets: 3, targetReps: 10, targetWeightKg: 32, targetRestSeconds: 90 },
      { workoutId: pushWorkout.id, exerciseId: exerciseMap['Dumbbell Lateral Raise'], orderIndex: 3, targetSets: 4, targetReps: 15, targetWeightKg: 14, targetRestSeconds: 60 },
      { workoutId: pushWorkout.id, exerciseId: exerciseMap['Tricep Rope Pushdown'], orderIndex: 4, targetSets: 3, targetReps: 12, targetWeightKg: 28, targetRestSeconds: 60 },
      { workoutId: pushWorkout.id, exerciseId: exerciseMap['Push-Up'], orderIndex: 5, targetSets: 3, targetReps: 20, targetWeightKg: 0, targetRestSeconds: 60 },
    ],
  });

  // Workout 2: Pull & Lats
  const pullWorkout = await prisma.workout.create({
    data: {
      planId: plan.id,
      title: 'Posterior Chain & Lats',
      description: 'Heavy rows, vertical lat pulldowns, and bicep volume.',
      dayOfWeek: 2,
      estimatedDurationMins: 50,
      estimatedCalories: 390,
    },
  });

  await prisma.workoutExercise.createMany({
    data: [
      { workoutId: pullWorkout.id, exerciseId: exerciseMap['Conventional Barbell Deadlift'], orderIndex: 1, targetSets: 3, targetReps: 5, targetWeightKg: 140, targetRestSeconds: 180 },
      { workoutId: pullWorkout.id, exerciseId: exerciseMap['Bent-Over Barbell Row'], orderIndex: 2, targetSets: 4, targetReps: 8, targetWeightKg: 75, targetRestSeconds: 90 },
      { workoutId: pullWorkout.id, exerciseId: exerciseMap['Lat Pulldown'], orderIndex: 3, targetSets: 3, targetReps: 10, targetWeightKg: 65, targetRestSeconds: 75 },
      { workoutId: pullWorkout.id, exerciseId: exerciseMap['Standing Barbell Bicep Curl'], orderIndex: 4, targetSets: 3, targetReps: 10, targetWeightKg: 35, targetRestSeconds: 60 },
    ],
  });

  // Seed Historical Workout Sessions for Alex (last 4 weeks)
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  // Session 1 (Today)
  const todaySession = await prisma.workoutSession.create({
    data: {
      userId: alexUser.id,
      workoutId: pushWorkout.id,
      title: 'Chest & Delts Hypertrophy (Session A)',
      startTime: new Date(now - 60 * 60 * 1000),
      endTime: new Date(now),
      durationSeconds: 3300,
      totalVolumeKg: 4850,
      totalCaloriesBurned: 410,
      perceivedExertion: 8,
      notes: 'Huge pump today! Felt strong on bench press 95kg.',
      completed: true,
      exerciseSets: {
        create: [
          { exerciseId: exerciseMap['Barbell Bench Press'], setNumber: 1, repsCompleted: 8, weightKg: 95, rpe: 8, isPr: false },
          { exerciseId: exerciseMap['Barbell Bench Press'], setNumber: 2, repsCompleted: 8, weightKg: 95, rpe: 8.5, isPr: false },
          { exerciseId: exerciseMap['Barbell Bench Press'], setNumber: 3, repsCompleted: 8, weightKg: 100, rpe: 9, isPr: true },
          { exerciseId: exerciseMap['Incline Dumbbell Press'], setNumber: 1, repsCompleted: 10, weightKg: 32, rpe: 7.5, isPr: false },
          { exerciseId: exerciseMap['Incline Dumbbell Press'], setNumber: 2, repsCompleted: 10, weightKg: 34, rpe: 8.5, isPr: true },
          { exerciseId: exerciseMap['Dumbbell Lateral Raise'], setNumber: 1, repsCompleted: 15, weightKg: 14, rpe: 8, isPr: false },
          { exerciseId: exerciseMap['Tricep Rope Pushdown'], setNumber: 1, repsCompleted: 12, weightKg: 30, rpe: 8, isPr: true },
        ],
      },
    },
  });

  // Session 2 (3 days ago)
  await prisma.workoutSession.create({
    data: {
      userId: alexUser.id,
      workoutId: pullWorkout.id,
      title: 'Posterior Chain & Lats',
      startTime: new Date(now - 3 * dayMs - 50 * 60 * 1000),
      endTime: new Date(now - 3 * dayMs),
      durationSeconds: 3000,
      totalVolumeKg: 5200,
      totalCaloriesBurned: 440,
      perceivedExertion: 8,
      completed: true,
      exerciseSets: {
        create: [
          { exerciseId: exerciseMap['Conventional Barbell Deadlift'], setNumber: 1, repsCompleted: 5, weightKg: 140, rpe: 8, isPr: false },
          { exerciseId: exerciseMap['Conventional Barbell Deadlift'], setNumber: 2, repsCompleted: 5, weightKg: 145, rpe: 8.5, isPr: true },
          { exerciseId: exerciseMap['Bent-Over Barbell Row'], setNumber: 1, repsCompleted: 8, weightKg: 75, rpe: 7.5, isPr: false },
          { exerciseId: exerciseMap['Lat Pulldown'], setNumber: 1, repsCompleted: 10, weightKg: 65, rpe: 8, isPr: false },
        ],
      },
    },
  });

  // Personal Records for Alex
  await prisma.progressRecord.createMany({
    data: [
      { userId: alexUser.id, exerciseId: exerciseMap['Barbell Bench Press'], bestWeightKg: 100, bestReps: 8, estimatedOneRepMaxKg: 124, totalVolumeKg: 12500, achievedAt: new Date(now) },
      { userId: alexUser.id, exerciseId: exerciseMap['Conventional Barbell Deadlift'], bestWeightKg: 145, bestReps: 5, estimatedOneRepMaxKg: 168, totalVolumeKg: 18200, achievedAt: new Date(now - 3 * dayMs) },
      { userId: alexUser.id, exerciseId: exerciseMap['Barbell Back Squat'], bestWeightKg: 130, bestReps: 6, estimatedOneRepMaxKg: 151, totalVolumeKg: 14900, achievedAt: new Date(now - 7 * dayMs) },
      { userId: alexUser.id, exerciseId: exerciseMap['Overhead Barbell Shoulder Press'], bestWeightKg: 65, bestReps: 8, estimatedOneRepMaxKg: 80, totalVolumeKg: 6400, achievedAt: new Date(now - 10 * dayMs) },
    ],
  });

  // Body Measurements over 6 weeks
  await prisma.bodyMeasurement.createMany({
    data: [
      { userId: alexUser.id, date: new Date(now - 35 * dayMs), weightKg: 76.8, bodyFatPct: 15.8, chestCm: 101, waistCm: 82, armsCm: 37.0, thighsCm: 58.0 },
      { userId: alexUser.id, date: new Date(now - 28 * dayMs), weightKg: 77.2, bodyFatPct: 15.6, chestCm: 102, waistCm: 81.8, armsCm: 37.3, thighsCm: 58.5 },
      { userId: alexUser.id, date: new Date(now - 21 * dayMs), weightKg: 77.5, bodyFatPct: 15.3, chestCm: 102.5, waistCm: 81.5, armsCm: 37.6, thighsCm: 59.0 },
      { userId: alexUser.id, date: new Date(now - 14 * dayMs), weightKg: 77.9, bodyFatPct: 15.1, chestCm: 103, waistCm: 81.2, armsCm: 37.9, thighsCm: 59.5 },
      { userId: alexUser.id, date: new Date(now - 7 * dayMs), weightKg: 78.2, bodyFatPct: 14.9, chestCm: 103.5, waistCm: 81.0, armsCm: 38.1, thighsCm: 60.0 },
      { userId: alexUser.id, date: new Date(now), weightKg: 78.5, bodyFatPct: 14.7, chestCm: 104, waistCm: 80.8, armsCm: 38.4, thighsCm: 60.5 },
    ],
  });

  // Nutrition Logs & Meals for Alex
  const breakfast = await prisma.meal.create({
    data: {
      userId: alexUser.id,
      name: 'Breakfast',
      date: new Date(now),
      totalCalories: 640,
      totalProteinG: 45,
      totalCarbsG: 68,
      totalFatG: 18,
      totalFiberG: 10,
      items: {
        create: [
          { foodId: foodRecords['Eggs (Whole, Large)'], servings: 2, calories: 286, proteinG: 25, carbsG: 1.4, fatG: 19, fiberG: 0 },
          { foodId: foodRecords['Rolled Oats (Dry)'], servings: 0.8, calories: 303, proteinG: 10.5, carbsG: 54, fatG: 5.2, fiberG: 8.0 },
          { foodId: foodRecords['Fresh Banana'], servings: 1, calories: 89, proteinG: 1.1, carbsG: 22.8, fatG: 0.3, fiberG: 2.6 },
        ],
      },
    },
  });

  const lunch = await prisma.meal.create({
    data: {
      userId: alexUser.id,
      name: 'Lunch',
      date: new Date(now),
      totalCalories: 780,
      totalProteinG: 62,
      totalCarbsG: 84,
      totalFatG: 16,
      totalFiberG: 7,
      items: {
        create: [
          { foodId: foodRecords['Boneless Skinless Chicken Breast'], servings: 1.8, calories: 297, proteinG: 55.8, carbsG: 0, fatG: 6.5, fiberG: 0 },
          { foodId: foodRecords['Jasmine White Rice (Cooked)'], servings: 2.5, calories: 325, proteinG: 6.7, carbsG: 70, fatG: 0.7, fiberG: 1.0 },
          { foodId: foodRecords['Steamed Broccoli'], servings: 1.5, calories: 52, proteinG: 3.6, carbsG: 10.8, fatG: 0.6, fiberG: 5.0 },
          { foodId: foodRecords['Extra Virgin Olive Oil'], servings: 0.8, calories: 95, proteinG: 0, carbsG: 0, fatG: 10.8, fiberG: 0 },
        ],
      },
    },
  });

  // Daily Nutrition summary
  await prisma.nutritionLog.create({
    data: {
      userId: alexUser.id,
      date: new Date(now),
      targetCalories: 2750,
      consumedCalories: 2180,
      targetProteinG: 175,
      consumedProteinG: 148,
      targetCarbsG: 320,
      consumedCarbsG: 245,
      targetFatG: 75,
      consumedFatG: 58,
    },
  });

  // Water Logs (Today)
  await prisma.waterLog.createMany({
    data: [
      { userId: alexUser.id, date: new Date(now - 6 * 60 * 60 * 1000), amountMl: 500 },
      { userId: alexUser.id, date: new Date(now - 4 * 60 * 60 * 1000), amountMl: 500 },
      { userId: alexUser.id, date: new Date(now - 2 * 60 * 60 * 1000), amountMl: 750 },
      { userId: alexUser.id, date: new Date(now), amountMl: 500 },
    ],
  });

  // Sleep Logs (Past 5 days)
  for (let i = 0; i < 5; i++) {
    await prisma.sleepLog.create({
      data: {
        userId: alexUser.id,
        date: new Date(now - i * dayMs),
        bedtime: '23:15',
        wakeTime: '07:05',
        durationMinutes: 470 + (i % 3) * 15,
        qualityRating: 4,
        notes: 'Felt well rested, minimal nighttime disruptions.',
      },
    });
  }

  // Habit Logs for Today
  for (const habitName of Object.keys(habitMap)) {
    await prisma.habitLog.create({
      data: {
        userId: alexUser.id,
        habitId: habitMap[habitName],
        date: new Date(now),
        value: 1,
        completed: true,
      },
    });
  }

  // User Achievements
  await prisma.userAchievement.createMany({
    data: [
      { userId: alexUser.id, achievementId: achievementMap['FIRST_WORKOUT'], unlockedAt: new Date(now - 30 * dayMs) },
      { userId: alexUser.id, achievementId: achievementMap['STREAK_7'], unlockedAt: new Date(now - 14 * dayMs) },
      { userId: alexUser.id, achievementId: achievementMap['WORKOUTS_10'], unlockedAt: new Date(now - 10 * dayMs) },
      { userId: alexUser.id, achievementId: achievementMap['FIRST_PR'], unlockedAt: new Date(now) },
    ],
  });

  // Challenges
  const shredChallenge = await prisma.challenge.create({
    data: {
      title: '30-Day Lean Muscle Ignition',
      description: 'Log 20 high-quality workouts and maintain an 80%+ clean nutrition compliance streak.',
      challengeType: 'workouts',
      targetValue: 20,
      unit: 'workouts',
      startDate: new Date(now - 10 * dayMs),
      endDate: new Date(now + 20 * dayMs),
      icon: 'Flame',
      isPrivate: false,
    },
  });

  await prisma.challengeParticipant.create({
    data: {
      challengeId: shredChallenge.id,
      userId: alexUser.id,
      currentProgress: 8,
      completed: false,
    },
  });

  // AI Recommendations
  await prisma.aiRecommendation.createMany({
    data: [
      {
        userId: alexUser.id,
        type: 'progression',
        title: 'Bench Press Progressive Overload Ready',
        content: 'Your Bench Press output has stabilized over the last 3 sessions at 8 clean reps of 95kg. Your movement tempo and estimated RPE indicate an increase to 97.5kg for 6-8 reps is safe and recommended.',
        rationale: 'Volume threshold exceeded with RPE ≤ 8.5 consistently.',
        confidenceScore: 0.94,
        feedbackRating: 5,
      },
      {
        userId: alexUser.id,
        type: 'recovery',
        title: 'Optimal Deload & Mobility Window',
        content: 'Your cumulative weekly training volume reached 38,400 kg. Incorporating 15 minutes of thoracic and hamstring mobility prior to tomorrow\'s leg session will maintain joint health.',
        rationale: 'Multi-day training load spike detected.',
        confidenceScore: 0.89,
        feedbackRating: 4,
      },
      {
        userId: alexUser.id,
        type: 'nutrition',
        title: 'Post-Workout Leucine Timing',
        content: 'You are currently 27g below your daily protein target following your push session. Consider a 30g whey isolate shake or 150g Greek yogurt to stimulate optimal muscle protein synthesis (MPS).',
        rationale: 'Daily protein target deficit following resistance training.',
        confidenceScore: 0.96,
        feedbackRating: 5,
      },
    ],
  });

  // ML Predictions (Weight trajectory and 1RM progression)
  await prisma.mlPrediction.createMany({
    data: [
      {
        userId: alexUser.id,
        predictionType: 'weight_trajectory',
        inputFeaturesJson: JSON.stringify({ currentWeight: 78.5, weeklySurplusKcal: 1750, trainingDays: 4 }),
        predictedValue: 80.2,
        confidenceLower: 79.6,
        confidenceUpper: 80.8,
        targetDate: new Date(now + 30 * dayMs),
      },
      {
        userId: alexUser.id,
        predictionType: 'one_rep_max_trend',
        inputFeaturesJson: JSON.stringify({ exercise: 'Barbell Bench Press', current1RM: 124, weeklyVolumeKg: 4850 }),
        predictedValue: 128.5,
        confidenceLower: 125.0,
        confidenceUpper: 131.0,
        targetDate: new Date(now + 30 * dayMs),
      },
    ],
  });

  // Seed AI Conversation with real fitness coach grounding
  const coachConv = await prisma.aiConversation.create({
    data: {
      userId: alexUser.id,
      title: 'Strength Progress & Calorie Strategy',
    },
  });

  await prisma.aiMessage.createMany({
    data: [
      {
        conversationId: coachConv.id,
        role: 'user',
        content: 'Hey FitAI Coach, how did my bench press perform this week compared to last week?',
      },
      {
        conversationId: coachConv.id,
        role: 'assistant',
        content: 'Great job today Alex! You hit a brand new Personal Record on the Barbell Bench Press today: 100 kg for 8 reps (Set 3), yielding an estimated 1-Rep Max of 124 kg. This is a 5.3% jump in total volume load compared to your session 4 days ago. Your average RPE was 8.2, which indicates you maintained strong technical control without hitting failure.',
        metadataJson: JSON.stringify({ prTriggered: true, exercise: 'Barbell Bench Press', new1RM: 124 }),
      },
    ],
  });

  // Notifications
  await prisma.notification.createMany({
    data: [
      { userId: alexUser.id, title: '🔥 New PR Recorded!', message: 'Barbell Bench Press 100kg × 8 reps recorded!', type: 'pr', isRead: false },
      { userId: alexUser.id, title: 'Coach Marcus Vance', message: 'Checked your workout log. Form on the RDL looked clean!', type: 'trainer', isRead: false },
      { userId: alexUser.id, title: 'Hydration Target', message: 'You have logged 2,250 ml today. 750 ml to go!', type: 'habit', isRead: true },
    ],
  });

  // Subscriptions
  await prisma.subscription.create({
    data: {
      userId: alexUser.id,
      tier: 'pro',
      status: 'active',
      startDate: new Date(now - 15 * dayMs),
      endDate: new Date(now + 15 * dayMs),
      autoRenew: true,
    },
  });

  console.log('✅ FitAI database successfully seeded!');
  console.log('Alex (User): alex@fitai.com / password123');
  console.log('Marcus (Trainer): marcus@fitai.com / password123');
  console.log('Admin (Admin): admin@fitai.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
