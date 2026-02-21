import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const circuitCalculator: CalculatorDefinition = {
  slug: "circuit-calculator",
  title: "Circuit Calculator",
  description:
    "Free circuit resistance calculator. Compute total resistance for series and parallel resistor configurations.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "circuit",
    "resistor",
    "series",
    "parallel",
    "resistance",
    "ohm",
  ],
  variants: [
    {
      id: "series",
      name: "Series Resistors",
      fields: [
        {
          name: "r1",
          label: "Resistance R1 (Ω)",
          type: "number",
          placeholder: "e.g. 100",
        },
        {
          name: "r2",
          label: "Resistance R2 (Ω)",
          type: "number",
          placeholder: "e.g. 200",
        },
        {
          name: "r3",
          label: "Resistance R3 (Ω) — optional",
          type: "number",
          placeholder: "e.g. 300",
        },
      ],
      calculate: (inputs) => {
        const r1 = inputs.r1 as number;
        const r2 = inputs.r2 as number;
        const r3 = inputs.r3 as number;
        if (!r1 || !r2) return null;
        const total = r1 + r2 + (r3 || 0);
        const resistorCount = r3 ? 3 : 2;
        return {
          primary: {
            label: "Total Resistance (Series)",
            value: formatNumber(total, 4) + " Ω",
          },
          details: [
            { label: "R1", value: formatNumber(r1, 4) + " Ω" },
            { label: "R2", value: formatNumber(r2, 4) + " Ω" },
            ...(r3
              ? [{ label: "R3", value: formatNumber(r3, 4) + " Ω" }]
              : []),
            { label: "Number of Resistors", value: String(resistorCount) },
            {
              label: "Formula",
              value: "R_total = R1 + R2" + (r3 ? " + R3" : ""),
            },
          ],
        };
      },
    },
    {
      id: "parallel",
      name: "Parallel Resistors",
      fields: [
        {
          name: "r1",
          label: "Resistance R1 (Ω)",
          type: "number",
          placeholder: "e.g. 100",
        },
        {
          name: "r2",
          label: "Resistance R2 (Ω)",
          type: "number",
          placeholder: "e.g. 200",
        },
        {
          name: "r3",
          label: "Resistance R3 (Ω) — optional",
          type: "number",
          placeholder: "e.g. 300",
        },
      ],
      calculate: (inputs) => {
        const r1 = inputs.r1 as number;
        const r2 = inputs.r2 as number;
        const r3 = inputs.r3 as number;
        if (!r1 || !r2) return null;
        if (r1 <= 0 || r2 <= 0) return null;
        if (r3 !== undefined && r3 !== null && r3 !== 0 && r3 < 0) return null;

        let reciprocalSum = 1 / r1 + 1 / r2;
        if (r3) {
          reciprocalSum += 1 / r3;
        }
        const total = 1 / reciprocalSum;
        const resistorCount = r3 ? 3 : 2;

        return {
          primary: {
            label: "Total Resistance (Parallel)",
            value: formatNumber(total, 4) + " Ω",
          },
          details: [
            { label: "R1", value: formatNumber(r1, 4) + " Ω" },
            { label: "R2", value: formatNumber(r2, 4) + " Ω" },
            ...(r3
              ? [{ label: "R3", value: formatNumber(r3, 4) + " Ω" }]
              : []),
            { label: "Number of Resistors", value: String(resistorCount) },
            {
              label: "Formula",
              value:
                "1/R = 1/R1 + 1/R2" + (r3 ? " + 1/R3" : ""),
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["capacitance-calculator", "power-factor-calculator"],
  faq: [
    {
      question: "How do series and parallel resistors differ?",
      answer:
        "In series, resistances add directly: R_total = R1 + R2 + ... In parallel, reciprocals add: 1/R_total = 1/R1 + 1/R2 + ... Parallel resistance is always less than the smallest individual resistor.",
    },
    {
      question: "What if I have more than 3 resistors?",
      answer:
        "For more resistors, apply the same formulas with additional terms. Series: keep adding. Parallel: keep adding reciprocals.",
    },
  ],
  formula:
    "Series: R_total = R1 + R2 + R3. Parallel: 1/R_total = 1/R1 + 1/R2 + 1/R3.",
};
