import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const summationCalculator: CalculatorDefinition = {
  slug: "summation-calculator",
  title: "Summation Calculator",
  description:
    "Free summation calculator. Compute arithmetic series sums and sums of powers (i^k) from a start to an end value.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "summation",
    "sigma notation",
    "arithmetic series",
    "sum of powers",
    "series sum",
  ],
  variants: [
    {
      id: "arithmetic",
      name: "Arithmetic Series",
      fields: [
        {
          name: "start",
          label: "Start value",
          type: "number",
          placeholder: "e.g. 1",
        },
        {
          name: "end",
          label: "End value",
          type: "number",
          placeholder: "e.g. 100",
        },
        {
          name: "step",
          label: "Common difference (d)",
          type: "number",
          placeholder: "e.g. 1",
        },
      ],
      calculate: (inputs) => {
        const start = inputs.start as number;
        const end = inputs.end as number;
        const step = inputs.step as number;
        if (start === undefined || end === undefined || !step) return null;
        if ((end - start) / step < 0) return null;

        const n = Math.floor((end - start) / step) + 1;
        const lastTerm = start + (n - 1) * step;
        const sum = (n * (start + lastTerm)) / 2;

        return {
          primary: { label: "Sum", value: formatNumber(sum, 4) },
          details: [
            { label: "Number of terms", value: String(n) },
            { label: "First term", value: formatNumber(start) },
            { label: "Last term", value: formatNumber(lastTerm) },
            { label: "Common difference", value: formatNumber(step) },
          ],
        };
      },
    },
    {
      id: "power-sum",
      name: "Sum of i^k",
      fields: [
        {
          name: "start",
          label: "Start (i =)",
          type: "number",
          placeholder: "e.g. 1",
        },
        {
          name: "end",
          label: "End (to)",
          type: "number",
          placeholder: "e.g. 10",
        },
        {
          name: "k",
          label: "Power (k)",
          type: "number",
          placeholder: "e.g. 2",
        },
      ],
      calculate: (inputs) => {
        const start = inputs.start as number;
        const end = inputs.end as number;
        const k = inputs.k as number;
        if (start === undefined || end === undefined || k === undefined) return null;
        if (!Number.isInteger(start) || !Number.isInteger(end) || !Number.isInteger(k))
          return null;
        if (end < start || k < 0) return null;
        if (end - start > 10000) return null; // prevent huge loops

        let sum = 0;
        for (let i = start; i <= end; i++) {
          sum += Math.pow(i, k);
        }

        const terms = end - start + 1;

        return {
          primary: { label: `Σi^${k}`, value: formatNumber(sum, 4) },
          details: [
            { label: "Start", value: String(start) },
            { label: "End", value: String(end) },
            { label: "Power", value: String(k) },
            { label: "Number of terms", value: String(terms) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "series-convergence-calculator",
    "polynomial-calculator",
    "mean-median-mode-calculator",
  ],
  faq: [
    {
      question: "What is the formula for the sum of an arithmetic series?",
      answer:
        "The sum of an arithmetic series is S = n(a₁ + aₙ)/2, where n is the number of terms, a₁ is the first term, and aₙ is the last term. For the sum of the first n natural numbers: S = n(n+1)/2.",
    },
  ],
  formula: "S = n(a₁ + aₙ)/2 for arithmetic; Σi^k computed directly for power sums",
};
