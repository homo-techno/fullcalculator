import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fatBurningZoneCalculator: CalculatorDefinition = {
  slug: "fat-burning-zone",
  title: "Fat Burning Zone Calculator",
  description: "Free online fat burning zone calculator. Find your optimal heart rate range for maximum fat burning during exercise based on your age and resting heart rate.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["fat burning zone", "fat burn heart rate", "optimal fat burning", "lipid zone", "cardio fat loss"],
  variants: [
    {
      id: "fat-burn-zone",
      name: "Calculate Fat Burning Zone",
      fields: [
        { name: "age", label: "Age (years)", type: "number", placeholder: "e.g. 30" },
        { name: "restingHR", label: "Resting Heart Rate (bpm)", type: "number", placeholder: "e.g. 65" },
        { name: "weight", label: "Weight (lbs)", type: "number", placeholder: "e.g. 170" },
        { name: "duration", label: "Workout Duration (minutes)", type: "number", placeholder: "e.g. 45" },
      ],
      calculate: (inputs) => {
        const age = parseFloat(inputs.age as string) || 0;
        const restingHR = parseFloat(inputs.restingHR as string) || 60;
        const weight = parseFloat(inputs.weight as string) || 0;
        const duration = parseFloat(inputs.duration as string) || 30;

        const maxHR = 220 - age;
        const hrReserve = maxHR - restingHR;

        const fatBurnLow = Math.round(hrReserve * 0.6 + restingHR);
        const fatBurnHigh = Math.round(hrReserve * 0.7 + restingHR);
        const cardioLow = Math.round(hrReserve * 0.7 + restingHR);
        const cardioHigh = Math.round(hrReserve * 0.85 + restingHR);

        const weightKg = weight * 0.453592;
        const fatZoneMET = 5.0;
        const cardioZoneMET = 8.0;

        const fatZoneCal = fatZoneMET * weightKg * (duration / 60);
        const cardioZoneCal = cardioZoneMET * weightKg * (duration / 60);
        const fatCalFromFatZone = fatZoneCal * 0.6;
        const fatCalFromCardio = cardioZoneCal * 0.35;

        return {
          primary: { label: "Fat Burning Zone", value: `${formatNumber(fatBurnLow)} - ${formatNumber(fatBurnHigh)} bpm` },
          details: [
            { label: "Max Heart Rate", value: `${formatNumber(maxHR)} bpm` },
            { label: "Cardio Zone", value: `${formatNumber(cardioLow)} - ${formatNumber(cardioHigh)} bpm` },
            { label: "Fat Zone Total Calories", value: formatNumber(Math.round(fatZoneCal)) },
            { label: "Fat Zone - Fat Calories", value: `${formatNumber(Math.round(fatCalFromFatZone))} (60%)` },
            { label: "Cardio Zone Total Calories", value: formatNumber(Math.round(cardioZoneCal)) },
            { label: "Cardio Zone - Fat Calories", value: `${formatNumber(Math.round(fatCalFromCardio))} (35%)` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["heart-rate-zone", "max-heart-rate", "cycling-calories"],
  faq: [
    {
      question: "What is the fat burning zone?",
      answer: "The fat burning zone is the heart rate range (typically 60-70% of max HR) where your body uses the highest percentage of fat as fuel. At this moderate intensity, about 60% of calories burned come from fat compared to 35% at higher intensities.",
    },
    {
      question: "Is the fat burning zone the best way to lose fat?",
      answer: "Not necessarily. While a higher percentage of calories come from fat at lower intensities, higher-intensity exercise burns more total calories and more total fat calories. The best approach combines both moderate and vigorous exercise.",
    },
    {
      question: "How long should I stay in the fat burning zone?",
      answer: "For effective fat burning, aim for 30-60 minutes in this zone. Longer sessions at moderate intensity are sustainable and effective. As fitness improves, you can increase duration or add intervals at higher intensities.",
    },
  ],
  formula: "Fat Burn Zone = (HR Reserve x 0.6 to 0.7) + Resting HR; HR Reserve = Max HR - Resting HR; Max HR = 220 - Age",
};
