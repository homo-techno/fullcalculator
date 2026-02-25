import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const seriesCapacitorsCalculator: CalculatorDefinition = {
  slug: "series-capacitors",
  title: "Series Capacitors Calculator",
  description:
    "Calculate the total capacitance of capacitors connected in series. In series, the reciprocals of individual capacitances add up.",
  category: "Science",
  categorySlug: "science",
  icon: "Link",
  keywords: [
    "series capacitors",
    "capacitance",
    "total capacitance",
    "circuit",
    "electronics",
    "physics",
  ],
  variants: [
    {
      id: "two-series-caps",
      name: "Two Capacitors in Series",
      fields: [
        {
          name: "c1",
          label: "Capacitance C₁ (F)",
          type: "number",
          placeholder: "Enter C₁ in farads",
        },
        {
          name: "c2",
          label: "Capacitance C₂ (F)",
          type: "number",
          placeholder: "Enter C₂ in farads",
        },
      ],
      calculate: (inputs) => {
        const c1 = parseFloat(inputs.c1 as string);
        const c2 = parseFloat(inputs.c2 as string);
        if (isNaN(c1) || isNaN(c2) || c1 <= 0 || c2 <= 0) {
          return { primary: { label: "Total Capacitance", value: "Invalid input" }, details: [] };
        }
        const total = 1 / (1 / c1 + 1 / c2);
        return {
          primary: { label: "Total Capacitance", value: `${formatNumber(total)} F` },
          details: [
            { label: "C₁", value: `${formatNumber(c1)} F` },
            { label: "C₂", value: `${formatNumber(c2)} F` },
            { label: "Total (μF)", value: `${formatNumber(total * 1e6)} μF` },
            { label: "Total (nF)", value: `${formatNumber(total * 1e9)} nF` },
            { label: "Simplified", value: `(C₁ × C₂)/(C₁ + C₂) = ${formatNumber(total)} F` },
          ],
        };
      },
    },
    {
      id: "three-series-caps",
      name: "Three Capacitors in Series",
      fields: [
        {
          name: "c1",
          label: "Capacitance C₁ (F)",
          type: "number",
          placeholder: "Enter C₁ in farads",
        },
        {
          name: "c2",
          label: "Capacitance C₂ (F)",
          type: "number",
          placeholder: "Enter C₂ in farads",
        },
        {
          name: "c3",
          label: "Capacitance C₃ (F)",
          type: "number",
          placeholder: "Enter C₃ in farads",
        },
      ],
      calculate: (inputs) => {
        const c1 = parseFloat(inputs.c1 as string);
        const c2 = parseFloat(inputs.c2 as string);
        const c3 = parseFloat(inputs.c3 as string);
        if (isNaN(c1) || isNaN(c2) || isNaN(c3) || c1 <= 0 || c2 <= 0 || c3 <= 0) {
          return { primary: { label: "Total Capacitance", value: "Invalid input" }, details: [] };
        }
        const total = 1 / (1 / c1 + 1 / c2 + 1 / c3);
        return {
          primary: { label: "Total Capacitance", value: `${formatNumber(total)} F` },
          details: [
            { label: "C₁", value: `${formatNumber(c1)} F` },
            { label: "C₂", value: `${formatNumber(c2)} F` },
            { label: "C₃", value: `${formatNumber(c3)} F` },
            { label: "Total (μF)", value: `${formatNumber(total * 1e6)} μF` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["parallel-capacitors", "capacitor-energy", "series-resistors"],
  faq: [
    {
      question: "How do capacitors add in series?",
      answer:
        "Capacitors in series add reciprocally: 1/C_total = 1/C₁ + 1/C₂ + 1/C₃ + ... The total capacitance is always less than the smallest individual capacitance.",
    },
    {
      question: "Why use capacitors in series?",
      answer:
        "Connecting capacitors in series increases the total voltage rating (the voltages add) while decreasing the total capacitance. This is useful when a higher voltage rating is needed than any single capacitor can provide.",
    },
  ],
  formula:
    "1/C_total = 1/C₁ + 1/C₂ + 1/C₃ + ..., where each C is the capacitance of an individual capacitor in farads.",
};
