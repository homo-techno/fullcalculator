import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const waterIntakeCalculator: CalculatorDefinition = {
  slug: "water-intake-calculator",
  title: "Water Intake Calculator",
  description: "Free water intake calculator. Find out how much water you should drink per day based on your weight, activity level, and climate.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["water intake calculator", "how much water should I drink", "daily water intake", "hydration calculator", "water calculator"],
  variants: [
    {
      id: "daily",
      name: "Daily Water Intake",
      description: "Calculate recommended daily water intake",
      fields: [
        { name: "weight", label: "Body Weight", type: "number", placeholder: "e.g. 160" },
        { name: "unit", label: "Weight Unit", type: "select", options: [
          { label: "Pounds (lbs)", value: "lbs" },
          { label: "Kilograms (kg)", value: "kg" },
        ], defaultValue: "lbs" },
        { name: "activity", label: "Activity Level", type: "select", options: [
          { label: "Sedentary (little exercise)", value: "1.0" },
          { label: "Lightly active (1-3 days/week)", value: "1.12" },
          { label: "Moderately active (3-5 days/week)", value: "1.25" },
          { label: "Very active (6-7 days/week)", value: "1.5" },
          { label: "Athlete (2x/day training)", value: "1.75" },
        ], defaultValue: "1.0" },
        { name: "climate", label: "Climate", type: "select", options: [
          { label: "Temperate", value: "1.0" },
          { label: "Hot / humid", value: "1.2" },
          { label: "Very hot / dry", value: "1.4" },
        ], defaultValue: "1.0" },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const unit = inputs.unit as string;
        const activityFactor = parseFloat(inputs.activity as string) || 1.0;
        const climateFactor = parseFloat(inputs.climate as string) || 1.0;
        if (!weight) return null;

        const weightLbs = unit === "kg" ? weight * 2.205 : weight;
        const baseOz = weightLbs * 0.5;
        const totalOz = baseOz * activityFactor * climateFactor;
        const totalMl = totalOz * 29.574;
        const totalL = totalMl / 1000;
        const cups = totalOz / 8;
        const bottles = totalOz / 16.9;

        return {
          primary: { label: "Daily Water Intake", value: `${formatNumber(totalOz, 0)} oz (${formatNumber(totalL, 1)} L)` },
          details: [
            { label: "Fluid ounces", value: `${formatNumber(totalOz, 0)} oz` },
            { label: "Liters", value: `${formatNumber(totalL, 1)} L` },
            { label: "Cups (8 oz)", value: formatNumber(cups, 1) },
            { label: "Water bottles (500mL)", value: formatNumber(bottles, 1) },
            { label: "Milliliters", value: formatNumber(totalMl, 0) },
          ],
          note: "This is a general guideline. You may need more water during illness, pregnancy, or breastfeeding. About 20% of daily water comes from food.",
        };
      },
    },
  ],
  relatedSlugs: ["calorie-calculator", "bmi-calculator", "protein-calculator"],
  faq: [
    { question: "How much water should I drink a day?", answer: "A general rule is half your body weight (in pounds) in ounces of water. A 160-lb person needs about 80 oz (2.4L). Increase for exercise, hot weather, and altitude. The 8×8 rule (eight 8-oz glasses) is about 64 oz — a reasonable minimum." },
    { question: "Can I drink too much water?", answer: "Yes. Overhydration (hyponatremia) is rare but can occur during extreme exercise. Your urine should be light yellow — if it's consistently clear, you may be overhydrating. Listen to your thirst signals." },
  ],
  formula: "Base = Body Weight (lbs) × 0.5 oz | Adjusted = Base × Activity Factor × Climate Factor",
};
