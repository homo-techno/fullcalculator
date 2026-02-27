import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rowingCalorieCalculator: CalculatorDefinition = {
  slug: "rowing-calorie-calculator",
  title: "Rowing Calorie Calculator",
  description: "Free rowing calorie calculator. Calculate calories burned during rowing based on your weight and duration.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["rowing calorie calculator", "calories burned", "exercise calculator"],
  variants: [
    {
      id: "standard",
      name: "Calories Burned",
      description: "Calculate calories burned during rowing",
      fields: [
        {
          name: "weight",
          label: "Body Weight",
          type: "number",
          placeholder: "e.g. 70",
          suffix: "kg",
          min: 20,
          max: 300,
        },
        {
          name: "duration",
          label: "Duration",
          type: "number",
          placeholder: "e.g. 30",
          suffix: "minutes",
          min: 1,
          max: 600,
        },
        {
          name: "intensity",
          label: "Intensity",
          type: "select",
          defaultValue: "1",
          options: [{ label: "Light", value: "0.75" }, { label: "Moderate", value: "1" }, { label: "Vigorous", value: "1.25" }, { label: "Very Intense", value: "1.5" }],
        }
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const duration = inputs.duration as number;
        const intensity = parseFloat(inputs.intensity as string) || 1;
        if (!weight || !duration) return null;
        const met = 7 * intensity;
        const calories = met * weight * (duration / 60);
        const caloriesPerMin = calories / duration;
        return {
          primary: { label: "Calories Burned", value: formatNumber(calories) + " kcal" },
          details: [
            { label: "MET value", value: formatNumber(met) },
            { label: "Calories per minute", value: formatNumber(caloriesPerMin) },
            { label: "Duration", value: duration + " minutes" },
            { label: "Equivalent walking minutes", value: formatNumber(calories / 3.5 * 60 / weight) + " min" },
          ],
        };
      },
    }
  ],
  relatedSlugs: ["calorie-calculator", "bmi-calculator"],
  faq: [
    {
      question: "How many calories does rowing burn?",
      answer: "A 70kg person burns approximately 245 calories in 30 minutes of moderate rowing.",
    },
    {
      question: "What is MET?",
      answer: "MET (Metabolic Equivalent of Task) measures the energy cost of physical activity. 1 MET is the energy used at rest. Higher METs indicate more intense activities.",
    }
  ],
  formula: "Calories = MET x Weight (kg) x Duration (hours)",
};
