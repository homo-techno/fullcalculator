import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const halfLifeCalculator: CalculatorDefinition = {
  slug: "half-life-calculator",
  title: "Half-Life Calculator",
  description: "Free half-life calculator. Calculate remaining quantity, elapsed time, or half-life period for radioactive decay and exponential processes.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["half-life calculator", "radioactive decay", "exponential decay", "decay calculator", "half life formula"],
  variants: [
    {
      id: "remaining",
      name: "Remaining Quantity",
      fields: [
        { name: "initial", label: "Initial Quantity", type: "number", placeholder: "e.g. 100" },
        { name: "halfLife", label: "Half-Life", type: "number", placeholder: "e.g. 5730" },
        { name: "time", label: "Elapsed Time", type: "number", placeholder: "e.g. 10000" },
      ],
      calculate: (inputs) => {
        const n0 = inputs.initial as number, hl = inputs.halfLife as number, t = inputs.time as number;
        if (!n0 || !hl || t === undefined) return null;
        const remaining = n0 * Math.pow(0.5, t / hl);
        const decayed = n0 - remaining;
        const halfLives = t / hl;
        return {
          primary: { label: "Remaining", value: formatNumber(remaining, 6) },
          details: [
            { label: "Decayed amount", value: formatNumber(decayed, 6) },
            { label: "% remaining", value: `${formatNumber((remaining / n0) * 100, 4)}%` },
            { label: "Half-lives elapsed", value: formatNumber(halfLives, 3) },
            { label: "Decay constant (λ)", value: formatNumber(Math.LN2 / hl, 8) },
          ],
        };
      },
    },
    {
      id: "findHalfLife",
      name: "Find Half-Life",
      fields: [
        { name: "initial", label: "Initial Quantity", type: "number", placeholder: "e.g. 100" },
        { name: "remaining", label: "Remaining Quantity", type: "number", placeholder: "e.g. 25" },
        { name: "time", label: "Elapsed Time", type: "number", placeholder: "e.g. 200" },
      ],
      calculate: (inputs) => {
        const n0 = inputs.initial as number, nr = inputs.remaining as number, t = inputs.time as number;
        if (!n0 || !nr || !t || nr >= n0) return null;
        const hl = -t * Math.LN2 / Math.log(nr / n0);
        return {
          primary: { label: "Half-Life", value: formatNumber(hl, 4) },
          details: [
            { label: "Decay constant (λ)", value: formatNumber(Math.LN2 / hl, 8) },
            { label: "Mean lifetime (τ)", value: formatNumber(hl / Math.LN2, 4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["logarithm-calculator", "exponent-calculator", "scientific-calculator"],
  faq: [{ question: "What is half-life?", answer: "Half-life is the time it takes for half of a substance to decay. After 1 half-life: 50% remains. After 2: 25%. After 3: 12.5%. The formula is N = N₀ × (½)^(t/t½). Carbon-14's half-life is 5,730 years." }],
  formula: "N = N₀ × (½)^(t/t½) | λ = ln(2)/t½",
};
