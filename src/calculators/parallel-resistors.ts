import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const parallelResistorsCalculator: CalculatorDefinition = {
  slug: "parallel-resistors",
  title: "Parallel Resistors Calculator",
  description:
    "Calculate the total resistance of resistors connected in parallel using 1/R_total = 1/R₁ + 1/R₂ + ...",
  category: "Science",
  categorySlug: "science",
  icon: "GitBranch",
  keywords: [
    "parallel resistors",
    "resistance",
    "total resistance",
    "circuit",
    "electronics",
    "ohms",
    "physics",
  ],
  variants: [
    {
      id: "two-parallel-res",
      name: "Two Resistors in Parallel",
      fields: [
        {
          name: "r1",
          label: "Resistance R₁ (Ω)",
          type: "number",
          placeholder: "Enter R₁ in ohms",
        },
        {
          name: "r2",
          label: "Resistance R₂ (Ω)",
          type: "number",
          placeholder: "Enter R₂ in ohms",
        },
      ],
      calculate: (inputs) => {
        const r1 = parseFloat(inputs.r1 as string);
        const r2 = parseFloat(inputs.r2 as string);
        if (isNaN(r1) || isNaN(r2) || r1 <= 0 || r2 <= 0) {
          return { primary: { label: "Total Resistance", value: "Invalid input" }, details: [] };
        }
        const total = 1 / (1 / r1 + 1 / r2);
        return {
          primary: { label: "Total Resistance", value: `${formatNumber(total)} Ω` },
          details: [
            { label: "R₁", value: `${formatNumber(r1)} Ω` },
            { label: "R₂", value: `${formatNumber(r2)} Ω` },
            { label: "Simplified", value: `(R₁ × R₂)/(R₁ + R₂) = ${formatNumber(total)} Ω` },
            { label: "Total (kΩ)", value: `${formatNumber(total / 1000)} kΩ` },
          ],
        };
      },
    },
    {
      id: "three-parallel-res",
      name: "Three Resistors in Parallel",
      fields: [
        {
          name: "r1",
          label: "Resistance R₁ (Ω)",
          type: "number",
          placeholder: "Enter R₁ in ohms",
        },
        {
          name: "r2",
          label: "Resistance R₂ (Ω)",
          type: "number",
          placeholder: "Enter R₂ in ohms",
        },
        {
          name: "r3",
          label: "Resistance R₃ (Ω)",
          type: "number",
          placeholder: "Enter R₃ in ohms",
        },
      ],
      calculate: (inputs) => {
        const r1 = parseFloat(inputs.r1 as string);
        const r2 = parseFloat(inputs.r2 as string);
        const r3 = parseFloat(inputs.r3 as string);
        if (isNaN(r1) || isNaN(r2) || isNaN(r3) || r1 <= 0 || r2 <= 0 || r3 <= 0) {
          return { primary: { label: "Total Resistance", value: "Invalid input" }, details: [] };
        }
        const total = 1 / (1 / r1 + 1 / r2 + 1 / r3);
        return {
          primary: { label: "Total Resistance", value: `${formatNumber(total)} Ω` },
          details: [
            { label: "R₁", value: `${formatNumber(r1)} Ω` },
            { label: "R₂", value: `${formatNumber(r2)} Ω` },
            { label: "R₃", value: `${formatNumber(r3)} Ω` },
            { label: "Total (kΩ)", value: `${formatNumber(total / 1000)} kΩ` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["series-resistors", "parallel-capacitors", "capacitor-energy"],
  faq: [
    {
      question: "How do resistors add in parallel?",
      answer:
        "Resistors in parallel add reciprocally: 1/R_total = 1/R₁ + 1/R₂ + ... The total resistance is always less than the smallest individual resistance.",
    },
    {
      question: "Why is parallel resistance always less than the smallest resistor?",
      answer:
        "In parallel, each resistor provides an additional path for current to flow. More paths means more total current for the same voltage, which is equivalent to a lower total resistance.",
    },
  ],
  formula:
    "1/R_total = 1/R₁ + 1/R₂ + 1/R₃ + ..., or for two resistors: R_total = (R₁ × R₂)/(R₁ + R₂).",
};
