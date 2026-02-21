import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const boxingCalorieCalculator: CalculatorDefinition = {
  slug: "boxing-calorie-calculator",
  title: "Boxing Calorie Calculator",
  description:
    "Free boxing and martial arts calorie burn calculator. Estimate calories burned during boxing, kickboxing, MMA, karate, jiu-jitsu, and other combat sports.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "boxing calorie calculator",
    "calories burned boxing",
    "kickboxing calories",
    "martial arts calories",
    "mma calorie burn",
  ],
  variants: [
    {
      id: "calc",
      name: "Boxing & Martial Arts Calories",
      description: "Estimate calories burned during combat sports training",
      fields: [
        { name: "weight", label: "Body Weight (lbs)", type: "number", placeholder: "e.g. 170" },
        { name: "duration", label: "Duration (minutes)", type: "number", placeholder: "e.g. 60", min: 1 },
        {
          name: "activity",
          label: "Activity Type",
          type: "select",
          options: [
            { label: "Boxing - Shadow Boxing", value: "4.8" },
            { label: "Boxing - Heavy Bag", value: "7.8" },
            { label: "Boxing - Speed Bag", value: "5.5" },
            { label: "Boxing - Sparring", value: "9.0" },
            { label: "Kickboxing Class", value: "7.0" },
            { label: "Muay Thai", value: "8.5" },
            { label: "MMA Training", value: "8.0" },
            { label: "Karate / Taekwondo", value: "6.5" },
            { label: "Judo / Jiu-Jitsu", value: "7.5" },
            { label: "Wrestling", value: "9.0" },
            { label: "Boxing Cardio Class (non-contact)", value: "6.0" },
          ],
          defaultValue: "7.8",
        },
        {
          name: "intensity",
          label: "Intensity Level",
          type: "select",
          options: [
            { label: "Light (drilling, technique work)", value: "0.8" },
            { label: "Moderate (regular training)", value: "1.0" },
            { label: "High (intense rounds, competition prep)", value: "1.2" },
          ],
          defaultValue: "1.0",
        },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const duration = inputs.duration as number;
        const baseMet = parseFloat(inputs.activity as string);
        const intensityMult = parseFloat(inputs.intensity as string);
        if (!weight || !duration) return null;

        const weightKg = weight * 0.453592;
        const effectiveMet = baseMet * intensityMult;
        const hours = duration / 60;

        const totalCalories = effectiveMet * weightKg * hours;
        const calPerMinute = totalCalories / duration;

        // Estimate per 3-minute round
        const calPerRound = calPerMinute * 3;
        const roundsInSession = Math.floor(duration / 3);

        return {
          primary: { label: "Calories Burned", value: formatNumber(totalCalories, 0) },
          details: [
            { label: "Effective MET", value: formatNumber(effectiveMet, 1) },
            { label: "Cal/Minute", value: formatNumber(calPerMinute, 1) },
            { label: "Cal per 3-Min Round", value: formatNumber(calPerRound, 0) },
            { label: "Rounds in Session", value: formatNumber(roundsInSession, 0) },
            { label: "Duration", value: `${formatNumber(duration, 0)} min` },
            { label: "Equivalent Miles Running", value: `${formatNumber(totalCalories / (weightKg * 1.036 * 1.60934), 1)} mi` },
          ],
          note: "Combat sports combine cardio, strength, and HIIT elements making them among the highest calorie-burning activities. MET values are averages; actual burn varies by round intensity.",
        };
      },
    },
  ],
  relatedSlugs: ["exercise-calorie-calculator", "calorie-calculator", "running-calorie-calculator"],
  faq: [
    {
      question: "How many calories does boxing burn?",
      answer:
        "A 170-lb person burns approximately 550-700 calories per hour hitting a heavy bag, 600-900 during sparring, and 350-450 during shadow boxing. Boxing is one of the most calorie-dense exercises, rivaling running and cycling at high intensities.",
    },
    {
      question: "Is kickboxing good for weight loss?",
      answer:
        "Yes. Kickboxing burns 500-800 calories per hour for an average person, making it excellent for weight loss. It also builds muscle, improves coordination, and reduces stress. Kickboxing classes are designed as full-body HIIT workouts.",
    },
    {
      question: "What burns more calories: boxing or running?",
      answer:
        "Intense boxing training (sparring, heavy bag) burns roughly the same as running at 7-8 mph (800-1000 cal/hour). Boxing may burn slightly more due to the combination of upper and lower body work plus the HIIT nature of rounds with rest periods.",
    },
  ],
  formula: "Calories = MET × Weight (kg) × Duration (hours) × Intensity Multiplier",
};
