import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const stepsMilesCalculator: CalculatorDefinition = {
  slug: "steps-to-miles-calculator",
  title: "Steps to Miles Calculator",
  description: "Free steps to miles calculator. Convert steps walked to miles and kilometers. Track your daily walking distance and calories burned.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["steps to miles", "steps calculator", "how many miles in 10000 steps", "walking distance calculator", "step counter"],
  variants: [
    {
      id: "convert",
      name: "Steps to Distance",
      fields: [
        { name: "steps", label: "Number of Steps", type: "number", placeholder: "e.g. 10000" },
        { name: "height", label: "Your Height (inches)", type: "number", placeholder: "e.g. 68", defaultValue: 68 },
      ],
      calculate: (inputs) => {
        const steps = inputs.steps as number;
        const height = (inputs.height as number) || 68;
        if (!steps) return null;
        const strideFt = height * 0.413 / 12;
        const miles = (steps * strideFt) / 5280;
        const km = miles * 1.60934;
        const calories = steps * 0.04;
        const minutes = steps / 100;
        return {
          primary: { label: `${formatNumber(steps, 0)} steps`, value: `${formatNumber(miles, 2)} miles` },
          details: [
            { label: "Kilometers", value: formatNumber(km, 2) },
            { label: "Est. calories burned", value: formatNumber(calories, 0) },
            { label: "Est. walking time", value: `${formatNumber(minutes, 0)} min` },
            { label: "Stride length", value: `${formatNumber(strideFt, 2)} ft` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["calorie-calculator", "pace-calculator", "bmi-calculator"],
  faq: [
    { question: "How many steps in a mile?", answer: "The average person takes about 2,000-2,500 steps per mile, depending on stride length. Taller people take fewer steps per mile. At average height (5'8\"), it's about 2,100 steps." },
    { question: "Is 10,000 steps a day enough?", answer: "10,000 steps (~4-5 miles) is a popular goal. Studies show health benefits start around 7,000-8,000 steps/day. Any increase in daily steps is beneficial, especially for sedentary individuals." },
  ],
  formula: "Stride (ft) = Height (in) × 0.413 / 12 | Miles = Steps × Stride / 5280",
};
