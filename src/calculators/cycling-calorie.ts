import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cyclingCalorieCalculator: CalculatorDefinition = {
  slug: "cycling-calorie-calculator",
  title: "Cycling Calorie Calculator",
  description:
    "Free cycling calorie calculator. Estimate how many calories you burn cycling based on weight, duration, and intensity. Uses MET values for different cycling speeds.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "cycling calorie calculator",
    "calories burned cycling",
    "biking calorie calculator",
    "bicycle calories burned",
    "cycling exercise calculator",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate Calories Burned",
      description: "Estimate calories burned while cycling",
      fields: [
        { name: "weight", label: "Weight", type: "number", placeholder: "e.g. 165", suffix: "lbs" },
        { name: "duration", label: "Duration", type: "number", placeholder: "e.g. 45", suffix: "minutes" },
        {
          name: "intensity",
          label: "Intensity",
          type: "select",
          options: [
            { label: "Leisure (<10 mph, casual ride)", value: "4" },
            { label: "Moderate (10-12 mph)", value: "6" },
            { label: "Vigorous (12-14 mph)", value: "8" },
            { label: "Very Vigorous (14-16 mph)", value: "10" },
            { label: "Racing (>16 mph)", value: "12" },
          ],
          defaultValue: "6",
        },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const duration = inputs.duration as number;
        const met = parseFloat(inputs.intensity as string);
        if (!weight || !duration) return null;

        const weightKg = weight * 0.453592;
        const hours = duration / 60;
        const calories = met * weightKg * hours;

        return {
          primary: { label: "Calories Burned", value: formatNumber(calories, 0) },
          details: [
            { label: "MET Value", value: formatNumber(met, 1) },
            { label: "Duration", value: `${formatNumber(duration, 0)} min` },
            { label: "Cal/Minute", value: formatNumber(calories / duration, 1) },
            { label: "Cal/Hour", value: formatNumber(calories / hours, 0) },
          ],
          note: "Actual calorie burn varies with terrain, wind resistance, bike type, and fitness level. Uphill cycling can increase burn by 50-100%.",
        };
      },
    },
  ],
  relatedSlugs: ["calorie-calculator", "exercise-calorie-calculator", "running-calorie-calculator", "walking-calorie-calculator"],
  faq: [
    {
      question: "How many calories does cycling burn?",
      answer:
        "A 155-lb person burns approximately 300-600 calories per hour cycling, depending on speed. Casual riding at 10 mph burns about 300 cal/hr, while vigorous cycling at 14+ mph burns 600+ cal/hr.",
    },
    {
      question: "Does cycling burn more calories than running?",
      answer:
        "Running typically burns more calories per hour at comparable effort levels because it is a weight-bearing exercise. However, cycling allows longer exercise sessions with less joint impact, so total calorie burn can be similar or greater over time.",
    },
    {
      question: "What is a MET value for cycling?",
      answer:
        "MET (Metabolic Equivalent of Task) values for cycling range from 4 (leisure) to 12+ (racing). A MET of 6 means you burn 6 times more energy than sitting still. Moderate cycling at 10-12 mph has a MET of about 6.",
    },
  ],
  formula:
    "Calories = MET × Weight (kg) × Duration (hours) | Cycling METs: Leisure = 4, Moderate = 6, Vigorous = 8, Very Vigorous = 10, Racing = 12",
};
