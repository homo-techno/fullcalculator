import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const proteinCalculator: CalculatorDefinition = {
  slug: "protein-calculator",
  title: "Protein Calculator",
  description: "Free protein intake calculator. Calculate how many grams of protein you need daily based on your weight, activity level, and fitness goals.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["protein calculator", "how much protein do I need", "daily protein intake", "protein per day calculator", "protein requirement"],
  variants: [
    {
      id: "daily",
      name: "Daily Protein Needs",
      description: "Calculate recommended daily protein intake by goal",
      fields: [
        { name: "weight", label: "Body Weight", type: "number", placeholder: "e.g. 160" },
        { name: "unit", label: "Weight Unit", type: "select", options: [
          { label: "Pounds (lbs)", value: "lbs" },
          { label: "Kilograms (kg)", value: "kg" },
        ], defaultValue: "lbs" },
        { name: "goal", label: "Goal", type: "select", options: [
          { label: "Sedentary / General Health", value: "sedentary" },
          { label: "Weight Loss", value: "loss" },
          { label: "Muscle Maintenance", value: "maintain" },
          { label: "Muscle Building", value: "build" },
          { label: "Athlete / Intense Training", value: "athlete" },
        ], defaultValue: "maintain" },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const unit = inputs.unit as string;
        const goal = inputs.goal as string;
        if (!weight) return null;

        const weightKg = unit === "lbs" ? weight / 2.205 : weight;

        const ranges: Record<string, [number, number]> = {
          sedentary: [0.8, 1.0],
          loss: [1.2, 1.6],
          maintain: [1.2, 1.4],
          build: [1.6, 2.2],
          athlete: [1.8, 2.4],
        };

        const [low, high] = ranges[goal] || ranges.maintain;
        const proteinLow = weightKg * low;
        const proteinHigh = weightKg * high;
        const proteinMid = (proteinLow + proteinHigh) / 2;

        const mealsLow = proteinLow / 4;
        const mealsHigh = proteinHigh / 4;

        return {
          primary: { label: "Daily Protein", value: `${formatNumber(proteinLow, 0)}-${formatNumber(proteinHigh, 0)} g` },
          details: [
            { label: "Recommended range", value: `${formatNumber(proteinLow, 0)}-${formatNumber(proteinHigh, 0)} g/day` },
            { label: "Midpoint", value: `${formatNumber(proteinMid, 0)} g/day` },
            { label: "Per meal (4 meals)", value: `${formatNumber(mealsLow, 0)}-${formatNumber(mealsHigh, 0)} g` },
            { label: "Rate used", value: `${low}-${high} g/kg body weight` },
            { label: "Body weight", value: `${formatNumber(weightKg, 1)} kg` },
          ],
          note: "Protein from both animal and plant sources counts equally. Spread intake across meals for optimal absorption (25-40g per meal). Sources: chicken breast (31g/100g), eggs (6g each), Greek yogurt (10g/100g), lentils (9g/100g).",
        };
      },
    },
  ],
  relatedSlugs: ["calorie-calculator", "bmi-calculator", "water-intake-calculator"],
  faq: [
    { question: "How much protein do I need to build muscle?", answer: "Research recommends 1.6-2.2 g per kg of body weight for muscle building. For a 180-lb (82 kg) person, that's 131-180 grams per day. More isn't necessarily better — most benefits plateau around 1.6 g/kg." },
    { question: "Can I eat too much protein?", answer: "For healthy individuals, high protein intake (up to 2.2 g/kg) is safe. Very high intake (>3 g/kg) may stress kidneys in people with pre-existing kidney issues. For most people, the bigger concern is not getting enough protein." },
  ],
  formula: "Daily Protein (g) = Body Weight (kg) × Protein Factor (0.8-2.4 g/kg based on goal)",
};
