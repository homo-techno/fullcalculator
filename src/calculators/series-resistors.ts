import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const seriesResistorsCalculator: CalculatorDefinition = {
  slug: "series-resistors",
  title: "Series Resistors Calculator",
  description:
    "Calculate the total resistance of resistors connected in series. In series, resistances simply add: R_total = R₁ + R₂ + ...",
  category: "Science",
  categorySlug: "science",
  icon: "Link",
  keywords: [
    "series resistors",
    "resistance",
    "total resistance",
    "circuit",
    "electronics",
    "ohms",
    "physics",
  ],
  variants: [
    {
      id: "two-series-res",
      name: "Two Resistors in Series",
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
        if (isNaN(r1) || isNaN(r2) || r1 < 0 || r2 < 0) {
          return { primary: { label: "Total Resistance", value: "Invalid input" }, details: [] };
        }
        const total = r1 + r2;
        return {
          primary: { label: "Total Resistance", value: `${formatNumber(total)} Ω` },
          details: [
            { label: "R₁", value: `${formatNumber(r1)} Ω` },
            { label: "R₂", value: `${formatNumber(r2)} Ω` },
            { label: "Total (kΩ)", value: `${formatNumber(total / 1000)} kΩ` },
          ],
        };
      },
    },
    {
      id: "three-series-res",
      name: "Three Resistors in Series",
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
        if (isNaN(r1) || isNaN(r2) || isNaN(r3) || r1 < 0 || r2 < 0 || r3 < 0) {
          return { primary: { label: "Total Resistance", value: "Invalid input" }, details: [] };
        }
        const total = r1 + r2 + r3;
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
  relatedSlugs: ["parallel-resistors", "series-capacitors", "capacitor-energy"],
  faq: [
    {
      question: "How do resistors add in series?",
      answer:
        "Resistors in series simply add up: R_total = R₁ + R₂ + R₃ + ... The total resistance is always greater than the largest individual resistance.",
    },
    {
      question: "What is the voltage division in series resistors?",
      answer:
        "In a series circuit, the voltage divides proportionally across each resistor according to its resistance: V_n = V_total × (R_n / R_total). This is the basis of voltage divider circuits.",
    },
  ],
  formula:
    "R_total = R₁ + R₂ + R₃ + ..., where each R is the resistance of an individual resistor in ohms.",
};
