import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const joulesToCalories: CalculatorDefinition = {
  slug: "joules-to-calories",
  title: "Joules to Calories",
  description: "Free Joules to calories converter. Convert energy from Joules to calories and kilocalories instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["joules to calories", "J to cal", "energy conversion", "joules calories"],
  variants: [
    {
      id: "joules-to-calories",
      name: "Joules to Calories",
      fields: [
        { name: "joules", label: "Energy (J)", type: "number", placeholder: "e.g. 4184", suffix: "J" },
      ],
      calculate: (inputs) => {
        const joules = inputs.joules as number;
        if (joules === undefined) return null;
        const calories = joules / 4.184;
        const kilocalories = joules / 4184;
        const kJ = joules / 1000;
        const btu = joules / 1055.06;
        const wattHours = joules / 3600;
        return {
          primary: { label: "Calories", value: formatNumber(calories, 2), suffix: "cal" },
          details: [
            { label: "Joules", value: `${formatNumber(joules, 2)} J` },
            { label: "Calories (small)", value: `${formatNumber(calories, 2)} cal` },
            { label: "Kilocalories (food)", value: `${formatNumber(kilocalories, 4)} kcal` },
            { label: "Kilojoules", value: `${formatNumber(kJ, 4)} kJ` },
            { label: "BTU", value: `${formatNumber(btu, 4)} BTU` },
            { label: "Watt-hours", value: `${formatNumber(wattHours, 4)} Wh` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["calories-to-joules", "watt-hours-to-joules", "energy"],
  faq: [
    { question: "How do I convert Joules to calories?", answer: "Divide the energy in Joules by 4.184. For example, 4,184 J = 1,000 cal = 1 kcal (food Calorie)." },
    { question: "What is the difference between calories and Calories?", answer: "A small calorie (cal) is the energy to heat 1g of water by 1°C. A food Calorie (Cal or kcal) equals 1,000 small calories." },
  ],
  formula: "cal = J ÷ 4.184",
};
