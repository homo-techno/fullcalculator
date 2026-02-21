import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const resistanceCalculator: CalculatorDefinition = {
  slug: "resistance-calculator",
  title: "Resistance Calculator",
  description: "Free resistance calculator. Calculate total resistance for series and parallel resistor combinations.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["resistance calculator", "parallel resistance", "series resistance", "resistor calculator", "total resistance"],
  variants: [
    {
      id: "series",
      name: "Series Resistors",
      fields: [
        { name: "r1", label: "R₁ (Ω)", type: "number", placeholder: "e.g. 100" },
        { name: "r2", label: "R₂ (Ω)", type: "number", placeholder: "e.g. 200" },
        { name: "r3", label: "R₃ (Ω) - optional", type: "number", placeholder: "e.g. 300", defaultValue: 0 },
        { name: "r4", label: "R₄ (Ω) - optional", type: "number", placeholder: "e.g. 0", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const r1 = inputs.r1 as number, r2 = inputs.r2 as number;
        const r3 = (inputs.r3 as number) || 0, r4 = (inputs.r4 as number) || 0;
        if (!r1 || !r2) return null;
        const total = r1 + r2 + r3 + r4;
        const resistors = [r1, r2, r3, r4].filter(r => r > 0);
        return {
          primary: { label: "Total Resistance", value: `${formatNumber(total, 4)} Ω` },
          details: [
            { label: "Number of resistors", value: String(resistors.length) },
            { label: "Formula", value: `R = ${resistors.map(r => formatNumber(r)).join(" + ")}` },
          ],
        };
      },
    },
    {
      id: "parallel",
      name: "Parallel Resistors",
      fields: [
        { name: "r1", label: "R₁ (Ω)", type: "number", placeholder: "e.g. 100" },
        { name: "r2", label: "R₂ (Ω)", type: "number", placeholder: "e.g. 200" },
        { name: "r3", label: "R₃ (Ω) - optional", type: "number", placeholder: "e.g. 0", defaultValue: 0 },
        { name: "r4", label: "R₄ (Ω) - optional", type: "number", placeholder: "e.g. 0", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const r1 = inputs.r1 as number, r2 = inputs.r2 as number;
        const r3 = (inputs.r3 as number) || 0, r4 = (inputs.r4 as number) || 0;
        if (!r1 || !r2) return null;
        const resistors = [r1, r2, r3, r4].filter(r => r > 0);
        const recipSum = resistors.reduce((sum, r) => sum + 1 / r, 0);
        const total = 1 / recipSum;
        return {
          primary: { label: "Total Resistance", value: `${formatNumber(total, 4)} Ω` },
          details: [
            { label: "Number of resistors", value: String(resistors.length) },
            { label: "Conductance (1/R)", value: `${formatNumber(recipSum, 6)} S` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["ohms-law-calculator", "energy-calculator", "force-calculator"],
  faq: [{ question: "How do I calculate total resistance?", answer: "Series: R_total = R₁ + R₂ + R₃ + ... (add them up). Parallel: 1/R_total = 1/R₁ + 1/R₂ + 1/R₃ + ... (reciprocal of sum of reciprocals). For two resistors in parallel: R = (R₁ × R₂) / (R₁ + R₂)." }],
  formula: "Series: R = R₁+R₂+... | Parallel: 1/R = 1/R₁+1/R₂+...",
};
