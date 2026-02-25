import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const proteinIntakeCalculator: CalculatorDefinition = {
  slug: "protein-intake-calculator",
  title: "Protein Intake Calculator",
  description: "Free protein intake calculator. Determine your optimal daily protein needs based on body weight, activity level, and fitness goals.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["protein intake", "protein calculator", "daily protein needs", "protein requirements", "muscle building protein", "protein per day"],
  variants: [
    {
      id: "protein-goal",
      name: "Protein by Goal",
      description: "Calculate protein needs based on your weight, activity, and goal",
      fields: [
        { name: "weight", label: "Body Weight", type: "number", placeholder: "e.g. 80" },
        { name: "unit", label: "Weight Unit", type: "select", options: [
          { label: "kg", value: "kg" }, { label: "lbs", value: "lbs" },
        ], defaultValue: "kg" },
        { name: "goal", label: "Goal", type: "select", options: [
          { label: "Sedentary / General Health", value: "sedentary" },
          { label: "Weight Loss (preserve muscle)", value: "loss" },
          { label: "Maintenance / Moderate Activity", value: "maintenance" },
          { label: "Muscle Building / Bulking", value: "build" },
          { label: "Athlete / High Intensity", value: "athlete" },
        ], defaultValue: "maintenance" },
        { name: "bodyFat", label: "Body Fat % (optional, for lean mass)", type: "number", placeholder: "e.g. 15", suffix: "%" },
      ],
      calculate: (inputs) => {
        let weight = inputs.weight as number;
        const unit = inputs.unit as string;
        const goal = inputs.goal as string;
        const bf = inputs.bodyFat as number;
        if (!weight) return null;
        const weightKg = unit === "lbs" ? weight * 0.4536 : weight;
        const leanMassKg = bf ? weightKg * (1 - bf / 100) : null;
        const ranges: Record<string, [number, number]> = {
          sedentary: [0.8, 1.0],
          loss: [1.6, 2.2],
          maintenance: [1.2, 1.6],
          build: [1.6, 2.2],
          athlete: [1.8, 2.5],
        };
        const [low, high] = ranges[goal] || [1.2, 1.6];
        const proteinLow = weightKg * low;
        const proteinHigh = weightKg * high;
        const proteinMid = (proteinLow + proteinHigh) / 2;
        const details: { label: string; value: string }[] = [
          { label: "Range", value: `${formatNumber(proteinLow, 0)} - ${formatNumber(proteinHigh, 0)} g/day` },
          { label: "Per kg Body Weight", value: `${low} - ${high} g/kg` },
          { label: "Meals (3/day)", value: `${formatNumber(proteinMid / 3, 0)} g per meal` },
          { label: "Meals (4/day)", value: `${formatNumber(proteinMid / 4, 0)} g per meal` },
          { label: "Calories from Protein", value: `${formatNumber(proteinMid * 4, 0)} kcal` },
        ];
        if (leanMassKg) {
          const leanProteinLow = leanMassKg * 2.0;
          const leanProteinHigh = leanMassKg * 2.8;
          details.push(
            { label: "Based on Lean Mass", value: `${formatNumber(leanProteinLow, 0)} - ${formatNumber(leanProteinHigh, 0)} g/day` },
          );
        }
        return {
          primary: { label: "Daily Protein", value: `${formatNumber(proteinMid, 0)} g` },
          details,
        };
      },
    },
    {
      id: "protein-timing",
      name: "Protein Timing",
      description: "Distribute daily protein across meals and snacks for optimal results",
      fields: [
        { name: "dailyProtein", label: "Daily Protein Target", type: "number", placeholder: "e.g. 150", suffix: "g" },
        { name: "meals", label: "Number of Meals", type: "select", options: [
          { label: "3 meals", value: "3" },
          { label: "4 meals", value: "4" },
          { label: "5 meals", value: "5" },
          { label: "6 meals", value: "6" },
        ], defaultValue: "4" },
      ],
      calculate: (inputs) => {
        const dailyProtein = inputs.dailyProtein as number;
        const meals = parseInt(inputs.meals as string);
        if (!dailyProtein || !meals) return null;
        const perMeal = dailyProtein / meals;
        return {
          primary: { label: "Protein per Meal", value: `${formatNumber(perMeal, 0)} g` },
          details: [
            { label: "Daily Total", value: `${formatNumber(dailyProtein, 0)} g` },
            { label: "Number of Meals", value: `${meals}` },
            { label: "Per Meal (calories)", value: `${formatNumber(perMeal * 4, 0)} kcal` },
            { label: "Max per Sitting (optimal)", value: `${formatNumber(Math.min(perMeal, 40), 0)} - 50 g` },
          ],
          note: "Research suggests 20-40g of protein per meal is optimal for muscle protein synthesis. Spread intake evenly across the day.",
        };
      },
    },
  ],
  relatedSlugs: ["calorie-calculator", "macro-calculator", "protein-calculator"],
  faq: [
    { question: "How much protein do I need per day?", answer: "The RDA minimum is 0.8 g/kg, but athletes and those building muscle need 1.6-2.2 g/kg. For weight loss, higher protein (1.6-2.2 g/kg) helps preserve muscle. Sedentary individuals need 0.8-1.0 g/kg." },
    { question: "Can you eat too much protein?", answer: "For healthy individuals, protein up to 2.5 g/kg is safe. Very high intakes (3.5+ g/kg) are unnecessary but generally not harmful for healthy kidneys. Those with kidney disease should consult a doctor." },
  ],
  formula: "Protein (g/day) = Body Weight (kg) x multiplier (0.8-2.5 depending on goal)",
};
