import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const parallelCapacitorsCalculator: CalculatorDefinition = {
  slug: "parallel-capacitors",
  title: "Parallel Capacitors Calculator",
  description:
    "Calculate the total capacitance of capacitors connected in parallel. In parallel, total capacitance is the sum of individual capacitances.",
  category: "Science",
  categorySlug: "science",
  icon: "GitBranch",
  keywords: [
    "parallel capacitors",
    "capacitance",
    "total capacitance",
    "circuit",
    "electronics",
    "physics",
  ],
  variants: [
    {
      id: "two-parallel-caps",
      name: "Two Capacitors in Parallel",
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
        if (isNaN(c1) || isNaN(c2) || c1 < 0 || c2 < 0) {
          return { primary: { label: "Total Capacitance", value: "Invalid input" }, details: [] };
        }
        const total = c1 + c2;
        return {
          primary: { label: "Total Capacitance", value: `${formatNumber(total)} F` },
          details: [
            { label: "C₁", value: `${formatNumber(c1)} F` },
            { label: "C₂", value: `${formatNumber(c2)} F` },
            { label: "Total (μF)", value: `${formatNumber(total * 1e6)} μF` },
            { label: "Total (nF)", value: `${formatNumber(total * 1e9)} nF` },
          ],
        };
      },
    },
    {
      id: "three-parallel-caps",
      name: "Three Capacitors in Parallel",
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
        if (isNaN(c1) || isNaN(c2) || isNaN(c3) || c1 < 0 || c2 < 0 || c3 < 0) {
          return { primary: { label: "Total Capacitance", value: "Invalid input" }, details: [] };
        }
        const total = c1 + c2 + c3;
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
  relatedSlugs: ["series-capacitors", "capacitor-energy", "parallel-resistors"],
  faq: [
    {
      question: "How do capacitors add in parallel?",
      answer:
        "Capacitors in parallel simply add: C_total = C₁ + C₂ + C₃ + ... This is because each capacitor stores charge independently, and the total charge equals the sum of individual charges.",
    },
    {
      question: "Why use capacitors in parallel?",
      answer:
        "Connecting capacitors in parallel increases the total capacitance and the total charge storage capacity while maintaining the same voltage across each capacitor.",
    },
  ],
  formula:
    "C_total = C₁ + C₂ + C₃ + ..., where each C is the capacitance of an individual capacitor in farads.",
};
