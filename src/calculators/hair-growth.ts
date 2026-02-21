import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hairGrowthCalculator: CalculatorDefinition = {
  slug: "hair-growth-calculator",
  title: "Hair Growth Calculator",
  description: "Free hair growth calculator. Estimate how long it will take to grow your hair to a desired length based on average growth rates.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["hair growth calculator", "hair length calculator", "how fast does hair grow", "hair growth rate", "hair growth time"],
  variants: [
    {
      id: "time-to-length",
      name: "Time to Desired Length",
      description: "Calculate how long it will take to grow your hair to a target length",
      fields: [
        { name: "currentLength", label: "Current Hair Length", type: "number", placeholder: "e.g. 10", suffix: "inches", step: 0.5 },
        { name: "desiredLength", label: "Desired Hair Length", type: "number", placeholder: "e.g. 20", suffix: "inches", step: 0.5 },
        { name: "growthRate", label: "Growth Rate", type: "select", options: [
          { label: "Slow (0.4 in/month)", value: "0.4" },
          { label: "Average (0.5 in/month)", value: "0.5" },
          { label: "Fast (0.7 in/month)", value: "0.7" },
          { label: "Very Fast (1.0 in/month)", value: "1.0" },
        ], defaultValue: "0.5" },
        { name: "trimFrequency", label: "Trim Frequency", type: "select", options: [
          { label: "No trims", value: "0" },
          { label: "Every 6 weeks (0.25 in)", value: "6" },
          { label: "Every 8 weeks (0.25 in)", value: "8" },
          { label: "Every 12 weeks (0.5 in)", value: "12" },
        ], defaultValue: "0" },
      ],
      calculate: (inputs) => {
        const currentLength = inputs.currentLength as number;
        const desiredLength = inputs.desiredLength as number;
        const growthRate = parseFloat(inputs.growthRate as string);
        const trimWeeks = parseFloat(inputs.trimFrequency as string);
        if (!currentLength && currentLength !== 0) return null;
        if (!desiredLength || desiredLength <= currentLength) return null;

        const diff = desiredLength - currentLength;
        let months: number;

        if (trimWeeks === 0) {
          months = diff / growthRate;
        } else {
          const trimPerMonth = trimWeeks === 6 ? 0.25 / 1.5 : trimWeeks === 8 ? 0.25 / 2 : 0.5 / 3;
          const netGrowth = growthRate - trimPerMonth;
          if (netGrowth <= 0) return { primary: { label: "Result", value: "Trims exceed growth rate" }, note: "Your trim frequency removes more hair than you grow. Reduce trim frequency or skip trims." };
          months = diff / netGrowth;
        }

        const years = Math.floor(months / 12);
        const remainingMonths = Math.round(months % 12);
        const timeStr = years > 0 ? `${years} year${years > 1 ? "s" : ""} ${remainingMonths} month${remainingMonths !== 1 ? "s" : ""}` : `${remainingMonths} month${remainingMonths !== 1 ? "s" : ""}`;

        return {
          primary: { label: "Estimated Time", value: timeStr },
          details: [
            { label: "Growth Needed", value: `${formatNumber(diff, 1)} inches` },
            { label: "Growth Rate", value: `${growthRate} in/month` },
            { label: "Total Months", value: formatNumber(months, 1) },
            { label: "Growth in cm", value: `${formatNumber(diff * 2.54, 1)} cm` },
          ],
          note: "Hair grows about 6 inches per year on average. Genetics, diet, age, and health can affect growth rate.",
        };
      },
    },
    {
      id: "growth-in-time",
      name: "Growth in Time Period",
      description: "Calculate how much hair will grow in a given time period",
      fields: [
        { name: "months", label: "Time Period", type: "number", placeholder: "e.g. 12", suffix: "months", min: 1 },
        { name: "growthRate", label: "Growth Rate", type: "select", options: [
          { label: "Slow (0.4 in/month)", value: "0.4" },
          { label: "Average (0.5 in/month)", value: "0.5" },
          { label: "Fast (0.7 in/month)", value: "0.7" },
          { label: "Very Fast (1.0 in/month)", value: "1.0" },
        ], defaultValue: "0.5" },
      ],
      calculate: (inputs) => {
        const months = inputs.months as number;
        const growthRate = parseFloat(inputs.growthRate as string);
        if (!months) return null;

        const growthInches = months * growthRate;
        const growthCm = growthInches * 2.54;

        return {
          primary: { label: "Hair Growth", value: formatNumber(growthInches, 1), suffix: "inches" },
          details: [
            { label: "Growth in cm", value: formatNumber(growthCm, 1) },
            { label: "Time Period", value: `${months} months` },
            { label: "Monthly Rate", value: `${growthRate} in/month` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["nail-growth-calculator", "skin-type-calculator"],
  faq: [
    { question: "How fast does hair grow on average?", answer: "Hair grows about 0.5 inches (1.25 cm) per month on average, which is approximately 6 inches (15 cm) per year. Growth rate varies by genetics, age, health, and nutrition." },
    { question: "Does cutting hair make it grow faster?", answer: "No, cutting hair does not make it grow faster. Hair growth occurs at the follicle beneath the scalp. Regular trims help prevent split ends and breakage, which can make hair appear to grow faster by reducing length lost to damage." },
    { question: "What factors affect hair growth rate?", answer: "Key factors include genetics, age (growth slows with age), nutrition (protein, iron, biotin), hormones, stress levels, and overall health. Hair also grows slightly faster in summer than winter." },
  ],
  formula: "Time (months) = (Desired Length − Current Length) / Monthly Growth Rate | Average growth ≈ 0.5 inches/month (1.25 cm/month)",
};
