import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pilatesCalorieCalculator: CalculatorDefinition = {
  slug: "pilates-calorie-calculator",
  title: "Pilates Calorie Burn Calculator",
  description: "Free Pilates calorie burn calculator. Estimate calories burned during mat Pilates, reformer Pilates, and other Pilates modalities based on your weight and session details.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["pilates calorie calculator", "pilates calories burned", "reformer pilates calories", "mat pilates calories", "pilates workout"],
  variants: [
    {
      id: "calorie-burn",
      name: "Pilates Calorie Burn",
      description: "Calculate calories burned based on Pilates type and duration",
      fields: [
        { name: "weight", label: "Body Weight (lbs)", type: "number", placeholder: "e.g. 140", min: 80, max: 400 },
        { name: "duration", label: "Session Duration (minutes)", type: "number", placeholder: "e.g. 50", min: 10, max: 120 },
        { name: "pilatesType", label: "Pilates Type", type: "select", options: [
          { label: "Mat Pilates (beginner)", value: "mat-beginner" },
          { label: "Mat Pilates (intermediate)", value: "mat-intermediate" },
          { label: "Mat Pilates (advanced)", value: "mat-advanced" },
          { label: "Reformer Pilates", value: "reformer" },
          { label: "Cadillac / Tower", value: "cadillac" },
          { label: "Pilates Barre Fusion", value: "barre" },
        ] },
        { name: "intensity", label: "Perceived Intensity", type: "select", options: [
          { label: "Light (gentle, rehabilitative)", value: "light" },
          { label: "Moderate (typical class)", value: "moderate" },
          { label: "Vigorous (challenging, fast-paced)", value: "vigorous" },
        ], defaultValue: "moderate" },
      ],
      calculate: (inputs) => {
        const weight = parseFloat(inputs.weight as string);
        const duration = parseFloat(inputs.duration as string);
        const type = inputs.pilatesType as string;
        const intensity = inputs.intensity as string;
        if (isNaN(weight) || isNaN(duration)) return null;

        const weightKg = weight * 0.4536;

        const metValues: Record<string, number> = {
          "mat-beginner": 3.0,
          "mat-intermediate": 4.0,
          "mat-advanced": 5.0,
          reformer: 4.5,
          cadillac: 4.0,
          barre: 5.5,
        };

        const intensityMult: Record<string, number> = { light: 0.8, moderate: 1.0, vigorous: 1.25 };

        const met = (metValues[type] || 4.0) * (intensityMult[intensity] || 1.0);
        const caloriesPerMin = (met * 3.5 * weightKg) / 200;
        const totalCalories = caloriesPerMin * duration;

        const fatCalories = totalCalories * 0.5;
        const fatGrams = fatCalories / 9;

        const weeklyCalories4x = totalCalories * 4;
        const monthlyCalories = weeklyCalories4x * 4.33;
        const monthlyFatLbs = monthlyCalories / 3500;

        let equivalent = "";
        if (totalCalories < 150) equivalent = `~${formatNumber(totalCalories / 100, 1)} slices of bread`;
        else if (totalCalories < 300) equivalent = `~${formatNumber(totalCalories / 140, 1)} bananas`;
        else equivalent = `~${formatNumber(totalCalories / 250, 1)} donuts`;

        return {
          primary: { label: "Calories Burned", value: formatNumber(totalCalories, 0) },
          details: [
            { label: "Calories/Minute", value: formatNumber(caloriesPerMin, 1) },
            { label: "MET Value", value: formatNumber(met, 1) },
            { label: "Fat Burned (est.)", value: `${formatNumber(fatGrams, 1)} g` },
            { label: "Food Equivalent", value: equivalent },
            { label: "If 4x/week", value: `${formatNumber(weeklyCalories4x, 0)} cal/week` },
            { label: "Monthly Fat Loss Potential", value: `${formatNumber(monthlyFatLbs, 2)} lbs (at 4x/week)` },
            { label: "Duration", value: `${formatNumber(duration, 0)} min` },
          ],
        };
      },
    },
    {
      id: "comparison",
      name: "Pilates vs Other Activities",
      description: "Compare Pilates calorie burn with other exercises",
      fields: [
        { name: "weight", label: "Body Weight (lbs)", type: "number", placeholder: "e.g. 140" },
        { name: "duration", label: "Duration (minutes)", type: "number", placeholder: "e.g. 60", defaultValue: 60 },
      ],
      calculate: (inputs) => {
        const weight = parseFloat(inputs.weight as string);
        const duration = parseFloat(inputs.duration as string);
        if (isNaN(weight) || isNaN(duration)) return null;

        const weightKg = weight * 0.4536;
        const calc = (met: number) => Math.round((met * 3.5 * weightKg) / 200 * duration);

        const matPilates = calc(4.0);
        const reformer = calc(4.5);
        const yoga = calc(3.0);
        const walking = calc(3.5);
        const running = calc(9.8);
        const cycling = calc(7.5);
        const swimming = calc(7.0);
        const weightTraining = calc(5.0);

        return {
          primary: { label: "Reformer Pilates", value: `${formatNumber(reformer, 0)} cal` },
          details: [
            { label: "Mat Pilates", value: `${formatNumber(matPilates, 0)} cal` },
            { label: "Yoga (Hatha)", value: `${formatNumber(yoga, 0)} cal` },
            { label: "Brisk Walking", value: `${formatNumber(walking, 0)} cal` },
            { label: "Weight Training", value: `${formatNumber(weightTraining, 0)} cal` },
            { label: "Cycling (moderate)", value: `${formatNumber(cycling, 0)} cal` },
            { label: "Swimming (moderate)", value: `${formatNumber(swimming, 0)} cal` },
            { label: "Running (6 mph)", value: `${formatNumber(running, 0)} cal` },
          ],
          note: `All values for ${formatNumber(duration, 0)} min at ${formatNumber(weight, 0)} lbs. Pilates burns fewer calories than cardio but builds core strength and flexibility.`,
        };
      },
    },
  ],
  relatedSlugs: ["calorie-calculator", "bmi-calculator", "heart-rate-calculator"],
  faq: [
    { question: "How many calories does Pilates burn?", answer: "A 150-lb person burns approximately 175-250 calories in a 50-minute mat Pilates class and 200-300 in a reformer class. Advanced or vigorous classes can burn up to 350+ calories. The actual amount depends on weight, intensity, and experience." },
    { question: "Is Pilates good for weight loss?", answer: "Pilates alone burns moderate calories (MET 3-5), less than cardio activities. However, it builds lean muscle which increases resting metabolism, improves posture, and builds core strength. For weight loss, combine Pilates with cardio and a balanced diet." },
    { question: "Reformer vs mat Pilates for calories?", answer: "Reformer Pilates typically burns 10-20% more calories than mat Pilates because the spring resistance adds an extra strength component. However, an advanced mat class can match or exceed a beginner reformer class in calorie burn." },
  ],
  formula: "Calories = (MET x 3.5 x Weight(kg) / 200) x Duration | MET: Mat Beginner=3.0, Intermediate=4.0, Advanced=5.0, Reformer=4.5, Barre=5.5",
};
