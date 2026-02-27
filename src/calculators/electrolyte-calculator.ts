import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const electrolyteCalculator: CalculatorDefinition = {
  slug: "electrolyte-calculator",
  title: "Daily Electrolyte Needs Calculator",
  description:
    "Calculate your daily electrolyte requirements for sodium, potassium, magnesium, and calcium based on activity level, diet, and climate conditions.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "electrolyte calculator",
    "daily sodium needs",
    "potassium intake",
    "magnesium needs",
    "electrolyte requirements",
    "keto electrolytes",
    "hydration calculator",
  ],
  variants: [
    {
      id: "daily",
      name: "Daily Electrolyte Needs",
      description: "Calculate recommended daily electrolyte intake",
      fields: [
        {
          name: "bodyWeight",
          label: "Body Weight",
          type: "number",
          placeholder: "e.g. 160",
          suffix: "lbs",
          min: 60,
          max: 400,
        },
        {
          name: "activityLevel",
          label: "Activity Level",
          type: "select",
          options: [
            { label: "Sedentary", value: "sedentary" },
            { label: "Moderate (3-5 hrs/week)", value: "moderate" },
            { label: "Active (5-10 hrs/week)", value: "active" },
            { label: "Endurance athlete (10+ hrs/week)", value: "endurance" },
          ],
          defaultValue: "moderate",
        },
        {
          name: "diet",
          label: "Diet Type",
          type: "select",
          options: [
            { label: "Standard diet", value: "standard" },
            { label: "Low-carb / Keto", value: "keto" },
            { label: "Whole food / low-sodium", value: "wholefood" },
            { label: "Fasting / intermittent fasting", value: "fasting" },
          ],
          defaultValue: "standard",
        },
        {
          name: "climate",
          label: "Climate / Sweating",
          type: "select",
          options: [
            { label: "Temperate / low sweat", value: "temperate" },
            { label: "Warm / moderate sweat", value: "warm" },
            { label: "Hot / heavy sweater", value: "hot" },
          ],
          defaultValue: "temperate",
        },
      ],
      calculate: (inputs) => {
        const weight = parseFloat(inputs.bodyWeight as string);
        const activity = inputs.activityLevel as string;
        const diet = inputs.diet as string;
        const climate = inputs.climate as string;
        if (!weight) return null;

        const weightKg = weight * 0.4536;

        // Base recommendations (mg/day)
        let sodium = 2300;
        let potassium = 3400;
        let magnesium = weightKg < 70 ? 320 : 420;
        let calcium = 1000;

        // Activity adjustments
        const activityMultipliers: Record<string, number> = {
          sedentary: 1.0, moderate: 1.15, active: 1.35, endurance: 1.6,
        };
        const actMult = activityMultipliers[activity] || 1.0;

        // Keto/low-carb increases electrolyte needs significantly
        const dietMultipliers: Record<string, { sodium: number; potassium: number; magnesium: number }> = {
          standard: { sodium: 1.0, potassium: 1.0, magnesium: 1.0 },
          keto: { sodium: 1.8, potassium: 1.3, magnesium: 1.4 },
          wholefood: { sodium: 1.2, potassium: 1.0, magnesium: 1.1 },
          fasting: { sodium: 1.5, potassium: 1.2, magnesium: 1.3 },
        };
        const dietMult = dietMultipliers[diet] || dietMultipliers.standard;

        // Climate adjustments (mainly sodium/potassium from sweat)
        const climateMultipliers: Record<string, number> = { temperate: 1.0, warm: 1.2, hot: 1.5 };
        const climateMult = climateMultipliers[climate] || 1.0;

        sodium = sodium * dietMult.sodium * actMult * climateMult;
        potassium = potassium * dietMult.potassium * actMult;
        magnesium = magnesium * dietMult.magnesium * actMult;
        calcium = calcium * actMult;

        return {
          primary: { label: "Sodium", value: `${formatNumber(sodium, 0)} mg/day` },
          details: [
            { label: "Potassium", value: `${formatNumber(potassium, 0)} mg/day` },
            { label: "Magnesium", value: `${formatNumber(magnesium, 0)} mg/day` },
            { label: "Calcium", value: `${formatNumber(calcium, 0)} mg/day` },
            { label: "Sodium (tsp salt equiv)", value: `${formatNumber(sodium / 2300, 1)} tsp` },
            { label: "Water Intake (est.)", value: `${formatNumber(weightKg * 0.033 * actMult, 1)} L/day` },
          ],
          note: "Recommendations are general guidelines. Individuals with hypertension, kidney disease, or heart failure should follow their physician's specific guidance. Electrolyte needs increase substantially during keto adaptation, endurance exercise, and hot weather.",
        };
      },
    },
  ],
  relatedSlugs: ["water-intake-calculator", "calorie-calculator", "creatine-dosage-calculator"],
  faq: [
    {
      question: "Why do I need more electrolytes on a keto diet?",
      answer:
        "Low-carb and keto diets cause the kidneys to excrete more sodium and water (due to lower insulin levels). This increases needs for sodium (3,000-5,000mg), potassium (3,500-4,700mg), and magnesium (400-600mg). 'Keto flu' symptoms are often caused by electrolyte deficiency.",
    },
    {
      question: "What are signs of electrolyte imbalance?",
      answer:
        "Common signs include muscle cramps, fatigue, headaches, dizziness, heart palpitations, nausea, and brain fog. Severe imbalances can cause irregular heartbeat and seizures. Athletes and people on restrictive diets are at highest risk.",
    },
    {
      question: "Should I use electrolyte supplements?",
      answer:
        "Most people eating a balanced diet get sufficient electrolytes from food. Supplementation may benefit those on keto/low-carb diets, endurance athletes, heavy sweaters, and people in hot climates. Choose supplements without excessive sugar. Food sources include bananas (potassium), nuts (magnesium), and dairy (calcium).",
    },
  ],
  formula:
    "Daily Need = Base Recommendation x Activity Multiplier x Diet Multiplier x Climate Multiplier",
};
