import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bacCalculator: CalculatorDefinition = {
  slug: "bac-calculator",
  title: "BAC Calculator",
  description: "Free blood alcohol content calculator. Estimate your BAC based on drinks consumed, body weight, gender, and time elapsed.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["bac calculator", "blood alcohol calculator", "alcohol calculator", "drunk calculator", "blood alcohol content"],
  variants: [
    {
      id: "bac",
      name: "Estimate BAC",
      description: "Estimate blood alcohol content using the Widmark formula",
      fields: [
        { name: "drinks", label: "Number of Standard Drinks", type: "number", placeholder: "e.g. 3", min: 0, max: 20 },
        { name: "weight", label: "Body Weight (lbs)", type: "number", placeholder: "e.g. 160" },
        { name: "gender", label: "Gender", type: "select", options: [
          { label: "Male", value: "male" }, { label: "Female", value: "female" },
        ], defaultValue: "male" },
        { name: "hours", label: "Hours Since First Drink", type: "number", placeholder: "e.g. 2", min: 0 },
      ],
      calculate: (inputs) => {
        const drinks = inputs.drinks as number;
        const weight = inputs.weight as number;
        const gender = inputs.gender as string;
        const hours = (inputs.hours as number) || 0;
        if (drinks === undefined || !weight) return null;
        const r = gender === "female" ? 0.55 : 0.68;
        const alcoholOz = drinks * 0.6;
        const bac = Math.max(0, (alcoholOz * 5.14) / (weight * r) - 0.015 * hours);
        let status = "Sober";
        if (bac >= 0.08) status = "Legally impaired (0.08+)";
        else if (bac >= 0.05) status = "Mildly impaired";
        else if (bac > 0.01) status = "Minimal effects";
        const hoursToSober = bac > 0 ? bac / 0.015 : 0;
        return {
          primary: { label: "Estimated BAC", value: `${formatNumber(bac, 3)}%` },
          details: [
            { label: "Status", value: status },
            { label: "Hours until sober (~0.00)", value: formatNumber(hoursToSober, 1) },
            { label: "Legal limit (US)", value: "0.08%" },
            { label: "Metabolism rate", value: "~0.015% per hour" },
          ],
          note: "This is a rough estimate only. BAC depends on many factors including food, medications, tolerance, and individual metabolism. Never drive if you've been drinking.",
        };
      },
    },
  ],
  relatedSlugs: ["bmi-calculator", "calorie-calculator", "water-intake-calculator"],
  faq: [
    { question: "What is a standard drink?", answer: "One standard drink = 14g of pure alcohol = 12 oz beer (5%), 5 oz wine (12%), or 1.5 oz spirits (40%). A strong IPA (7%) in a 16 oz pint = ~1.9 standard drinks." },
    { question: "How long until I'm sober?", answer: "The body metabolizes about 0.015% BAC per hour. At 0.08% BAC, it takes about 5.3 hours to reach 0.00%. Nothing speeds this up — not coffee, water, or cold showers." },
  ],
  formula: "BAC = (Alcohol oz × 5.14) / (Weight × r) - 0.015 × hours | r = 0.68 (male) or 0.55 (female)",
};
