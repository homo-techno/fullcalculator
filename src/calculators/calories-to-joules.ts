import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const caloriesToJoules: CalculatorDefinition = {
  slug: "calories-to-joules",
  title: "Calories to Joules",
  description: "Free calories to Joules converter. Convert energy from calories and kilocalories to Joules instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["calories to joules", "cal to J", "energy conversion", "calories joules"],
  variants: [
    {
      id: "calories-to-joules",
      name: "Calories to Joules",
      fields: [
        { name: "calories", label: "Energy (cal)", type: "number", placeholder: "e.g. 1000", suffix: "cal" },
      ],
      calculate: (inputs) => {
        const calories = inputs.calories as number;
        if (calories === undefined) return null;
        const joules = calories * 4.184;
        const kilocalories = calories / 1000;
        const kJ = joules / 1000;
        const btu = joules / 1055.06;
        const wattHours = joules / 3600;
        return {
          primary: { label: "Joules", value: formatNumber(joules, 2), suffix: "J" },
          details: [
            { label: "Calories (small)", value: `${formatNumber(calories, 2)} cal` },
            { label: "Joules", value: `${formatNumber(joules, 2)} J` },
            { label: "Kilocalories (food)", value: `${formatNumber(kilocalories, 4)} kcal` },
            { label: "Kilojoules", value: `${formatNumber(kJ, 4)} kJ` },
            { label: "BTU", value: `${formatNumber(btu, 4)} BTU` },
            { label: "Watt-hours", value: `${formatNumber(wattHours, 4)} Wh` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["joules-to-calories", "watt-hours-to-joules", "energy"],
  faq: [
    { question: "How do I convert calories to Joules?", answer: "Multiply the energy in calories by 4.184. For example, 1,000 cal = 4,184 J." },
    { question: "How many Joules in a food Calorie?", answer: "One food Calorie (kcal) equals 4,184 Joules, or approximately 4.2 kJ." },
  ],
  formula: "J = cal × 4.184",
};
