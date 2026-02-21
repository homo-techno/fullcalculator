import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const muscleGainCalculator: CalculatorDefinition = {
  slug: "muscle-gain-calculator",
  title: "Muscle Gain Potential Calculator",
  description:
    "Free muscle gain potential calculator. Estimate your maximum muscular potential and realistic rate of muscle gain using the McDonald and Berkhan models.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "muscle gain calculator",
    "muscle building potential",
    "maximum muscular potential",
    "how much muscle can I gain",
    "natural muscle limit",
  ],
  variants: [
    {
      id: "mcdonald",
      name: "McDonald Model",
      description: "Estimate yearly muscle gain rate by training experience",
      fields: [
        {
          name: "gender",
          label: "Gender",
          type: "select",
          options: [
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ],
        },
        {
          name: "experience",
          label: "Training Experience",
          type: "select",
          options: [
            { label: "Year 1 (Beginner)", value: "1" },
            { label: "Year 2 (Novice)", value: "2" },
            { label: "Year 3 (Intermediate)", value: "3" },
            { label: "Year 4+ (Advanced)", value: "4" },
          ],
          defaultValue: "1",
        },
        { name: "weight", label: "Current Body Weight (lbs)", type: "number", placeholder: "e.g. 170" },
        { name: "bodyFat", label: "Current Body Fat %", type: "number", placeholder: "e.g. 15", step: 0.1 },
      ],
      calculate: (inputs) => {
        const gender = inputs.gender as string;
        const year = parseInt(inputs.experience as string);
        const weight = inputs.weight as number;
        const bodyFat = inputs.bodyFat as number;
        if (!weight) return null;

        // McDonald model (lbs of muscle per year for males)
        const maleRates: Record<number, number> = { 1: 24, 2: 12, 3: 6, 4: 3 };
        const femaleRates: Record<number, number> = { 1: 12, 2: 6, 3: 3, 4: 1.5 };

        const yearlyGain = gender === "male" ? maleRates[year] : femaleRates[year];
        const monthlyGain = yearlyGain / 12;
        const weeklyGain = yearlyGain / 52;

        const leanMass = bodyFat ? weight * (1 - bodyFat / 100) : weight * 0.85;

        // Cumulative potential over 4 years
        const totalPotential = gender === "male" ? 45 : 22.5;

        return {
          primary: { label: "Expected Muscle Gain", value: formatNumber(yearlyGain, 0), suffix: "lbs/year" },
          details: [
            { label: "Monthly Gain", value: `${formatNumber(monthlyGain, 1)} lbs` },
            { label: "Weekly Gain", value: `${formatNumber(weeklyGain, 2)} lbs` },
            { label: "Training Year", value: `Year ${year}` },
            { label: "Current Lean Mass", value: `${formatNumber(leanMass, 1)} lbs` },
            { label: "4-Year Total Potential", value: `~${formatNumber(totalPotential, 0)} lbs` },
          ],
          note: "Based on the Lyle McDonald model for natural (drug-free) lifters with proper training and nutrition. Individual results vary based on genetics, diet, sleep, and training quality.",
        };
      },
    },
    {
      id: "berkhan",
      name: "Berkhan/Leangains Formula",
      description: "Estimate maximum lean body weight at contest-level leanness",
      fields: [
        { name: "height", label: "Height (inches)", type: "number", placeholder: "e.g. 70" },
        {
          name: "targetBf",
          label: "Target Body Fat %",
          type: "select",
          options: [
            { label: "5% (Contest)", value: "5" },
            { label: "8% (Very Lean)", value: "8" },
            { label: "10% (Lean)", value: "10" },
            { label: "12% (Athletic)", value: "12" },
            { label: "15% (Fit)", value: "15" },
          ],
          defaultValue: "10",
        },
      ],
      calculate: (inputs) => {
        const heightIn = inputs.height as number;
        const targetBf = parseFloat(inputs.targetBf as string);
        if (!heightIn) return null;

        const heightCm = heightIn * 2.54;

        // Berkhan formula: Max LBM (kg) = (height in cm - 100) at ~5% body fat
        const maxLbmKg = heightCm - 100;
        const maxLbmLbs = maxLbmKg * 2.20462;

        // Total weight at target body fat
        const totalWeightKg = maxLbmKg / (1 - targetBf / 100);
        const totalWeightLbs = totalWeightKg * 2.20462;

        // FFMI at this weight
        const heightM = heightCm / 100;
        const ffmi = maxLbmKg / (heightM * heightM);
        const normalizedFfmi = ffmi + 6.1 * (1.8 - heightM);

        return {
          primary: { label: "Max Total Weight", value: formatNumber(totalWeightLbs, 0), suffix: `lbs at ${targetBf}% BF` },
          details: [
            { label: "Max Lean Body Mass", value: `${formatNumber(maxLbmLbs, 0)} lbs (${formatNumber(maxLbmKg, 1)} kg)` },
            { label: "At Target BF%", value: `${formatNumber(totalWeightLbs, 0)} lbs (${formatNumber(totalWeightKg, 1)} kg)` },
            { label: "FFMI", value: formatNumber(ffmi, 1) },
            { label: "Normalized FFMI", value: formatNumber(normalizedFfmi, 1) },
          ],
          note: "Berkhan formula estimates the natural muscular ceiling for drug-free male athletes. FFMI above 25 is generally considered the natural limit.",
        };
      },
    },
  ],
  relatedSlugs: ["protein-calculator", "tdee-calculator", "calorie-calculator", "body-fat-calculator"],
  faq: [
    {
      question: "How much muscle can a beginner gain?",
      answer:
        "A male beginner can expect to gain approximately 20-25 lbs of muscle in the first year of proper training and nutrition. Females can expect roughly half that amount (10-12 lbs). This rate decreases significantly with each subsequent year of training.",
    },
    {
      question: "What is the natural muscular potential?",
      answer:
        "The Berkhan formula estimates maximum lean body mass as (height in cm - 100) kg at 5% body fat for males. For a 5'10\" male, this is about 178 lbs lean or 198 lbs at 10% body fat. An FFMI of 25 is generally considered the natural limit.",
    },
    {
      question: "Can you gain muscle and lose fat at the same time?",
      answer:
        "Yes, body recomposition is possible, especially for beginners, those returning after a break, or those with higher body fat. It is most effective at a slight caloric deficit (200-300 cal) with high protein intake (1g/lb bodyweight) and progressive strength training.",
    },
  ],
  formula: "McDonald: Year 1 = 20-25 lbs, Year 2 = 10-12, Year 3 = 5-6, Year 4+ = 2-3 | Berkhan: Max LBM (kg) = height (cm) - 100",
};
