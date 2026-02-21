import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hydrationCalculator: CalculatorDefinition = {
  slug: "hydration-calculator",
  title: "Hydration Calculator",
  description:
    "Free hydration calculator. Estimate daily water intake needs based on body weight, activity level, and climate conditions.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["hydration", "water intake", "daily water needs", "fluid intake"],
  variants: [
    {
      id: "dailyWater",
      name: "Daily Water Needs",
      fields: [
        {
          name: "weight",
          label: "Body Weight (lbs)",
          type: "number",
          placeholder: "e.g. 160",
        },
        {
          name: "activityLevel",
          label: "Activity Level",
          type: "select",
          options: [
            { label: "Sedentary (no exercise)", value: "sedentary" },
            { label: "Light (1\u20133 days/week)", value: "light" },
            { label: "Moderate (3\u20135 days/week)", value: "moderate" },
            { label: "Active (6\u20137 days/week)", value: "active" },
            { label: "Very Active (2x/day)", value: "very_active" },
          ],
        },
        {
          name: "climate",
          label: "Climate",
          type: "select",
          options: [
            { label: "Temperate", value: "temperate" },
            { label: "Hot / Humid", value: "hot" },
            { label: "Cold / Dry", value: "cold" },
          ],
        },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const activityLevel = inputs.activityLevel as string;
        const climate = inputs.climate as string;
        if (!weight || !activityLevel || !climate) return null;

        // Base: half body weight in ounces
        let baseOz = weight / 2;

        // Activity additions
        const activityAdditions: Record<string, number> = {
          sedentary: 0,
          light: 12,
          moderate: 20,
          active: 32,
          very_active: 48,
        };

        // Climate additions
        const climateAdditions: Record<string, number> = {
          temperate: 0,
          hot: 16,
          cold: 8,
        };

        const activityAdd = activityAdditions[activityLevel] || 0;
        const climateAdd = climateAdditions[climate] || 0;
        const totalOz = baseOz + activityAdd + climateAdd;
        const totalLiters = totalOz * 0.0295735;
        const totalCups = totalOz / 8;

        return {
          primary: {
            label: "Daily Water Intake",
            value: `${formatNumber(totalOz, 0)} oz (${formatNumber(totalLiters, 1)} L)`,
          },
          details: [
            { label: "Base Intake", value: `${formatNumber(baseOz, 0)} oz` },
            { label: "Activity Addition", value: `+${formatNumber(activityAdd, 0)} oz` },
            { label: "Climate Addition", value: `+${formatNumber(climateAdd, 0)} oz` },
            { label: "In Cups (8 oz)", value: `${formatNumber(totalCups, 1)} cups` },
            { label: "Body Weight", value: `${formatNumber(weight, 0)} lbs` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["exercise-calorie-calculator", "body-water-calculator"],
  faq: [
    {
      question: "How much water should I drink daily?",
      answer:
        "A common guideline is to drink half your body weight (in pounds) in ounces of water per day, then add more for exercise and hot climates.",
    },
    {
      question: "Does exercise increase water needs?",
      answer:
        "Yes. You should drink an additional 12\u201348 oz of water depending on exercise intensity and duration. For every 30 minutes of exercise, add approximately 12 oz.",
    },
  ],
  formula:
    "Base = weight(lbs) / 2 in ounces. Add 12\u201348 oz for activity level and 8\u201316 oz for hot/dry climates.",
};
