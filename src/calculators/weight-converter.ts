import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const weightUnits: Record<string, number> = {
  kg: 1, g: 0.001, mg: 0.000001, lb: 0.453592, oz: 0.0283495,
  st: 6.35029, ton_us: 907.185, ton_metric: 1000, ton_uk: 1016.05,
};
const unitLabels: Record<string, string> = {
  kg: "Kilograms", g: "Grams", mg: "Milligrams", lb: "Pounds", oz: "Ounces",
  st: "Stone", ton_us: "US Tons", ton_metric: "Metric Tonnes", ton_uk: "UK Tons (Long)",
};

export const weightConverter: CalculatorDefinition = {
  slug: "weight-converter",
  title: "Weight Converter",
  description: "Free weight converter. Convert between kilograms, pounds, ounces, grams, stone, and tons instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["weight converter", "kg to lbs", "pounds to kg", "lbs to kg", "weight conversion", "mass converter"],
  variants: [
    {
      id: "convert",
      name: "Convert Weight",
      fields: [
        { name: "value", label: "Value", type: "number", placeholder: "e.g. 150" },
        {
          name: "from", label: "From", type: "select",
          options: Object.entries(unitLabels).map(([v, l]) => ({ label: l, value: v })),
        },
        {
          name: "to", label: "To", type: "select",
          options: Object.entries(unitLabels).map(([v, l]) => ({ label: l, value: v })),
        },
      ],
      calculate: (inputs) => {
        const val = inputs.value as number;
        const from = (inputs.from as string) || "lb";
        const to = (inputs.to as string) || "kg";
        if (!val) return null;
        const kg = val * (weightUnits[from] || 1);
        const result = kg / (weightUnits[to] || 1);
        return {
          primary: { label: `${val} ${unitLabels[from] || from}`, value: `${formatNumber(result, 6)} ${unitLabels[to] || to}` },
          details: [
            { label: "Kilograms", value: formatNumber(kg, 6) },
            { label: "Pounds", value: formatNumber(kg / weightUnits.lb, 6) },
            { label: "Ounces", value: formatNumber(kg / weightUnits.oz, 4) },
            { label: "Grams", value: formatNumber(kg / weightUnits.g, 4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter", "cooking-converter", "bmi-calculator"],
  faq: [{ question: "How do I convert kg to lbs?", answer: "Multiply kilograms by 2.20462. For example, 70 kg = 70 × 2.20462 = 154.32 lbs. To convert lbs to kg, multiply by 0.453592." }],
  formula: "1 kg = 2.20462 lbs = 35.274 oz",
};
