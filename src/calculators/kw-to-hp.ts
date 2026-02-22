import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const kwToHpConverter: CalculatorDefinition = {
  slug: "kw-to-hp-converter",
  title: "Kilowatts to Horsepower Converter",
  description: "Free kW to HP converter. Convert kilowatts to horsepower instantly. Supports mechanical, metric, and electrical horsepower.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["kw to hp", "kilowatts to horsepower", "kw to hp converter", "kw hp conversion", "power converter"],
  variants: [
    {
      id: "convert",
      name: "Convert kW to HP",
      fields: [
        { name: "value", label: "Kilowatts (kW)", type: "number", placeholder: "e.g. 100" },
        { name: "type", label: "Horsepower Type", type: "select", options: [
          { label: "Mechanical (Imperial)", value: "mechanical" },
          { label: "Metric", value: "metric" },
          { label: "Electrical", value: "electrical" },
        ], defaultValue: "mechanical" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        const type = inputs.type as string;
        if (value === undefined) return null;
        const factors: Record<string, number> = { mechanical: 1.34102, metric: 1.35962, electrical: 1.34048 };
        const factor = factors[type] || factors.mechanical;
        const hp = value * factor;
        return {
          primary: { label: `${formatNumber(value)} kW`, value: `${formatNumber(hp, 4)} HP` },
          details: [
            { label: "Mechanical HP", value: formatNumber(value * 1.34102, 4) },
            { label: "Metric HP", value: formatNumber(value * 1.35962, 4) },
            { label: "Electrical HP", value: formatNumber(value * 1.34048, 4) },
            { label: "Watts", value: formatNumber(value * 1000, 0) },
            { label: "BTU/hr", value: formatNumber(value * 3412.14, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter", "watts-to-btu-converter", "energy-calculator"],
  faq: [
    { question: "How do I convert kW to HP?", answer: "Multiply kilowatts by 1.34102 for mechanical (imperial) horsepower. For example, 100 kW = 134.1 HP. For metric horsepower (PS), multiply by 1.35962." },
    { question: "What is the difference between mechanical and metric HP?", answer: "Mechanical (imperial) HP equals 745.7 watts, while metric HP (PS/CV) equals 735.5 watts. Metric HP is commonly used in Europe and Asia." },
  ],
  formula: "1 kW = 1.34102 mechanical HP = 1.35962 metric HP = 1.34048 electrical HP | 1 HP = 0.7457 kW",
};
