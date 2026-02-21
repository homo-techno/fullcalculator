import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const decayCalculator: CalculatorDefinition = {
  slug: "decay-calculator",
  title: "Decay Calculator",
  description:
    "Free radioactive decay calculator. Compute remaining quantity using N(t) = N0 × e^(-λt) with half-life.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "radioactive decay",
    "half-life",
    "exponential decay",
    "lambda",
    "nuclear physics",
  ],
  variants: [
    {
      id: "remaining",
      name: "Remaining Quantity",
      fields: [
        {
          name: "n0",
          label: "Initial Quantity (N0)",
          type: "number",
          placeholder: "e.g. 1000",
        },
        {
          name: "halfLife",
          label: "Half-Life",
          type: "number",
          placeholder: "e.g. 5730",
        },
        {
          name: "time",
          label: "Time Elapsed",
          type: "number",
          placeholder: "e.g. 11460",
        },
      ],
      calculate: (inputs) => {
        const n0 = inputs.n0 as number;
        const halfLife = inputs.halfLife as number;
        const time = inputs.time as number;
        if (!n0 || !halfLife || !time) return null;
        if (halfLife <= 0) return null;
        const lambda = Math.LN2 / halfLife;
        const nT = n0 * Math.exp(-lambda * time);
        const decayed = n0 - nT;
        const halfLivesElapsed = time / halfLife;
        return {
          primary: {
            label: "Remaining Quantity N(t)",
            value: formatNumber(nT, 4),
          },
          details: [
            { label: "Initial Quantity (N0)", value: formatNumber(n0, 4) },
            { label: "Decay Constant (λ)", value: formatNumber(lambda, 6) },
            { label: "Amount Decayed", value: formatNumber(decayed, 4) },
            {
              label: "Half-Lives Elapsed",
              value: formatNumber(halfLivesElapsed, 2),
            },
            {
              label: "Percentage Remaining",
              value: formatNumber((nT / n0) * 100, 2) + "%",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["beer-lambert-calculator", "stefan-boltzmann-calculator"],
  faq: [
    {
      question: "What is radioactive decay?",
      answer:
        "Radioactive decay is the process by which an unstable atomic nucleus loses energy by emitting radiation. The rate of decay is characterized by the half-life.",
    },
    {
      question: "What is the decay constant λ?",
      answer:
        "The decay constant λ = ln(2) / half-life. It represents the probability per unit time that a nucleus will decay.",
    },
  ],
  formula:
    "N(t) = N0 × e^(-λt), where λ = ln(2) / half-life, N0 is the initial quantity, and t is time elapsed.",
};
