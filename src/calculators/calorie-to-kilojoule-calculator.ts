import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const calorieToKilojouleCalculator: CalculatorDefinition = {
  slug: "calorie-to-kilojoule-calculator",
  title: "Calorie to Kilojoule Calculator",
  description: "Free calorie to kilojoule calculator. Convert between cal and kJ instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["calorie to kilojoule calculator", "cal to kJ", "converter"],
  variants: [
    {
      id: "forward",
      name: "cal to kJ",
      description: "Convert cal to kJ",
      fields: [
        {
          name: "value",
          label: "Value in cal",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "cal",
          min: 0,
          step: 0.01,
        }
      ],
      calculate: (inputs) => {
        const v = inputs.value as number;
        if (!v && v !== 0) return null;
        const r = v * 0.004184;
        return {
          primary: { label: "kJ", value: formatNumber(r) + " kJ" },
          details: [
            { label: "Input", value: formatNumber(v) + " cal" },
            { label: "Factor", value: "1 cal = 0.004184 kJ" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter"],
  faq: [
    { question: "How to convert cal to kJ?", answer: "Multiply by 0.004184. Example: 10 cal = 0.04184 kJ." },
    { question: "Is this conversion exact?", answer: "Yes, this uses the standard conversion factor." },
  ],
  formula: "kJ = cal x 0.004184",
};
