import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dogYearsCalculator: CalculatorDefinition = {
  slug: "dog-years-calculator",
  title: "Dog Years Calculator",
  description: "Free dog years calculator. Convert dog years to human years using modern veterinary formulas based on dog size.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["dog years calculator", "dog age calculator", "dog to human years", "pet age calculator"],
  variants: [
    {
      id: "dogToHuman",
      name: "Dog Years → Human Years",
      fields: [
        { name: "age", label: "Dog's Age (years)", type: "number", placeholder: "e.g. 5" },
        {
          name: "size", label: "Dog Size", type: "select",
          options: [
            { label: "Small (under 20 lbs)", value: "small" },
            { label: "Medium (20-50 lbs)", value: "medium" },
            { label: "Large (50-90 lbs)", value: "large" },
            { label: "Giant (90+ lbs)", value: "giant" },
          ],
        },
      ],
      calculate: (inputs) => {
        const age = inputs.age as number;
        const size = inputs.size as string || "medium";
        if (!age || age < 0) return null;
        let humanAge: number;
        const rates: Record<string, number[]> = {
          small: [15, 9.5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
          medium: [15, 9, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
          large: [15, 9, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
          giant: [12, 10, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
        };
        const r = rates[size] || rates.medium;
        humanAge = 0;
        const fullYears = Math.floor(age);
        const frac = age - fullYears;
        for (let i = 0; i < fullYears && i < r.length; i++) humanAge += r[i];
        if (fullYears >= r.length) humanAge += (fullYears - r.length) * r[r.length - 1];
        if (frac > 0) humanAge += frac * (r[Math.min(fullYears, r.length - 1)]);
        return {
          primary: { label: `${age} dog years`, value: `≈ ${formatNumber(humanAge, 1)} human years` },
          details: [
            { label: "Dog size", value: size.charAt(0).toUpperCase() + size.slice(1) },
            { label: "Life stage", value: age <= 1 ? "Puppy" : age <= 3 ? "Young adult" : age <= 7 ? "Adult" : "Senior" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["age-calculator", "bmi-calculator", "calorie-calculator"],
  faq: [{ question: "Is 1 dog year really 7 human years?", answer: "The old '7 years' rule is oversimplified. Dogs age faster in their first 2 years. A 1-year-old dog is roughly equivalent to a 15-year-old human. After that, aging rate depends on the dog's size—larger dogs age faster than smaller ones." }],
  formula: "Year 1 ≈ 15 human years, Year 2 ≈ 9, then 4-7 per year by size",
};
